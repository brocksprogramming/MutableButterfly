const imageInput = document.getElementById('imageInput');
const fileStatus = document.getElementById('fileStatus');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// Add this at the top of converter.js
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('click', () => {
  imageInput.click();
});

// Optional: Add a visual 'hover' effect when dragging files over it
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#6200ee";
  dropZone.style.background = "#f0ebfa";
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = "#ccc";
  dropZone.style.background = "transparent";
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#ccc";
  dropZone.style.background = "transparent";
  
  if (e.dataTransfer.files.length > 0) {
    imageInput.files = e.dataTransfer.files;
    // Manually trigger the 'change' event we already wrote
    imageInput.dispatchEvent(new Event('change'));
  }
});
// --- 1. HANDLE FILE SELECTION ---

// Update the UI text when a file is picked
imageInput.addEventListener('change', (e) => {
  if (e.target.files[0]) {
    fileStatus.innerText = `Selected: ${e.target.files[0].name}`;
    fileStatus.style.color = "#6200ee";
    fileStatus.style.fontWeight = "bold";
  }
});

// --- 2. ENCODE & EXPORT LOGIC ---

document.getElementById('convertBtn').addEventListener('click', () => {
  const file = imageInput.files[0];
  const format = document.getElementById('formatSelect').value;
  const secretMessage = document.getElementById('secretInput').value;

  if (!file) return alert("Please select an image first!");

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Only run Steganography if it's PNG and there's a message
      if (format === 'image/png' && secretMessage.length > 0) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        encodeLSB(imgData.data, secretMessage);
        ctx.putImageData(imgData, 0, 0);
      } else if (secretMessage.length > 0 && format !== 'image/png') {
        alert("Warning: Secret messages only work with PNG. Exporting without secret.");
      }

      const dataUrl = canvas.toDataURL(format, 1.0);
      chrome.downloads.download({
        url: dataUrl,
        filename: `mutable_${Date.now()}.${format.split('/')[1]}`
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// --- 3. DECODE LOGIC ---

document.getElementById('decodeBtn').addEventListener('click', () => {
  const file = imageInput.files[0];
  if (!file) return alert("Select the image you want to read!");

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const secret = decodeLSB(imgData.data);

      const resultArea = document.getElementById('resultArea');
      const messageDisplay = document.getElementById('decodedMessage');

      if (secret && secret.trim().length > 0) {
        resultArea.style.display = 'block';
        messageDisplay.innerText = secret;
      } else {
        alert("No hidden message found.");
        resultArea.style.display = 'none';
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// --- HELPER FUNCTIONS (BIT MATH) ---

function encodeLSB(pixels, message) {
  const binaryMsg = (message + '\0').split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');

  for (let i = 0; i < binaryMsg.length; i++) {
    let pixelIdx = i + Math.floor(i / 3);
    if (binaryMsg[i] === '1') {
      pixels[pixelIdx] |= 1;
    } else {
      pixels[pixelIdx] &= ~1;
    }
  }
}

function decodeLSB(pixels) {
  let binary = "";
  let message = "";
  for (let i = 0; i < pixels.length; i++) {
    if ((i + 1) % 4 === 0) continue;
    binary += (pixels[i] & 1);
    if (binary.length === 8) {
      let charCode = parseInt(binary, 2);
      if (charCode === 0) break;
      if (charCode >= 32 && charCode <= 126) message += String.fromCharCode(charCode);
      binary = "";
    }
  }
  return message;
}