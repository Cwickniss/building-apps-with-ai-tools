# Weather App with API Integration - Specification

## Problem Statement
Create a weather application that demonstrates secure API integration without exposing API keys in the frontend code.

## Learning Objectives
- Understand API integration basics
- Learn secure API key handling
- Implement error handling
- Create user-friendly interfaces
- Handle asynchronous operations

## Architecture Overview

### Option 1: Backend Proxy (Recommended)
```
Frontend → Backend Proxy → Weather API
   ↓            ↓              ↓
Browser    Your Server    External API
```

### Option 2: Serverless Function
```
Frontend → Netlify/Vercel Function → Weather API
```

### Option 3: Development Only
```
Frontend → CORS Proxy → Weather API
(For learning only - not for production)
```

## Implementation Guide

### 1. Frontend Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Weather App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div class="weather-app">
        <h1>Weather Finder</h1>
        <form id="weather-form">
            <input type="text" id="city" placeholder="Enter city name" required>
            <button type="submit">Get Weather</button>
        </form>
        <div id="weather-display" class="hidden">
            <!-- Weather data will be displayed here -->
        </div>
        <div id="error-message" class="hidden">
            <!-- Error messages will be displayed here -->
        </div>
    </div>
</body>
</html>
```

### 2. Secure API Handling

#### Never Do This (Exposed Key):
```javascript
// BAD - API key exposed in frontend
const API_KEY = 'your-api-key-here';
const response = await fetch(`https://api.weather.com/data?key=${API_KEY}&city=${city}`);
```

#### Do This Instead (Proxy):
```javascript
// GOOD - API key hidden in backend
async function getWeather(city) {
    try {
        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city })
        });
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}
```

### 3. Backend Proxy Example (Node.js/Express)
```javascript
// server.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/weather', async (req, res) => {
    const { city } = req.body;
    const API_KEY = process.env.WEATHER_API_KEY; // Stored securely
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        
        // Send only necessary data to frontend
        res.json({
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch weather data' });
    }
});
```

### 4. User Interface Features
- Search input with validation
- Loading state during API calls
- Error messages for failed requests
- Weather data display with icons
- Responsive design for mobile
- Recent searches (stored locally)

### 5. Error Handling Scenarios
- Invalid city name
- Network connection issues
- API rate limits exceeded
- Server errors
- Empty responses

### 6. Progressive Enhancement
1. **Basic Version**: Simple form and text display
2. **Enhanced Version**: Add weather icons and animations
3. **Advanced Version**: Include forecast, maps, and charts

### 7. Development Setup

#### For Learning (Using Public CORS Proxy):
```javascript
// Development only - not for production
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const response = await fetch(`${PROXY_URL}${API_URL}?q=${city}&appid=DEMO_KEY`);
```

#### For Production:
1. Set up backend server or serverless function
2. Store API key in environment variables
3. Implement rate limiting
4. Add caching to reduce API calls

### 8. Testing Checklist
- [ ] Valid city names return weather data
- [ ] Invalid city names show appropriate error
- [ ] Network errors are handled gracefully
- [ ] UI remains responsive during loading
- [ ] Mobile layout works correctly
- [ ] API key is never exposed in browser

### 9. Security Best Practices
- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement rate limiting on your proxy
- Validate and sanitize all user input
- Use HTTPS for all requests
- Consider adding authentication for production

### 10. Resources
- OpenWeatherMap API: https://openweathermap.org/api
- Environment variables guide
- CORS explanation and solutions
- Serverless function tutorials