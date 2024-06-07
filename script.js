document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll('.main-screen');
    const navItems = document.querySelectorAll('.nav-item');
    const coinAmountSpan = document.querySelector('.coin-amount');
    const characterHer = document.getElementById('character-her');
    const characterHim = document.getElementById('character');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    const genderSwitchInputs = document.querySelectorAll('.gender-switch input');
    const contentHer = document.getElementById('content-her');
    const contentHim = document.getElementById('content-him');

    let coins = 0;
    let coinsPerTap = 1;
    const autoClickers = {
        gym: { level: 0, basePrice: 50, increment: 1, currentRate: 0, priceFactor: 3, multiplier: 2 },
        aiTap: { level: 0, basePrice: 20000, increment: 2, currentRate: 0, priceFactor: 3, multiplier: 2 },
        airdrop: { level: 0, basePrice: 100000, increment: 6, currentRate: 0, priceFactor: 3, multiplier: 2 },
        defi: { level: 0, basePrice: 10000000, increment: 10, currentRate: 0, priceFactor: 3, multiplier: 2 },
    };

    // Function to save progress to localStorage
    const saveProgress = () => {
        const progress = {
            coins: coins,
            coinsPerTap: coinsPerTap,
            autoClickers: autoClickers,
        };
        localStorage.setItem('gameProgress', JSON.stringify(progress));
    };

    // Function to load progress from localStorage
    const loadProgress = () => {
        const savedProgress = localStorage.getItem('gameProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            coins = progress.coins;
            coinsPerTap = progress.coinsPerTap;
            Object.keys(autoClickers).forEach(key => {
                autoClickers[key].level = progress.autoClickers[key].level;
                autoClickers[key].currentRate = progress.autoClickers[key].currentRate;
            });
            coinAmountSpan.textContent = coins;
            updateUpgradePrices();
        }
    };

    // Function to hide all pages
    const hideAllPages = () => {
        pages.forEach(page => {
            page.style.display = 'none';
        });
    };

    // Function to show a specific page
    const showPage = (pageId) => {
        hideAllPages();
        document.getElementById(pageId).style.display = 'flex';
        updateNavigation(pageId);
    };

    // Function to update navigation active state
    const updateNavigation = (activePageId) => {
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.dataset.page === activePageId) {
                navItem.classList.add('active');
            }
        });
    };

    // Event listener for navigation items
    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            showPage(navItem.dataset.page);
        });
    });

    // Function to get the price of an upgrade
    const getUpgradePrice = (upgradeType) => {
        const basePrice = autoClickers[upgradeType].basePrice;
        const level = autoClickers[upgradeType].level;
        if (level === 0) {
            return basePrice;
        }
        return Math.floor(basePrice * Math.pow(autoClickers[upgradeType].priceFactor, level));
    };

    // Function to start an auto clicker
    const startAutoClicker = (upgradeType) => {
        setInterval(() => {
            coins += autoClickers[upgradeType].currentRate;
            coinAmountSpan.textContent = coins;
            updateUpgradePrices();
            saveProgress();
        }, 1000);
    };

    // Function to update upgrade prices and levels
    const updateUpgradePrices = () => {
        upgradeButtons.forEach(button => {
            const upgradeType = button.getAttribute('data-type');
            const price = getUpgradePrice(upgradeType);
            const upgradeItem = button.parentElement;
            const priceText = upgradeItem.querySelector('.upgrade-details p');
            const level = autoClickers[upgradeType].level;
            const rate = autoClickers[upgradeType].currentRate;

            if (upgradeType === "gym") {
                priceText.innerHTML = `${price} | level ${level}/10<br>${rate + coinsPerTap} Young coin per tap`;
            } else {
                priceText.innerHTML = `${price} | level ${level}/10<br>${rate} Young coin / sec`;
            }
            
            if (coins >= price) {
                button.style.backgroundColor = '#00ff00';
            } else {
                button.style.backgroundColor = '#ff3b30';
            }
        });
    };

    // Event listener for character clicks
    characterHim.addEventListener('click', (event) => {
        coins += coinsPerTap;
        coinAmountSpan.textContent = coins;
        showCoinAnimation(event.clientX, event.clientY, coinsPerTap);
        updateUpgradePrices();
        saveProgress();
    });

    characterHer.addEventListener('click', (event) => {
        coins += coinsPerTap;
        coinAmountSpan.textContent = coins;
        showCoinAnimation(event.clientX, event.clientY, coinsPerTap);
        updateUpgradePrices();
        saveProgress();
    });

    // Function to show coin animation
    const showCoinAnimation = (x, y, amount) => {
        const coinAnimation = document.createElement('div');
        coinAnimation.classList.add('coin-animation');
        coinAnimation.innerHTML = `<img src="assets/images/coins.svg" alt="Coin"><span>+${amount}</span>`;
        document.body.appendChild(coinAnimation);

        coinAnimation.style.left = `${x}px`;
        coinAnimation.style.top = `${y}px`;

        coinAnimation.addEventListener('animationend', () => {
            coinAnimation.remove();
        });
    };

    // Event listener for upgrade buttons
    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const upgradeType = button.getAttribute('data-type');
            const price = getUpgradePrice(upgradeType);

            if (coins >= price && autoClickers[upgradeType].level < 10) {
                coins -= price;
                coinAmountSpan.textContent = coins;
                autoClickers[upgradeType].level++;
                if (upgradeType === "gym") {
                    coinsPerTap *= autoClickers[upgradeType].multiplier;
                } else {
                    autoClickers[upgradeType].currentRate += autoClickers[upgradeType].increment * autoClickers[upgradeType].multiplier ** (autoClickers[upgradeType].level - 1);
                }
                if (autoClickers[upgradeType].level === 1) {
                    startAutoClicker(upgradeType);
                }
                updateUpgradePrices();
                saveProgress();
            }
        });
    });

    // Event listener for gender switch inputs
    genderSwitchInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value === 'her') {
                contentHer.style.display = 'flex';
                contentHim.style.display = 'none';
            } else {
                contentHer.style.display = 'none';
                contentHim.style.display = 'flex';
            }
            saveProgress();
        });
    });

    // Prevent zoom and scroll on mobile devices
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Load progress when the app starts
    loadProgress();

    // Save progress when the app is about to be closed
    window.addEventListener('beforeunload', saveProgress);

    showPage('home-page');
});
