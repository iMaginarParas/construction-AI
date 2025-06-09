const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: { 
        error: 'Too many requests from this IP, please try again later.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware setup
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001']
}));
app.use(express.json({ limit: '10mb' }));
app.use('/api', limiter);

// Serve static files from public directory
app.use(express.static('public'));

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Validate API key on startup
if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is not set in environment variables');
    console.error('Please create a .env file with: OPENAI_API_KEY=your_api_key_here');
    process.exit(1);
}

// Optimized system prompt for faster responses
const SYSTEM_PROMPT = `You are ConstructAI, a specialized construction industry expert. Provide concise, actionable advice with:

KEY AREAS:
- Cost estimation & material calculations
- Building codes & permit requirements  
- Project planning & scheduling
- Safety protocols & OSHA compliance
- Structural engineering basics
- Equipment recommendations

RESPONSE FORMAT:
- Use **bold** for important terms, costs, and measurements
- Use bullet points (•) for lists
- Use numbered lists for step-by-step instructions
- Include relevant safety warnings
- Mention regional variations when applicable
- Keep responses focused and practical

CALCULATIONS:
- Show formulas when relevant
- Include 10-15% waste allowance for materials
- Reference current market pricing trends
- Always recommend local verification

Be professional, accurate, and helpful while keeping responses concise.`;

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        ai_ready: !!OPENAI_API_KEY,
        environment: process.env.NODE_ENV || 'development',
        model: 'gpt-3.5-turbo'
    });
});

// Streaming chat endpoint (PRIMARY)
app.post('/api/chat/stream', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Input validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Message is required and must be a string' 
            });
        }

        if (message.length > 4000) {
            return res.status(400).json({ 
                error: 'Message too long. Please keep it under 4000 characters.' 
            });
        }

        // Set headers for Server-Sent Events streaming
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        console.log(`📩 Streaming request: "${message.substring(0, 50)}..."`);

        // Make streaming request to OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo', // Fast and cost-effective
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1200,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
            stream: true // Enable streaming
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            responseType: 'stream',
            timeout: 30000 // 30 second timeout
        });

        let hasStarted = false;

        // Handle streaming data
        response.data.on('data', (chunk) => {
            try {
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                
                for (const line of lines) {
                    if (line.includes('[DONE]')) {
                        console.log('✅ Stream completed');
                        res.write('data: [DONE]\n\n');
                        return res.end();
                    }
                    
                    if (line.startsWith('data: ')) {
                        if (!hasStarted) {
                            console.log('🚀 Stream started');
                            hasStarted = true;
                        }
                        res.write(`${line}\n\n`);
                    }
                }
            } catch (error) {
                console.error('❌ Chunk processing error:', error);
            }
        });

        // Handle stream end
        response.data.on('end', () => {
            console.log('📝 Stream ended');
            if (!res.headersSent || !res.destroyed) {
                try {
                    res.end();
                } catch (e) {
                    console.log('Stream already ended');
                }
            }
        });

        // Handle stream errors
        response.data.on('error', (error) => {
            console.error('❌ Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Stream error occurred' });
            }
        });

        // Timeout protection
        const timeout = setTimeout(() => {
            if (!res.headersSent) {
                console.log('⏰ Stream timeout');
                res.status(504).json({ error: 'Request timeout' });
            }
        }, 25000);

        response.data.on('end', () => {
            clearTimeout(timeout);
        });

    } catch (error) {
        console.error('❌ OpenAI API Error:', error.response?.data || error.message);
        
        if (!res.headersSent) {
            if (error.response?.status === 401) {
                res.status(500).json({ error: 'Invalid API key configuration' });
            } else if (error.response?.status === 429) {
                res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
            } else if (error.response?.status === 400) {
                res.status(400).json({ error: 'Invalid request format' });
            } else if (error.code === 'ECONNABORTED') {
                res.status(504).json({ error: 'Request timeout' });
            } else {
                res.status(500).json({ error: 'AI service temporarily unavailable' });
            }
        }
    }
});

// Non-streaming chat endpoint (FALLBACK)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Input validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Message is required and must be a string' 
            });
        }

        if (message.length > 4000) {
            return res.status(400).json({ 
                error: 'Message too long. Please keep it under 4000 characters.' 
            });
        }

        console.log(`📩 Non-streaming request: "${message.substring(0, 50)}..."`);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1200,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 20000 // 20 second timeout
        });

        const aiResponse = response.data.choices[0].message.content;
        console.log(`✅ Response generated (${aiResponse.length} chars)`);
        
        res.json({ 
            response: aiResponse,
            timestamp: new Date().toISOString(),
            model: 'gpt-3.5-turbo',
            usage: response.data.usage
        });

    } catch (error) {
        console.error('❌ OpenAI API Error:', error.response?.data || error.message);
        
        // Enhanced error handling
        if (error.code === 'ECONNABORTED') {
            res.status(504).json({ error: 'Request timeout. Please try again.' });
        } else if (error.response?.status === 401) {
            res.status(500).json({ error: 'Invalid API key configuration' });
        } else if (error.response?.status === 429) {
            res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
        } else if (error.response?.status === 400) {
            res.status(400).json({ 
                error: 'Invalid request. Please check your message format.' 
            });
        } else if (error.response?.status >= 500) {
            res.status(503).json({ error: 'OpenAI service temporarily unavailable' });
        } else {
            res.status(500).json({ 
                error: 'AI service temporarily unavailable. Please try again.' 
            });
        }
    }
});

// API endpoints info
app.get('/api/info', (req, res) => {
    res.json({
        name: 'ConstructAI API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            chat: 'POST /api/chat',
            stream: 'POST /api/chat/stream'
        },
        models: ['gpt-3.5-turbo'],
        features: ['streaming', 'rate-limiting', 'error-handling']
    });
});

// Catch-all handler for SPA (Single Page Application)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log('🏗️  ConstructAI Backend Server Started');
    console.log('='.repeat(50));
    console.log(`🚀 Server running on port: ${PORT}`);
    console.log(`🔑 API Key configured: ${!!OPENAI_API_KEY}`);
    console.log(`🤖 AI Model: gpt-3.5-turbo (fast & efficient)`);
    console.log(`⚡ Streaming: Enabled`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 CORS: ${process.env.NODE_ENV === 'production' ? 'Production domains' : 'Development (localhost)'}`);
    console.log('='.repeat(50));
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 API info: http://localhost:${PORT}/api/info`);
    console.log('='.repeat(50));
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});