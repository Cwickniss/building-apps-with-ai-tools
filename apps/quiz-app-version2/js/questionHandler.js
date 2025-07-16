class QuestionHandler {
  constructor() {
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.answers = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    const submitButton = document.getElementById('submit-answer');
    const nextButton = document.getElementById('next-question');
    
    submitButton.addEventListener('click', () => this.handleSubmit());
    nextButton.addEventListener('click', () => this.showNextQuestion());
  }

  initializeQuiz(quiz) {
    this.questions = quiz.questions;
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.updateProgress();
    this.showQuestion();
  }

  showQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    if (!question) return;

    // Update question text
    document.getElementById('question-text').textContent = question.question;

    // Hide all answer containers
    document.querySelectorAll('.answer-container').forEach(container => {
      container.style.display = 'none';
    });

    // Show appropriate answer container based on question type
    switch (question.type) {
      case 'multiple-choice':
        this.setupMultipleChoice(question);
        break;
      case 'text':
        this.setupTextInput();
        break;
      case 'true-false':
        this.setupTrueFalse();
        break;
    }

    this.updateProgress();
  }

  setupMultipleChoice(question) {
    const container = document.getElementById('multiple-choice');
    const grid = container.querySelector('.options-grid');
    
    // Clear existing options
    grid.innerHTML = '';
    
    // Create option buttons
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option-button';
      button.textContent = option;
      button.dataset.value = option;
      grid.appendChild(button);
    });

    container.style.display = 'block';
  }

  setupTextInput() {
    const container = document.getElementById('text-input');
    const input = container.querySelector('#text-answer');
    input.value = '';
    container.style.display = 'block';
  }

  setupTrueFalse() {
    const container = document.getElementById('true-false');
    container.style.display = 'block';
  }

  handleSubmit() {
    const question = this.questions[this.currentQuestionIndex];
    const userAnswer = this.getUserAnswer(question.type);
    
    if (userAnswer === null) {
      alert('Please provide an answer');
      return;
    }

    const isCorrect = this.checkAnswer(question, userAnswer);
    this.answers.push({
      questionId: question.id,
      userAnswer,
      isCorrect,
      timeSpent: 0 // TODO: Implement timer
    });

    this.showFeedback(isCorrect, question);
  }

  getUserAnswer(questionType) {
    switch (questionType) {
      case 'multiple-choice':
        const selectedOption = document.querySelector('.option-button.selected');
        return selectedOption ? selectedOption.dataset.value : null;
      
      case 'text':
        const textInput = document.getElementById('text-answer');
        return textInput.value.trim() || null;
      
      case 'true-false':
        const selectedButton = document.querySelector('.true-false-btn.selected');
        return selectedButton ? selectedButton.dataset.value === 'true' : null;
      
      default:
        return null;
    }
  }

  checkAnswer(question, userAnswer) {
    if (question.type === 'true-false') {
      return userAnswer === (question.correctAnswer === true);
    }
    
    return userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
  }

  showFeedback(isCorrect, question) {
    const feedbackScreen = document.getElementById('feedback-screen');
    const messageElement = document.getElementById('feedback-message');
    const correctAnswerElement = document.getElementById('correct-answer');
    const explanationElement = document.getElementById('explanation');

    messageElement.textContent = isCorrect ? 'Correct!' : 'Incorrect';
    messageElement.className = isCorrect ? 'correct' : 'incorrect';

    correctAnswerElement.textContent = `Correct answer: ${question.correctAnswer}`;
    explanationElement.textContent = question.explanation || '';

    this.switchScreen('feedback-screen');
  }

  showNextQuestion() {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex >= this.questions.length) {
      this.finishQuiz();
    } else {
      this.switchScreen('question-screen');
      this.showQuestion();
    }
  }

  updateProgress() {
    document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = this.questions.length;
  }

  switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
  }

  finishQuiz() {
    const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
    
    document.getElementById('final-score').textContent = correctAnswers;
    document.getElementById('total-score').textContent = this.questions.length;
    
    this.displayQuestionReview();
    this.switchScreen('results-screen');
  }

  displayQuestionReview() {
    const reviewContainer = document.getElementById('questions-review');
    reviewContainer.innerHTML = '';

    this.answers.forEach((answer, index) => {
      const question = this.questions[index];
      const reviewItem = document.createElement('div');
      reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
      
      reviewItem.innerHTML = `
        <h4>Question ${index + 1}</h4>
        <p>${question.question}</p>
        <p>Your answer: ${answer.userAnswer}</p>
        <p>Correct answer: ${question.correctAnswer}</p>
        ${question.explanation ? `<p>Explanation: ${question.explanation}</p>` : ''}
      `;

      reviewContainer.appendChild(reviewItem);
    });
  }

  getResults() {
    return {
      questions: this.questions,
      answers: this.answers
    };
  }
} 