# Building Secure Web Applications with HTML, JavaScript, and APIs

This tutorial will guide you through building web applications that interact with external APIs while following security best practices. We'll cover everything from basic setup to deployment considerations.

## Table of Contents
- [Building Secure Web Applications with HTML, JavaScript, and APIs](#building-secure-web-applications-with-html-javascript-and-apis)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Setting Up the Development Environment](#setting-up-the-development-environment)
  - [Security Best Practices](#security-best-practices)
    - [1. Never Expose API Keys in Frontend Code](#1-never-expose-api-keys-in-frontend-code)
    - [2. Use Environment Variables](#2-use-environment-variables)
  - [Building the Frontend](#building-the-frontend)
  - [Creating a Secure Backend](#creating-a-secure-backend)
  - [Environment Variables](#environment-variables)
  - [API Integration](#api-integration)
    - [Frontend API Calls](#frontend-api-calls)
    - [Backend Proxy Endpoints](#backend-proxy-endpoints)
  - [Deployment Considerations](#deployment-considerations)
  - [Conclusion](#conclusion)
  - [Additional Resources](#additional-resources)

## Project Structure

A well-organized project structure is essential for maintainability: 

```
secure-web-app/
├── index.html          # Frontend HTML
├── style.css           # Styling
├── script.js           # Client-side JavaScript
├── server.js           # Backend proxy server
├── package.json        # Dependencies
├── .env                # Environment variables (not committed)
├── .env.example        # Environment template (committed)
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## Setting Up the Development Environment

1. Initialize a new Node.js project:
```bash
npm init -y
```

2. Install necessary dependencies:
```bash
npm install express dotenv node-fetch
```

3. Create a `.gitignore` file:
```
node_modules/
.env
.DS_Store
```

## Security Best Practices

### 1. Never Expose API Keys in Frontend Code
❌ **Bad Practice:**
```javascript
const apiKey = "your-api-key-here";
fetch(`https://api.example.com/data?key=${apiKey}`);
```

✅ **Good Practice:**
- Store API keys in environment variables
- Create backend proxy endpoints
- Never expose sensitive data in client-side code

### 2. Use Environment Variables
Create a `.env` file:
```
API_KEY=your_api_key_here
PORT=3000
```

Load variables in server.js:
```javascript
require('dotenv').config();
const apiKey = process.env.API_KEY;
```

## Building the Frontend

Your index.html should focus on UI and user interaction:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Web App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <h1>Secure API Integration Example</h1>
        <button id="fetchData">Fetch Data</button>
        <div id="result"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

Frontend JavaScript (script.js):
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetchData');
    const resultDiv = document.getElementById('result');
    
    fetchButton.addEventListener('click', async function() {
        try {
            resultDiv.innerHTML = 'Loading...';
            
            // Make request to your backend proxy endpoint
            const response = await fetch('/api/data');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            console.error('Fetch error:', error);
        }
    });
});
```

## Creating a Secure Backend

Create a server.js file to proxy API requests:

```javascript
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files
app.use(express.static(__dirname));

// Parse JSON bodies
app.use(express.json());

// Proxy endpoint example
app.get('/api/data', async (req, res) => {
    try {
        // Validate environment variables
        if (!process.env.API_KEY) {
            return res.status(500).json({ 
                error: 'API configuration error' 
            });
        }
        
        const response = await fetch(
            `https://api.example.com/data?key=${process.env.API_KEY}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'YourApp/1.0'
                }
            }
        );
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: 'External API error' 
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch data' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!' 
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

## Environment Variables

1. Create a `.env.example` file as a template (safe to commit):
```
API_KEY=your_api_key_here
PORT=3000
DATABASE_URL=your_database_url_here
```

2. Create actual `.env` file (never commit this):
```
API_KEY=actual_api_key_here
PORT=3000
DATABASE_URL=actual_database_url_here
```

## API Integration

### Frontend API Calls
Make requests to your backend proxy endpoints instead of directly to external APIs:

```javascript
// ❌ Bad Practice: Direct API calls with exposed keys
fetch(`https://api.example.com/data?key=${apiKey}`);

// ✅ Good Practice: Use backend proxy
async function fetchSecureData() {
    try {
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
```

### Backend Proxy Endpoints
Create separate endpoints for different API functionalities:

```javascript
// Weather API endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        // Validate input parameters
        if (!lat || !lon) {
            return res.status(400).json({ 
                error: 'Latitude and longitude are required' 
            });
        }
        
        const response = await fetch(
            `https://api.weather.com/data?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
        );
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: 'Weather API error' 
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch weather data' 
        });
    }
});

// User data endpoint with authentication
app.get('/api/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate user ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ 
                error: 'Valid user ID is required' 
            });
        }
        
        const response = await fetch(
            `https://api.example.com/users/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: 'User API error' 
            });
        }
        
        const userData = await response.json();
        
        // Filter sensitive data before sending to client
        const safeUserData = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            // Don't expose: password, tokens, internal IDs
        };
        
        res.json(safeUserData);
        
    } catch (error) {
        console.error('User API Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch user data' 
        });
    }
});
```

## Deployment Considerations

### 1. Environment Variables
- Use platform-specific environment variable configuration
- Never commit .env files
- Keep a .env.example template

#### Platform-Specific Examples:

**Heroku:**
```bash
heroku config:set API_KEY=your_api_key_here
```

**Netlify:**
```bash
netlify env:set API_KEY your_api_key_here
```

**Vercel:**
```bash
vercel env add API_KEY
```

### 2. Security Headers
Add comprehensive security headers:

```javascript
app.use((req, res, next) => {
    // Prevent XSS attacks
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // HTTPS enforcement
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    
    next();
});
```

### 3. Error Handling
Implement comprehensive error handling:

```javascript
// Input validation
function validateInput(data, schema) {
    // Implement your validation logic
    return true;
}

// Error response formatting
function formatError(error, isProduction = false) {
    if (isProduction) {
        return { error: 'Internal server error' };
    }
    return { 
        error: error.message,
        stack: error.stack 
    };
}

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json(formatError(err, isProduction));
});
```

### 4. HTTPS Configuration
Always use HTTPS in production:

```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}
```

### 5. Rate Limiting
Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

## Conclusion

Following these best practices will help you build secure and maintainable web applications. Remember:

- **Never expose API keys in frontend code**
- **Use environment variables for configuration**
- **Implement backend proxy endpoints**
- **Follow security best practices**
- **Handle errors appropriately**
- **Use HTTPS in production**
- **Validate all inputs**
- **Implement rate limiting**
- **Log security events**

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Dotenv Documentation](https://github.com/motdotla/dotenv)
- [OWASP Top 10 Security Risks](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://nodejs.org/en/security/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## Next Steps

Continue your learning with:
- [Claude AI Integration](claude-walkthrough.md)
- [Cursor IDE Development](cursor-walkthrough.md)
- [Advanced Cursor Rules](cursor-rules-tutorial.md)