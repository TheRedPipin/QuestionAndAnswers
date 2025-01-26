let started = false;
let questions;
let answers;
let intervalId;
let previousQuestions = [];

function start() {
    started = !started;
    if (started) {
        questions = document.getElementById("inputBox").value.split(",").map(q => q.trim());
        answers = document.getElementById("answerBox").value.split(",").map(a => a.trim());
        console.log(questions);
        document.getElementById("startBtn").innerHTML = "Stop";
        document.getElementById("startBtn").style.backgroundColor = "red";
        function randomInterval() {
            const startDelay = parseInt(document.getElementById("delayStart").value, 10);
            const endDelay = parseInt(document.getElementById("delayEnd").value, 10);
            const answerDelay = parseInt(document.getElementById("delayAnswer").value, 10);
            const randomSeconds = Math.floor(Math.random() * (endDelay - startDelay + 1)) + startDelay;
            intervalId = setTimeout(() => {
                if (!started) return;
                const randomIndex = Math.floor(Math.random() * questions.length);
                const randomQuestion = questions[randomIndex];
                const randomAnswer = answers[randomIndex];
                const utterance = new SpeechSynthesisUtterance(randomQuestion);
                utterance.lang = "en-US";
                utterance.pitch = 1;
                utterance.rate = 1; 
                speechSynthesis.speak(utterance);
                previousQuestions.push(randomQuestion);
                const previousQuestionsBox = document.getElementById("previousQuestions");
                previousQuestionsBox.value = previousQuestions.join("\n");
                previousQuestionsBox.scrollTop = previousQuestionsBox.scrollHeight;
                utterance.onend = () => {
                    setTimeout(() => {
                        if (!started) return;
                        const answerUtterance = new SpeechSynthesisUtterance(randomAnswer);
                        answerUtterance.lang = "en-US";
                        answerUtterance.pitch = 1;
                        answerUtterance.rate = 1;
                        speechSynthesis.speak(answerUtterance);
                        answerUtterance.onend = () => {
                            randomInterval();
                        };
                    }, answerDelay * 1000);
                };
            }, randomSeconds * 1000);
        }
        randomInterval();
    } else {
        document.getElementById("startBtn").innerHTML = "Start";
        document.getElementById("startBtn").style.backgroundColor = "#4CAF50";
        clearTimeout(intervalId);
    }
}

function loadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            document.getElementById('inputBox').value = event.target.result;
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportFile() {
    const questionString = document.getElementById("inputBox").value;
    const blob = new Blob([questionString], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Questions.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function loadAnswersFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            document.getElementById('answerBox').value = event.target.result;
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportAnswersFile() {
    const answerString = document.getElementById("answerBox").value;
    const blob = new Blob([answerString], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Answers.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
