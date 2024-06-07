document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
        document.getElementById('home-page').style.display = 'flex';
    }, 4000);
    
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
                button.style.backgroundColor = '#00ff00'; // Зеленый цвет при достаточном количестве монет
            } else {
                button.style.backgroundColor = '#ff3b30'; // Красный цвет при недостаточном количестве монет
            }
        });
    };

    characterHim.addEventListener('click', (event) => {
        coins += coinsPerTap; // Увеличиваем баланс монет на силу клика
        coinAmountSpan.textContent = coins; // Обновляем отображение баланса
        showCoinAnimation(event.clientX, event.clientY, coinsPerTap); // Показ анимации монеты
        updateUpgradePrices();
    });

    characterHer.addEventListener('click', (event) => {
        coins += coinsPerTap; // Увеличиваем баланс монет на силу клика
        coinAmountSpan.textContent = coins; // Обновляем отображение баланса
        showCoinAnimation(event.clientX, event.clientY, coinsPerTap); // Показ анимации монеты
        updateUpgradePrices();
    });

    const showCoinAnimation = (x, y, amount) => {
        const coinAnimation = document.createElement('div');
        coinAnimation.classList.add('coin-animation');
        coinAnimation.innerHTML = `<img src="assets/images/coins.svg" alt="Coin"><span>+${amount}</span>`;
        document.body.appendChild(coinAnimation);

        // Позиционирование анимации монеты рядом с местом клика
        coinAnimation.style.left = `${x}px`;
        coinAnimation.style.top = `${y}px`;

        // Удаление анимации монеты после завершения анимации
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
                    coinsPerTap *= autoClickers[upgradeType].multiplier; // Увеличиваем силу клика
                } else {
                    autoClickers[upgradeType].currentRate += autoClickers[upgradeType].increment * autoClickers[upgradeType].multiplier ** (autoClickers[upgradeType].level - 1);
                }
                if (autoClickers[upgradeType].level === 1) {
                    startAutoClicker(upgradeType);
                }
                updateUpgradePrices();
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
        });
    });

    // Предотвращаем зум и скролл на мобильных устройствах
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    // Предотвращаем двойной тап для зума и масштабирования
    let lastTouchEnd = 0;
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

    showPage('home-page'); // Показать домашнюю страницу по умолчанию
});
