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
    let autoClickers = {
        gym: { level: 0, basePrice: 50, increment: 1, currentRate: 0 },
        aiTap: { level: 0, basePrice: 50000, increment: 5, currentRate: 0 },
        airdrop: { level: 0, basePrice: 500000, increment: 15, currentRate: 0 },
        defi: { level: 0, basePrice: 1000000, increment: 30, currentRate: 0 },
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
        return Math.floor(basePrice * Math.pow(1.5, level));
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
            const upgradeItem = button.parentElement;
            const upgradeType = upgradeItem.querySelector('.upgrade-details h3').textContent.toLowerCase();
            const price = getUpgradePrice(upgradeType);
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
        showCoinAnimation(event.clientX, event.clientY); // Показ анимации монеты
        updateUpgradePrices();
    });

    characterHer.addEventListener('click', (event) => {
        coins += coinsPerTap; // Увеличиваем баланс монет на силу клика
        coinAmountSpan.textContent = coins; // Обновляем отображение баланса
        showCoinAnimation(event.clientX, event.clientY); // Показ анимации монеты
        updateUpgradePrices();
    });

    const showCoinAnimation = (x, y) => {
        const coinAnimation = document.createElement('div');
        coinAnimation.classList.add('coin-animation');
        coinAnimation.innerHTML = '<img src="assets/images/coins.svg" alt="Coin"><span>+1</span>';
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
            const upgradeItem = button.parentElement;
            const upgradeType = upgradeItem.querySelector('.upgrade-details h3').textContent.toLowerCase();
            const price = getUpgradePrice(upgradeType);

            if (coins >= price) {
                coins -= price;
                coinAmountSpan.textContent = coins;
                autoClickers[upgradeType].level++;
                autoClickers[upgradeType].currentRate += autoClickers[upgradeType].increment;
                if (upgradeType === "gym") {
                    coinsPerTap += autoClickers[upgradeType].increment; // Увеличиваем силу клика
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
