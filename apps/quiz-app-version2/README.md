# Quiz App Version 2

A pure HTML/JavaScript quiz application that allows users to take quizzes from JSON files and export results in various formats.

## Features

- Load quizzes from JSON files
- Support for multiple question types:
  - Multiple choice (4 options)
  - True/False
  - Text input
- Immediate feedback after each answer
- Comprehensive results review
- Export options:
  - CSV export of quiz results
  - Anki flashcard export

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Import a quiz file (use the sample quiz from `sample-quizzes/example-quiz.json` to get started)
4. Start the quiz and answer the questions
5. Review your results and export them in your preferred format

## Quiz File Format

Quiz files should be in JSON format with the following structure:

```json
{
  "title": "Quiz Title",
  "description": "Quiz Description",
  "questions": [
    {
      "id": "unique_id",
      "type": "multiple-choice|true-false|text",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],  // Required for multiple-choice
      "correctAnswer": "Correct answer",
      "explanation": "Optional explanation"
    }
  ]
}
```

## Export Formats

### CSV Export
The CSV export includes:
- QuestionID
- QuestionType
- QuestionText
- UserAnswer
- CorrectAnswer
- IsCorrect
- TimeSpent

### Anki Export
The Anki export creates a tab-separated file with:
- Front: Question text
- Back: Correct answer + explanation
- Tags: Quiz type and question type

## Technical Details

- Pure HTML/JavaScript implementation
- No external dependencies
- Local file processing only
- Responsive design
- Accessible interface

## Browser Support

The application works in all modern browsers that support:
- ES6+ JavaScript
- File API
- Blob API
- CSS Grid
- CSS Custom Properties

## Security

- All processing is done client-side
- No external API calls
- No data storage or transmission
- Safe file handling

## Contributing

Feel free to submit issues and enhancement requests. 