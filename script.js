const profileBtn=document.querySelector(".profilebtn");
profileBtn.addEventListener("click",function() {
    alert("Привет! Это твой профиль.");
});
let currentAlgorithm = "bubble";
const btnBubble = document.querySelector("#btn-bubble");
const btnSelection = document.querySelector("#btn-selection");
btnBubble.addEventListener("click", function() {
    currentAlgorithm = "bubble";
    btnBubble.classList.add("active");
    btnSelection.classList.remove("active");
    restBtn.click();
    statusBtn.textContent = "Выбрана: Пузырьковая сортировка";
});
btnSelection.addEventListener("click", function() {
    currentAlgorithm = "selection";
    btnSelection.classList.add("active");
    btnBubble.classList.remove("active");
    restBtn.click();
    statusBtn.textContent = "Выбрана: Сортировка выбором";
});
let isPaused = false;
let isSorting = false;
let isTrainerMode = false;
let currentRunId = 0;
const startBtn = document.querySelector("#soda1");
const statusBtn = document.querySelector("#status");
const pauseBtn = document.querySelector("#pau");
const stepText = document.querySelector("#step-text");
const customArrayInput = document.querySelector("#custom-array");
const applyArrayBtn = document.querySelector("#apply-array");
let resolveTrainerAnswer; 
function waitForAnswer() {
    return new Promise(resolve => {
        resolveTrainerAnswer = resolve;
    });
}
const trainerToggle = document.querySelector("#trainer-toggle");
trainerToggle.addEventListener("change", function() {
    isTrainerMode = this.checked;
});
const btnSwap = document.querySelector("#btn-swap");
const btnKeep = document.querySelector("#btn-keep");
const trainerTheory = document.querySelector("#trainer-theory");
const theoryText = document.querySelector("#theory-text");
const trainerBox = document.querySelector("#trainer-box");
const questionText = document.querySelector("#question-text");
btnSwap.addEventListener("click", () => {
    if (resolveTrainerAnswer) resolveTrainerAnswer("swap"); 
});
btnKeep.addEventListener("click", () => {
    if (resolveTrainerAnswer) resolveTrainerAnswer("keep"); 
});
startBtn.addEventListener("click", function () {
    statusBtn.textContent= "Статус: Алгоритм запущен!";
    startBtn.style.backgroundColor="rgb(72, 218, 35)";
    startBtn.style.color="white";
    pauseBtn.style.backgroundColor="";
    pauseBtn.style.color="";
    startBtn.disabled=true;
    pauseBtn.disabled=false;
    if (!isSorting) {
        isPaused = false;
        if (currentAlgorithm === "bubble") {
            bubbleSort();
        } else if (currentAlgorithm === "selection") {
            selectionSort();
        }
    } else {
        isPaused = false;
    }
});
const restBtn = document.querySelector("#res");
restBtn.addEventListener("click", function() {
    statusBtn.textContent= "Статус: Ожидание";
    startBtn.style.backgroundColor="";
    pauseBtn.style.backgroundColor="";
    startBtn.style.color="";
    startBtn.disabled=false;
    pauseBtn.disabled=false;
    currentRunId++;
    isSorting = false; 
    isPaused = false;
    stepText.textContent = "Нажмите «Старт», чтобы начать";
    generateArray();
    drawBars();
});
pauseBtn.addEventListener("click", function() {
    statusBtn.textContent= "Статус: Пауза";
    pauseBtn.style.backgroundColor = "yellow";
    startBtn.style.backgroundColor="";
    startBtn.style.color="";
    pauseBtn.disabled=true;
    startBtn.disabled=false;
    isPaused = true;
});
const canvas = document.querySelector("#sortCanvas");
const ctx = canvas.getContext("2d");
let numbers = [];
let originalNumbers = [];
function generateArray() {
    numbers = [];
    for (let i = 0; i < 7; i++) {
        let randomHeight = Math.floor(Math.random() * (280 - 30 + 1)) + 30;
        numbers.push(randomHeight);
    }
    originalNumbers = [...numbers];
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function drawBars(index1 = -1, index2 = -1, sortedBoundary = numbers.length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numbers.length; i++) {
        const height = numbers[i];
        const width = 40;
        const x = 50 + i * 70; 
        const y = 300 - height;
        if (i >= sortedBoundary) {
            ctx.fillStyle = "#2ecc71";
        } else if (i === index1 || i === index2) {
            ctx.fillStyle = "#e74c3c"; 
        } else {
            ctx.fillStyle = "#3498db";
        }  
        ctx.fillRect(x, y, width, height);
    }
}
async function bubbleSort() {
    currentRunId++;
    const myRunId = currentRunId;
    isSorting = true;
    const speedSlider = document.querySelector("#speedSlider");
    let delay = 1050 - parseInt(speedSlider.value)
    for (let i = 0; i < numbers.length - 1; i++) {
        const sortedBoundary = numbers.length - i;
        for (let j = 0; j < numbers.length - 1 - i; j++) {
            while (isPaused) {
                await sleep(100);
                if (myRunId !== currentRunId) return;
            }
            if (myRunId !== currentRunId) return;
            stepText.textContent = `Сравниваем ${numbers[j]} и ${numbers[j+1]}...`;
            drawBars(j, j + 1, sortedBoundary);
            if (isTrainerMode) {
                trainerBox.style.display = "block";
                trainerTheory.style.display = "none";
                questionText.textContent = `Сейчас сравниваются числа ${numbers[j]} и ${numbers[j+1]}. Что сделает алгоритм?`;
                const userAnswer = await waitForAnswer();
                const actuallyNeedSwap = numbers[j] > numbers[j + 1];
                const correctAnswer = actuallyNeedSwap ? "swap" : "keep";
                if (userAnswer !== correctAnswer) {
                    trainerTheory.style.display = "block";
                    trainerTheory.style.background = "#fff3cd";
                    trainerTheory.style.color = "#856404";
                    trainerTheory.style.borderLeftColor = "#ffeeba";
                    if (actuallyNeedSwap) {
                        theoryText.innerHTML = `<strong>Ошибка!</strong> Алгоритм сравнивает ${numbers[j]} и ${numbers[j+1]}. Так как ${numbers[j]} <strong>больше</strong> ${numbers[j+1]}, они стоят неправильно. Алгоритм <strong>обязан</strong> поменять их местами.<br><br><code>if (left > right) { swap(); }</code>`;
                    } else {
                        theoryText.innerHTML = `<strong>Ошибка!</strong> Алгоритм сравнивает ${numbers[j]} и ${numbers[j+1]}. Так как ${numbers[j]} <strong>меньше или равно</strong> ${numbers[j+1]}, они уже стоят в правильном порядке. Алгоритм <strong>оставит их на месте</strong>.<br><br><code>if (left > right) { ... } // Условие ложно</code>`;
                    }
                    await sleep(4000);
                    trainerTheory.style.display = "none";
                } else {
                    trainerTheory.style.display = "block";
                    trainerTheory.style.background = "#d4edda"; 
                    trainerTheory.style.color = "#155724";      
                    trainerTheory.style.borderLeftColor = "#c3e6cb";
                    theoryText.innerHTML = `<strong>Верно!</strong> Условие ${numbers[j]} > ${numbers[j+1]} ${actuallyNeedSwap ? 'выполняется' : 'не выполняется'}. Алгоритм сделает именно так.`;  
                    await sleep(2000);
                    trainerTheory.style.display = "none"; 
                    trainerTheory.style.background = "#fff3cd"; 
                    trainerTheory.style.color = "#856404";
                    trainerTheory.style.borderLeftColor = "#ffeeba";
                }
                trainerBox.style.display = "none";
                if (myRunId !== currentRunId) return;
            } else {
                delay = 1050 - parseInt(speedSlider.value);
                await sleep(delay);
                if (myRunId !== currentRunId) return;
            }
            if (myRunId !== currentRunId) return;
            if (numbers[j] > numbers[j + 1]) {
                stepText.textContent = `${numbers[j]} больше, чем ${numbers[j+1]}. Меняем их местами!`;
                [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]];
                drawBars(j, j + 1, sortedBoundary);
                await sleep(300);
                if (myRunId !== currentRunId) return;
            } else {
                 stepText.textContent = `${numbers[j]} меньше или равно ${numbers[j+1]}. Оставляем как есть.`;
                if (myRunId !== currentRunId) return;
            }
        }
    }
    stepText.textContent = `Элемент ${numbers[numbers.length - 1 - i]} встал на своё место!`;
    await sleep(delay);
    isSorting = false;
    statusBtn.textContent = "Статус: Сортировка завершена";
    stepText.textContent = "Массив полностью отсортирован!";
    drawBars(-1, -1, 0);
}
async function selectionSort() {
    currentRunId++;
    const myRunId = currentRunId;
    isSorting = true;
    const speedSlider = document.querySelector("#speedSlider");
    let delay = 1050 - parseInt(speedSlider.value);
    for (let i = 0; i < numbers.length - 1; i++) {
        let minIndex = i;
        const sortedBoundary = i;
        for (let j = i + 1; j < numbers.length; j++) {
            while (isPaused) {
                await sleep(100);
                if (myRunId !== currentRunId) return;
            }
            if (myRunId !== currentRunId) return;
            stepText.textContent = `Ищем минимум. Сравниваем текущий минимум ${numbers[minIndex]} и ${numbers[j]}...`;
            drawBars(minIndex, j, sortedBoundary);          
            if (isTrainerMode) {
                trainerBox.style.display = "block";
                trainerTheory.style.display = "none";
                questionText.textContent = `Число ${numbers[j]} меньше, чем текущий минимум ${numbers[minIndex]}?`;               
                const userAnswer = await waitForAnswer();
                const actuallySmaller = numbers[j] < numbers[minIndex];
                const correctAnswer = actuallySmaller ? "swap" : "keep";
                if (userAnswer !== correctAnswer) {
                    trainerTheory.style.display = "block";
                    trainerTheory.style.background = "#fff3cd"; 
                    trainerTheory.style.color = "#856404";
                    if (actuallySmaller) {
                        theoryText.innerHTML = `<strong>Ошибка!</strong> ${numbers[j]} <strong>меньше</strong> ${numbers[minIndex]}. Значит, теперь ${numbers[j]} — новый минимум!`;
                    } else {
                        theoryText.innerHTML = `<strong>Ошибка!</strong> ${numbers[j]} <strong>больше или равно</strong> ${numbers[minIndex]}. Минимум остается прежним.`;
                    }
                    await sleep(4000);
                    trainerTheory.style.display = "none";
                } else {
                    trainerTheory.style.display = "block";
                    trainerTheory.style.background = "#d4edda"; 
                    trainerTheory.style.color = "#155724";
                    theoryText.innerHTML = `<strong>Верно!</strong> Вы правильно определили, что делать с числом ${numbers[j]}.`;
                    await sleep(1500);
                    trainerTheory.style.display = "none";
                    trainerTheory.style.background = "#fff3cd"; 
                    trainerTheory.style.color = "#856404";
                }
                trainerBox.style.display = "none";
                if (myRunId !== currentRunId) return;
            } else {
                delay = 1050 - parseInt(speedSlider.value);
                await sleep(delay);
                if (myRunId !== currentRunId) return;
            }
            if (numbers[j] < numbers[minIndex]) {
                minIndex = j;
                stepText.textContent = `${numbers[j]} меньше! Запоминаем его как новый минимум.`;
                drawBars(minIndex, j, sortedBoundary);
                await sleep(delay);
                if (myRunId !== currentRunId) return;
            }
        }
        if (minIndex !== i) {
            stepText.textContent = `Нашли минимум: ${numbers[minIndex]}. Меняем его местами с ${numbers[i]}.`;
            [numbers[i], numbers[minIndex]] = [numbers[minIndex], numbers[i]];
            drawBars(i, minIndex, sortedBoundary + 1);
            await sleep(delay);
            if (myRunId !== currentRunId) return;
        }
    }   
    isSorting = false;
    statusBtn.textContent = "Статус: Сортировка завершена";
    stepText.textContent = "Массив полностью отсортирован!";
    drawBars(-1, -1, 0);
}
generateArray();
drawBars();
applyArrayBtn.addEventListener("click", function() {
    const inputText = customArrayInput.value;
    if (inputText.trim() === "") {
        alert("Пожалуйста, введите числа!");
        return;
    }
    const newNumbers = inputText.split(",").map(Number);
    if (newNumbers.includes(NaN)) {
        alert("Ошибка! Вводите только числа через запятую (например: 10, 50, 20)");
        return;
    }
    if (newNumbers.length > 7) {
        alert("Максимум 7 чисел, чтобы они поместились на холсте!");
        return;
    }
    for(let i = 0; i < newNumbers.length; i++) {
        if (newNumbers[i] > 280 || newNumbers[i] < 10) {
            alert("Числа должны быть от 10 до 280!");
            return;
        }
    }
    numbers = newNumbers;
    originalNumbers = [...numbers];
    currentRunId++;
    isSorting = false;
    isPaused = false;
    statusBtn.textContent = "Статус: Ожидание";
    startBtn.style.backgroundColor = "";
    pauseBtn.style.backgroundColor = "";
    startBtn.style.color = "";
    startBtn.disabled = false;
    pauseBtn.disabled = false;
    stepText.textContent = "Массив обновлен! Нажмите «Старт»";
    drawBars();
});