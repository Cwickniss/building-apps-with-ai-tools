class QuizApp {
  constructor() {
    this.quizLoader = new QuizLoader();
    this.questionHandler = new QuestionHandler();
    this.exportManager = new ExportManager(this.questionHandler);
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Start Quiz Button
    const startButton = document.getElementById('start-quiz');
    startButton.addEventListener('click', () => this.startQuiz());

    // Retry Quiz Button
    const retryButton = document.getElementById('retry-quiz');
    retryButton.addEventListener('click', () => this.retryQuiz());

    // Load New Quiz Button
    const loadNewButton = document.getElementById('load-new-quiz');
    loadNewButton.addEventListener('click', () => this.loadNewQuiz());

    // Option Selection for Multiple Choice
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('option-button')) {
        this.handleOptionSelection(e.target);
      }
    });

    // True/False Selection
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('true-false-btn')) {
        this.handleTrueFalseSelection(e.target);
      }
    });
  }

  startQuiz() {
    const quiz = this.quizLoader.getQuiz();
    if (!quiz) return;

    document.getElementById('quiz-title').textContent = quiz.title;
    this.questionHandler.initializeQuiz(quiz);
    this.switchScreen('question-screen');
  }

  retryQuiz() {
    const quiz = this.quizLoader.getQuiz();
    if (!quiz) return;

    this.questionHandler.initializeQuiz(quiz);
    this.switchScreen('question-screen');
  }

  loadNewQuiz() {
    document.getElementById('quiz-file').value = '';
    document.getElementById('start-quiz').disabled = true;
    this.switchScreen('initial-screen');
  }

  handleOptionSelection(selectedOption) {
    // Remove selection from other options
    const options = selectedOption.parentElement.querySelectorAll('.option-button');
    options.forEach(option => option.classList.remove('selected'));
    
    // Add selection to clicked option
    selectedOption.classList.add('selected');
  }

  handleTrueFalseSelection(selectedButton) {
    // Remove selection from other button
    const buttons = selectedButton.parentElement.querySelectorAll('.true-false-btn');
    buttons.forEach(button => button.classList.remove('selected'));
    
    // Add selection to clicked button
    selectedButton.classList.add('selected');
  }

  switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new QuizApp();
}); 