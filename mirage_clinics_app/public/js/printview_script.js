// Dynamic Colors for Company Cards
function applyDynamicColors(cardId) {
    const colorThief = new ColorThief();
    const card = document.getElementById(cardId); // Use parameter to get specific card
    if (!card) {
        console.error('Card not found: ' + cardId);
        return;
    }

    const logo = card.querySelector('.company-logo');
    if (!logo) {
        console.error('Logo not found in card: ' + cardId);
        return;
    }
    const originalImageUrl = logo.src;
    // Adding a timestamp to the URL to prevent caching issues
    const proxiedImageUrl = originalImageUrl + '?' + new Date().getTime();
    const profileLink = card.querySelector('.profile-link');
    if (!profileLink) {
        console.error('Profile link not found in card: ' + cardId);
        return;
    }

    logo.src = proxiedImageUrl;
    logo.setAttribute('crossOrigin', 'anonymous'); // Set crossOrigin to handle CORS

    logo.onload = function() {
        if (logo.complete) {
            const color = colorThief.getColor(logo);
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            const rgbaColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`;
            const gradientCss = `linear-gradient(to right, ${rgbaColor}, rgba(255, 255, 255, 1))`;
            const darkerColor = `rgb(${Math.max(color[0] - 30, 0)}, ${Math.max(color[1] - 30, 0)}, ${Math.max(color[2] - 30, 0)})`;
            const header = card.querySelector('.card-header');
            if (header) {
                header.style.backgroundImage = gradientCss;
            }
            profileLink.style.backgroundColor = rgbColor;
            profileLink.style.setProperty('--hover-color', darkerColor);
            const textColor = (color[0]*0.299 + color[1]*0.587 + color[2]*0.114) > 186 ? '#212529' : '#fff';
            profileLink.style.color = textColor;

            // Adding hover effects through JavaScript
            profileLink.addEventListener('mouseenter', () => {
                profileLink.style.backgroundColor = darkerColor;
            });
            profileLink.addEventListener('mouseleave', () => {
                profileLink.style.backgroundColor = rgbColor;
            });
        }
    };

    logo.onerror = function() {
        console.error('Error loading the proxied image');
    };
}

// Page Numbering
function addPageNumbers(pageHeight) {
    var totalPages = Math.ceil(document.body.scrollHeight / pageHeight);
    for (var i = 1; i <= totalPages; i++) {
      var pageNumberDiv = document.createElement("div");
      var pageNumber = document.createTextNode("Page " + i + " of " + totalPages);
      pageNumberDiv.className = 'pageNumber'; // Assign a class name for easy selection
      pageNumberDiv.style.position = "absolute";
      const pos = 55;
      if (i === 1) {
          pageNumberDiv.style.top = pos + "px";
      } else {
          pageNumberDiv.style.top = (1123 * (i - 1) + 55) + "px";
      }
      pageNumberDiv.style.webkitPrintColorAdjust = 'exact';
      pageNumberDiv.appendChild(pageNumber);
      document.body.appendChild(pageNumberDiv);
      pageNumberDiv.style.left = "calc(100% - (" + pageNumberDiv.offsetWidth + "px + 12px))";
      pageNumberDiv.style.backgroundColor = "#00545c";
    }
}
  
  function removePageNumbers() {
    document.querySelectorAll('.pageNumber').forEach(function(node) {
      node.parentNode.removeChild(node);
    });
  }
// Sends Images via API
async function sendBase64UrlInChunks(base64Url, docName, docDoctype) {
    const MAX_CHUNK_SIZE = 1950; // Adjust based on your server's URL length limit
    const totalChunks = Math.ceil(base64Url.length / MAX_CHUNK_SIZE);
    console.log(totalChunks);

    const promises = [];

    for (let i = 0; i < totalChunks; i++) {
        const chunk = base64Url.substring(i * MAX_CHUNK_SIZE, (i + 1) * MAX_CHUNK_SIZE);
        const params = new URLSearchParams({
            docName: docName,
            docDoctype: docDoctype,
            chunkIndex: i,
            totalChunks: totalChunks,
            chunk: chunk
        });

        // Push the fetch promise to the array without awaiting here
        promises.push(fetch(`/api/method/storeData/storeSignature?${params.toString()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => console.log('Chunk sent successfully:', data))
            .catch(error => {
                console.error('Error sending chunk:', error);
                break; // Continue with other requests even if one fails
            })
        );
    }

    // Wait for all the promises to resolve
    await Promise.all(promises);
}

function applyWatermark(docName) {
    const pageSign = document.getElementById('-page-sign');
    if (!pageSign) {
        console.error('Element with ID -page-sign not found.');
        return;
    }

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = 10; // Size of the font
    const text = docName; // The watermark text
    const stepX = 90; // Step size for repeating the text horizontally
    const stepY = 40; // Step size for repeating the text vertically

    canvas.width = 250; // Set the dimensions of the canvas
    canvas.height = 90;

    // Set styles for the text
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = 'rgba(150, 150, 150, 0.5)'; // Semi-transparent text
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-45 * Math.PI / 180); // Rotate the context for diagonal text

    // Repeat the text vertically and horizontally
    let alternate = 0; // Variable to alternate start position
    for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
        alternate = (alternate === 0) ? stepX / 3 : 0; // Alternate the starting x position
        for (let x = -canvas.width + alternate; x < canvas.width * 2; x += stepX) {
            ctx.fillText(text, x, y);
        }
    }

    ctx.restore();

    // Convert the canvas to a data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Apply the canvas as a background image to the -page-sign div
    pageSign.style.backgroundImage = `url('${dataUrl}')`;
    pageSign.style.backgroundRepeat = 'repeat';
}


// Watermarks Images
function watermarkSignature(signatureBase64, employeeName, date, docName) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = 480; // Updated size
        canvas.height = 200; // Updated size
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Prepare for drawing rotated text
            ctx.font = '16px Arial'; // Adjust font size as needed
            ctx.fillStyle = '#7a7a7a'; // Semi-transparent text for watermark
            const text = docName; // The pattern text

            ctx.save(); // Save the current context state
            ctx.translate(canvas.width / 2, canvas.height / 2); // Move the context to center of canvas
            ctx.rotate(-45 * Math.PI / 180); // Rotate context by -45 degrees

            // Calculate the number of times the text should repeat
            const textWidth = ctx.measureText(text).width;
            const repetitionsX = Math.ceil(canvas.width / (textWidth + 20));
            const repetitionsY = Math.ceil(canvas.height / 30); // Assuming 30 is an approx line height

            // Draw repeating text
            for (let x = -repetitionsX * textWidth; x < repetitionsX * textWidth; x += textWidth + 20) {
                for (let y = -canvas.height -30; y < canvas.height * 2; y += 30) {
                    ctx.fillText(text, x, y);
                }
            }
            
            ctx.restore(); // Restore the context to its original state

            // Draw "Signed by" sentence centered and bold
            const signedByText = `Signed by: ${employeeName} on ${date}`;
            ctx.font = 'bold 16px Arial'; // Make text bold
            ctx.fillStyle = '#00545c'; // Text color
            const signedTextWidth = ctx.measureText(signedByText).width;
            // Center the text horizontally
            ctx.fillText(signedByText, (canvas.width - signedTextWidth) / 2, canvas.height - 40);

            // Draw "(C) Mirage Dental Clinic - www.mirageclinics.com" below
            const copyRightText = "Mirage Dental Clinic - www.mirageclinics.com";
            ctx.font = '16px Arial'; // Regular weight for the copyright text
            const copyRightTextWidth = ctx.measureText(copyRightText).width;
            // Center the text horizontally
            ctx.fillText(copyRightText, (canvas.width - copyRightTextWidth) / 2, canvas.height - 20);

            resolve(canvas.toDataURL()); // Resolve promise with the base64 string
        };
        img.onerror = () => {
            reject(new Error('Error loading the signature image'));
        };
        img.src = signatureBase64; // Ensure this is a valid base64 data URI
    });
}



// Menu JS
// Debounce timer for shake event
let debounceTimer = null;

// Variables to track acceleration for shake detection
let lastAcc = { x: null, y: null, z: null };
const shakeThreshold = 30;

function onShake() {
    if (debounceTimer) return;

    const menu = document.getElementById("-menu");
    const tooltip = document.querySelector(".tooltip");

    if (menu.style.display === "none" || !menu.style.display) {
        menu.style.display = "block";
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
        setTimeout(() => {
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
        }, 5000);
    } else {
        menu.style.display = "none";
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    }

    debounceTimer = true;
    setTimeout(() => debounceTimer = null, 1000);
}

function detectShake(event) {
    let acc = event.accelerationIncludingGravity;
    if (!acc.x || !acc.y || !acc.z) return;

    let deltaX = Math.abs(lastAcc.x - acc.x),
        deltaY = Math.abs(lastAcc.y - acc.y),
        deltaZ = Math.abs(lastAcc.z - acc.z);
    let deltaTotal = deltaX + deltaY + deltaZ;

    if (deltaTotal > shakeThreshold) onShake();
    lastAcc = { x: acc.x, y: acc.y, z: acc.z };
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', detectShake, false);
    } else {
        console.log('DeviceMotionEvent is not supported by your device.');
    }

    const tooltip = document.querySelector(".tooltip");
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
    setTimeout(() => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    }, 5000);
});

function copyCurrentPageURL() {
    const tempInput = document.createElement('input');
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        const successful = document.execCommand('copy');
        console.log('Copying text command was ' + (successful ? 'successful' : 'unsuccessful'));
    } catch (err) {
        console.error('Oops, unable to copy', err);
    }
    document.body.removeChild(tempInput);
}

function exportTableToExcel(tableId, filename = '') {
    const table = document.getElementById(tableId);
    const workbook = XLSX.utils.table_to_book(table, {sheet: "Sheet1"});
    XLSX.writeFile(workbook, filename || 'table.xlsx');
}

function copyTableForExcel() {
    const table = document.getElementById("exportableTable");
    let range, sel;

    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(table);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(table);
            sel.addRange(range);
        }

        document.execCommand("copy");
        sel.removeAllRanges();
        alert("Table copied to clipboard. You can now paste it into an Excel sheet.");
    } else {
        console.warn("Your browser does not support this feature. Please manually select the table, copy it, and paste it into Excel.");
    }
}

async function takeSnapshotAndCopy() {
    const table = document.getElementById('exportableTable');
    html2canvas(table).then(canvas => {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]).then(() => {
                console.log("Table snapshot copied to clipboard");
            }, error => {
                console.error("Error copying snapshot to clipboard: ", error);
            });
        }, 'image/png');
    });
}
function shareContent() {
    if (navigator.share) {
        const doctype = "{{doctype.replace(' ', '%20'}}/"; // Ensure you replace this with actual data or pass as a parameter
        const name = "{{name}}"; // Ensure you replace this with actual data or pass as a parameter
        const base = '{{frappe.get_url}}/'
        const key = '?key={{frappe.get_doc(doctype, name).get_signature()}}'
        const url = base + doctype + name + key;

        navigator.share({
            title: `${doctype} - ${name}`,  // Optional: Title of the content to share
            url: url  // The URL you want to share
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        console.log('Web Share API is not supported in your browser.');
    }
}