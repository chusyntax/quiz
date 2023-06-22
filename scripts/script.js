const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const scoreElement = document.getElementById('score');
const resultElement = document.getElementById('result');
const submitButton = document.getElementById('submit');
const restartButton = document.getElementById('restart');
const timeTakenElement = document.getElementById('time-taken');

let currentQuestionIndex = 0;
let score = 0;
let isQuizCompleted = false;
let startTime;
let endTime;

// Fetch questions from JSON file
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    const questions = data.questions;

    function startTimer() {
      startTime = Date.now();
    }

    function selectAnswer(index) {
      const currentQuestion = questions[currentQuestionIndex];
      const correctIndex = currentQuestion.correctIndex;

      const options = optionsElement.getElementsByClassName('option');
      const selectedOption = options[index];

      Array.from(options).forEach(option => {
        option.classList.remove('selected');
      });

      selectedOption.classList.add('selected');

      if (submitButton.disabled) {
        submitButton.disabled = false;
      }

      submitButton.addEventListener('click', () => {
        clearInterval(timer);

        if (index === correctIndex) {
          score++;
          resultElement.innerText = 'Correct!';
          resultElement.style.color = 'green';
          selectedOption.classList.add('correct');
        } else {
          resultElement.innerText = 'Wrong!';
          resultElement.style.color = 'red';
          selectedOption.classList.add('wrong');
          options[correctIndex].classList.add('correct');
        }

        scoreElement.innerText = `Score: ${score}`;

        if (!isQuizCompleted) {
          setTimeout(nextQuestion, 1000);
        }
      });
    }

    function loadQuestion() {
      const currentQuestion = questions[currentQuestionIndex];
      questionElement.innerText = currentQuestion.question;

      optionsElement.innerHTML = '';

      currentQuestion.answers.forEach((answer, index) => {
        const option = document.createElement('div');
        option.className = 'option';
        option.innerText = answer;
        option.addEventListener('click', () => selectAnswer(index));
        optionsElement.appendChild(option);
      });

      resultElement.innerText = '';
      submitButton.disabled = true;
    }

    function nextQuestion() {
      currentQuestionIndex++;

      if (currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        isQuizCompleted = true;
        optionsElement.innerHTML = '';
        resultElement.innerText = `Quiz completed! Your score: ${score} out of ${questions.length}`;
        submitButton.disabled = true;

        endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000; 
        timeTakenElement.innerText = `Time taken: ${totalTime.toFixed(2)} seconds`;
      }
    }

    function restartQuiz() {
      currentQuestionIndex = 0;
      score = 0;
      isQuizCompleted = false;

      scoreElement.innerText = `Score: ${score}`;
      resultElement.innerText = '';

      optionsElement.innerHTML = '';

      clearInterval(timer);
      startTimer();

      loadQuestion();
      submitButton.disabled = true;

      timeTakenElement.innerText = ''; 
    }

    function startQuiz() {
      score = 0;
      isQuizCompleted = false;

      scoreElement.innerText = `Score: ${score}`;

      startTimer();
      loadQuestion();
      submitButton.disabled = true;

      timeTakenElement.innerText = '';
    }

    restartButton.addEventListener('click', restartQuiz);

    startQuiz();
  })
  .catch(error => {
    console.error('Error fetching questions:', error);
  });

