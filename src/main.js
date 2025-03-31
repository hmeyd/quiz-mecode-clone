import './style.css'
import { Questions } from "./question";
console.log(Questions);

const app = document.querySelector("#app");
const startButton = document.querySelector("#start");
startButton.addEventListener("click", startQuiz);

function startQuiz(event) {
  event.stopPropagation();
  let currentQuestion = 0;
  let score = 0;
  displayQuestion(currentQuestion);

  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }

  function getProgressBar(max, value) {
    const progress = document.createElement("progress");
    progress.setAttribute("max", max);
    progress.setAttribute("value", value);
    return progress;
  }

  function displayQuestion(index) {
    clean();
    const question = Questions[index];
    
    if (!question) {
      displayFinishMessage();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);
    app.appendChild(submitButton);
  }

  function displayFinishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo ! Tu as terminé le quiz.";
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} sur ${Questions.length} points!`;
    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit() {
    const selectedAnswer = app.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) return;
    disableAllAnswers();
    const value = selectedAnswer.value;
    const question = Questions[currentQuestion];
    const isCorrect = question.correct === value;
    if (isCorrect) {
      score++;
    }
    showFeedback(isCorrect, question.correct);
    displayNextQuestionButton(() => {
      currentQuestion++;
      displayQuestion(currentQuestion);
    });
  }

  function displayNextQuestionButton(callback) {
    let remainingTimeout = 5000;
    app.querySelector("button")?.remove();
    
    const nextButton = document.createElement("button");
    nextButton.innerText = `Next (${remainingTimeout / 1000})`;
    app.appendChild(nextButton);

    const interval = setInterval(() => {
      remainingTimeout -= 1000;
      nextButton.innerText = `Next (${remainingTimeout / 1000})`;
    }, 1000);

    const timeout = setTimeout(() => {
      handleNextQuestion();
    }, remainingTimeout);

    function handleNextQuestion() {
      clearInterval(interval);
      clearTimeout(timeout);
      callback();
    }

    nextButton.addEventListener("click", handleNextQuestion);
  }

  function disableAllAnswers() {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    for (const radio of radioInputs) {
      radio.disabled = true;
    }
  }

  function createAnswers(answers) {
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answersDiv.appendChild(label);
    }
    return answersDiv;
  }
}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatId(text) {
  return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase();
}

function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}

function showFeedback(isCorrect, correct) {
  const feedback = document.createElement("p");
  feedback.innerText = isCorrect
    ? "Bravo ! Tu as eu la bonne réponse."
    : `Désolé... mais la bonne réponse était ${correct}.`;
  app.appendChild(feedback);
}
