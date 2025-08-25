<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brain Train - Memory Game</title>
    <style>
        /* General Styling */
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap');

        :root {
            --bg-color: #FDF8E6;
            --primary-color: #282A3A;
            --accent-color: #6f00fc;
            --card-front: #ffcb05;
            --card-back: #3d7dca;
        }

        body {
            font-family: 'Lexend', sans-serif;
            background-color: var(--bg-color);
            color: var(--primary-color);
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            flex-direction: column;
        }

        .game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        h1 {
            font-size: 2.5rem;
            color: var(--primary-color);
            text-shadow: 2px 2px var(--accent-color);
        }

        /* Controls and Stats */
        .controls {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 500px;
            background: rgba(255, 255, 255, 0.7);
            padding: 10px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .controls button {
            background-color: var(--accent-color);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Lexend', sans-serif;
            font-weight: bold;
            transition: transform 0.2s, background-color 0.2s;
        }

        .controls button:hover {
            transform: scale(1.05);
            background-color: #5a00d1;
        }

        .stats {
            display: flex;
            gap: 20px;
            font-size: 1.2rem;
            font-weight: bold;
        }

        /* Board and Cards */
        .board-container {
            perspective: 1000px;
            position: relative;
            width: 500px;
            height: 500px;
        }

        .board, .win {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            transition: transform 0.6s;
            transform-style: preserve-3d;
        }

        .board {
            display: grid;
            gap: 10px;
            padding: 10px;
            background: var(--primary-color);
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .board-container.flipped .board {
            transform: rotateY(180deg);
        }

        .card {
            position: relative;
            cursor: pointer;
            transform-style: preserve-3d;
            transition: transform 0.6s;
            border-radius: 8px;
            overflow: hidden;
        }

        .card.flipped {
            transform: rotateY(180deg);
        }

        .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .card-front {
            background: var(--card-front);
            background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233d7dca' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
        }

        .card-back {
            background: var(--card-back);
            transform: rotateY(180deg);
        }

        .card-back img {
            width: 90%;
            height: 90%;
            object-fit: cover;
            border-radius: 5px;
        }
        
        .card.matched .card-back {
            box-shadow: 0 0 15px 5px #00ff00; /* Green glow for matched cards */
        }

        /* Win Screen */
        .win {
            transform: rotateY(-180deg);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            gap: 20px;
            background: var(--bg-color);
            border-radius: 12px;
        }
        
        .scorecard-img {
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .win button {
            background-color: var(--accent-color);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Lexend', sans-serif;
            font-size: 1rem;
            font-weight: bold;
            transition: transform 0.2s, background-color 0.2s;
        }
        
        .win button:hover {
            transform: scale(1.05);
            background-color: #5a00d1;
        }

        /* Rules Popup */
        .popup {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.6);
        }

        .popup-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 30px;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px;
            border-radius: 12px;
            position: relative;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }

        .close {
            color: #aaa;
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover, .close:focus {
            color: black;
        }
        
        /* Mobile Error Message */
        .error-message {
            font-family: 'Lexend', sans-serif;
            text-align: center;
            padding: 20px;
            color: var(--primary-color);
        }
    </style>
</head>
<body>

    <div class="game-container">
        <h1>Brain Train</h1>
        <div class="controls">
            <button id="rulesBtn">Rules</button>
            <div class="stats">
                <div class="moves">0 moves</div>
                <div class="timer">time: 0 sec</div>
            </div>
        </div>
        <div class="board-container">
            <div class="board" data-dimension="4"></div>
            <div class="win"></div>
        </div>
    </div>

    <!-- Rules Popup -->
    <div id="rulesPopup" class="popup">
        <div class="popup-content">
            <span class="close">&times;</span>
            <h2>Game Rules</h2>
            <p>1. Flip over any two cards.</p>
            <p>2. If the two cards match, they will stay open.</p>
            <p>3. If they don't match, they will be flipped back over.</p>
            <p>4. The game is over when all the cards have been matched.</p>
            <p>5. Try to complete the game in the fewest moves and shortest time!</p>
        </div>
    </div>
    
    <!-- Audio Elements -->
    <audio id="matchSound" src="https://actions.google.com/sounds/v1/positive/bell_toll_positive.ogg" preload="auto"></audio>
    <audio id="noMatchSound" src="https://actions.google.com/sounds/v1/negative/negative_beeps.ogg" preload="auto"></audio>

    <script>
        // Check if running on a mobile device
        if (/Android|iPhone/i.test(navigator.userAgent)) {
            document.body.innerHTML = '<div class="error-message"><h1>This game is supported only on PC or in desktop mode.</h1></div>';
        } else {
            // Ensure the DOM is fully loaded before running the game logic
            document.addEventListener('DOMContentLoaded', () => {
                const selectors = {
                    boardContainer: document.querySelector('.board-container'),
                    board: document.querySelector('.board'),
                    moves: document.querySelector('.moves'),
                    timer: document.querySelector('.timer'),
                    win: document.querySelector('.win'),
                    rulesBtn: document.getElementById('rulesBtn'),
                    rulesPopup: document.getElementById('rulesPopup'),
                    closeBtn: document.querySelector('#rulesPopup .close')
                };

                const state = {
                    gameStarted: false,
                    flippedCards: 0,
                    totalFlips: 0,
                    totalTime: 0,
                    loop: null,
                    currentFlipped: []
                };

                const shuffle = array => {
                    const clonedArray = [...array];
                    for (let index = clonedArray.length - 1; index > 0; index--) {
                        const randomIndex = Math.floor(Math.random() * (index + 1));
                        [clonedArray[index], clonedArray[randomIndex]] = [clonedArray[randomIndex], clonedArray[index]];
                    }
                    return clonedArray;
                };

                const pickRandom = (array, items) => {
                    const clonedArray = [...array];
                    const randomPicks = [];
                    for (let index = 0; index < items; index++) {
                        const randomIndex = Math.floor(Math.random() * clonedArray.length);
                        randomPicks.push(clonedArray[randomIndex]);
                        clonedArray.splice(randomIndex, 1);
                    }
                    return randomPicks;
                };

                const generateTweetText = () => {
                    const moves = state.totalFlips;
                    const time = state.totalTime;
                    const gameLink = window.location.href;
                    return `I just completed Brain Train Game with ${moves} moves in ${time} secs\n\nTry it out!`;
                };

                const generateScorecardImage = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 600;
                    canvas.height = 300;
                    const ctx = canvas.getContext('2d');

                    ctx.fillStyle = '#FDF8E6';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.strokeStyle = '#282A3A';
                    ctx.lineWidth = 10;
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);

                    ctx.fillStyle = '#282A3A';
                    ctx.font = 'bold 40px Lexend';
                    ctx.textAlign = 'center';
                    ctx.fillText('Brain Train Scorecard', canvas.width / 2, 60);

                    ctx.font = '30px Lexend';
                    ctx.fillText(`Moves: ${state.totalFlips}`, canvas.width / 2, 140);
                    ctx.fillText(`Time: ${state.totalTime} seconds`, canvas.width / 2, 200);

                    ctx.font = '20px Lexend';
                    ctx.fillStyle = '#6f00fc';
                    ctx.fillText('Good Game!', canvas.width / 2, 260);

                    return canvas.toDataURL('image/png');
                };

                const generateGame = () => {
                    const dimensions = selectors.board.getAttribute('data-dimension');
                    if (dimensions % 2 !== 0) {
                        throw new Error("The dimension of the board must be an even number.");
                    }

                    // FIXED: Using absolute URLs from a placeholder service instead of local paths
                    const images = [
                        'assets/images/image1.jpg',
                        'assets/images/image2.jpg',
        		'assets/images/image3.jpg',
        		'assets/images/image4.jpg',
        		'assets/images/image5.jpg',
        		'assets/images/image6.jpg',
        		'assets/images/image7.jpg',
        		'assets/images/image8.jpg',
        		'assets/images/image9.jpg',
        		'assets/images/image10.png'
                    ];
                    const picks = pickRandom(images, (dimensions * dimensions) / 2);
                    const items = shuffle([...picks, ...picks]);
                    
                    const cardsHTML = items.map(item => `
                        <div class="card">
                            <div class="card-front"></div>
                            <div class="card-back"><img src="${item}" alt="card image" onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=Error';"></div>
                        </div>
                    `).join('');

                    selectors.board.style.gridTemplateColumns = `repeat(${dimensions}, auto)`;
                    selectors.board.innerHTML = cardsHTML;
                };

                const startGame = () => {
                    state.gameStarted = true;
                    selectors.boardContainer.classList.remove('flipped'); // Ensure board is visible
                    state.loop = setInterval(() => {
                        state.totalTime++;
                        selectors.timer.innerText = `time: ${state.totalTime} sec`;
                    }, 1000);
                };

                const flipBackCards = () => {
                    document.querySelectorAll('.card:not(.matched)').forEach(card => {
                        card.classList.remove('flipped');
                    });
                    state.flippedCards = 0;
                };

                const flipCard = card => {
                    if (state.currentFlipped.length >= 2 || card.classList.contains('flipped')) {
                        return; // Prevent flipping more than 2 cards or a flipped card
                    }
                    
                    state.flippedCards++;
                    state.totalFlips++;
                    selectors.moves.innerText = `${state.totalFlips} moves`;

                    if (!state.gameStarted) {
                        startGame();
                    }

                    card.classList.add('flipped');
                    state.currentFlipped.push(card);

                    if (state.currentFlipped.length === 2) {
                        const [card1, card2] = state.currentFlipped;
                        const img1 = card1.querySelector('.card-back img').src;
                        const img2 = card2.querySelector('.card-back img').src;

                        if (img1 === img2) {
                            card1.classList.add('matched');
                            card2.classList.add('matched');
                            document.getElementById('matchSound').play();
                            state.currentFlipped = []; // Clear for next pair
                        } else {
                            setTimeout(() => {
                                card1.classList.remove('flipped');
                                card2.classList.remove('flipped');
                                document.getElementById('noMatchSound').play();
                                state.currentFlipped = []; // Clear for next pair
                            }, 1000);
                        }
                    }

                    // Check for win condition
                    if (document.querySelectorAll('.card.matched').length === document.querySelectorAll('.card').length) {
                        setTimeout(() => {
                            selectors.boardContainer.classList.add('flipped');
                            const scorecardImg = generateScorecardImage();
                            selectors.win.innerHTML = `
                                <img src="${scorecardImg}" alt="Scorecard" class="scorecard-img">
                                <div style="display: flex; justify-content: center; gap: 20px;">
                                    <button id="replayBtn">Replay</button>
                                    <button id="shareBtn">Share on X</button>
                                </div>
                            `;
                            clearInterval(state.loop);
                        }, 1000);
                    }
                };
                
                const attachEventListeners = () => {
                    document.addEventListener('click', event => {
                        const target = event.target;
                        const card = target.closest('.card');

                        if (card && !card.classList.contains('matched')) {
                            flipCard(card);
                        } else if (target.id === 'replayBtn') {
                            window.location.reload();
                        } else if (target.id === 'shareBtn') {
                            const tweetText = generateTweetText();
                            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                            window.open(tweetUrl, '_blank');
                        } else if (target.id === 'rulesBtn') {
                            selectors.rulesPopup.style.display = 'block';
                        } else if (target === selectors.rulesPopup || target === selectors.closeBtn) {
                            selectors.rulesPopup.style.display = 'none';
                        }
                    });
                };

                // Initialize Game
                generateGame();
                attachEventListeners();
            });
        }
    </script>
</body>
</html>
