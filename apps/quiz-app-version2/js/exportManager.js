class ExportManager {
  constructor(questionHandler) {
    this.questionHandler = questionHandler;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const csvButton = document.getElementById('export-csv');
    const ankiButton = document.getElementById('export-anki');

    csvButton.addEventListener('click', () => this.exportToCSV());
    ankiButton.addEventListener('click', () => this.exportToAnki());
  }

  exportToCSV() {
    const { questions, answers } = this.questionHandler.getResults();
    
    // Create CSV header
    const headers = [
      'QuestionID',
      'QuestionType',
      'QuestionText',
      'UserAnswer',
      'CorrectAnswer',
      'IsCorrect',
      'TimeSpent'
    ].join(',');

    // Create CSV rows
    const rows = answers.map((answer, index) => {
      const question = questions[index];
      return [
        question.id,
        question.type,
        `"${question.question.replace(/"/g, '""')}"`,
        `"${answer.userAnswer.toString().replace(/"/g, '""')}"`,
        `"${question.correctAnswer.toString().replace(/"/g, '""')}"`,
        answer.isCorrect,
        answer.timeSpent
      ].join(',');
    });

    // Combine header and rows
    const csv = [headers, ...rows].join('\n');
    
    // Create and trigger download
    this.downloadFile(csv, 'quiz-results.csv', 'text/csv');
  }

  exportToAnki() {
    const { questions, answers } = this.questionHandler.getResults();
    
    // Create tab-separated values for Anki import
    // Format: front<tab>back<tab>tags
    const ankiRows = questions.map((question, index) => {
      const answer = answers[index];
      const front = question.question;
      const back = `${question.correctAnswer}${question.explanation ? '<br><br>' + question.explanation : ''}`;
      const tags = `quiz_app ${question.type}`;

      return [
        this.escapeAnkiField(front),
        this.escapeAnkiField(back),
        tags
      ].join('\t');
    });

    const tsv = ankiRows.join('\n');
    
    // Create and trigger download
    this.downloadFile(tsv, 'anki-cards.txt', 'text/plain');
  }

  escapeAnkiField(text) {
    // Escape special characters for Anki
    return text
      .replace(/"/g, '""')  // Escape quotes
      .replace(/\n/g, '<br>')  // Convert newlines to HTML breaks
      .replace(/\t/g, ' ');  // Replace tabs with spaces
  }

  downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
} 