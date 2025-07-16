# Migrating from .cursorrules to Modern Project Rules

## Why Migrate?
- `.cursorrules` files are legacy and will be deprecated
- Modern Project Rules offer more flexibility and organization
- Better team collaboration with clearer structure
- More granular control over AI assistance

## Migration Steps

### Step 1: Understand Your Current .cursorrules
Review your existing `.cursorrules` file and categorize the rules:
- Code style guidelines
- Project-specific patterns
- Security requirements
- Architecture decisions

### Step 2: Create the New Structure
```bash
mkdir -p .cursor
touch .cursor/rules
```

### Step 3: Convert Your Rules

#### Old Format (.cursorrules):
```markdown
# Project Guidelines
style:
  indentation: 2 spaces
  quotes: single
  
architecture:
  - Use modular components
  - Implement error handling
  
security:
  - Never expose API keys
```

#### New Format (.cursor/rules):
```markdown
[Always]
You are working on an educational web development project.
Apply these guidelines to all code generation.

[Code Style]
- Use 2-space indentation consistently
- Prefer single quotes for strings
- Use const/let, never var
- Add descriptive comments for learning

[Architecture]
- Implement modular component structure
- Separate concerns (HTML, CSS, JS)
- Always include error handling
- Use progressive enhancement

[Security]
- Never expose API keys in frontend code
- Validate all user inputs
- Use HTTPS for external requests
- Implement proper CORS handling

[Auto Attached]
When working on JavaScript files:
- Use modern ES6+ syntax
- Include error boundaries
- Add JSDoc comments

When working on CSS files:
- Use CSS custom properties
- Implement mobile-first design
```

### Step 4: Test the Migration
1. Open your project in Cursor
2. Test code generation with the new rules
3. Verify AI suggestions follow your guidelines
4. Adjust rules as needed

### Step 5: Remove Old File
Once satisfied with the new setup:
```bash
git rm .cursorrules
git add .cursor/rules
git commit -m "Migrate to modern Cursor Project Rules"
```

## Advanced Features

### Multiple Rule Files
You can now organize rules by category:
```
.cursor/
├── rules           # Main rules file
├── security.rules  # Security-specific rules
├── style.rules     # Code style guidelines
└── testing.rules   # Testing requirements
```

### Rule Types

#### [Always]
Rules that apply to every interaction:
```
[Always]
Focus on educational value and code clarity.
Prefer simplicity over premature optimization.
```

#### [Auto Attached]
Context-specific rules:
```
[Auto Attached]
When working on API integrations:
- Never expose API keys
- Use environment variables
- Implement proper error handling
```

## Best Practices

1. **Keep Rules Concise**: Each rule should be actionable
2. **Use Clear Categories**: Group related rules together
3. **Include Examples**: Show good and bad patterns
4. **Update Regularly**: Evolve rules with your project
5. **Document Why**: Explain the reasoning behind rules

## Rollback Plan
If you need to revert:
1. The old `.cursorrules` format still works
2. Keep a backup of your original file
3. Both formats can coexist during transition

## Common Migration Issues

### Issue: Rules Not Being Applied
**Solution**: Ensure `.cursor/rules` is in the project root and properly formatted

### Issue: Too Many Rules
**Solution**: Split into multiple files by category

### Issue: Conflicting Rules
**Solution**: Use specific [Auto Attached] sections to handle different contexts

## Example: Complete Migration

### Before (.cursorrules):
```markdown
# Quiz App Rules
- Use vanilla JavaScript only
- Mobile-first design
- Save data locally
- Descriptive variable names
```

### After (.cursor/rules):
```markdown
[Always]
You are helping build an educational quiz application.
This is a learning project using vanilla JavaScript.

[Technical Requirements]
- Use only HTML, CSS, and vanilla JavaScript
- No external dependencies or frameworks
- Implement local storage for data persistence
- Ensure mobile-first responsive design

[Code Quality]
- Use descriptive variable and function names
- Add comments explaining complex logic
- Follow consistent indentation (2 spaces)
- Implement proper error handling

[Auto Attached]
When creating quiz questions:
- Validate all user inputs
- Provide clear feedback
- Include accessibility features
```

## Next Steps
1. Start with a simple migration
2. Test thoroughly
3. Gradually add more sophisticated rules
4. Share successful patterns with your team