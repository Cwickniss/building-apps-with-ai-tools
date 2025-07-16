class QuizLoader {
  constructor() {
    this.quiz = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const fileInput = document.getElementById('quiz-file');
    fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
  }

  async handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const content = await this.readFile(file);
      let quizData;
      
      try {
        quizData = JSON.parse(content);
      } catch (parseError) {
        throw new Error(`Failed to parse JSON: ${parseError.message}`);
      }
      
      const validationResult = this.validateQuizFormat(quizData);
      if (validationResult.isValid) {
        this.quiz = quizData;
        this.enableStartButton();
      } else {
        throw new Error(`Invalid quiz format: ${validationResult.error}`);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error(`Error reading file: ${e.target.error}`));
      reader.readAsText(file);
    });
  }

  validateQuizFormat(quiz) {
    // Check required fields
    if (!quiz) {
      return { isValid: false, error: 'Quiz data is null or undefined' };
    }

    if (!quiz.title) {
      return { isValid: false, error: 'Quiz title is required' };
    }

    if (!quiz.description) {
      return { isValid: false, error: 'Quiz description is required' };
    }

    if (!Array.isArray(quiz.questions)) {
      return { isValid: false, error: 'Questions must be an array' };
    }

    if (quiz.questions.length === 0) {
      return { isValid: false, error: 'Quiz must contain at least one question' };
    }

    // Validate each question
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const questionNum = i + 1;

      if (!question.id) {
        return { isValid: false, error: `Question ${questionNum} is missing an ID` };
      }

      if (!question.type) {
        return { isValid: false, error: `Question ${questionNum} is missing a type` };
      }

      if (!question.question) {
        return { isValid: false, error: `Question ${questionNum} is missing question text` };
      }

      if (question.correctAnswer === undefined || question.correctAnswer === null) {
        return { isValid: false, error: `Question ${questionNum} is missing a correct answer` };
      }

      // Validate specific question types
      switch (question.type) {
        case 'multiple-choice':
          if (!Array.isArray(question.options)) {
            return { isValid: false, error: `Question ${questionNum}: multiple-choice requires options array` };
          }
          if (question.options.length !== 4) {
            return { isValid: false, error: `Question ${questionNum}: multiple-choice requires exactly 4 options` };
          }
          if (!question.options.includes(question.correctAnswer)) {
            return { isValid: false, error: `Question ${questionNum}: correct answer must be one of the options` };
          }
          break;

        case 'text':
          if (typeof question.correctAnswer !== 'string') {
            return { isValid: false, error: `Question ${questionNum}: text question requires string answer` };
          }
          break;

        case 'true-false':
          const validAnswer = typeof question.correctAnswer === 'boolean' ||
                            ['true', 'false'].includes(question.correctAnswer.toString().toLowerCase());
          if (!validAnswer) {
            return { isValid: false, error: `Question ${questionNum}: true-false question requires boolean answer` };
          }
          break;

        default:
          return { isValid: false, error: `Question ${questionNum}: invalid question type "${question.type}"` };
      }
    }

    return { isValid: true, error: null };
  }

  enableStartButton() {
    const startButton = document.getElementById('start-quiz');
    startButton.disabled = false;
  }

  handleError(error) {
    console.error('Quiz loading error:', error);
    alert(error.message || 'Error loading quiz file. Please check the file format and try again.');
    
    // Reset file input
    const fileInput = document.getElementById('quiz-file');
    fileInput.value = '';
    
    // Disable start button
    const startButton = document.getElementById('start-quiz');
    startButton.disabled = true;
  }

  getQuiz() {
    return this.quiz;
  }
} 