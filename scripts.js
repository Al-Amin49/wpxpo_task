const names = [];
let currentAngle = 0;
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const diameter = canvas.width;
const radius = diameter / 2;
let spinning = false;

function drawWheel() {
    const sliceAngle = 2 * Math.PI / names.length;
    names.forEach((name, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = (index + 1) * sliceAngle;

        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = index % 2 === 0 ? '#FFDDC1' : '#FFABAB';
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(name, radius - 10, 10);
        ctx.restore();
    });
}

function addName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    if (name) {
        names.push(name);
        nameInput.value = '';
        updateNamesList();
        drawWheel();
    }
}

function updateNamesList() {
    const namesList = document.getElementById('namesList');
    namesList.innerHTML = '';
    names.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        namesList.appendChild(li);
    });
}

function spin() {
    if (spinning || names.length === 0) return;
    spinning = true;
    const spinAngle = Math.random() * 2 * Math.PI + 10 * 2 * Math.PI; // Random spin angle + multiple rotations
    const duration = 5000; // 5 seconds

    const startTime = Date.now();

    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        currentAngle = spinAngle * easeOutCubic(progress);

        ctx.clearRect(0, 0, diameter, diameter);
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(currentAngle);
        ctx.translate(-radius, -radius);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            showWinner();
        }
    }

    animate();
}

function showWinner() {
    const sliceAngle = 2 * Math.PI / names.length;
    const winnerIndex = Math.floor((2 * Math.PI - (currentAngle % (2 * Math.PI))) / sliceAngle) % names.length;
    const winnerMessage = document.getElementById('winner');
    winnerMessage.textContent = `"${names[winnerIndex]}" is Winner!`;
    winnerMessage.style.display = 'block';
}

function easeOutCubic(t) {
    return (--t) * t * t + 1;
}
