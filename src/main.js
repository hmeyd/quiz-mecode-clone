import './style.css'
import {Questions} from "./question"
console.log(Questions);

const app = document.querySelector("#app");


const startButton = document.querySelector("#start");
startButton.addEventListener("click", startQuiz)

function startQuiz(event) {
  event.stopPropagation();
  let currentQuestion = 0;
  let score = 0;
  displayQuestion(currentQuestion);


  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length, currentQuestion)
    app.appendChild(progress);
  }

  function getProgressBar(max, value) {
    const progress = document.createElement("progress");
    progress.setAttribute("max", max)
    progress.setAttribute("value", value)
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
    app.appendChild(title)
    const answersDiv =createAnswers(question.answers);
    app.appendChild(answersDiv);

    const sumbitbutton = getSubmitbutton();
    sumbitbutton.addEventListener("click", submit)
    sumbitbutton.removeEventlistener
    app.appendChild(sumbitbutton);
  }

  function displayFinishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo ! Tu as terminé le quiz.";
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} sur ${Questions.length} point!`
    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit(){
    const selecteAnsewer = app.querrySelector('input[name="answer"]:checked')
    const value = selecteAnsewer.value;
    const question = Questions[currentQuestion]
    const isCorrect = question.correct === value;
    if (isCorrect) {
      score++;
    }
    showFeedback(isCorrect, question.correct, value);
    const feedback = getFeedbackMessage (isCorrect, question.correct)
    app.appendChild(feedback);

    displayNextQuestionButton();
   }
  }

  function displayNextQuestionButton() {
    let remainingTimeout = TIMEOUT;

      app.querrySelector("button").remove();
      
      const nextButton = document.createElement("button")
      nextButton.innerText = `Next (${remainingTimeout / 1000})`;

      app.appendChild(nextButton);

      const interval = setInterval(() => {
        remainingTimeout-= 10000;
        nextButton.innerText = `Next (${remainingTimeout / 1000}s)`;
      }, 1000);


      const handleNextQuestion = () => {
        currentQuestion++;
        clearInterval(interval);
        clearTimeout(timeout);
        displayQuestion(currentQuestion);
      }

      const timeout = setTimeout(() => {
        handleNextQuestion()
        },TIMEOUT);

        nextButton.addEventListener("click", () =>{

        })
    }

  function createAnswers(answers){
    const answersDiv = document.createElement("div");

    answersDiv.classList.add("answers");
    for (const answer of answers) {
      const label = getTitleElement(answer);
      answersDiv.appendChild(label);
    }
    return answersDiv;
  }

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatId(text) {
  const id = text.replaceAll(" ","-").tolowerCase();
}

function getAnswerElement(text){
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute ("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

function getSubmitbutton() {
  const sumbitbutton = document.createElement("button");
  sumbitbutton.innerText = "Submit";
  return sumbitbutton;
}
  const correctAnswerId = formatId(correct)
  const correctElement = document.querySelector(
    `label[for=${correctAnswerId}]`
  )

  const selectedAnswerId = formatId(answer)
  const selectedElement = document.querySelector(
    `label[for=${selectedAnswerId}]`
  );

  function getFeedbackMessage (isCorrect, correct) {
    const paragraph =  document.createElement("p");
    paragraph.innerText = isCorrect
    ? `Bravo ! Tu as eu la bonne réponse`
    : `Désolé.... mais la bonne réponse était ${correct}`;
    return paragraph;
  }
