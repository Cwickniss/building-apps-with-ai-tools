# Shopping List Application Specification

## Problem Statement
Create a comprehensive shopping list application that allows users to manage their shopping items with categories, track purchases, and maintain an organized list with import/export capabilities for data portability.

## Core Features

### 1. Item Management
- Add items with name, quantity, and category
- Edit existing item names inline
- Delete individual items
- Mark items as purchased/unpurchased with checkbox
- Visual distinction for purchased items (strikethrough text, reduced opacity)

### 2. Category Organization
- Pre-defined categories: Produce, Dairy, Meat & Fish, Bakery, Pantry, Frozen, Beverages, Household, Personal Care, Other
- Dynamic tab navigation showing only categories with items
- "All Items" view as default tab
- Category-specific views with item counts and purchase statistics

### 3. Data Persistence
- Automatic saving to browser localStorage
- Persist all item properties including purchase status
- Load saved data on page refresh

### 4. Summary Dashboard
- Display category-wise breakdown with item counts and quantities
- Show total items count with purchased status
- Real-time updates as items are added/modified/deleted

### 5. Bulk Operations
- Clear all purchased items with confirmation
- Clear entire list with confirmation
- Export shopping list as formatted JSON file with date stamp
- Import previously exported JSON files

## Technical Requirements

### Development Constraints
- Single HTML file with embedded CSS and JavaScript
- No external dependencies or frameworks
- Pure vanilla JavaScript implementation
- Mobile-responsive design
- Cross-browser compatibility

### Data Structure
```json
{
  "items": [
    {
      "id": 1735423890123,
      "name": "Milk",
      "quantity": 2,
      "category": "Dairy",
      "purchased": false,
      "dateAdded": "2024-12-28T12:00:00.000Z"
    }
  ],
  "categories": {
    "Dairy": [1735423890123],
    "Produce": [],
    "Meat": [],
    "Bakery": [],
    "Pantry": [],
    "Frozen": [],
    "Beverages": [],
    "Household": [],
    "Personal Care": [],
    "Other": []
  }
}
```

### UI/UX Requirements

#### Visual Design
- Modern gradient background (purple to blue: #667eea to #764ba2)
- Card-based layout with rounded corners (20px radius)
- Maximum container width of 800px centered
- White card background with subtle shadows
- Consistent spacing (30px padding for main sections)

#### Typography
- System font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif
- Header title: 2.5em (2em on mobile)
- Regular text: 16px
- Small text: 14px for buttons, 0.9em for metadata

#### Color Scheme
- Primary gradient: #667eea to #764ba2
- Text colors: #333 (primary), #666 (secondary), #999 (tertiary)
- Border color: #e0e0e0
- Background gray: #f5f5f5, #f8f9fa, #f0f0f0
- Delete action: #e74c3c
- Focus state: #667eea border

#### Interactive Elements
- Input fields with 2px borders, 8px border radius
- Focus states with primary color border
- Buttons with gradient background and hover effects (translateY animation)
- Tab navigation with underline indicator for active state
- Item cards with hover effect (border color change and translateX)
- Smooth transitions (0.3s for colors, 0.2s for transforms)

### Component Specifications

#### Header Section
- Title with shopping emoji (📝)
- Subtitle describing app purpose
- Gradient background matching primary theme

#### Input Section
- Text input for item name (flexible width, min 200px)
- Number input for quantity (80px width, min value 1, default 1)
- Dropdown for category selection (includes all pre-defined categories)
- Add button with primary styling
- Responsive flex layout, stacks on mobile

#### Tab Navigation
- Horizontal tab layout with bottom border
- Active tab with colored text and bottom accent bar
- Dynamically generated based on categories with items
- Always includes "All Items" tab as first option

#### Item Display
- Card layout for each item (15px padding, 8px border radius)
- Checkbox for purchase status (22x22px)
- Item name with larger font (1.1em)
- Metadata showing quantity and category
- Edit and Delete action buttons
- Hover state with border color change and slide effect
- Purchased items with strikethrough and reduced opacity

#### Category Sections
- Category header with title and statistics
- Item count and purchased count display
- Gray background for header section
- Dynamic visibility based on active tab

#### Summary Section
- Gray background panel
- Category breakdown with item and quantity counts
- Total items summary with purchased count
- Separator line for total (2px primary color border)

#### Control Buttons
- Four action buttons in footer section
- Clear Purchased: Removes completed items
- Clear All: Empties entire list
- Export JSON: Downloads data file
- Import JSON: Hidden file input triggered by button

#### Empty State
- Centered message when no items exist
- SVG shopping bag icon (80x80px)
- Instructional text to guide users

### Functional Specifications

#### Adding Items
- Validate item name is not empty
- Default to "Other" category if none selected
- Generate unique ID using timestamp
- Add ISO timestamp for creation date
- Clear inputs after successful addition
- Support Enter key submission from name field

#### Editing Items
- Use browser prompt for name editing
- Validate new name is not empty
- Preserve all other item properties
- Trigger re-render after update

#### Deleting Items
- Remove from items array
- Clean up category ID references
- No confirmation required (immediate deletion)

#### Toggle Purchase Status
- Flip boolean value on checkbox change
- Update visual state (opacity, strikethrough)
- Persist change to localStorage

#### Category Navigation
- Click tab to filter items by category
- Update active tab styling
- Show/hide corresponding section
- "All Items" displays everything

#### Data Export
- Stringify data with 2-space indentation
- Create blob with application/json type
- Generate filename with current date
- Trigger download automatically

#### Data Import
- Accept only .json files
- Validate structure (items and categories properties)
- Replace entire dataset on successful import
- Show success/error alerts

### Performance Considerations
- Debounce rendering operations
- Use single render function for consistency
- Minimize DOM manipulations
- Efficient array operations for filtering

### Accessibility Features
- Semantic HTML structure
- Proper label associations
- Keyboard navigation support
- Focus states on interactive elements
- Confirmation dialogs for destructive actions

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Local Storage API
- File API for import/export

## Implementation Notes

### Key Functions Required
1. `loadData()` - Initialize from localStorage or defaults
2. `saveData()` - Persist to localStorage
3. `addItem()` - Create new shopping item
4. `editItem(id)` - Modify item name
5. `deleteItem(id)` - Remove item
6. `toggleItem(id)` - Change purchase status
7. `renderTabs()` - Generate category navigation
8. `renderItems()` - Display all items
9. `showCategory(name)` - Filter by category
10. `updateSummary()` - Calculate statistics
11. `clearPurchased()` - Remove completed items
12. `clearAll()` - Empty entire list
13. `exportData()` - Download JSON file
14. `importData(event)` - Load JSON file

### State Management
- Single global object `shoppingData` with items array and categories map
- localStorage key: 'shoppingList'
- Synchronous updates with immediate persistence
- Full re-render on state changes

### Error Handling
- Try-catch blocks for JSON operations
- User alerts for validation failures
- File format validation on import
- Graceful degradation if localStorage unavailable

### Mobile Optimizations
- Viewport meta tag for proper scaling
- Flexible layouts with wrap behavior
- Touch-friendly button sizes (minimum 44px tap targets)
- Responsive typography scaling
- Column layout for inputs on narrow screens

## Deliverable
A single, self-contained HTML file with all CSS and JavaScript embedded inline that provides a fully functional shopping list application meeting all specifications above. The file should be production-ready with no console errors and smooth performance across devices.