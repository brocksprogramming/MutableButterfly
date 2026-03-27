🦋 MutableImage (Mutable Butterfly)
The Private Image Converter & Steganography Tool.
MutableImage is a high-performance Chrome Extension built for developers, scientists, and privacy enthusiasts. It allows you to convert image formats and hide secret messages in pixel data—all without ever uploading a single byte to a server.

🚀 Key Features
100% Local Processing: Uses the browser's Canvas API to perform math and conversions on your machine. Your data never leaves your computer.
Format Conversion: Seamlessly switch between PNG, JPG, and WebP.
LSB Steganography: Hide and extract secret text messages within PNG files using Least Significant Bit encoding.
No Focus Loss: Built using a stable-window architecture to ensure your conversion isn't interrupted by native OS file pickers.
Zero Cost: No subscriptions, no API fees, and no "pro" limits on base features.

🛠 How It Works
Image Conversion
MutableImage reads the raw pixel buffer of your uploaded file and re-renders it onto a hidden HTML5 Canvas. It then utilizes the browser's native encoding engines to export the data in your desired format.
Steganography (The Secret Mode)
We use LSB (Least Significant Bit) encoding.
Your secret message is converted into a binary stream.
The algorithm replaces the last bit of every RGB color channel in the image with a bit from your message.
Because the change is only $1/255$th of a color's intensity, the human eye perceives no difference, while the data remains perfectly preserved in a lossless PNG.

📥 Installation
Clone this repository or download the ZIP.
Open Chrome and navigate to chrome://extensions/.
Enable Developer Mode (top right).
Click Load Unpacked and select the project folder.

🖥 Usage
Click the Mutable Butterfly icon in your Chrome toolbar.
A stable converter window will open.
To Convert: Drop an image, select your target format, and click Encode & Export.
To Hide a Message: Select PNG, type your message in the text area, and click Encode & Export.
To Read a Message: Upload an image that contains a secret and click Read Secret.

├── manifest.json         # Extension configuration
├── popup.html            # The "Receptionist" UI
├── popup.js              # Launcher logic for the stable window
├── converter.html        # The main "Factory" UI
├── converter.js          # Core logic: Canvas API & LSB Math
└── icons/                # Mutable Butterfly branding assets

🛡 Privacy & Security
MutableImage was built on the principle of Digital Sovereignty.
No Analytics: We don't track what you convert.
No Cloud: There is no "backend."
Open Logic: All conversion and encryption logic is visible in converter.js.
