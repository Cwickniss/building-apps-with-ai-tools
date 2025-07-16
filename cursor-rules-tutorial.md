# The Complete Guide to Cursor Rules for JavaScript/HTML Apps

## Table of Contents
1. [Introduction: Why Rules Matter](#introduction-why-rules-matter)
2. [Understanding the Evolution: From .cursorrules to Project Rules](#understanding-the-evolution)
3. [Setting Up Your Rules Structure](#setting-up-your-rules-structure)
4. [Writing Effective Rules for JavaScript Apps](#writing-effective-rules)
5. [Advanced Patterns and Best Practices](#advanced-patterns)
6. [Common Pitfalls and How to Avoid Them](#common-pitfalls)
7. [Real-World Examples](#real-world-examples)

## Introduction: Why Rules Matter

Cursor Rules are your way of teaching the AI assistant how to work with your specific codebase. They're like having a senior developer permanently assigned to your project who knows all your conventions, patterns, and preferences.

### What Rules Can Do For You:
- **Enforce coding standards** across your entire team
- **Maintain consistency** in code generation
- **Prevent common mistakes** before they happen
- **Speed up development** by eliminating repetitive instructions

## Understanding the Evolution

### The Old Way: .cursorrules
Originally, Cursor used a single `.cursorrules` file at the project root. This approach had serious limitations:

```
project/
├── .cursorrules  # One file to rule them all (and fail)
├── src/
├── api/
└── components/
```

**Problems with .cursorrules:**
- **Context overload**: AI processed every rule for every file
- **No modularity**: Frontend rules applied to backend code
- **Poor scalability**: Files became bloated and unmanageable
- **Inconsistent results**: AI often ignored or misapplied rules

### The New Way: Project Rules (.mdc files)
Cursor now uses modular `.mdc` files stored in `.cursor/rules/`:

```
project/
├── .cursor/
│   └── rules/
│       ├── general.mdc      # Global rules
│       ├── frontend.mdc     # React/Vue specific
│       ├── backend.mdc      # Node.js/API rules
│       └── database.mdc     # SQL/MongoDB rules
├── src/
├── api/
└── components/
```

## Setting Up Your Rules Structure

### Step 1: Create the Rules Directory
```bash
mkdir -p .cursor/rules
```

### Step 2: Plan Your Rule Categories
For a typical JavaScript/HTML app, consider these categories:

1. **General Rules** - Apply to all files
2. **Frontend Rules** - React/Vue/HTML components
3. **Backend Rules** - Node.js/Express/API code
4. **Styling Rules** - CSS/Tailwind/Sass
5. **Testing Rules** - Jest/Cypress/Testing Library
6. **Database Rules** - SQL/MongoDB/Prisma

## Writing Effective Rules

### Example 1: General Rules (general.mdc)

```markdown
Description: General JavaScript Coding Standards
Globs: *

# General Guidelines

## Code Quality
- Use ES6+ features (const/let, arrow functions, destructuring)
- Prefer async/await over callbacks
- Always handle errors properly with try/catch
- Use meaningful variable names (no single letters except loop counters)

## File Organization
- One component/module per file
- Group related functions together
- Keep files under 300 lines when possible

## Example of Good Code:
```javascript
// Good
const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user:', error);
    throw new UserFetchError(error.message);
  }
};
```

## Example of Bad Code:
```javascript
// Bad
function getData(id) {
  return api.get('/users/' + id).then(r => r.data);
}
```
```

### Example 2: Frontend Rules (frontend.mdc)

```markdown
Description: React Component Standards
Globs: **/*.jsx, **/*.tsx, **/components/**/*.js

# React Development Rules

## Component Structure
- Use functional components with hooks (no class components)
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Place PropTypes or TypeScript interfaces at the top

## State Management
- Use local state for component-specific data
- Use Context API for cross-component state
- Consider Redux only for complex global state

## Example Component:
```jsx
// Good: Clean functional component
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUserData } from '../hooks/useUserData';
import './UserProfile.css';

const UserProfile = ({ userId }) => {
  const { user, loading, error } = useUserData(userId);
  
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired
};

export default UserProfile;
```

## Styling Rules
- Use CSS Modules or styled-components for component styles
- Follow BEM naming convention for CSS classes
- Avoid inline styles except for dynamic values
```

### Example 3: Backend Rules (backend.mdc)

```markdown
Description: Node.js API Development Standards
Globs: **/api/**/*.js, **/server/**/*.js, **/routes/**/*.js

# Backend API Guidelines

## API Design
- Follow RESTful conventions strictly
- Use proper HTTP status codes
- Always validate input data
- Implement rate limiting for public endpoints

## Error Handling
- Create custom error classes
- Use middleware for centralized error handling
- Log errors with appropriate levels (error, warn, info)
- Never expose sensitive information in error messages

## Example Route:
```javascript
// Good: Well-structured API endpoint
router.post('/users', 
  validateInput(userSchema),
  rateLimit({ max: 5, windowMs: 60000 }),
  async (req, res, next) => {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
);
```

## Database Queries
- Always use parameterized queries
- Implement connection pooling
- Add indexes for frequently queried fields
- Use transactions for related operations
```

### Example 4: Testing Rules (testing.mdc)

```markdown
Description: Testing Standards
Globs: **/*.test.js, **/*.spec.js, **/tests/**/*.js

# Testing Guidelines

## Test Structure
- Use describe blocks for logical grouping
- Write descriptive test names that explain the scenario
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies

## Example Test:
```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user).toMatchObject({
        id: expect.any(String),
        email: userData.email,
        name: userData.name
      });
    });
    
    it('should throw error for duplicate email', async () => {
      // Test implementation
    });
  });
});
```
```

## Advanced Patterns

### Pattern 1: Auto-Attached Rules
Rules that automatically apply when working with specific file types:

```markdown
Description: Auto-format HTML files
Globs: **/*.html
Type: Auto Attached

# HTML Standards
- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Validate forms on both client and server
- Optimize images with lazy loading
```

### Pattern 2: Composable Rules
Reference other files within your rules:

```markdown
Description: Component Library Standards
Globs: **/components/**

# Component Development

Follow our design system guidelines:
@design-system.md

Use our standard component template:
@templates/component.template.js
```

### Pattern 3: Environment-Specific Rules

```markdown
Description: Production Code Standards
Globs: **/src/**
Type: Agent Requested

# Production Requirements

When deploying to production:
- Remove all console.log statements
- Ensure error boundaries are in place
- Verify environment variables are set
- Check that sensitive data is not exposed
```

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Overly Broad Rules
❌ **Bad:**
```markdown
Globs: *
Always use best practices.
```

✅ **Good:**
```markdown
Globs: **/*.js
Use ES6+ features: const/let, arrow functions, template literals.
Prefer object destructuring over property access.
```

### Pitfall 2: Conflicting Rules
❌ **Bad:**
Having both rules active:
- `frontend.mdc`: "Use arrow functions for all functions"
- `backend.mdc`: "Use regular functions for better stack traces"

✅ **Good:**
Use specific globs to prevent overlap:
- `frontend.mdc` → `Globs: **/client/**/*.js`
- `backend.mdc` → `Globs: **/server/**/*.js`

### Pitfall 3: Rules That Are Too Long
❌ **Bad:**
One 1000-line rule file trying to cover everything

✅ **Good:**
Split into focused rules under 500 lines each:
- `react-components.mdc`
- `react-hooks.mdc`
- `react-performance.mdc`

## Real-World Examples

### Example: E-commerce App Structure

```
.cursor/rules/
├── general.mdc           # ES6+, error handling, logging
├── frontend/
│   ├── components.mdc    # React component standards
│   ├── state.mdc        # Redux/Context patterns
│   └── styling.mdc      # Tailwind/CSS modules
├── backend/
│   ├── api.mdc          # REST API conventions
│   ├── auth.mdc         # Authentication rules
│   └── database.mdc     # Prisma/SQL patterns
└── testing/
    ├── unit.mdc         # Jest unit testing
    └── e2e.mdc          # Cypress E2E testing
```

### Example: Complete Frontend Rule

```markdown
Description: Modern React Development
Globs: **/src/components/**/*.{js,jsx,ts,tsx}
Type: Always

# React Component Standards

## File Structure
```typescript
// 1. Imports (grouped and ordered)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// External libraries
import axios from 'axios';
import { format } from 'date-fns';

// Internal imports
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks';
import styles from './Component.module.css';

// 2. TypeScript interfaces
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
}

// 3. Component definition
export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // 4. Hooks at the top
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // 5. Effects after hooks
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6. Handlers and helper functions
  const handleClick = () => {
    onAction(user.id);
  };
  
  // 7. Render
  return (
    <Card className={styles.container}>
      <h2>{title}</h2>
      <Button onClick={handleClick} disabled={loading}>
        Action
      </Button>
    </Card>
  );
};
```

## Performance Optimization
- Wrap expensive calculations in useMemo
- Use React.memo for pure components
- Implement virtualization for long lists
- Lazy load routes and heavy components

## State Management Patterns
```typescript
// Simple state: useState
const [count, setCount] = useState(0);

// Complex state: useReducer
const [state, dispatch] = useReducer(reducer, initialState);

// Shared state: Context
const ThemeContext = createContext<ThemeContextType>();

// Global state: Redux Toolkit
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.current = action.payload;
    }
  }
});
```
```

## Summary

Cursor Rules transform AI-assisted development from unpredictable to precise. By creating modular, well-scoped rules:

1. **Start small**: Begin with general rules, then add specific ones
2. **Be explicit**: Show examples of good and bad code
3. **Stay organized**: Use clear file structure and naming
4. **Keep it maintainable**: Regular reviews and updates
5. **Test your rules**: Verify AI follows them correctly

Remember: Good rules are like good documentation—they make everyone's life easier, including your future self.

### Quick Start Checklist
- [ ] Create `.cursor/rules` directory
- [ ] Add `general.mdc` with basic JavaScript standards
- [ ] Create frontend/backend specific rules
- [ ] Include concrete code examples
- [ ] Test rules with actual development tasks
- [ ] Refine based on AI behavior
- [ ] Document rule changes in version control