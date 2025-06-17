const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Render/production environments
app.set('trust proxy', 1);

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/' || req.path === '/api/health' || req.path === '/api/info'
});

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? true
        : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use('/api', limiter);
app.use(express.static('public'));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is not set in environment variables');
    process.exit(1);
}

// OPTIMIZED SYSTEM PROMPT - Token efficient version with detailed calculations
const SYSTEM_PROMPT = `You are ConstructAI, India's AI construction expert. Provide DIRECT, actionable answers with Indian building standards.

🎯 CORE BEHAVIOR:
- Give complete answers first, minimize questions
- Provide specific costs (₹), calculations, dimensions
- Use expertise to fill reasonable assumptions
- Be decisive and confident

🇮🇳 INDIAN EXPERTISE:
- Cost: ₹/sq ft, regional rates
- Standards: NBC 2016, IS 456/800/1893
- Regional: North/South/East/West considerations
- Materials: M20/M25/M30, Fe415, local availability
- Labor: Skilled/semi-skilled rates by region

📋 RESPONSE FORMAT:
1. Direct Answer: Complete solution
2. Cost Breakdown: ₹ materials + labor
3. Technical Specs: IS codes, grades, dimensions
4. Regional Notes: City variations
5. Hindi Summary: मुख्य बातें
6. Optional: ONE follow-up question

🔢 CALCULATION FORMULAS:

CONCRETE: Volume = L×W×H

BRICKWORK (per m³):
- Brick size: 190×90×90mm, Mortar: 10mm
- Bricks needed: 500 nos/m³
- Cement: 63kg (1.26 bags)
- Sand: 0.2627 m³
- Mortar ratio: 1:6, Dry factor: 1.33

PLASTERING:
- Internal: 10-15mm, External: 15-25mm
- Mortar = Area × thickness × 1.35 (dry factor)
- Cement = Mortar × (1/7) × 1440 kg/m³
- Sand = Mortar × (6/7) × 1450 kg/m³

STIRRUPS:
- Rectangular: 2(L+W) + 2×hook - bend deduction
- Circular: π×D + 2×hook - 2×135° bend
- Hook: min 75mm
- Bend deduction: 45°=1d, 90°=2d, 135°=3d, 180°=4d

DENSITIES:
- Cement: 1440 kg/m³ (50kg bag = 0.035m³)
- Sand: 1450-1500 kg/m³
- Aggregate: 1450-1550 kg/m³

ASSUMPTIONS:
- Residential construction
- Standard Indian soil (black cotton/alluvial)
- NBC 2016 compliance, Seismic Zone III
- Monsoon-resistant construction
- Current market rates (mention volatility)

COST STANDARDS:
- Wastage: 15-20% for Indian conditions
- Labor: 40-50% of material cost
- Transport: 5-10% of material
- Regional multipliers: Mumbai(1.3x), Delhi(1.25x), Bangalore(1.2x), Tier-2(1x), Rural(0.8x)

EXAMPLE:
Q: "Foundation cost 1000 sq ft"
A: "1000 sq ft residential foundation: ₹45,000-65,000
Materials: M20 concrete 15m³×₹4,200=₹63,000, Steel 450kg×₹65=₹29,250, Excavation ₹8,000, Labor ₹18,000
Specs: 4-5ft depth (IS 1904), 2ft width, M20 grade, 12mm bars
Regional: Mumbai/Delhi +25-30%, Rural -15-20%
मुख्य बातें: ₹45,000-65,000, M20 कंक्रीट, 4-5 फुट गहराई"

BE DECISIVE. GIVE COMPLETE ANSWERS.`;

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'ConstructAI India - भारतीय निर्माण सहायक',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0 (India Edition)',
        features: ['Indian Standards', 'Bilingual Support', 'Regional Pricing', 'IS Codes'],
        endpoints: {
            health: '/api/health',
            chat: '/api/chat',
            stream: '/api/chat/stream',
            info: '/api/info'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        ai_ready: !!OPENAI_API_KEY,
        environment: process.env.NODE_ENV || 'development',
        model: 'gpt-3.5-turbo',
        region: 'India',
        uptime: process.uptime()
    });
});

// Streaming chat endpoint (PRIMARY)
app.post('/api/chat/stream', async (req, res) => {
    try {
        const { message } = req.body;

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

        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        console.log(`📩 Streaming request: "${message.substring(0, 50)}..."`);

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
            max_tokens: 2000,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
            stream: true
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            responseType: 'stream',
            timeout: 30000
        });

        let hasStarted = false;

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

        response.data.on('end', () => {
            console.log('📝 Stream ended');
            if (!res.headersSent && !res.destroyed) {
                try {
                    res.end();
                } catch (e) {
                    console.log('Stream already ended');
                }
            }
        });

        response.data.on('error', (error) => {
            console.error('❌ Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Stream error occurred' });
            }
        });

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
            max_tokens: 1500,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 20000
        });

        const aiResponse = response.data.choices[0].message.content;
        console.log(`✅ Response generated (${aiResponse.length} chars)`);

        res.json({
            response: aiResponse,
            timestamp: new Date().toISOString(),
            model: 'gpt-3.5-turbo',
            region: 'India',
            usage: response.data.usage
        });

    } catch (error) {
        console.error('❌ OpenAI API Error:', error.response?.data || error.message);

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

// API info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        name: 'ConstructAI India',
        version: '2.0.0',
        description: 'AI-powered construction assistant for Indian building standards',
        region: 'India',
        languages: ['English', 'Hindi'],
        standards: ['NBC 2016', 'IS Codes', 'Municipal Bylaws'],
        endpoints: {
            health: 'GET /api/health',
            chat: 'POST /api/chat',
            stream: 'POST /api/chat/stream',
            info: 'GET /api/info'
        },
        models: ['gpt-3.5-turbo'],
        features: [
            'Indian Building Standards',
            'Bilingual Support (English/Hindi)',
            'Regional Pricing (₹)',
            'IS Code References',
            'Monsoon Considerations',
            'Vastu Guidelines',
            'Municipal Compliance'
        ],
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Catch-all for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log('🏗️  ConstructAI India - भारतीय निर्माण सहायक');
    console.log('='.repeat(60));
    console.log(`🚀 Server running on port: ${PORT}`);
    console.log(`🔑 API Key configured: ${!!OPENAI_API_KEY}`);
    console.log(`🤖 AI Model: gpt-3.5-turbo (India Edition)`);
    console.log(`⚡ Streaming: Enabled`);
    console.log(`🇮🇳 Region: India (भारत)`);
    console.log(`🗣️  Languages: English + Hindi`);
    console.log(`📋 Standards: NBC 2016, IS Codes`);
    console.log(`💰 Currency: Indian Rupees (₹)`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(60));
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
    console.log(`📋 Info: http://localhost:${PORT}/api/info`);
    console.log('='.repeat(60));
});

// Graceful shutdown
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

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});