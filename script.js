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

    let coins = parseInt(coinAmountSpan.textContent);

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
});
