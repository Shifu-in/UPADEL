document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById('loading');
    const pages = document.querySelectorAll('.main-screen');
    const navItems = document.querySelectorAll('.nav-item');
    const coinAmountSpan = document.querySelector('.coin-amount');
    const characterHer = document.getElementById('character-her');
    const characterHim = document.getElementById('character');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    const genderSwitchInputs = document.querySelectorAll('.gender-switch input');
    const contentHer = document.getElementById('content-her');
    const contentHim = document.getElementById('content-him');

    // Load balance from localStorage
    let coins = parseInt(localStorage.getItem('coins')) || 0;
    coinAmountSpan.textContent = coins;

    let clickStrength = 1;

    let autoClickers = {
        gym: { level: 0, basePrice: 50, increment: 1, currentRate: 0 },
        aiTap: { level: 0, basePrice: 50000, increment: 5, currentRate: 0 },
        airdrop: { level: 0, basePrice: 500000, increment: 15, currentRate: 0 },
        defi: { level: 0, basePrice: 1000000, increment: 30, currentRate: 0 },
    };

    const updateCoinAmount = () => {
        coinAmountSpan.textContent = coins;
        localStorage.setItem('coins', coins);
    };

    const autoIncrementCoins = () => {
        let incrementAmount = 0;
        for (let key in autoClickers) {
            if (key !== 'gym') {
                incrementAmount += autoClickers[key].currentRate;
            }
        }
        coins += incrementAmount;
        updateCoinAmount();
    };

    setInterval(autoIncrementCoins, 1000);

    const buyUpgrade = (upgradeKey) => {
        const upgrade = autoClickers[upgradeKey];
        const price = Math.floor(upgrade.basePrice * Math.pow(1.5, upgrade.level));
        if (coins >= price) {
            coins -= price;
            upgrade.level++;
            if (upgradeKey === 'gym') {
                clickStrength += upgrade.increment;
            } else {
                upgrade.currentRate += upgrade.increment * 1.5; // Увеличение доходности на 50%
            }
            updateUpgradeDetails(upgradeKey);
            updateCoinAmount();
            saveUpgrades();
        }
    };

    const updateUpgradeDetails = (upgradeKey) => {
        const upgrade = autoClickers[upgradeKey];
        const upgradeItem = document.querySelector(`.upgrade-button[data-upgrade="${upgradeKey}"]`).parentElement;
        upgradeItem.querySelector('.upgrade-level').textContent = upgrade.level;
        upgradeItem.querySelector('.upgrade-rate').textContent = upgrade.currentRate.toFixed(1);
    };

    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const upgradeKey = button.getAttribute('data-upgrade');
            buyUpgrade(upgradeKey);
        });
    });

    const updateButtonState = () => {
        upgradeButtons.forEach(button => {
            const upgradeKey = button.getAttribute('data-upgrade');
            const upgrade = autoClickers[upgradeKey];
            const price = Math.floor(upgrade.basePrice * Math.pow(1.5, upgrade.level));
            if (coins >= price) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    };

    setInterval(updateButtonState, 100);

    // Загрузка сохраненных данных об апгрейдах из localStorage
    const loadUpgrades = () => {
        const savedUpgrades = JSON.parse(localStorage.getItem('autoClickers')) || autoClickers;
        for (let key in savedUpgrades) {
            if (autoClickers[key]) {
                autoClickers[key] = savedUpgrades[key];
                updateUpgradeDetails(key);
            }
        }
    };

    // Сохранение данных об апгрейдах в localStorage
    const saveUpgrades = () => {
        localStorage.setItem('autoClickers', JSON.stringify(autoClickers));
    };

    // Загрузка баланса и апгрейдов из localStorage
    const loadGameState = () => {
        coins = parseInt(localStorage.getItem('coins')) || 0;
        coinAmountSpan.textContent = coins;
        loadUpgrades();
    };

    // Сохранение баланса и апгрейдов в localStorage
    const saveGameState = () => {
        localStorage.setItem('coins', coins);
        saveUpgrades();
    };

    // Инициализация состояния игры
    loadGameState();

    // Автоматическое сохранение состояния игры каждые 5 секунд
    setInterval(saveGameState, 5000);

    const switchPage = (pageId) => {
        pages.forEach(page => page.style.display = 'none');
        document.getElementById(pageId).style.display = 'flex';
    };

    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            const pageId = navItem.dataset.page;
            switchPage(pageId);
        });
    });

    // Set initial page
    switchPage('home-page');

    genderSwitchInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value === 'her') {
                contentHer.style.display = 'flex';
                contentHim.style.display = 'none';
            } else {
                contentHer.style.display = 'none';
                contentHim.style.display = 'flex';
            }
        });
    });

    // Show loading screen for 4 seconds
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        switchPage('home-page');
    }, 4000);

    // Add click event to the characters
    const createCoinAnimation = (character, clickStrength) => {
        const coinAnimation = document.createElement('div');
        coinAnimation.classList.add('coin-animation');
        coinAnimation.innerHTML = `<img src="assets/images/coins.svg" alt="Coin"> <span class="coin-value">+${clickStrength}</span>`;
        coinAnimation.style.left = `${Math.random() * 80}%`;
        coinAnimation.style.top = `${Math.random() * 80}%`;
        character.appendChild(coinAnimation);
        setTimeout(() => {
            coinAnimation.remove();
        }, 1000);
    };

    characterHer.addEventListener('click', () => {
        coins += clickStrength;
        updateCoinAmount();
        createCoinAnimation(characterHer, clickStrength);
    });

    characterHim.addEventListener('click', () => {
        coins += clickStrength;
        updateCoinAmount();
        createCoinAnimation(characterHim, clickStrength);
    });
});
