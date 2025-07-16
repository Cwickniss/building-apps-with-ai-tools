# Project Overview
Quiz App Version 2 is a pure HTML/JavaScript application that provides an interactive quiz-taking experience with advanced import/export capabilities. The app follows a simple, user-friendly design that guides users through quiz questions while providing immediate feedback and comprehensive results.

# Core Functionalities

## Quiz Flow
1. Initial Screen
   - Import quiz file (.json) button
   - Start Quiz button (enabled after quiz import)

2. Question Display
   - Multiple question types supported:
     - Multiple choice (4 options)
     - Text input (free form)
     - True/False
   - Clear question description
   - Navigation between questions
   - Submit button for answers

3. Answer Feedback
   - Immediate feedback after submission
   - Visual indication of correct/incorrect answers
   - Display of correct answer
   - Next button to proceed

4. Results Screen
   - Overall score display
   - Question-by-question review
   - Export options:
     - Download results as CSV
     - Export to Anki flashcards
   - Options to retry quiz or load new quiz

## Data Management
1. Quiz Import
   - JSON format support
   - Schema validation
   - Error handling for invalid files

2. Export Capabilities
   - CSV export with:
     - Question details
     - User answers
     - Correct answers
     - Score statistics
   - Anki flashcard export:
     - Question as front
     - Answer as back
     - Additional context in tags

# Documentation

## JSON Quiz Format
```json
{
  "title": "Quiz Title",
  "description": "Quiz Description",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Optional explanation"
    }
  ]
}
```

## CSV Export Format
- QuestionID
- QuestionType
- QuestionText
- UserAnswer
- CorrectAnswer
- IsCorrect
- TimeSpent

## Anki Export Format
- Front: Question text
- Back: Correct answer + explanation
- Tags: Quiz title, question type

# Current File Structure
```
quiz-app-version2/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── quizLoader.js
│   ├── questionHandler.js
│   └── exportManager.js
├── sample-quizzes/
│   └── example-quiz.json
└── README.md
```

# Implementation Notes

## Technical Requirements
- Pure HTML/JavaScript implementation
- No external dependencies except for file handling
- Local storage for session management
- File API for import/export operations

## UI/UX Guidelines
- Clean, minimalist interface
- Responsive design
- Clear feedback mechanisms
- Accessible color schemes
- Progress indication
- Error states handling

## Security Considerations
- Local file processing only
- Input sanitization
- No external API calls
- Safe file handling

## Performance Optimization
- Lazy loading of questions
- Efficient DOM manipulation
- Memory management for large quizzes
- Smooth transitions between states

## Testing Strategy
- Input validation testing
- File format validation
- Edge case handling
- Cross-browser compatibility
- Accessibility testing 