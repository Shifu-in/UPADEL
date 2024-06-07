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

    // Game code
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

    var width = 422,
        height = 552;

    canvas.width = width;
    canvas.height = height;

    // Variables for game
    var platforms = [],
        image = new Image(),
        player, platformCount = 10,
        position = 0,
        gravity = 0.2,
        animloop,
        flag = 0,
        menuloop, broken = 0,
        dir, score = 0,
        firstRun = true;

    image.src = 'https://i.imgur.com/YXNA9.png';

    // Base object
    var Base = function() {
        this.height = 5;
        this.width = width;

        this.cx = 0;
        this.cy = 614;
        this.cwidth = 100;
        this.cheight = 5;

        this.moved = 0;

        this.x = 0;
        this.y = height - this.height;

        this.draw = function() {
            try {
                ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
            } catch (e) {}
        };
    };

    var base = new Base();

    // Player object
    var Player = function() {
        this.vy = 11;
        this.vx = 0;

        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isDead = false;

        this.width = 55;
        this.height = 40;

        this.cx = 0;
        this.cy = 0;
        this.cwidth = 110;
        this.cheight = 80;

        this.dir = "left";

        this.x = width / 2 - this.width / 2;
        this.y = height;

        this.draw = function() {
            try {
                if (this.dir == "right") this.cy = 121;
                else if (this.dir == "left") this.cy = 201;
                else if (this.dir == "right_land") this.cy = 289;
                else if (this.dir == "left_land") this.cy = 371;

                ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
            } catch (e) {}
        };

        this.jump = function() {
            this.vy = -8;
        };

        this.jumpHigh = function() {
            this.vy = -16;
        };

    };

    player = new Player();

    // Platform class

    function Platform() {
        this.width = 70;
        this.height = 17;

        this.x = Math.random() * (width - this.width);
        this.y = position;

        position += (height / platformCount);

        this.flag = 0;
        this.state = 0;

        this.cx = 0;
        this.cy = 0;
        this.cwidth = 105;
        this.cheight = 31;

        this.draw = function() {
            try {
                if (this.type == 1) this.cy = 0;
                else if (this.type == 2) this.cy = 61;
                else if (this.type == 3 && this.flag === 0) this.cy = 31;
                else if (this.type == 3 && this.flag == 1) this.cy = 1000;
                else if (this.type == 4 && this.state === 0) this.cy = 90;
                else if (this.type == 4 && this.state == 1) this.cy = 1000;

                ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
            } catch (e) {}
        };

        if (score >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4];
        else if (score >= 2000 && score < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
        else if (score >= 1000 && score < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
        else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
        else if (score >= 100 && score < 500) this.types = [1, 1, 1, 1, 2, 2];
        else this.types = [1];

        this.type = this.types[Math.floor(Math.random() * this.types.length)];

        if (this.type == 3 && broken < 1) {
            broken++;
        } else if (this.type == 3 && broken >= 1) {
            this.type = 1;
            broken = 0;
        }

        this.moved = 0;
        this.vx = 1;
    }

    for (var i = 0; i < platformCount; i++) {
        platforms.push(new Platform());
    }

    // Broken platform object
    var Platform_broken_substitute = function() {
        this.height = 30;
        this.width = 70;

        this.x = 0;
        this.y = 0;

        this.cx = 0;
        this.cy = 554;
        this.cwidth = 105;
        this.cheight = 60;

        this.appearance = false;

        this.draw = function() {
            try {
                if (this.appearance === true) ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
                else return;
            } catch (e) {}
        };
    };

    var platform_broken_substitute = new Platform_broken_substitute();

    // Spring Class
    var spring = function() {
        this.x = 0;
        this.y = 0;

        this.width = 26;
        this.height = 30;

        this.cx = 0;
        this.cy = 0;
        this.cwidth = 45;
        this.cheight = 53;

        this.state = 0;

        this.draw = function() {
            try {
                if (this.state === 0) this.cy = 445;
                else if (this.state == 1) this.cy = 501;

                ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
            } catch (e) {}
        };
    };

    var Spring = new spring();

    function init() {
        var	dir = "left",
            jumpCount = 0;
        
        firstRun = false;

        function paintCanvas() {
            ctx.clearRect(0, 0, width, height);
        }

        function playerCalc() {
            if (dir == "left") {
                player.dir = "left";
                if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
            } else if (dir == "right") {
                player.dir = "right";
                if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
            }

            document.onkeydown = function(e) {
                var key = e.keyCode;
                
                if (key == 37) {
                    dir = "left";
                    player.isMovingLeft = true;
                } else if (key == 39) {
                    dir = "right";
                    player.isMovingRight = true;
                }
                
                if(key == 32) {
                    if(firstRun === true)
                        init();
                    else 
                        reset();
                }
            };

            document.onkeyup = function(e) {
                var key = e.keyCode;
            
                if (key == 37) {
                    dir = "left";
                    player.isMovingLeft = false;
                } else if (key == 39) {
                    dir = "right";
                    player.isMovingRight = false;
                }
            };

            if (player.isMovingLeft === true) {
                player.x += player.vx;
                player.vx -= 0.15;
            } else {
                player.x += player.vx;
                if (player.vx < 0) player.vx += 0.1;
            }

            if (player.isMovingRight === true) {
                player.x += player.vx;
                player.vx += 0.15;
            } else {
                player.x += player.vx;
                if (player.vx > 0) player.vx -= 0.1;
            }

            if ((player.y + player.height) > base.y && base.y < height) player.jump();

            if (base.y > height && (player.y + player.height) > height && player.isDead != "lol") player.isDead = true;

            if (player.x > width) player.x = 0 - player.width;
            else if (player.x < 0 - player.width) player.x = width;

            if (player.y >= (height / 2) - (player.height / 2)) {
                player.y += player.vy;
                player.vy += gravity;
            } else {
                platforms.forEach(function(p, i) {
                    if (player.vy < 0) {
                        p.y -= player.vy;
                    }
                    if (p.y > height) {
                        platforms[i] = new Platform();
                        platforms[i].y = p.y - height;
                    }
                });

                base.y -= player.vy;
                player.vy += gravity;

                if (player.vy >= 0) {
                    player.y += player.vy;
                    player.vy += gravity;
                }

                score++;
            }

            collides();

            if (player.isDead === true) gameOver();
        }

        function springCalc() {
            var s = Spring;
            var p = platforms[0];

            if (p.type == 1 || p.type == 2) {
                s.x = p.x + p.width / 2 - s.width / 2;
                s.y = p.y - p.height - 10;

                if (s.y > height / 1.1) s.state = 0;

                s.draw();
            } else {
                s.x = 0 - s.width;
                s.y = 0 - s.height;
            }
        }

        function platformCalc() {
            var subs = platform_broken_substitute;

            platforms.forEach(function(p, i) {
                if (p.type == 2) {
                    if (p.x < 0 || p.x + p.width > width) p.vx *= -1;

                    p.x += p.vx;
                }

                if (p.flag == 1 && subs.appearance === false && jumpCount === 0) {
                    subs.x = p.x;
                    subs.y = p.y;
                    subs.appearance = true;

                    jumpCount++;
                }

                p.draw();
            });

            if (subs.appearance === true) {
                subs.draw();
                subs.y += 8;
            }

            if (subs.y > height) subs.appearance = false;
        }

        function collides() {
            platforms.forEach(function(p, i) {
                if (player.vy > 0 && p.state === 0 && (player.x + 15 < p.x + p.width) && (player.x + player.width - 15 > p.x) && (player.y + player.height > p.y) && (player.y + player.height < p.y + p.height)) {
                    if (p.type == 3 && p.flag === 0) {
                        p.flag = 1;
                        jumpCount = 0;
                        return;
                    } else if (p.type == 4 && p.state === 0) {
                        player.jump();
                        p.state = 1;
                    } else if (p.flag == 1) return;
                    else {
                        player.jump();
                    }
                }
            });

            var s = Spring;
            if (player.vy > 0 && (s.state === 0) && (player.x + 15 < s.x + s.width) && (player.x + player.width - 15 > s.x) && (player.y + player.height > s.y) && (player.y + player.height < s.y + s.height)) {
                s.state = 1;
                player.jumpHigh();
            }
        }

        function updateScore() {
            var scoreText = document.getElementById("score");
            scoreText.innerHTML = score;
        }

        function gameOver() {
            platforms.forEach(function(p, i) {
                p.y -= 12;
            });

            if (player.y > height / 2 && flag === 0) {
                player.y -= 8;
                player.vy = 0;
            } else if (player.y < height / 2) flag = 1;
            else if (player.y + player.height > height) {
                showGoMenu();
                hideScore();
                player.isDead = "lol";
            }
        }

        function update() {
            paintCanvas();
            platformCalc();
            springCalc();
            playerCalc();
            player.draw();
            base.draw();
            updateScore();
        }

        menuLoop = function() {
            return;
        };
        animloop = function() {
            update();
            requestAnimFrame(animloop);
        };

        animloop();
        hideMenu();
        showScore();
    }

    function reset() {
        hideGoMenu();
        showScore();
        player.isDead = false;

        flag = 0;
        position = 0;
        score = 0;

        base = new Base();
        player = new Player();
        Spring = new spring();
        platform_broken_substitute = new Platform_broken_substitute();

        platforms = [];
        for (var i = 0; i < platformCount; i++) {
            platforms.push(new Platform());
        }
    }

    function hideMenu() {
        var menu = document.getElementById("mainMenu");
        menu.style.zIndex = -1;
    }

    function showGoMenu() {
        var menu = document.getElementById("gameOverMenu");
        menu.style.zIndex = 1;
        menu.style.visibility = "visible";

        var scoreText = document.getElementById("go_score");
        scoreText.innerHTML = "You scored " + score + " points!";
    }

    function hideGoMenu() {
        var menu = document.getElementById("gameOverMenu");
        menu.style.zIndex = -1;
        menu.style.visibility = "hidden";
    }

    function showScore() {
        var menu = document.getElementById("scoreBoard");
        menu.style.zIndex = 1;
    }

    function hideScore() {
        var menu = document.getElementById("scoreBoard");
        menu.style.zIndex = -1;
    }

    function playerJump() {
        player.y += player.vy;
        player.vy += gravity;

        if (player.vy > 0 &&
            (player.x + 15 < 260) &&
            (player.x + player.width - 15 > 155) &&
            (player.y + player.height > 475) &&
            (player.y + player.height < 500))
            player.jump();

        if (dir == "left") {
            player.dir = "left";
            if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
        } else if (dir == "right") {
            player.dir = "right";
            if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
        }

        document.onkeydown = function(e) {
            var key = e.keyCode;

            if (key == 37) {
                dir = "left";
                player.isMovingLeft = true;
            } else if (key == 39) {
                dir = "right";
                player.isMovingRight = true;
            }

            if (key == 32) {
                if (firstRun === true) {
                    init();
                    firstRun = false;
                } else
                    reset();
            }
        };

        document.onkeyup = function(e) {
            var key = e.keyCode;

            if (key == 37) {
                dir = "left";
                player.isMovingLeft = false;
            } else if (key == 39) {
                dir = "right";
                player.isMovingRight = false;
            }
        };

        if (player.isMovingLeft === true) {
            player.x += player.vx;
            player.vx -= 0.15;
        } else {
            player.x += player.vx;
            if (player.vx < 0) player.vx += 0.1;
        }

        if (player.isMovingRight === true) {
            player.x += player.vx;
            player.vx += 0.15;
        } else {
            player.x += player.vx;
            if (player.vx > 0) player.vx -= 0.1;
        }

        if ((player.y + player.height) > base.y && base.y < height) player.jump();

        if (player.x > width) player.x = 0 - player.width;
        else if (player.x < 0 - player.width) player.x = width;

        player.draw();
    }

    function update() {
        ctx.clearRect(0, 0, width, height);
        playerJump();
    }

    menuLoop = function() {
        update();
        requestAnimFrame(menuLoop);
    };

    menuLoop();

    // Partner functionality
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
});

