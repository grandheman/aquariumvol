document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');

    const labelLength = document.getElementById('label-length');
    const labelWidth = document.getElementById('label-width');
    const labelHeight = document.getElementById('label-height');

    const btnImperial = document.getElementById('btn-imperial');
    const btnMetric = document.getElementById('btn-metric');

    const resGallons = document.getElementById('res-gallons');
    const resLiters = document.getElementById('res-liters');

    // State
    let currentUnit = 'imperial'; // 'imperial' or 'metric'

    // Constants
    const GALLONS_PER_CUBIC_INCH = 1 / 231;
    const LITERS_PER_CUBIC_CM = 1 / 1000;
    const LITERS_PER_GALLON = 3.78541;

    // Functions
    function calculate() {
        const l = parseFloat(lengthInput.value) || 0;
        const w = parseFloat(widthInput.value) || 0;
        const h = parseFloat(heightInput.value) || 0;

        let gallons = 0;
        let liters = 0;

        if (currentUnit === 'imperial') {
            const volumeCubicInches = l * w * h;
            gallons = volumeCubicInches * GALLONS_PER_CUBIC_INCH;
            liters = gallons * LITERS_PER_GALLON;
        } else {
            const volumeCubicCm = l * w * h;
            liters = volumeCubicCm * LITERS_PER_CUBIC_CM;
            gallons = liters / LITERS_PER_GALLON;
        }

        // Format and display
        // Show up to 1 decimal place, or 2 if very small
        resGallons.textContent = formatNumber(gallons);
        resLiters.textContent = formatNumber(liters);

        updateRecommendations(gallons);
    }

    function updateRecommendations(gallons) {
        // Elements
        const gravelEl = document.getElementById('rec-gravel-amount');
        const filterEl = document.getElementById('rec-filter-rate');
        const heaterEl = document.getElementById('rec-heater-watt');

        if (gallons <= 0) {
            gravelEl.textContent = '--';
            filterEl.textContent = '--';
            heaterEl.textContent = '--';
            return;
        }

        // Calculations
        // Gravel: ~1.5 lbs per gallon
        const gravelAmt = Math.round(gallons * 1.5);

        // Filter: 4-6x turnover
        const filterLow = Math.round(gallons * 4);
        const filterHigh = Math.round(gallons * 6);

        // Heater: ~3-5 watts per gallon
        const heaterLow = Math.round(gallons * 3);
        const heaterHigh = Math.round(gallons * 5);

        // Update Text
        gravelEl.textContent = gravelAmt;
        filterEl.textContent = `${filterLow} - ${filterHigh}`;
        heaterEl.textContent = `${heaterLow} - ${heaterHigh}`;
    }

    // Helper for buttons
    window.adjustValue = function (id, delta) {
        const input = document.getElementById(id);
        if (!input) return;

        let val = parseFloat(input.value) || 0;
        val += delta;

        // Prevent negative text (Logic allows 0)
        if (val < 0) val = 0;

        // Handle floating point errors roughly if needed, 
        // but for +/- 1 it's usually fine. 
        // If they use float steps, might need to fix.
        input.value = val;

        calculate();
    };

    function formatNumber(num) {
        if (num === 0) return '0.0';
        if (num < 0.1) return num.toFixed(3);
        if (num < 10) return num.toFixed(2);
        return num.toFixed(1);
    }

    // Export function to window for the onclick handlers in HTML
    window.setUnit = function (unit) {
        currentUnit = unit;

        // UI Update
        if (unit === 'imperial') {
            btnImperial.classList.add('active');
            btnMetric.classList.remove('active');

            labelLength.textContent = 'in';
            labelWidth.textContent = 'in';
            labelHeight.textContent = 'in';
        } else {
            btnMetric.classList.add('active');
            btnImperial.classList.remove('active');

            labelLength.textContent = 'cm';
            labelWidth.textContent = 'cm';
            labelHeight.textContent = 'cm';
        }

        // Clear inputs when switching units to avoid confusion? 
        // Or keep them? Let's keep them and re-calc, assuming user might just be toggling to see conversion of the same numbers (though 10in != 10cm).
        // Actually, usually users enter numbers for the specific unit. 
        // But re-calculating immediately is the most responsive behavior.
        calculate();
    };

    // Event Listeners
    const inputs = [lengthInput, widthInput, heightInput];
    inputs.forEach(input => {
        input.addEventListener('input', calculate);
        input.addEventListener('keyup', calculate);
    });

    // Initial calc
    calculate();

    // Load Products
    // Load Products call moved to end of file to ensure data is defined


    // Product Data (Embedded to avoid CORS issues on local file:// execution)
    const productsData = {
        "substrate": [
            {
                "title": "Natural River Gravel",
                "description": "Classic look, easy to clean. Best for community tanks without live plants.",
                "imageUrl": "https://m.media-amazon.com/images/I/71tLS0NpxRL._AC_SL1100_.jpg",
                "affiliateUrl": "https://amzn.to/4pzZSWK",
                "buttonText": "Check Price on Amazon"
            },
            {
                "title": "Aquarium Sand",
                "description": "Soft texture, perfect for bottom dwellers like Corydoras and Loaches.",
                "imageUrl": "https://m.media-amazon.com/images/I/91yqp1C0PwL._AC_SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/4bm18cA",
                "buttonText": "Check Price on Amazon"
            },
            {
                "title": "Planted Tank Soil",
                "description": "Nutrient-rich substrate specifically designed for live plant growth.",
                "imageUrl": "https://m.media-amazon.com/images/I/8168fqUinKL._AC_SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/4qgq4a9",
                "buttonText": "Check Price on Amazon"
            }
        ],
        "filtration": [
            {
                "title": "Hang-On-Back (HOB)",
                "description": "Easy maintenance. Great for tanks 10-50 gallons.",
                "imageUrl": "https://m.media-amazon.com/images/I/816nzvA+DiL._AC_SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/3L8gkj3",
                "buttonText": "Shop Filters"
            },
            {
                "title": "Canister Filter",
                "description": "High capacity filtration for large tanks (55+ gallons).",
                "imageUrl": "https://m.media-amazon.com/images/I/61YDYSEu35L._AC_SL1200_.jpg",
                "affiliateUrl": "https://amzn.to/4qLjCI0",
                "buttonText": "Shop Canisters"
            },
            {
                "title": "Sponge Filter",
                "description": "Gentle flow. Ideal for fry, shrimp, and hospital tanks.",
                "imageUrl": "https://m.media-amazon.com/images/I/816XjC54xCL._AC_SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/4aSZIpY",
                "buttonText": "Shop Sponge Filters"
            }
        ],
        "heating": [
            {
                "title": "Budget Heater",
                "description": "Reliable and affordable heating for standard aquarium setups.",
                "imageUrl": "https://m.media-amazon.com/images/I/61aCcw5MGnL._AC_SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/4spnVdA",
                "buttonText": "Check Price"
            },
            {
                "title": "Digital Thermometer",
                "description": "Don't trust the dial! Always verify temps with a digital probe.",
                "imageUrl": "https://m.media-amazon.com/images/I/71nIsYf15uL._SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/4qxn7Cl",
                "buttonText": "Check Prices"
            },
            {
                "title": "Premium Heater",
                "description": "Heavy-duty construction with advanced safety features and precision.",
                "imageUrl": "https://m.media-amazon.com/images/I/61TYLsn4TgL._AC_SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/4qLmCUM",
                "buttonText": "Check Premium"
            }
        ],
        "water_chemistry": [
            {
                "title": "Water Conditioner",
                "description": "Instantly removes chlorine and chloramines from tap water.",
                "imageUrl": "https://m.media-amazon.com/images/I/71k+2wVR8RL._AC_SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/3LiI04J",
                "buttonText": "Buy Conditioner"
            },
            {
                "title": "Master Test Kit",
                "description": "Essential for monitoring Ammonia, Nitrite, and Nitrate levels.",
                "imageUrl": "https://m.media-amazon.com/images/I/71V7oSDfPUL._AC_SL1500_.jpg",
                "affiliateUrl": "https://amzn.to/4bosfUf",
                "buttonText": "Get Test Kit"
            },
            {
                "title": "Beneficial Bacteria",
                "description": "Jumpstart your nitrogen cycle for new aquariums.",
                "imageUrl": "https://m.media-amazon.com/images/I/611mZuJRXKL._AC_SL1000_.jpg",
                "affiliateUrl": "https://amzn.to/4qi3zSa",
                "buttonText": "Shop Bacteria"
            }
        ]
    };

    function loadProducts() {
        // Render directly from the embedded constant
        renderSection('substrate', productsData.substrate);
        renderSection('filtration', productsData.filtration);
        renderSection('heating', productsData.heating);
        renderSection('water_chemistry', productsData.water_chemistry);
    }

    function renderSection(sectionId, products) {
        const container = document.getElementById(`${sectionId}-products`);
        if (!container || !products) return;

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            // Allow image to fill container but contain aspect ratio
            const imgStyle = `background-image: url('${product.imageUrl}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: white;`;

            card.innerHTML = `
                <div class="product-image-container">
                    <div class="product-img" style="${imgStyle}"></div>
                </div>
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <a href="${product.affiliateUrl}" class="btn-buy" target="_blank" rel="noopener noreferrer">${product.buttonText}</a>
            `;
            container.appendChild(card);
        });
    }

    loadProducts();
});
