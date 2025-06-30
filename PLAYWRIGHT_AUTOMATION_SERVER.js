/**
 * AURALO PLAYWRIGHT AUTOMATION SERVER
 * 
 * Advanced server-side solution using Playwright to provide
 * automated browser sessions with Mercuryo forcing
 */

const { chromium, devices: playwrightDevices } = require('playwright');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

class AuraloPlaywrightAutomationServer {
    constructor(port = 3001) {
        this.port = port;
        this.version = '1.0.0';
        this.sessions = new Map();
        this.app = express();
        
        this.setupMiddleware();
        this.setupRoutes();
        
        console.log('🚀 Auralo Playwright Automation Server v' + this.version);
    }
    
    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        
        // Logging middleware
        this.app.use((req, res, next) => {
            console.log(`📥 ${req.method} ${req.path}`, req.body ? req.body : '');
            next();
        });
    }
    
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                version: this.version,
                activeSessions: this.sessions.size,
                timestamp: new Date().toISOString()
            });
        });
        
        // Create new automation session
        this.app.post('/session/create', async (req, res) => {
            try {
                const sessionId = uuidv4();
                const { device = 'iPhone 13 Pro', amount = 50, region = 'US' } = req.body;
                
                console.log(`🔧 Creating session ${sessionId} for device: ${device}`);
                
                const session = await this.createSession(sessionId, device, amount, region);
                
                res.json({
                    success: true,
                    sessionId: sessionId,
                    device: device,
                    amount: amount,
                    region: region,
                    url: session.url
                });
                
            } catch (error) {
                console.error('❌ Session creation failed:', error.message);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // Get session status
        this.app.get('/session/:sessionId/status', async (req, res) => {
            const { sessionId } = req.params;
            const session = this.sessions.get(sessionId);
            
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            
            try {
                const status = await this.getSessionStatus(session);
                res.json({
                    success: true,
                    sessionId: sessionId,
                    ...status
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // Force Mercuryo in session
        this.app.post('/session/:sessionId/force', async (req, res) => {
            const { sessionId } = req.params;
            const session = this.sessions.get(sessionId);
            
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            
            try {
                const result = await this.forceMercuryoInSession(session);
                res.json({
                    success: true,
                    sessionId: sessionId,
                    forcingResult: result
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // Get session screenshot
        this.app.get('/session/:sessionId/screenshot', async (req, res) => {
            const { sessionId } = req.params;
            const session = this.sessions.get(sessionId);
            
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            
            try {
                const screenshot = await session.page.screenshot({ 
                    encoding: 'base64',
                    fullPage: true 
                });
                
                res.json({
                    success: true,
                    sessionId: sessionId,
                    screenshot: `data:image/png;base64,${screenshot}`
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // Close session
        this.app.delete('/session/:sessionId', async (req, res) => {
            const { sessionId } = req.params;
            const session = this.sessions.get(sessionId);
            
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            
            try {
                await this.closeSession(sessionId);
                res.json({
                    success: true,
                    sessionId: sessionId,
                    message: 'Session closed'
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // List all sessions
        this.app.get('/sessions', (req, res) => {
            const sessionList = Array.from(this.sessions.entries()).map(([id, session]) => ({
                sessionId: id,
                device: session.device,
                amount: session.amount,
                region: session.region,
                createdAt: session.createdAt,
                url: session.url
            }));
            
            res.json({
                success: true,
                sessions: sessionList,
                count: sessionList.length
            });
        });
    }
    
    async createSession(sessionId, deviceName, amount, region) {
        const browser = await chromium.launch({
            headless: false,  // Show browser for debugging
            args: [
                '--disable-web-security',
                '--no-sandbox',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        
        const deviceConfig = playwrightDevices[deviceName] || playwrightDevices['iPhone 13 Pro'];
        
        const context = await browser.newContext({
            ...deviceConfig,
            locale: region === 'US' ? 'en-US' : region === 'EU' ? 'en-GB' : 'en-AU',
            geolocation: this.getGeolocation(region),
            permissions: ['geolocation']
        });
        
        const page = await context.newPage();
        
        const url = `https://simpleswap.io/?from=eur&to=pol&amount=${amount}&partner=auralo`;
        
        console.log(`🌐 Loading ${url} in session ${sessionId}`);
        
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        
        // Inject Mercuryo forcing script
        await this.injectForcingScript(page);
        
        const session = {
            sessionId,
            browser,
            context,
            page,
            device: deviceName,
            amount,
            region,
            url,
            createdAt: new Date().toISOString(),
            forcingActive: true
        };
        
        this.sessions.set(sessionId, session);
        
        // Start continuous forcing
        this.startContinuousForcing(session);
        
        return session;
    }
    
    getGeolocation(region) {
        const locations = {
            'US': { latitude: 40.7128, longitude: -74.0060 }, // New York
            'EU': { latitude: 51.5074, longitude: -0.1278 },  // London
            'AU': { latitude: -33.8688, longitude: 151.2093 }, // Sydney
            'CA': { latitude: 43.6532, longitude: -79.3832 }   // Toronto
        };
        
        return locations[region] || locations['US'];
    }
    
    async injectForcingScript(page) {
        await page.addScriptTag({
            content: `
            (function() {
                'use strict';
                
                console.log('🚀 Auralo Playwright Automation - Mercuryo Forcing Active');
                
                const AuraloAutomationForcer = {
                    version: '1.0.0',
                    active: true,
                    attempts: 0,
                    maxAttempts: 200,
                    
                    config: {
                        checkInterval: 1000,
                        maxRuntime: 300000, // 5 minutes
                        forceVisualStyle: {
                            border: '5px solid #22c55e',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(34, 197, 94, 0.3)',
                            boxShadow: '0 0 25px rgba(34, 197, 94, 1)',
                            outline: '3px solid #22c55e',
                            zIndex: '9999'
                        }
                    },
                    
                    init() {
                        console.log('🔧 Initializing Playwright Automation Forcer...');
                        this.startForcing();
                        this.setupMutationObserver();
                        this.setupEventListeners();
                        console.log('✅ Playwright Automation Forcer activated');
                    },
                    
                    startForcing() {
                        const forceInterval = setInterval(() => {
                            if (!this.active || this.attempts > this.maxAttempts) {
                                clearInterval(forceInterval);
                                return;
                            }
                            
                            this.attempts++;
                            this.forceMercuryoSelection();
                            
                        }, this.config.checkInterval);
                        
                        setTimeout(() => {
                            this.active = false;
                            clearInterval(forceInterval);
                            console.log('⏰ Automation forcer stopped after 5 minutes');
                        }, this.config.maxRuntime);
                    },
                    
                    forceMercuryoSelection() {
                        if (!this.active || this.attempts > this.maxAttempts) return;
                        
                        let actionsApplied = 0;
                        
                        document.querySelectorAll('*').forEach(el => {
                            if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
                            
                            const text = (el.textContent || '').toLowerCase();
                            
                            // Force Mercuryo selection with extreme measures
                            if (text.includes('mercuryo') && 
                                !text.includes('schema.org') && 
                                text.length < 500 &&
                                el.tagName !== 'HTML' && 
                                el.tagName !== 'BODY') {
                                
                                // Apply extremely strong visual forcing
                                Object.assign(el.style, this.config.forceVisualStyle);
                                
                                el.setAttribute('aria-selected', 'true');
                                el.setAttribute('data-selected', 'true');
                                el.setAttribute('data-auralo-automation-forced', 'true');
                                
                                if (el.classList) {
                                    el.classList.add('selected', 'active', 'chosen', 'forced', 'auralo-automation');
                                }
                                
                                // Aggressive clicking
                                for (let i = 0; i < 5; i++) {
                                    setTimeout(() => {
                                        try { 
                                            el.click(); 
                                            el.focus();
                                            el.dispatchEvent(new Event('click', { bubbles: true }));
                                            el.dispatchEvent(new Event('mousedown', { bubbles: true }));
                                            el.dispatchEvent(new Event('mouseup', { bubbles: true }));
                                        } catch(e) {}
                                    }, i * 100);
                                }
                                
                                actionsApplied++;
                            }
                            
                            // Completely disable MoonPay
                            if (text.includes('moonpay') && 
                                !text.includes('schema.org') && 
                                text.length < 500 &&
                                el.tagName !== 'HTML' && 
                                el.tagName !== 'BODY') {
                                
                                el.style.cssText += \`
                                    opacity: 0.1 !important;
                                    pointer-events: none !important;
                                    filter: grayscale(100%) blur(2px) !important;
                                    position: relative !important;
                                \`;
                                
                                el.setAttribute('aria-selected', 'false');
                                el.setAttribute('data-auralo-automation-disabled', 'true');
                                
                                if (el.classList) {
                                    el.classList.remove('selected', 'active', 'chosen');
                                    el.classList.add('disabled', 'auralo-automation-disabled');
                                }
                                
                                // Add overlay to completely block interaction
                                const overlay = document.createElement('div');
                                overlay.style.cssText = \`
                                    position: absolute;
                                    top: 0; left: 0; right: 0; bottom: 0;
                                    background: rgba(255, 0, 0, 0.3);
                                    z-index: 9998;
                                    pointer-events: none;
                                \`;
                                
                                if (el.style.position !== 'absolute' && el.style.position !== 'relative') {
                                    el.style.position = 'relative';
                                }
                                el.appendChild(overlay);
                                
                                actionsApplied++;
                            }
                        });
                        
                        if (actionsApplied > 0) {
                            console.log(\`🔧 Automation Round \${this.attempts}: Applied \${actionsApplied} forcing actions\`);
                            
                            // Notify automation server
                            if (window.auraloAutomationCallback) {
                                window.auraloAutomationCallback({
                                    type: 'forcing_applied',
                                    attempt: this.attempts,
                                    actions: actionsApplied
                                });
                            }
                        }
                        
                        return actionsApplied;
                    },
                    
                    setupMutationObserver() {
                        const observer = new MutationObserver(() => {
                            if (this.active) {
                                setTimeout(() => this.forceMercuryoSelection(), 100);
                            }
                        });
                        
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true,
                            attributes: true,
                            attributeFilter: ['class', 'aria-selected', 'data-selected']
                        });
                    },
                    
                    setupEventListeners() {
                        ['click', 'touchstart', 'change', 'focus', 'blur'].forEach(eventType => {
                            document.addEventListener(eventType, () => {
                                if (this.active) {
                                    setTimeout(() => this.forceMercuryoSelection(), 50);
                                }
                            }, true);
                        });
                    },
                    
                    getStatus() {
                        const mercuryoElements = document.querySelectorAll('[data-auralo-automation-forced="true"]').length;
                        const moonpayDisabled = document.querySelectorAll('[data-auralo-automation-disabled="true"]').length;
                        
                        return {
                            active: this.active,
                            attempts: this.attempts,
                            mercuryoForced: mercuryoElements,
                            moonpayDisabled: moonpayDisabled,
                            timestamp: new Date().toISOString()
                        };
                    }
                };
                
                // Auto-initialize
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => AuraloAutomationForcer.init());
                } else {
                    AuraloAutomationForcer.init();
                }
                
                // Expose to global scope
                window.AuraloAutomationForcer = AuraloAutomationForcer;
                
            })();
            `
        });
    }
    
    startContinuousForcing(session) {
        const { page } = session;
        
        // Set up callback for forcing notifications
        page.evaluate(() => {
            window.auraloAutomationCallback = (data) => {
                console.log('📊 Automation status:', data);
            };
        });
        
        // Periodically check and force
        const forcingInterval = setInterval(async () => {
            if (!this.sessions.has(session.sessionId)) {
                clearInterval(forcingInterval);
                return;
            }
            
            try {
                await page.evaluate(() => {
                    if (window.AuraloAutomationForcer && window.AuraloAutomationForcer.active) {
                        window.AuraloAutomationForcer.forceMercuryoSelection();
                    }
                });
            } catch (error) {
                console.error(`❌ Forcing error in session ${session.sessionId}:`, error.message);
            }
        }, 2000);
        
        session.forcingInterval = forcingInterval;
    }
    
    async getSessionStatus(session) {
        try {
            const status = await session.page.evaluate(() => {
                if (window.AuraloAutomationForcer) {
                    return window.AuraloAutomationForcer.getStatus();
                }
                return { error: 'Forcer not found' };
            });
            
            const url = session.page.url();
            
            return {
                ...status,
                currentUrl: url,
                device: session.device,
                amount: session.amount,
                region: session.region
            };
        } catch (error) {
            return { error: error.message };
        }
    }
    
    async forceMercuryoInSession(session) {
        try {
            const result = await session.page.evaluate(() => {
                if (window.AuraloAutomationForcer) {
                    return window.AuraloAutomationForcer.forceMercuryoSelection();
                }
                return 0;
            });
            
            return {
                actionsApplied: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Forcing failed: ${error.message}`);
        }
    }
    
    async closeSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        
        if (session.forcingInterval) {
            clearInterval(session.forcingInterval);
        }
        
        await session.context.close();
        await session.browser.close();
        
        this.sessions.delete(sessionId);
        
        console.log(`✅ Session ${sessionId} closed`);
    }
    
    async start() {
        return new Promise((resolve) => {
            this.app.listen(this.port, () => {
                console.log(`🚀 Auralo Playwright Automation Server running on port ${this.port}`);
                console.log(`📋 Health check: http://localhost:${this.port}/health`);
                console.log(`📚 API endpoints available:`);
                console.log(`   POST /session/create - Create new automation session`);
                console.log(`   GET /session/:id/status - Get session status`);
                console.log(`   POST /session/:id/force - Force Mercuryo in session`);
                console.log(`   GET /session/:id/screenshot - Get session screenshot`);
                console.log(`   DELETE /session/:id - Close session`);
                console.log(`   GET /sessions - List all sessions`);
                resolve();
            });
        });
    }
    
    async stop() {
        // Close all sessions
        for (const [sessionId] of this.sessions) {
            await this.closeSession(sessionId);
        }
        
        console.log('✅ Auralo Playwright Automation Server stopped');
    }
}

// Export and auto-start if run directly
if (require.main === module) {
    const server = new AuraloPlaywrightAutomationServer();
    server.start().catch(console.error);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('🛑 Shutting down server...');
        await server.stop();
        process.exit(0);
    });
} else {
    module.exports = AuraloPlaywrightAutomationServer;
}

/**
 * CLIENT USAGE EXAMPLE:
 * 
 * // Create session
 * const response = await fetch('http://localhost:3001/session/create', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *         device: 'iPhone 13 Pro',
 *         amount: 50,
 *         region: 'US'
 *     })
 * });
 * 
 * const { sessionId } = await response.json();
 * 
 * // Check status
 * const status = await fetch(`http://localhost:3001/session/${sessionId}/status`);
 * console.log(await status.json());
 * 
 * // Force Mercuryo
 * const force = await fetch(`http://localhost:3001/session/${sessionId}/force`, { method: 'POST' });
 * console.log(await force.json());
 * 
 * // Get screenshot
 * const screenshot = await fetch(`http://localhost:3001/session/${sessionId}/screenshot`);
 * console.log(await screenshot.json());
 */