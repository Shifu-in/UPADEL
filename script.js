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

    let coins = 0; // Инициализация баланса монет с 0
    let coinsPerTap = 1; // Начальная сила клика
    const autoClickers = {
        gym: { level: 0, basePrice: 50, increment: 1, currentRate: 0, priceFactor: 3, multiplier: 2 },
        aiTap: { level: 0, basePrice: 20000, increment: 2, currentRate: 0, priceFactor: 3, multiplier: 2 },
        airdrop: { level: 0, basePrice: 100000, increment: 6, currentRate: 0, priceFactor: 3, multiplier: 2 },
        defi: { level: 0, basePrice: 10000000, increment: 10, currentRate: 0, priceFactor: 3, multiplier: 2 },
    };

    // URL вашего веб-приложения Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxBHtD6OCU0A76pJ55uk77qtVgzhfQBxf4pT_XwScVdZXhUBILmAmG1hH64bNMdYwhE/exec';

    // Локальное сохранение с помощью localStorage
    const saveProgressLocal = () => {
        const progress = {
            coins: coins,
            coinsPerTap: coinsPerTap,
            autoClickers: autoClickers,
        };
        localStorage.setItem('gameProgress', JSON.stringify(progress));
    };

    const loadProgressLocal = () => {
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

    // Сохранение прогресса на Google Sheets
    const saveProgressServer = async () => {
        const progress = {
            userId: 'user1', // Замените на уникальный идентификатор пользователя
            coins: coins,
            coinsPerTap: coinsPerTap,
            autoClickers: autoClickers,
        };
        try {
            await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progress),
            });
        } catch (error) {
            console.error('Error saving progress to server:', error);
        }
    };

    const loadProgressServer = async () => {
        try {
            const response = await fetch(`${scriptURL}?userId=user1`);
            if (response.ok) {
                const progress = await response.json();
                coins = progress.coins;
                coinsPerTap = progress.coinsPerTap;
                Object.keys(autoClickers).forEach(key => {
                    autoClickers[key].level = progress.autoClickers[key].level;
                    autoClickers[key].currentRate = progress.autoClickers[key].currentRate;
                });
                coinAmountSpan.textContent = coins;
                updateUpgradePrices();
            }
        } catch (error) {
            console.error('Error loading progress from server:', error);
        }
    };

    const hideAllPages = () => {
        pages.forEach(page => {
            page.style.display = 'none';
        });
    };

    const showPage = (pageId) => {
        hideAllPages();
        document.getElementById(pageId).style.display = 'flex';
        updateNavigation(pageId);
    };

    const updateNavigation = (activePageId) => {
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.dataset.page === activePageId) {
                navItem.classList.add('active');
            }
        });
    };

    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            showPage(navItem.dataset.page);
        });
    });

    const getUpgradePrice = (upgradeType) => {
        const basePrice = autoClickers[upgradeType].basePrice;
        const level = autoClickers[upgradeType].level;
        if (level === 0) {
            return basePrice;
        }
        return Math.floor(basePrice * Math.pow(autoClickers[upgradeType].priceFactor, level));
    };

    const startAutoClicker = (upgradeType) => {
        setInterval(() => {
            coins += autoClickers[upgradeType].currentRate;
            coinAmountSpan.textContent = coins;
            updateUpgradePrices();
            saveProgressLocal();
            saveProgressServer();
        }, 1000);
    };

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

    characterHim.addEventListener('click', (event) => {
        coins += coinsPerTap;
        coinAmountSpan.textContent = coins;
        showCoinAnimation(event.clientX, event.clientY, coinsPerTap);
        updateUpgradePrices();
        saveProgressLocal();
        saveProgressServer();
    });

    characterHer.addEventListener('click', (event) => {
        coins += coinsPerTap;
        coinAmountSpan.textContent = coins;
        showCoinAnimation(event.clientX, event.clientY, coinsPerTap);
        updateUpgradePrices();
        saveProgressLocal();
        saveProgressServer();
    });

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
                saveProgressLocal();
                saveProgressServer();
            }
        });
    });

    genderSwitchInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value === 'her') {
                contentHer.style.display = 'flex';
                contentHim.style.display = 'none';
            } else {
                contentHer.style.display = 'none';
                contentHim.style.display = 'flex';
            }
            saveProgressLocal();
            saveProgressServer();
        });
    });

    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    showPage('home-page');
    loadProgressLocal();
    loadProgressServer();
});

function subscribeChannel(url, partnerId) {
    window.open(url, '_blank');
    document.querySelector(`#${partnerId} .confirm-button`).style.display = 'inline-block';
}

function confirmSubscription(partnerId) {
    const confirmButton = document.querySelector(`#${partnerId} .confirm-button`);
    const checkmark = document.createElement('img');
    checkmark.src = 'assets/images/checkmark-gold.svg';
    checkmark.classList.add('checkmark');
    confirmButton.parentElement.appendChild(checkmark);

    confirmButton.style.display = 'none';
}
