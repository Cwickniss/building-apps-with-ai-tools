# Card-Based Habit Tracker App Development Prompt

## Project Overview
Create a minimalist, visually appealing habit tracker web application using pure HTML, CSS, and JavaScript (no frameworks). The application should follow a card-based design pattern that focuses on simplicity and functionality while maintaining a sleek, modern aesthetic.

## Technical Requirements
- Use only vanilla JavaScript, HTML5, and CSS3
- Ensure the app works offline with localStorage for data persistence
- Responsive design that works well on both mobile and desktop
- No external libraries or frameworks (except for optional icons)
- Single HTML file with embedded CSS and JavaScript for easy deployment

## Core App Structure

### Home Screen
The main interface displaying a grid of habit cards.

**Visual Components:**
- Header with app title "Habit Tracker" and "+ New Habit" button
- Grid layout for habit cards (2 columns on mobile, 3+ on desktop)
- Optional stats summary at top (completion rate for day/week)
- Simple navigation to Stats view (if implemented)

**Each Habit Card Should Display:**
- Habit name (limited to 1-2 lines with ellipsis if longer)
- Small icon or color indicator for category
- Current streak counter prominently displayed
- Today's completion status as a tappable circle
- Mini 7-day calendar showing past completions
- Visual distinction between completed/incomplete habits

**Card Interactions:**
- Tap circle to toggle today's completion status
- Long press or dedicated button to access detailed view
- Visual feedback when marking complete (subtle animation)
- Cards should sort with incomplete habits first by default

### Add/Edit Habit Form
A minimal form overlay for creating or editing habits.

**Required Fields:**
- Habit name (text input)
- Category selection (dropdown with 5-7 preset categories)
- Optional color tag selection (5-6 color options maximum)
- Save and Cancel buttons

**Behavior:**
- Form should slide/fade in from bottom or center
- Form validation to ensure habit has a name
- Escape key or clicking outside should cancel (with confirmation if data entered)
- Save button creates/updates the habit and returns to home screen

### Habit Detail Screen
Expanded view showing detailed information about a specific habit.

**Visual Components:**
- Large habit name and category at top
- Current streak and longest streak statistics
- Completion rate percentage with simple visualization
- Monthly calendar view showing all completion dates
- Edit and Delete buttons
- Back button/gesture to return to home screen

**Interactions:**
- Calendar should allow tapping on past dates to mark/unmark
- Edit button should open the edit form with pre-filled values
- Delete button should show confirmation dialog
- Swipe down or back button returns to home screen

### Optional Stats Overview
If implementing a stats view, keep it minimal but informative.

**Visual Components:**
- Overall completion rate for all habits
- Most consistent and least consistent habits
- Simple visualization of daily/weekly trends
- Total number of active habits

## Data Model

### Habit Object Structure
```javascript
{
  id: "unique-id-string",
  name: "Habit Name",
  category: "health", // One of: health, productivity, learning, mindfulness, etc.
  color: "#colorHex", // Optional color tag
  createdAt: "2023-01-01", // ISO date string
  completedDates: ["2023-01-01", "2023-01-02"], // Array of ISO date strings
  currentStreak: 3, // Number
  longestStreak: 5, // Number
}
```

### Required Functions
Implement core functionality including:

- **CRUD Operations:**
  - Create new habits
  - Read/display habit data
  - Update habit properties
  - Delete habits with confirmation

- **Data Management:**
  - Save to localStorage
  - Load from localStorage
  - Handle data integrity checks

- **Calculations:**
  - Current streak (consecutive days completed up to today)
  - Longest streak (longest consecutive completion period)
  - Completion rates (percentage of days completed since creation)
  - Sorting logic (incomplete first, then alphabetical or by streak)

## Visual Design Guidelines

### Color Palette
- Use a minimal color scheme with 2-3 primary colors maximum
- Include neutral tones for most UI elements
- Use color primarily for:
  1. Indicating completion status
  2. Category/tag colors
  3. Accent elements for important actions

### Typography
- Use a single sans-serif font family for readability
- Limit to 2-3 font sizes for hierarchy
- Ensure sufficient contrast for readability

### Layout and Spacing
- Consistent spacing system (8px increments recommended)
- Cards should have uniform size and padding
- Clear visual hierarchy with proper whitespace

### Visual Feedback
- Subtle animations for state changes (100-200ms duration)
- Haptic-like visual feedback for completions
- Clear hover/active states for interactive elements

## Implementation Details

### HTML Structure
- Semantic HTML5 elements (header, main, section, etc.)
- Logical DOM organization for JavaScript manipulation
- Proper heading hierarchy

### CSS Requirements
- CSS custom properties for colors and repeated values
- Mobile-first responsive design
- Flexbox/Grid for layout
- Transitions for smooth state changes
- Media queries for responsive breakpoints

### JavaScript Architecture
- Use modern ES6+ JavaScript
- Organize code with clear separation of concerns:
  1. Data management (CRUD operations, localStorage)
  2. UI rendering functions
  3. Event handlers
  4. Utility/calculation functions
- Use event delegation where appropriate
- Implement proper error handling

### Optimization Considerations
- Minimize DOM manipulations
- Batch updates when possible
- Use requestAnimationFrame for animations
- Throttle/debounce event handlers for performance

## User Experience Requirements

### Core User Flows
1. User opens app → sees existing habits or empty state
2. User creates new habit → form appears → submits → new card appears
3. User completes habit → taps circle → visual feedback → streak updates
4. User views details → taps/holds card → detail view appears
5. User edits habit → changes values → saves → card updates
6. User deletes habit → confirms → card removes

### Error Handling
- Provide user feedback for invalid inputs
- Handle localStorage availability/errors gracefully
- Show appropriate empty states
- Recover from potential data corruption

### Accessibility Considerations
- Semantic HTML with proper ARIA attributes where needed
- Keyboard navigable interface
- Sufficient color contrast
- Touch targets at least 44×44px for mobile

## Bonus Features (Optional)
Consider implementing these if time allows:

1. Simple onboarding for first-time users
2. Dark/light theme toggle
3. Export/import data functionality
4. Habit categories with custom icons
5. Weekly goal setting (X times per week instead of daily)
6. Confetti/celebration animation for milestone streaks
7. Simple data visualization for trends

## Deliverable
A single HTML file containing all HTML, CSS, and JavaScript that implements the complete habit tracking app as specified. The app should run locally in any modern browser without requiring a server or build step.