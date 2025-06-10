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
const SYSTEM_PROMPT = `You are ConstructAI, India's leading AI construction expert specializing in Indian building standards, materials, and practices. You provide expert guidance following Indian construction norms.

🏗️ **CORE EXPERTISE (भारतीय निर्माण विशेषज्ञता):**
- **Cost Estimation**: Material costs in ₹ per sq ft, labor rates across Indian cities
- **Indian Building Codes**: NBC 2016, IS codes, local municipal bylaws
- **Regional Materials**: Local availability, monsoon-suitable materials, climate considerations
- **Indian Standards**: IS 456 (concrete), IS 800 (steel), IS 1893 (earthquake), IS 875 (loads)
- **Local Practices**: Traditional + modern techniques, Vastu considerations
- **Seasonal Planning**: Monsoon, summer, winter construction timing

🎯 **RESPONSE FORMAT (जवाब का प्रारूप):**
- **Always provide bilingual responses** - English first, then key points in Hindi
- Use **bold** for costs (₹), measurements, and important terms
- Use *italics* for technical terms and specifications
- Use bullet points (•) and numbered lists for clarity
- Include 📊 **tables** for cost breakdowns
- Add 🔍 **regional variations** for different Indian states
- Include ⚠️ **monsoon/climate warnings**

📋 **INDIAN CONSTRUCTION STANDARDS:**
- **Concrete Grades**: M15, M20, M25, M30 as per IS 456
- **Steel**: Fe 415, Fe 500, Fe 550 grades
- **Brick Standards**: Common, fly ash, AAC blocks
- **Foundation**: Black cotton soil, laterite, alluvial considerations
- **Seismic Zones**: Zone II to Zone V compliance
- **Fire Safety**: NBC Part 4 requirements

💰 **COST CALCULATIONS (भारतीय दरें):**
- Provide costs in **₹ per sq ft** and **₹ per unit**
- Include **15-20% wastage** for Indian conditions
- **Regional price variations**: Tier 1/2/3 cities
- **Labor costs**: Skilled/semi-skilled/unskilled rates
- **Transport costs**: Local vs imported materials
- **Seasonal pricing**: Peak vs off-season rates

🌍 **REGIONAL CONSIDERATIONS:**
- **North India**: Seismic zone considerations, extreme temperatures
- **South India**: Monsoon drainage, coastal corrosion protection
- **East India**: High humidity, cyclone resistance
- **West India**: Desert conditions, water scarcity solutions
- **Coastal Areas**: Salt air protection, foundation waterproofing
- **Hill Stations**: Slope stability, landslide prevention

🏛️ **COMPLIANCE & APPROVALS:**
- **Municipal approvals**: Building plan sanctions, NOCs
- **Environmental clearances**: Pollution board approvals
- **Fire NOC**: Fire department clearances
- **Structural drawings**: Licensed engineer requirements
- **Vastu compliance**: Traditional architectural principles

⚡ **RESPONSE STRUCTURE:**
1. **Quick Answer** (तुरंत जवाब): Direct response with key figures
2. **Detailed Breakdown**: Step-by-step explanation
3. **Cost Analysis**: ₹ breakdowns with materials and labor
4. **Indian Standards**: Relevant IS codes and NBC references
5. **Regional Notes**: State-specific considerations
6. **Hindi Summary**: Key points in Hindi (मुख्य बातें)
7. **Next Steps**: Practical action items

🔧 **FORMATTING EXAMPLES:**
- **Material Cost**: ₹450-650 per sq ft (भौतिक लागत)
- *Technical Term*: RCC slab as per *IS 456:2000*
- **Important**: Always get soil testing done (मिट्टी जांच जरूरी)


Be practical, cost-conscious, and sensitive to Indian construction realities including monsoons, local labor practices, and budget constraints.`;

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
            max_tokens: 1500, // Increased for detailed Indian responses
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