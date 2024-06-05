document.addEventListener("DOMContentLoaded", () => {
    const homePage = document.getElementById('home-page');
    const storePage = document.getElementById('store-page');
    const walletPage = document.getElementById('wallet-page');
    const statsPage = document.getElementById('stats-page');
    const funPage = document.getElementById('fun-page');
    const navHome = document.getElementById('nav-home');
    const navStore = document.getElementById('nav-store');
    const navWallet = document.getElementById('nav-wallet');
    const navStats = document.getElementById('nav-stats');
    const navFun = document.getElementById('nav-fun');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    const coinAmountSpan = document.querySelector('.coin-amount');
    const character = document.getElementById('character'); // Получаем элемент персонажа

    let coins = 0; // Инициализация баланса монет с 0

    const pages = {
        'home-page': homePage,
        'store-page': storePage,
        'wallet-page': walletPage,
        'stats-page': statsPage,
        'fun-page': funPage
    };

    const hideAllPages = () => {
        Object.values(pages).forEach(page => {
            page.style.display = 'none';
        });
    };

    const showPage = (pageId) => {
        hideAllPages();
        pages[pageId].style.display = 'flex';
    };

    navHome.addEventListener('click', () => showPage('home-page'));
    navStore.addEventListener('click', () => showPage('store-page'));
    navWallet.addEventListener('click', () => showPage('wallet-page'));
    navStats.addEventListener('click', () => showPage('stats-page'));
    navFun.addEventListener('click', () => showPage('fun-page'));

    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const upgradeItem = button.parentElement;
            const priceText = upgradeItem.querySelector('.upgrade-details p').textContent;
            const price = parseInt(priceText.split('|')[0].trim().replace(/,/g, ''));

            if (coins >= price) {
                coins -= price;
                coinAmountSpan.textContent = coins;
                alert('Upgrade purchased!');
            } else {
                alert('Not enough coins!');
            }
        });
    });

    // Добавляем обработчик события клика на персонажа
    character.addEventListener('click', (event) => {
        coins += 1; // Увеличиваем баланс монет на 1
        coinAmountSpan.textContent = coins; // Обновляем отображение баланса
        showCoinAnimation(event.clientX, event.clientY); // Показ анимации монеты
    });

    // Функция для отображения анимации монеты
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

    // Предотвращаем зум и скролл на мобильных устройствах
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    // Предотвращаем двойной тап для зума
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});
