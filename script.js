const totalTime = 300; // 5 minutos en segundos
let timeLeft = totalTime;
let timerInterval;
let quizCompleted = false;

const timerDisplay = document.getElementById('timer-container');
const submitButton = document.querySelector('.submit-button');
const questionBoxes = document.querySelectorAll('.question-box');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Tiempo restante: ${formatTime(timeLeft)}`;

        if (timeLeft <= 30 && timeLeft > 0) {
            timerDisplay.style.color = '#e67e22'; /* Naranja */
        } else if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'Tiempo terminado!';
            timerDisplay.classList.add('time-up');
            disableQuiz();
            checkAnswers(); // Auto-submit when time runs out
        }
    }, 1000);
}

function disableQuiz() {
    questionBoxes.forEach(box => {
        const options = box.querySelectorAll('.option-button');
        options.forEach(opt => opt.disabled = true);
    });
    submitButton.disabled = true;
    quizCompleted = true;
}

document.addEventListener('DOMContentLoaded', () => {
    // MathJax ahora se inicializa y renderiza automáticamente desde el HTML
    startTimer();

    questionBoxes.forEach(box => {
        const options = box.querySelectorAll('.option-button');
        options.forEach(option => {
            option.addEventListener('click', () => {
                if (!quizCompleted) {
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                }
            });
        });
    });
});

function checkAnswers() {
    if (quizCompleted && submitButton.disabled) {
        return;
    }

    clearInterval(timerInterval);
    disableQuiz();

    let correctCount = 0;
    let incorrectCount = 0;

    questionBoxes.forEach(box => {
        const selectedOption = box.querySelector('.option-button.selected');
        const correctAnswer = box.dataset.correct;

        const options = box.querySelectorAll('.option-button');

        if (selectedOption) {
            // Comparamos el texto del botón con la respuesta correcta (string LaTeX)
            if (selectedOption.textContent.trim() === correctAnswer.trim()) {
                selectedOption.classList.add('correct');
                correctCount++;
            } else {
                selectedOption.classList.add('incorrect');
                incorrectCount++;
                // Resaltar la respuesta correcta si la seleccionada fue incorrecta
                options.forEach(opt => {
                    if (opt.textContent.trim() === correctAnswer.trim()) {
                        opt.classList.add('correct');
                    }
                });
            }
        } else {
            // Si no se seleccionó ninguna opción, cuenta como incorrecta y resalta la correcta
            incorrectCount++;
            options.forEach(opt => {
                if (opt.textContent.trim() === correctAnswer.trim()) {
                    opt.classList.add('correct');
                }
            });
        }
    });

    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
    document.getElementById('time-taken').textContent = formatTime(totalTime - timeLeft);
    document.getElementById('results').style.display = 'block';
    submitButton.style.display = 'none';
}

// NUEVA FUNCIÓN para copiar resultados al portapapeles
function copyResults() {
    const timeTaken = document.getElementById('time-taken').textContent;
    const correctCount = document.getElementById('correct-count').textContent;
    const incorrectCount = document.getElementById('incorrect-count').textContent;

    // Puedes personalizar este mensaje como quieras
    const resultsText = `¡He completado el Quiz de Trigonometría!\n` +
                        `Tiempo: ${timeTaken}\n` +
                        `Respuestas correctas: ${correctCount}\n` +
                        `Respuestas incorrectas: ${incorrectCount}\n` +
                        `¡Intenta superarme! https://macdiseno.github.io/`; // ¡Asegúrate de que esta sea la URL correcta de tu quiz!

    // Usar la API del Portapapeles
    navigator.clipboard.writeText(resultsText)
        .then(() => {
            alert('¡Resultados copiados al portapapeles! Ahora puedes pegarlos en WhatsApp o donde quieras.');
        })
        .catch(err => {
            console.error('Error al copiar: ', err);
            alert('No se pudieron copiar los resultados automáticamente. Por favor, selecciona el texto y cópialo manualmente.');
        });
}
