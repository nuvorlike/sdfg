const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    win: document.querySelector('.win')
};

let rulesBtn = document.getElementById('rulesBtn');
let rulesPopup = document.getElementById('rulesPopup');
let closeBtn = rulesPopup.querySelector('.close');

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
    return `I just completed Brain Train Game (made by @AlicommPng) with ${moves} moves under ${time} secs\n\nTry it out this @tenprotocol themed game : ${gameLink}`;
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
    ctx.fillText('Made by @AlicommPng', canvas.width / 2, 260);

    return canvas.toDataURL('image/png');
};

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension');
    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }

    // Mengganti URL placeholder untuk menampilkan nama gambar, bukan hanya angka.
    // Pastikan path ini sesuai dengan struktur folder proyek Anda.
    const images = [
        'https://placehold.co/100x100/EBF4FA/000000?text=Image1',
        'https://placehold.co/100x100/F9EBFA/000000?text=Image2',
        'https://placehold.co/100x100/FAF3EB/000000?text=Image3',
        'https://placehold.co/100x100/EBF9F3/000000?text=Image4',
        'https://placehold.co/100x100/EBEFF9/000000?text=Image5',
        'https://placehold.co/100x100/F9EBEB/000000?text=Image6',
        'https://placehold.co/100x100/F8F9EB/000000?text=Image7',
        'https://placehold.co/100x100/EBF9F9/000000?text=Image8',
        'https://placehold.co/100x100/F3EBF9/000000?text=Image9',
        'https://placehold.co/100x100/F9F0EB/000000?text=Image10'
    ];
    const picks = pickRandom(images, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item}" alt="card image" onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=Error';"></div>
                </div>
            `).join('')}
        </div>
    `;
    
    const parser = new DOMParser().parseFromString(cards, 'text/html');
    // It's better to get a new reference to the board after replacing it
    const newBoard = parser.querySelector('.board');
    selectors.board.parentNode.replaceChild(newBoard, selectors.board);
    selectors.board = newBoard; // Update the selector to the new board
};

const startGame = () => {
    state.gameStarted = true;
    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000);
};

const flipBackCards = () => {
    const unmatchedCards = state.currentFlipped.filter(card => !card.classList.contains('matched'));
    if (unmatchedCards.length > 0) {
        // Assuming you have an audio element with id 'noMatchSound'
        const noMatchSound = document.getElementById('noMatchSound');
        if (noMatchSound) noMatchSound.play();
        unmatchedCards.forEach(card => card.classList.remove('flipped'));
    }
    state.flippedCards = 0;
    state.currentFlipped = [];
};

const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;
    selectors.moves.innerText = `${state.totalFlips} moves`;

    if (!state.gameStarted) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
        state.currentFlipped.push(card);
    }

    if (state.flippedCards === 2) {
        const [card1, card2] = state.currentFlipped;
        if (card1.querySelector('.card-back img').src === card2.querySelector('.card-back img').src) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            // Assuming you have an audio element with id 'matchSound'
            const matchSound = document.getElementById('matchSound');
            if (matchSound) matchSound.play();
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    // Use the updated board selector to query for cards
    if (!selectors.board.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            const scorecardImg = generateScorecardImage();
            selectors.boardContainer.classList.add('flipped');
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
        const card = event.target.closest('.card');
        if (card && !card.classList.contains('flipped')) {
            flipCard(card);
        } else if (event.target.id === 'rulesBtn') {
            rulesPopup.style.display = 'block';
        } else if (event.target.id === 'replayBtn') {
            window.location.reload();
        } else if (event.target.id === 'shareBtn') {
            const tweetText = generateTweetText();
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            window.open(tweetUrl, '_blank');
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            rulesPopup.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === rulesPopup) {
            rulesPopup.style.display = 'none';
        }
    });
};

// Check if running on a mobile device
if (/Android|iPhone/i.test(navigator.userAgent)) {
    document.body.innerHTML = '<div class="error-message" style="text-align: center; padding: 20px; font-family: sans-serif;"><h1>This game is supported only on PC or in desktop mode.</h1></div>';
} else {
    // Ensure the DOM is fully loaded before running the game logic
    document.addEventListener('DOMContentLoaded', () => {
        generateGame();
        attachEventListeners();
    });
}
