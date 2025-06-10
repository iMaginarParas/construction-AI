<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Builder.Wtf - Professional Construction Assistant</title>
    <style>
        :root {
            --primary: #6366f1;
            --primary-light: #818cf8;
            --primary-dark: #4f46e5;
            --secondary: #f1f5f9;
            --accent: #f59e0b;
            --accent-light: #fbbf24;
            --background: #0f172a;
            --surface: #1e293b;
            --surface-light: #334155;
            --border: #475569;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --text-muted: #94a3b8;
            --success: #10b981;
            --error: #ef4444;
            --warning: #f59e0b;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        html, body {
            height: 100%;
            overflow-x: hidden;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
            background: var(--background);
            color: var(--text-primary);
            line-height: 1.6;
            position: fixed;
            width: 100%;
        }

        .app-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Header */
        .header {
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(71, 85, 105, 0.3);
            padding: 0.75rem 1rem;
            flex-shrink: 0;
            z-index: 100;
        }

        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 100%;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .logo-icon {
            width: 2rem;
            height: 2rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1rem;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.375rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-dot {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background: currentColor;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 0.5rem;
        }

        .chat-container {
            flex: 1;
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            border: 1px solid rgba(71, 85, 105, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Quick Actions - Horizontal Scrollable */
        .quick-actions {
            flex-shrink: 0;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(71, 85, 105, 0.3);
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(51, 65, 85, 0.4));
        }

        .action-scroll-container {
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .action-scroll-container::-webkit-scrollbar {
            display: none;
        }

        .action-grid {
            display: flex;
            gap: 0.75rem;
            padding: 0 1rem;
            min-width: max-content;
        }

        .action-btn {
            padding: 0.875rem 1rem;
            background: rgba(51, 65, 85, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(71, 85, 105, 0.4);
            border-radius: 0.75rem;
            cursor: pointer;
            font-size: 0.8125rem;
            color: var(--text-primary);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            white-space: nowrap;
            min-width: 140px;
            max-width: 180px;
            touch-action: manipulation;
            flex-shrink: 0;
        }

        .action-btn:active {
            transform: scale(0.98);
            background: rgba(51, 65, 85, 0.8);
        }

        .action-icon {
            width: 1.75rem;
            height: 1.75rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            color: white;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            flex-shrink: 0;
        }

        .action-text {
            flex: 1;
            text-align: left;
            overflow: hidden;
        }

        .action-title {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.8125rem;
            line-height: 1.2;
            margin-bottom: 0.125rem;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .action-desc {
            font-size: 0.6875rem;
            color: var(--text-muted);
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }

        /* Messages */
        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }

        .message {
            margin-bottom: 1rem;
            display: flex;
            gap: 0.75rem;
            max-width: 100%;
        }

        .message.user {
            flex-direction: row-reverse;
        }

        .message-avatar {
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.75rem;
            flex-shrink: 0;
        }

        .message.assistant .message-avatar {
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            color: white;
        }

        .message.user .message-avatar {
            background: linear-gradient(135deg, var(--accent), var(--accent-light));
            color: white;
        }

        .message-content {
            max-width: 80%;
            padding: 0.875rem 1rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            line-height: 1.5;
        }

        .message.user .message-content {
            background: linear-gradient(135deg, var(--accent), var(--accent-light));
            color: white;
            border-bottom-right-radius: 0.25rem;
        }

        .message.assistant .message-content {
            background: rgba(51, 65, 85, 0.6);
            color: var(--text-primary);
            border: 1px solid rgba(71, 85, 105, 0.3);
            border-bottom-left-radius: 0.25rem;
            backdrop-filter: blur(10px);
        }

        .welcome-content {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(245, 158, 11, 0.1));
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 0.75rem;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .welcome-title {
            font-size: 1.125rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .capability-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.5rem;
            margin-top: 0.75rem;
        }

        .capability-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: rgba(51, 65, 85, 0.4);
            border-radius: 0.5rem;
            font-size: 0.8125rem;
        }

        .capability-icon {
            width: 1.5rem;
            height: 1.5rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            border-radius: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.75rem;
            flex-shrink: 0;
        }

        .loading-message {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-secondary);
            font-style: italic;
        }

        .loading-dots {
            display: flex;
            gap: 0.25rem;
        }

        .loading-dot {
            width: 0.375rem;
            height: 0.375rem;
            background: var(--primary);
            border-radius: 50%;
            animation: bounce 1.4s ease-in-out infinite both;
        }

        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        .loading-dot:nth-child(3) { animation-delay: 0s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1.2); opacity: 1; }
        }

        /* Input Section */
        .input-section {
            flex-shrink: 0;
            padding: 1rem;
            border-top: 1px solid rgba(71, 85, 105, 0.3);
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6));
            backdrop-filter: blur(10px);
        }

        .input-container {
            display: flex;
            gap: 0.75rem;
            align-items: end;
        }

        .input-wrapper {
            flex: 1;
            position: relative;
        }

        .input-field {
            width: 100%;
            min-height: 2.75rem;
            max-height: 6rem;
            padding: 0.75rem 1rem;
            background: rgba(51, 65, 85, 0.6);
            border: 2px solid rgba(71, 85, 105, 0.4);
            border-radius: 1rem;
            font-size: 1rem;
            font-family: inherit;
            color: var(--text-primary);
            resize: none;
            outline: none;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }

        .input-field:focus {
            border-color: var(--primary);
            background: rgba(51, 65, 85, 0.8);
        }

        .input-field::placeholder {
            color: var(--text-muted);
        }

        .send-button {
            width: 2.75rem;
            height: 2.75rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            color: white;
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            flex-shrink: 0;
            touch-action: manipulation;
        }

        .send-button:active {
            transform: scale(0.95);
        }

        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .send-icon {
            width: 1.25rem;
            height: 1.25rem;
            fill: currentColor;
        }

        .message-content code {
            background: rgba(99, 102, 241, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875em;
            color: var(--primary-light);
        }

        .message-content pre {
            background: rgba(0, 0, 0, 0.2);
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 0.5rem 0;
            border-left: 3px solid var(--primary);
        }

        .message-content pre code {
            background: none;
            padding: 0;
            color: var(--text-primary);
        }

        .message-content strong {
            font-weight: 700;
            color: var(--text-primary);
        }

        .message-content em {
            font-style: italic;
            color: var(--text-secondary);
        }
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: var(--error);
            padding: 1rem;
            border-radius: 0.75rem;
            margin: 1rem 0;
            font-size: 0.875rem;
        }

        /* Scrollbar Styling */
        .messages-container::-webkit-scrollbar,
        .quick-actions::-webkit-scrollbar {
            width: 0.25rem;
        }

        .messages-container::-webkit-scrollbar-track,
        .quick-actions::-webkit-scrollbar-track {
            background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb,
        .quick-actions::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.5);
            border-radius: 0.125rem;
        }

        /* Desktop Enhancements */
        @media (min-width: 769px) {
            .header {
                padding: 1.5rem 2rem;
            }

            .logo {
                font-size: 1.75rem;
                gap: 1rem;
            }

            .logo-icon {
                width: 3rem;
                height: 3rem;
                border-radius: 1rem;
                font-size: 1.5rem;
            }

            .status-indicator {
                padding: 0.75rem 1.25rem;
                font-size: 0.875rem;
            }

            .main-content {
                padding: 2rem;
            }

            .chat-container {
                border-radius: 2rem;
                height: calc(100vh - 12rem);
            }

            /* Desktop Enhancements */
            .quick-actions {
                padding: 1.5rem 0;
            }

            .action-grid {
                padding: 0 2rem;
            }

            .action-btn {
                padding: 1rem 1.25rem;
                border-radius: 1rem;
                min-width: 200px;
                max-width: 240px;
            }

            .action-btn:hover {
                border-color: var(--primary);
                transform: translateY(-1px);
                background: rgba(51, 65, 85, 0.8);
            }

            .action-icon {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 0.75rem;
                font-size: 1.125rem;
            }

            .action-title {
                font-size: 0.9375rem;
                margin-bottom: 0.25rem;
            }

            .action-desc {
                font-size: 0.8125rem;
            }

            .messages-container {
                padding: 2rem;
            }

            .message {
                margin-bottom: 2rem;
                gap: 1rem;
            }

            .message-avatar {
                width: 3rem;
                height: 3rem;
                border-radius: 1rem;
                font-size: 0.875rem;
            }

            .message-content {
                max-width: 75%;
                padding: 1.5rem 2rem;
                border-radius: 1.5rem;
                font-size: 0.9375rem;
            }

            .message.user .message-content {
                border-bottom-right-radius: 0.5rem;
            }

            .message.assistant .message-content {
                border-bottom-left-radius: 0.5rem;
            }

            .welcome-content {
                padding: 2rem;
                border-radius: 1.5rem;
            }

            .welcome-title {
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }

            .capability-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin-top: 1.5rem;
            }

            .capability-item {
                padding: 0.75rem;
                border-radius: 0.75rem;
                gap: 0.75rem;
            }

            .capability-icon {
                width: 2rem;
                height: 2rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
            }

            .input-section {
                padding: 2rem;
            }

            .input-container {
                gap: 1rem;
            }

            .input-field {
                min-height: 3.5rem;
                max-height: 10rem;
                padding: 1rem 1.5rem;
                border-radius: 1.5rem;
            }

            .send-button {
                width: 3.5rem;
                height: 3.5rem;
                border-radius: 1.5rem;
            }

            .send-icon {
                width: 1.5rem;
                height: 1.5rem;
            }

            /* Background Effects for Desktop */
            body::before {
                content: '';
                position: fixed;
                top: -50%;
                right: -50%;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
                animation: float 20s ease-in-out infinite;
                z-index: -1;
            }

            body::after {
                content: '';
                position: fixed;
                bottom: -50%;
                left: -50%;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%);
                animation: float 20s ease-in-out infinite reverse;
                z-index: -1;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(10deg); }
            }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon">🏗</div>
                    <span>Builder.Wtf</span>
                </div>
                <div class="status-indicator" id="connectionStatus">
                    <div class="status-dot"></div>
                    <span>Connected</span>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <div class="chat-container">
                <!-- Quick Actions -->
                <section class="quick-actions">
                    <div class="action-scroll-container">
                        <div class="action-grid">
                            <button class="action-btn" onclick="usePrompt('Calculate material costs for a 2000 sq ft residential foundation')">
                                <div class="action-icon">💰</div>
                                <div class="action-text">
                                    <div class="action-title">Cost Calculator</div>
                                    <div class="action-desc">Material estimates</div>
                                </div>
                            </button>
                            <button class="action-btn" onclick="usePrompt('Building codes for commercial bathrooms')">
                                <div class="action-icon">📋</div>
                                <div class="action-text">
                                    <div class="action-title">Building Codes</div>
                                    <div class="action-desc">Regulations & permits</div>
                                </div>
                            </button>
                            <button class="action-btn" onclick="usePrompt('Project timeline for framing a 3-bedroom house')">
                                <div class="action-icon">📅</div>
                                <div class="action-text">
                                    <div class="action-title">Timeline Planner</div>
                                    <div class="action-desc">Project scheduling</div>
                                </div>
                            </button>
                            <button class="action-btn" onclick="usePrompt('Safety protocols for concrete in cold weather')">
                                <div class="action-icon">⚠️</div>
                                <div class="action-text">
                                    <div class="action-title">Safety Protocols</div>
                                    <div class="action-desc">OSHA compliance</div>
                                </div>
                            </button>
                            <button class="action-btn" onclick="usePrompt('Steel vs wood framing comparison')">
                                <div class="action-icon">⚖️</div>
                                <div class="action-text">
                                    <div class="action-title">Material Compare</div>
                                    <div class="action-desc">Costs & benefits</div>
                                </div>
                            </button>
                            <button class="action-btn" onclick="usePrompt('Load-bearing calculations for deck structure')">
                                <div class="action-icon">🔧</div>
                                <div class="action-text">
                                    <div class="action-title">Structural Analysis</div>
                                    <div class="action-desc">Engineering calcs</div>
                                </div>
                            </button>
                            <button class="action-btn" onclick="usePrompt('HVAC system sizing for 2500 sq ft home')">
                                <div class="action-icon">🌡️</div>
                                <div class="action-text">
                                    <div class="action-title">HVAC Sizing</div>
                                    <div class="action-desc">System calculations</div>
                                </div>
                            </button>
                            <button class="action-btn" onclick="usePrompt('Electrical load calculations for commercial building')">
                                <div class="action-icon">⚡</div>
                                <div class="action-text">
                                    <div class="action-title">Electrical Load</div>
                                    <div class="action-desc">Power requirements</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Messages -->
                <div class="messages-container" id="messages">
                    <div class="message assistant">
                        <div class="message-avatar">AI</div>
                        <div class="message-content">
                            <div class="welcome-content">
                                <div class="welcome-title">Welcome to Builder.Wtf</div>
                                <p style="margin-bottom: 1rem; color: var(--text-secondary);">Your advanced AI construction consultant, ready to provide expert guidance and solutions.</p>
                                <div class="capability-grid">
                                    <div class="capability-item">
                                        <div class="capability-icon">💰</div>
                                        <span>Cost Estimation</span>
                                    </div>
                                    <div class="capability-item">
                                        <div class="capability-icon">📐</div>
                                        <span>Engineering Calculations</span>
                                    </div>
                                    <div class="capability-item">
                                        <div class="capability-icon">🏗️</div>
                                        <span>Project Management</span>
                                    </div>
                                    <div class="capability-item">
                                        <div class="capability-icon">⚠️</div>
                                        <span>Safety & Compliance</span>
                                    </div>
                                    <div class="capability-item">
                                        <div class="capability-icon">📋</div>
                                        <span>Building Codes</span>
                                    </div>
                                    <div class="capability-item">
                                        <div class="capability-icon">🔧</div>
                                        <span>Technical Support</span>
                                    </div>
                                </div>
                            </div>
                            <p>How can I assist with your construction project today?</p>
                        </div>
                    </div>
                </div>

                <!-- Input Section -->
                <section class="input-section">
                    <div class="input-container">
                        <div class="input-wrapper">
                            <textarea 
                                class="input-field" 
                                id="messageInput" 
                                placeholder="Ask anything about construction..."
                                rows="1"
                            ></textarea>
                        </div>
                        <button class="send-button" id="sendBtn" onclick="sendMessage()">
                            <svg class="send-icon" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </section>
            </div>
        </main>
    </div>

    <script>
        let isLoading = false;
        const API_BASE_URL = '/api';

        function usePrompt(prompt) {
            const input = document.getElementById('messageInput');
            input.value = prompt;
            input.focus();
            autoResizeTextarea(input);
        }

        function autoResizeTextarea(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 96) + 'px';
        }

        function addMessage(content, isUser = false) {
            const messagesContainer = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
            
            messageDiv.innerHTML = `
                <div class="message-avatar">${isUser ? 'You' : 'AI'}</div>
                <div class="message-content">${content}</div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function addLoadingMessage() {
            // This function is kept for compatibility but not used anymore
            console.log('Using new loading message system');
        }

        function removeLoadingMessage() {
            // This function is kept for compatibility but not used anymore
            console.log('Using new loading message system');
        }

        function showError(message) {
            const messagesContainer = document.getElementById('messages');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `<strong>Connection Error:</strong> ${message}`;
            messagesContainer.appendChild(errorDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Fixed streaming implementation
        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message || isLoading) return;
            
            isLoading = true;
            const sendBtn = document.getElementById('sendBtn');
            sendBtn.disabled = true;
            
            addMessage(message, true);
            input.value = '';
            autoResizeTextarea(input);
            
            // Create unique ID for this message
            const messageId = 'msg_' + Date.now();
            const messagesContainer = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant';
            messageDiv.id = messageId;
            
            messageDiv.innerHTML = `
                <div class="message-avatar">AI</div>
                <div class="message-content" id="content_${messageId}">
                    <div class="loading-message">
                        <span>Thinking...</span>
                        <div class="loading-dots">
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                        </div>
                    </div>
                </div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            try {
                // Use fetch with streaming
                const response = await fetch(`${API_BASE_URL}/chat/stream`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        timestamp: new Date().toISOString()
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                const contentDiv = document.getElementById(`content_${messageId}`);
                
                let accumulatedText = '';
                let hasStarted = false;
                
                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                            try {
                                const jsonStr = line.slice(6).trim();
                                if (jsonStr && jsonStr !== '') {
                                    const data = JSON.parse(jsonStr);
                                    if (data.choices?.[0]?.delta?.content) {
                                        if (!hasStarted) {
                                            contentDiv.innerHTML = '';
                                            hasStarted = true;
                                        }
                                        accumulatedText += data.choices[0].delta.content;
                                        contentDiv.innerHTML = formatMarkdown(accumulatedText);
                                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                                    }
                                }
                            } catch (e) {
                                // Ignore parsing errors for malformed chunks
                            }
                        } else if (line.includes('[DONE]')) {
                            break;
                        }
                    }
                }
                
                // Remove the ID after completion
                messageDiv.id = '';
                
            } catch (error) {
                // Fallback to non-streaming on error
                console.log('Streaming failed, falling back to regular API');
                try {
                    const fallbackResponse = await fetch(`${API_BASE_URL}/chat`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message,
                            timestamp: new Date().toISOString()
                        })
                    });
                    
                    if (!fallbackResponse.ok) {
                        throw new Error(`HTTP ${fallbackResponse.status}`);
                    }
                    
                    const data = await fallbackResponse.json();
                    const contentDiv = document.getElementById(`content_${messageId}`);
                    contentDiv.innerHTML = formatMarkdown(data.response);
                    messageDiv.id = '';
                    
                } catch (fallbackError) {
                    const errorDiv = document.getElementById(messageId);
                    if (errorDiv) {
                        errorDiv.remove();
                    }
                    showError(`${fallbackError.message}. Please check if the backend server is running.`);
                    console.error('Error:', fallbackError);
                    updateConnectionStatus(false);
                }
            } finally {
                isLoading = false;
                sendBtn.disabled = false;
            }
        }

        function addLoadingMessageWithId(messageId) {
            const messagesContainer = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant';
            messageDiv.id = messageId;
            
            messageDiv.innerHTML = `
                <div class="message-avatar">AI</div>
                <div class="message-content">
                    <div class="loading-message">
                        <span>Thinking...</span>
                        <div class="loading-dots">
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                        </div>
                    </div>
                </div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function removeLoadingMessageById(messageId) {
            const loadingMsg = document.getElementById(messageId);
            if (loadingMsg) {
                loadingMsg.remove();
            }
        }

        // Simple markdown formatter
        function formatMarkdown(text) {
            return text
                // Bold text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                // Italic text
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                // Code blocks
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                // Inline code
                .replace(/`(.*?)`/g, '<code>$1</code>')
                // Line breaks
                .replace(/\n/g, '<br>')
                // Bullet points
                .replace(/^• (.+)$/gm, '<div style="margin-left: 1rem;">• $1</div>')
                .replace(/^- (.+)$/gm, '<div style="margin-left: 1rem;">• $1</div>')
                // Numbered lists
                .replace(/^(\d+)\. (.+)$/gm, '<div style="margin-left: 1rem;">$1. $2</div>');
        }

        function updateConnectionStatus(isConnected) {
            const statusEl = document.getElementById('connectionStatus');
            if (isConnected) {
                statusEl.innerHTML = '<div class="status-dot"></div><span>Connected</span>';
                statusEl.className = 'status-indicator';
                statusEl.style.background = 'rgba(16, 185, 129, 0.1)';
                statusEl.style.color = 'var(--success)';
                statusEl.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            } else {
                statusEl.innerHTML = '<div class="status-dot"></div><span>Disconnected</span>';
                statusEl.className = 'status-indicator';
                statusEl.style.background = 'rgba(239, 68, 68, 0.1)';
                statusEl.style.color = 'var(--error)';
                statusEl.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }
        }

        // Event listeners
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('messageInput').addEventListener('input', function() {
            autoResizeTextarea(this);
        });

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            // Simulate connection check
            setTimeout(() => {
                updateConnectionStatus(true);
            }, 1000);
        });
    </script>
</body>
</html>

