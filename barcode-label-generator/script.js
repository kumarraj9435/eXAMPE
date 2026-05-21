// DOM Elements
const barcodeUpload = document.getElementById('barcode-upload');
const previewArea = document.getElementById('preview-area');
const labelNameInput = document.getElementById('label-name');
const copiesSelect = document.getElementById('copies');
const pagesInput = document.getElementById('pages');
const generateBtn = document.getElementById('generate-btn');
const printArea = document.getElementById('print-area');
const printControls = document.getElementById('print-controls');

let barcodeDataURL = null;

// Grid configurations for different label counts
const gridConfig = {
    10: { cols: 2, rows: 5 },
    12: { cols: 3, rows: 4 },
    15: { cols: 3, rows: 5 },
    20: { cols: 4, rows: 5 },
    24: { cols: 4, rows: 6 },
    30: { cols: 5, rows: 6 }
};

// Preview uploaded barcode
barcodeUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            barcodeDataURL = event.target.result;
            previewArea.innerHTML = `<img src="${barcodeDataURL}" alt="Barcode Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Generate A4 sheet
generateBtn.addEventListener('click', function() {
    // Validation
    if (!barcodeDataURL) {
        alert('Please upload a barcode image first!');
        return;
    }

    const labelName = labelNameInput.value.trim();
    if (!labelName) {
        alert('Please enter a name for the label!');
        return;
    }

    const labelsPerPage = parseInt(copiesSelect.value);
    const numPages = parseInt(pagesInput.value);
    const config = gridConfig[labelsPerPage];

    // Clear previous output
    printArea.innerHTML = '';

    // Generate pages
    for (let p = 0; p < numPages; p++) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        page.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
        page.style.gridTemplateRows = `repeat(${config.rows}, 1fr)`;
        page.style.gap = '2mm';

        for (let i = 0; i < labelsPerPage; i++) {
            const label = document.createElement('div');
            label.className = 'label-item';

            const img = document.createElement('img');
            img.src = barcodeDataURL;
            img.alt = 'Barcode';

            const name = document.createElement('div');
            name.className = 'label-name';
            name.textContent = labelName;

            label.appendChild(img);
            label.appendChild(name);
            page.appendChild(label);
        }

        printArea.appendChild(page);
    }

    // Switch to generated view
    document.body.classList.add('generated');
});

// Go back to edit
function goBack() {
    document.body.classList.remove('generated');
    printArea.innerHTML = '';
}
