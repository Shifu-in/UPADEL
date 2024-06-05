document.addEventListener("DOMContentLoaded", () => {
    const homePage = document.getElementById('home-page');
    const storePage = document.getElementById('store-page');
    const navHome = document.getElementById('nav-home');
    const navStore = document.getElementById('nav-store');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    const coinAmountSpan = document.querySelector('.coin-amount');

    let coins = parseInt(coinAmountSpan.textContent);

    navHome.addEventListener('click', () => {
        homePage.style.display = 'flex';
        storePage.style.display = 'none';
    });

    navStore.addEventListener('click', () => {
        homePage.style.display = 'none';
        storePage.style.display = 'flex';
    });

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
