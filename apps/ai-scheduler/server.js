const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs').promises;
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Anthropic client using system environment variable
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Stricter rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 AI requests per windowMs
  message: 'Too many AI requests, please try again later.',
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // max 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'text/markdown', 'application/json'];
    const allowedExtensions = ['.txt', '.md', '.json'];
    
    const hasValidType = allowedTypes.includes(file.mimetype);
    const hasValidExt = allowedExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );
    
    if (hasValidType || hasValidExt) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .txt, .md, and .json files are allowed.'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Extract events endpoint
app.post('/api/extract-events', aiLimiter, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Read all uploaded files
    let allContent = '';
    const fileContents = [];

    for (const file of req.files) {
      try {
        const content = await fs.readFile(file.path, 'utf-8');
        allContent += `\n\n--- ${file.originalname} ---\n${content}`;
        fileContents.push({ name: file.originalname, content });
        
        // Clean up uploaded file
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error reading file ${file.originalname}:`, error);
      }
    }

    if (!allContent.trim()) {
      return res.status(400).json({ error: 'No readable content found in uploaded files' });
    }

    // Create prompt for Claude
    const prompt = `Please analyze the following content and extract calendar events. Look for patterns like meetings, appointments, classes, deadlines, etc. Return a JSON array of events with this exact format:

[
  {
    "title": "Event title",
    "date": "YYYY-MM-DD",
    "startTime": "HH:MM",
    "endTime": "HH:MM",
    "category": "meeting|appointment|personal|work|class|other",
    "description": "Brief description if available"
  }
]

Content to analyze:
${allContent}

IMPORTANT: 
- Return ONLY valid JSON, no other text
- Use 24-hour format for times
- If time is not specified, estimate reasonable times
- If end time is not specified, add 1 hour to start time
- Today's date is ${new Date().toISOString().split('T')[0]}
- Convert relative dates like "tomorrow", "next week" to actual dates
- Be conservative - only extract clear, actionable events`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    let responseText = message.content[0].text;

    // Clean the response
    responseText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    responseText = responseText.trim();

    try {
      const events = JSON.parse(responseText);
      
      // Validate the events array
      if (!Array.isArray(events)) {
        throw new Error('Response is not an array');
      }

      // Validate each event has required fields
      const validatedEvents = events.filter(event => {
        return event.title && event.date && event.startTime && event.endTime;
      });

      res.json({ 
        events: validatedEvents,
        filesProcessed: req.files.length,
        eventsExtracted: validatedEvents.length
      });

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', responseText);
      res.status(500).json({ 
        error: 'Failed to parse AI response. Please try again.',
        details: 'The AI response was not in the expected JSON format.'
      });
    }

  } catch (error) {
    console.error('Extract events error:', error);
    
    if (error.name === 'MulterError') {
      return res.status(400).json({ error: `File upload error: ${error.message}` });
    }
    
    res.status(500).json({ 
      error: 'Failed to process files and extract events.',
      details: error.message
    });
  }
});

// Generate ICS file endpoint
app.post('/api/generate-ics', (req, res) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'No events provided' });
    }

    // Generate ICS content
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    let ics = 'BEGIN:VCALENDAR\r\n';
    ics += 'VERSION:2.0\r\n';
    ics += 'PRODID:-//AI Scheduler//AI Scheduler//EN\r\n';
    ics += 'CALSCALE:GREGORIAN\r\n';

    events.forEach((event, index) => {
      // Validate required fields
      if (!event.title || !event.date || !event.startTime || !event.endTime) {
        return; // Skip invalid events
      }

      const eventDate = event.date.replace(/-/g, '');
      const startDateTime = eventDate + 'T' + event.startTime.replace(':', '') + '00';
      const endDateTime = eventDate + 'T' + event.endTime.replace(':', '') + '00';
      const uid = `event-${index}-${timestamp}@aischeduler.com`;

      ics += 'BEGIN:VEVENT\r\n';
      ics += `UID:${uid}\r\n`;
      ics += `DTSTAMP:${timestamp}\r\n`;
      ics += `DTSTART:${startDateTime}\r\n`;
      ics += `DTEND:${endDateTime}\r\n`;
      ics += `SUMMARY:${event.title.replace(/[,;\\]/g, '\\$&')}\r\n`;
      ics += `CATEGORIES:${(event.category || 'other').toUpperCase()}\r\n`;
      
      if (event.description) {
        ics += `DESCRIPTION:${event.description.replace(/[,;\\]/g, '\\$&')}\r\n`;
      }
      
      if (event.reminder && event.reminder !== '0') {
        ics += 'BEGIN:VALARM\r\n';
        ics += `TRIGGER:-PT${event.reminder}M\r\n`;
        ics += 'ACTION:DISPLAY\r\n';
        ics += `DESCRIPTION:${event.title.replace(/[,;\\]/g, '\\$&')}\r\n`;
        ics += 'END:VALARM\r\n';
      }
      
      ics += 'END:VEVENT\r\n';
    });

    ics += 'END:VCALENDAR\r\n';

    // Set headers for file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="ai-generated-calendar.ics"');
    res.send(ics);

  } catch (error) {
    console.error('Generate ICS error:', error);
    res.status(500).json({ 
      error: 'Failed to generate calendar file.',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${error.message}` });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Scheduler server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  Warning: ANTHROPIC_API_KEY not set in environment variables');
  }
});

module.exports = app;