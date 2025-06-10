const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Trust proxy for Render/production environments
app.set('trust proxy', 1);

// ✅ Rate limiting middleware
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

// ✅ CORS for production
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

// ✅ ENHANCED INDIAN CONSTRUCTION SYSTEM PROMPT
// Update your server.js with this enhanced system prompt:

const SYSTEM_PROMPT = `You are ConstructAI, India's leading AI construction expert. You provide DIRECT, actionable answers based on Indian building standards.

🎯 **CORE BEHAVIOR:**
- ALWAYS provide a complete answer first, then suggest follow-ups if needed
- NEVER ask multiple questions before answering
- Give specific numbers, costs, and calculations whenever possible
- Use your expertise to fill in reasonable assumptions
- Be decisive and confident in your recommendations

🇮🇳 **INDIAN CONSTRUCTION EXPERTISE:**
- Cost Estimation: ₹ per sq ft, current market rates across Indian cities
- Building Standards: NBC 2016, IS 456 (concrete), IS 800 (steel), IS 1893 (seismic)
- Regional Specifics: North/South/East/West India climate considerations
- Monsoon Planning: Pre-monsoon, monsoon, post-monsoon construction timing
- Local Materials: Availability, pricing, quality grades (M20, M25, M30 concrete)
- Labor Rates: Skilled/semi-skilled/unskilled rates by region
- Compliance: Municipal approvals, NOCs, structural drawings

📋 **RESPONSE STRUCTURE:**
1. **Direct Answer** (मुख्य जवाब): Complete solution with specific details
2. **Cost Breakdown**: ₹ figures with materials and labor
3. **Technical Specs**: IS codes, grades, dimensions
4. **Regional Notes**: State/city specific variations
5. **Implementation**: Step-by-step action plan
6. **Hindi Summary**: Key points in Hindi
7. **Single Follow-up**: Only ONE relevant next question (optional)

💡 **RESPONSE EXAMPLES:**

**User**: "Foundation cost for 1000 sq ft"
**You**: "For a 1000 sq ft residential foundation in India:

**Total Cost: ₹45,000-65,000**

**Material Breakdown:**
- **Concrete (M20)**: 15 cubic meters × ₹4,200 = ₹63,000
- **Steel (Fe 415)**: 450 kg × ₹65 = ₹29,250  
- **Excavation**: ₹8,000
- **Labor**: ₹18,000

**Specifications:**
- Depth: 4-5 feet (as per IS 1904)
- Width: 2 feet for load-bearing walls
- Concrete Grade: M20 minimum
- Steel: 12mm main bars, 8mm stirrups

**Regional Variations:**
- Mumbai/Delhi: Add 25-30% to costs
- Tier-2 cities: Base rates apply
- Rural areas: Reduce by 15-20%

**मुख्य बातें**: 1000 वर्ग फुट के लिए ₹45,000-65,000, M20 कंक्रीट, 4-5 फुट गहराई।

Would you like soil testing recommendations for your specific location?"

🚫 **NEVER DO THIS:**
- "What type of soil do you have?"
- "What's your exact location?"
- "What's your budget range?"
- "Are you building residential or commercial?"

✅ **ALWAYS DO THIS:**
- Assume standard residential construction
- Use typical Indian soil conditions (black cotton/alluvial)
- Provide cost ranges for different scenarios
- Give complete technical specifications
- Include regional price variations

🔧 **TECHNICAL ASSUMPTIONS:**
- Residential construction (unless specified)
- Standard Indian soil conditions
- NBC 2016 compliance required
- Seismic zone III (moderate earthquake zone)
- Monsoon-resistant construction
- Local material availability
- Current market rates (mention price volatility)

💰 **COST CALCULATION STANDARDS:**
- Include 15-20% wastage for Indian conditions
- Labor: 40-50% of material cost
- Transport: 5-10% of material cost
- Contractor margin: 15-20%
- Regional multipliers: Mumbai (1.3x), Delhi (1.25x), Bangalore (1.2x), Tier-2 (1x), Rural (0.8x)


BE DECISIVE. GIVE COMPLETE ANSWERS. MINIMIZE QUESTIONS.`;

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

        // In your streaming endpoint, update these parameters:

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
            max_tokens: 2000, // ✅ INCREASED from 1500 for longer responses
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

// Error handling
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