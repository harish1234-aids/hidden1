const questionEl = document.getElementById('question-display');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const hotspotLayer = document.getElementById('hotspot-layer');
const nextLevelBtn = document.getElementById('next-level-btn');
const hint1Btn = document.getElementById('hint1-btn');
const hint2Btn = document.getElementById('hint2-btn');
const hintDisplay = document.getElementById('hint-display');
const successSound = document.getElementById('success-sound');

let score = 0;
let lives = 3;
let currentItem = null;
let currentLevel = 0;
let gameData = [];
let hintUsed = 0;

const levels = [
    { image:"/static/images/level2.jpg", items: [
        { riddle: "I am an animal with long neck.", name: "Giraffe", top: "5%", left: "84%", width: "12%", height: "17%", hints: ["I have spots.","I eat leaves."] },
        { riddle: "I am a domestic animal.", name: "Cat", top: "20%", left: "61%", width: "8%", height: "10%", hints: ["I catch mice.", "I say meow."] },
        { riddle: "I am a fruit with red colour.", name: "Strawberry", top: "88%", left: "39%", width: "8%", height: "10%", hints: ["I have tiny seeds.", "I am sweet."] },
        { riddle: "I am a long yellow fruit. Monkeys love to eat me.", name: "Banana", top: "43%", left: "45%", width: "8%", height: "10%", hints: ["I am yellow.", "I can fall down people who put their legs on me."] },
        { riddle: "I am hard and strong. I are inside your body and help you stand.", name: "Bone", top: "55%", left: "85%", width: "10%", height: "8%", hints: ["Every vertibrates has me.", "I am so strong."] }
    ] },
    { image:"/static/images/screen-6.jpg", items: [
        { riddle: "I am hot and bright. I give light and heat.", name: "Fire", top: "49%", left: "75%", width: "12%", height: "17%", hints: ["I can burn.","I give heat."] },
        { riddle: "I help you see clearly. I sit on your nose.", name: "Spectacles", top: "41%", left: "30%", width: "8%", height: "10%", hints: ["I have two glasses.", "People wear me."] },
        { riddle: "I have many pages. I help you read and learn.", name: "Book", top: "88%", left: "10%", width: "8%", height: "10%", hints: ["I have words and pictures.", "We read me."] },
        { riddle: "I am soft and fluffy. Children love to hug me.", name: "Teddy", top: "82%", left: "90%", width: "8%", height: "17%", hints: ["I am a toy.", "Children hug me."] },
        { riddle: "I make a loud sound and wake you up in the morning.", name: "Alarm", top: "31%", left: "85%", width: "10%", height: "8%", hints: ["I tell time.", "Used in the morning."] }
    ] },
    { image:"/static/images/level1.webp", items: [
        { riddle: "I have vast blue body covers most of the Earth.", name: "Sea", top: "45%", left: "50%", width: "8%", height: "14%", hints: ["It touches every shore.", "Its waters rise and fall with the moon."] },
        { riddle: "I holds a plant upright while it grows.", name: "Plant Pot", top: "65%", left: "90%", width: "4%", height: "6%", hints: ["It holds soil, not water.", "Roots rest inside it."] },
        { riddle: "I stand silent, shaped by hands, telling stories without a voice.", name: "Sculpture", top: "48%", left: "26%", width: "5%", height: "10%", hints: ["Made of stone, wood, or metal.", "It shows a form, figure, or shape as art."] },
        { riddle: "I am an animal that neighs, runs fast, and people ride me.", name: "Horse", top: "53%", left: "15%", width: "5%", height: "13%", hints: ["race with me.", "I have four legs and hooves."] },
        { riddle: "I am a board used for painting pictures.", name: "Painting Board", top: "53%", left: "60%", width: "12%", height: "20%", hints: ["my partner is painting brush.", "people often paints on me."] }
    ] }
];

function initLevel() {
    hintUsed = 0;
    hint1Btn.disabled = false;
    hint2Btn.disabled = true;
    hintDisplay.innerHTML = "";
    nextLevelBtn.style.display = "none";

    const level = levels[currentLevel];
    document.getElementById("game-image").src = level.image;
    gameData = [...level.items];
    lives = 3;
    updateHearts();
    startGame();
}

function startGame() {
    if (gameData.length === 0) {
        questionEl.innerText =
            currentLevel < levels.length - 1
            ? "Level Complete! 🎉"
            : "You found everything! You are a master detective 🕵️‍♂️";

        nextLevelBtn.style.display =
            currentLevel < levels.length - 1 ? "inline-block" : "none";

        hotspotLayer.innerHTML = '';
        return;
    }

    currentItem = gameData[Math.floor(Math.random() * gameData.length)];
    questionEl.innerText = `Question: ${currentItem.riddle}`;

    // Reset hints for new item
    hintUsed = 0;
    hintDisplay.innerHTML = '';
    hint1Btn.disabled = false;
    hint2Btn.disabled = true;

    renderHotspot();
}

function renderHotspot() {
    hotspotLayer.innerHTML = '';
    const spot = document.createElement('div');
    spot.className = 'hotspot';
    Object.assign(spot.style, currentItem, {
        transition: "box-shadow 0.3s, transform 0.3s"
    });

    spot.onclick = e => {
        e.stopPropagation();
        spot.style.boxShadow = "0 0 20px 5px gold";
        spot.style.transform = "scale(1.1)";
        successSound.play();
        setTimeout(handleSuccess, 300);
    };

    hotspotLayer.appendChild(spot);
}

function handleSuccess() {
    score++;
    scoreEl.innerText = score;
    gameData.splice(gameData.indexOf(currentItem), 1);
    startGame();
}

function handleMiss() {
    if (--lives < 0) return;
    updateHearts();
    if (lives === 0) {
        questionEl.innerText = "Game Over 💀 You ran out of lives.";
        hotspotLayer.innerHTML = '';
    }
}

function updateHearts() {
    livesEl.innerText = "❤️".repeat(lives);
}

function showHint(num) {
    if (num === 1 && hintUsed === 0) {
        hintDisplay.innerHTML = `1️⃣ ${currentItem.hints[0]}`;
        hintUsed = 1;
        hint1Btn.disabled = true;
        hint2Btn.disabled = false;
    } else if (num === 2 && hintUsed === 1) {
        hintDisplay.innerHTML += `<br>2️⃣ ${currentItem.hints[1]}`;
        hint2Btn.disabled = true;
    }
}

document.getElementById('game-container').onclick = handleMiss;
hint1Btn.onclick = () => showHint(1);
hint2Btn.onclick = () => showHint(2);
document.getElementById('restart-btn').onclick = () => location.reload();
nextLevelBtn.onclick = () => { currentLevel++; initLevel(); };

initLevel();
