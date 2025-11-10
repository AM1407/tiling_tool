// Use DOMContentLoaded to ensure the script runs only after the HTML elements are fully loaded.
// This is the most reliable structure for robust frontend code.
window.addEventListener('DOMContentLoaded', initializeCalculator);

function initializeCalculator() {
    // --- DATA STRUCTURE ---
    const TILE_DATA = [
        { size: "30 x 30 cm", coveragePerBox: 1.08 },
        { size: "40 x 40 cm", coveragePerBox: 1.28 },
        { size: "50 x 50 cm", coveragePerBox: 1.50 },
        { size: "60 x 60 cm", coveragePerBox: 1.44 },
        { size: "80 x 80 cm", coveragePerBox: 1.28 }
    ];

    // --- DOM ELEMENT CONSTANTS ---
    // All these elements are guaranteed to exist now thanks to DOMContentLoaded
    const areaInput = document.getElementById('areaInput');
    const tileSizeInput = document.getElementById('tileSize');
    const groutInput = document.getElementById('groutInput');
    const calculateBtn = document.getElementById('calcBtn');

    const totalBoxesEl = document.getElementById('totalBoxes');
    const totalGlueEl = document.getElementById('totalGlue');
    const subTotalEl = document.getElementById('subTotal');
    const discountEl = document.getElementById('discount');
    const totalPriceEl = document.getElementById('totalPrice');
    const alertMessage = document.getElementById('alertMessage'); 

    // --- HARDCODED CALCULATION CONSTANTS ---
    const TILE_PRICE_PER_SQM = 45.00; 
    const TILE_WASTE_PERCENTAGE = 0.10; 
    const GLUE_CONSUMPTION_RATE = 4.5; 

    // Initialize dropdown and event listener
    populateTileSizes(TILE_DATA, tileSizeInput);
    calculateBtn.addEventListener('click', calculateTileData);

    // --- FUNCTIONS ---

    /**
     * Populates the Tile Size dropdown (<select>) using the TILE_DATA array.
     */
    function populateTileSizes(data, selectElement) {
        if (!data || !selectElement) return;

        data.forEach((tile, index) => {
            const option = document.createElement('option');
            // The value stores the coverage area (m²) for easy lookup in the calculation
            option.value = tile.coveragePerBox; 
            option.textContent = `${tile.size} (Doos: ${tile.coveragePerBox} m²)`;

            if (index === 0) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    /**
     * Main function to calculate materials, price, and apply discounts.
     */
    function calculateTileData() {
        // 1. INPUT DATA EXTRACTION AND VALIDATION
        const area = parseFloat(areaInput.value);
        const coveragePerBox = parseFloat(tileSizeInput.value); 

        // THIS LINE IS NOW SAFE: Hiding the alert message at the start of the function run
        alertMessage.classList.add('d-none'); 

        // Validation check
        if (isNaN(area) || area <= 0 || isNaN(coveragePerBox) || coveragePerBox <= 0) {
            alertMessage.textContent = "Vul geldige waarden in voor oppervlakte en tegelgrootte.";
            alertMessage.classList.remove('d-none');
            return;
        }

        // 2. ASSIGNMENT 4: CALCULATE MATERIALS & SUBTOTAL

        // A. Total Required Area (Area + Waste)
        const requiredArea = area * (1 + TILE_WASTE_PERCENTAGE);

        // B. Total Boxes Needed (Always round UP using Math.ceil)
        const totalBoxes = Math.ceil(requiredArea / coveragePerBox);
        
        // C. Tile Glue Needed (Consumption Rate * Surface Area)
        const totalGlue = Math.ceil(area * GLUE_CONSUMPTION_RATE); 

        // D. Subtotal Price
        const subTotal = area * TILE_PRICE_PER_SQM;


        // 3. ASSIGNMENT 5: APPLY COMMERCIAL DISCOUNT (Tiered Pricing)

        let discountPercentage = 0;

        if (subTotal > 5000) {
            discountPercentage = 0.10; // 10%
        } else if (subTotal >= 1000) {
            discountPercentage = 0.05; // 5%
        } else if (subTotal > 0) {
            discountPercentage = 0.02; // 2%
        }

        const discountAmount = subTotal * discountPercentage;
        const finalPrice = subTotal - discountAmount;
        
        
        // 4. DISPLAY RESULTS
        totalBoxesEl.textContent = totalBoxes;
        totalGlueEl.textContent = `${totalGlue} kg`;
        subTotalEl.textContent = `€${subTotal.toFixed(2)}`;

        const displayPercentage = (discountPercentage * 100).toFixed(0);
        discountEl.textContent = `-€${discountAmount.toFixed(2)} (${displayPercentage}%)`;

        totalPriceEl.textContent = `€${finalPrice.toFixed(2)}`;
    }
}