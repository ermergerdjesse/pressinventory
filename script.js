const generateBtn = document.getElementById('generate-btn');
const qrInput = document.getElementById('qr-input');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const qrCodeDiv = document.getElementById('qr-code');

// Unique Identifier for every label generated, adds 1 each time QR is generated
let sequentialNumber = 1;

// Function to generate the QR code
function generateQRCode(text, firstName, lastName, number) {
  qrCodeDiv.innerHTML = '';

// Error pops up if all fields aren't filled out
  if (!text || !firstName || !lastName) {
    alert('Please fill out all fields.');
    return;
  }

// Error pops up if text is longer than 50 characters. I limited the text box to 50 also, just worst case they can add it somehow
  if (text.length > 50) {
    alert('Your text is too long to be stamped. Please revise your text for it to fit.');
    return;
  }

  const qrData = `Name: ${firstName} ${lastName} | ${text} | #${number}`;
  const canvas = document.createElement('canvas');

  QRCode.toCanvas(canvas, qrData, { width: 50, height: 50, margin: 0, errorCorrectionLevel: 'H' }, function (error) { 
    if (error) {
      console.error('Error generating QR Code:', error);
      alert('Failed to generate QR code.');
      return;
    }

    console.log("QR code generated!");
    const imageUrl = canvas.toDataURL(); // Convert QR to image

// Small delay for laptop rendering/slowness
    setTimeout(() => {
      printQRCode(imageUrl, firstName, lastName, number);
    }, 300);
  });
}

// Print only the QR labels
function printQRCode(imageUrl, firstName, lastName, number) {
  const printArea = document.createElement('div');
  printArea.id = 'print-area';
  printArea.innerHTML = `
    <style>
      @page {
        size: 3in 2in;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        text-align: center;
        width: 3in;
        height: 4in; /* Prevents extra blank pages */
        overflow: hidden; /* Prevents extra space */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .print-wrapper {
        width: 3in;
        height: 4in;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: scale(0.8); /* Auto-adjusts scaling to fit page width */
        transform-origin: top center;
      }
      .label-container {
        width: 3in;
        height: 2in;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-family: Arial, sans-serif;
        font-size: 8pt;
      }
      .details h2 {
        font-size: 8pt;
        margin: 2px 0;
      }
      img {
        width: 0.75in;
        height: 0.75in;
      }
    </style>

    <div class="print-wrapper">
      <!-- Label 1 -->
      <div class="label-container">
        <div class="details">
          <h2>${firstName} ${lastName}</h2>
          <h2># ${number}</h2>
        </div>
        <img src="${imageUrl}" alt="QR Code">
      </div>

      <!-- Label 2 -->
      <div class="label-container">
        <div class="details">
          <h2>${firstName} ${lastName}</h2>
          <h2># ${number}</h2>
        </div>
        <img src="${imageUrl}" alt="QR Code">
      </div>
    </div>
  `;

// Changes print area of the label
  document.body.appendChild(printArea);

// This is to make sure the QR is rendered before it's printed, resulting in no blank QR codes printed if on a slow pc
  setTimeout(() => {
    window.print();
    document.body.removeChild(printArea);
  }, 500);
}

// Event listener for generating the QR code
generateBtn.addEventListener('click', function () {
  generateQRCode(qrInput.value.trim(), firstNameInput.value.trim(), lastNameInput.value.trim(), sequentialNumber);
  sequentialNumber += 1;
});
