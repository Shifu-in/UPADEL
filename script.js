document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading');
    const pages = document.querySelectorAll('.main-screen');
    const navItems = document.querySelectorAll('.nav-item');
    const coinAmountSpan = document.querySelector('.coin-amount');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    const characterHer = document.getElementById('character-her');
    const characterHim = document.getElementById('character');
    const contentHer = document.getElementById('content-her');
    const contentHim = document.getElementById('content-him');
    const genderSwitchInputs = document.querySelectorAll('.gender-switch input[type="radio"]');

    let coins = 0;

    const autoClickers = {
        'gym': { level: 0, basePrice: 50, currentRate: 1, increment: 1 },
        'ai-tap': { level: 0, basePrice: 50000, currentRate: 5, increment: 5 },
        'airdrop': { level: 0, basePrice: 500000, currentRate: 15, increment: 15 },
        'defi': { level: 0, basePrice: 1000000, currentRate: 30, increment: 30 }
    };

    const showContent = () => {
        loadingScreen.style.display = 'none';
        pages.forEach(page => page.style.display = 'flex');
        document.querySelector('.navigation').style.display = 'flex';
    };

    setTimeout(showContent, 4000); // Показываем основной контент через 4 секунды

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
            priceText.innerHTML = `${price} | level ${level}/10<br>${rate} Young coin - sec`;
            
            if (coins >= price) {
                button.style.backgroundColor = '#00ff00'; // Зеленый цвет при достаточном количестве монет
            } else {
                button.style.backgroundColor = '#ff3b30'; // Красный цвет при недостаточном количестве монет
            }
        });
    };

    characterHim.addEventListener('click', (event) => {
        coins += 1; // Увеличиваем баланс монет на 1
        coinAmountSpan.textContent = coins; // Обновляем отображение баланса
        showCoinAnimation(event.clientX, event.clientY);
    });

    characterHer.addEventListener('click', (event) => {
        coins += 1; // Увеличиваем баланс монет на 1
        coinAmountSpan.textContent = coins; // Обновляем отображение баланса
        showCoinAnimation(event.clientX, event.clientY);
    });

    const showCoinAnimation = (x, y) => {
        const coinAnimation = document.createElement('div');
        coinAnimation.className = 'coin-animation';
        coinAnimation.style.left = `${x}px`;
        coinAnimation.style.top = `${y}px`;
        coinAnimation.innerHTML = '<img src="assets/images/coin.svg" alt="Coin"> +1';
        document.body.appendChild(coinAnimation);

        setTimeout(() => {
            document.body.removeChild(coinAnimation);
        }, 1000);
    };

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

    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const upgradeItem = button.parentElement;
            const upgradeType = upgradeItem.querySelector('.upgrade-details h3').textContent.toLowerCase();
            const price = getUpgradePrice(upgradeType);

            if (coins >= price && autoClickers[upgradeType].level < 10) {
                coins -= price;
                autoClickers[upgradeType].level++;
                autoClickers[upgradeType].currentRate += autoClickers[upgradeType].increment;
                coinAmountSpan.textContent = coins;
                startAutoClicker(upgradeType);
                updateUpgradePrices();
            }
        });
    });

    showPage('home-page');
});
