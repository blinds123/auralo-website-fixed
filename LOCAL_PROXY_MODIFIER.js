/**
 * AURALO LOCAL PROXY MODIFIER
 * 
 * Advanced approach using local HTTP proxy to intercept and modify
 * SimpleSwap responses for Mercuryo forcing
 */

const http = require('http');
const https = require('https');
const url = require('url');
const net = require('net');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

class AuraloLocalProxyModifier {
    constructor(port = 8080) {
        this.port = port;
        this.version = '1.0.0';
        this.server = null;
        this.connections = new Set();
        this.requestCount = 0;
        this.modificationCount = 0;
        
        console.log('🚀 Auralo Local Proxy Modifier v' + this.version);
    }
    
    /**
     * Start the proxy server
     */
    async start() {
        return new Promise((resolve, reject) => {
            this.server = http.createServer((req, res) => {
                this.handleHttpRequest(req, res);
            });
            
            // Handle HTTPS CONNECT method for SSL tunneling
            this.server.on('connect', (req, clientSocket, head) => {
                this.handleHttpsConnect(req, clientSocket, head);
            });
            
            this.server.on('connection', (socket) => {
                this.connections.add(socket);
                socket.on('close', () => {
                    this.connections.delete(socket);
                });
            });
            
            this.server.listen(this.port, () => {
                console.log(`🌐 Auralo Proxy Server running on port ${this.port}`);
                console.log(`📋 Configure browser proxy: localhost:${this.port}`);
                console.log(`🔧 All HTTP/HTTPS requests will be intercepted and modified`);
                resolve();
            });
            
            this.server.on('error', (error) => {
                console.error('❌ Proxy server error:', error.message);
                reject(error);
            });
        });
    }
    
    /**
     * Handle HTTP requests
     */
    async handleHttpRequest(clientReq, clientRes) {
        this.requestCount++;
        
        const targetUrl = clientReq.url;
        const parsedUrl = url.parse(targetUrl);
        
        console.log(`📥 HTTP Request [${this.requestCount}]: ${clientReq.method} ${targetUrl}`);
        
        // Options for the target request
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.path,
            method: clientReq.method,
            headers: this.cleanHeaders(clientReq.headers)
        };
        
        const targetReq = (parsedUrl.protocol === 'https:' ? https : http).request(options, (targetRes) => {
            this.handleTargetResponse(targetRes, clientRes, targetUrl);
        });
        
        targetReq.on('error', (error) => {
            console.error(`❌ Target request error for ${targetUrl}:`, error.message);
            clientRes.writeHead(500);
            clientRes.end('Proxy Error');
        });
        
        // Pipe client request to target
        clientReq.pipe(targetReq);
    }
    
    /**
     * Handle HTTPS CONNECT method for SSL tunneling
     */
    handleHttpsConnect(req, clientSocket, head) {
        const { hostname, port } = this.parseConnectHost(req.url);
        
        console.log(`🔒 HTTPS CONNECT: ${hostname}:${port}`);
        
        // For SimpleSwap HTTPS, we need to intercept
        if (hostname.includes('simpleswap.io')) {
            console.log('🔧 Intercepting SimpleSwap HTTPS connection');
            
            // Create a fake HTTPS server to intercept
            this.createFakeHttpsServer(clientSocket, head, hostname, port);
        } else {
            // Normal tunneling for other sites
            this.createNormalTunnel(clientSocket, head, hostname, port);
        }
    }
    
    /**
     * Create fake HTTPS server for SimpleSwap interception
     */
    createFakeHttpsServer(clientSocket, head, hostname, port) {
        try {
            // Generate or load SSL certificate for simpleswap.io
            const { key, cert } = this.getSSLCertificate(hostname);
            
            const serverSocket = https.createServer({ key, cert }, (req, res) => {
                this.handleInterceptedHttpsRequest(req, res, hostname);
            });
            
            serverSocket.on('connection', (socket) => {
                // Handle the intercepted connection
                clientSocket.write('HTTP/1.1 200 Connection Established\\r\\n\\r\\n');
                
                // Pipe the client socket to our fake server
                socket.pipe(clientSocket);
                clientSocket.pipe(socket);
            });
            
            serverSocket.listen(0, () => {
                const serverPort = serverSocket.address().port;
                console.log(`🔧 Fake HTTPS server created on port ${serverPort}`);
            });
            
        } catch (error) {
            console.error('❌ Failed to create fake HTTPS server:', error.message);
            this.createNormalTunnel(clientSocket, head, hostname, port);
        }
    }
    
    /**
     * Handle intercepted HTTPS requests for SimpleSwap
     */
    async handleInterceptedHttpsRequest(req, res, originalHostname) {
        this.requestCount++;
        
        console.log(`🔒 Intercepted HTTPS [${this.requestCount}]: ${req.method} ${req.url}`);
        
        // Forward to real SimpleSwap
        const options = {
            hostname: originalHostname,
            port: 443,
            path: req.url,
            method: req.method,
            headers: this.cleanHeaders(req.headers)
        };
        
        const targetReq = https.request(options, (targetRes) => {
            this.handleTargetResponse(targetRes, res, `https://${originalHostname}${req.url}`);
        });
        
        targetReq.on('error', (error) => {
            console.error(`❌ Intercepted HTTPS request error:`, error.message);
            res.writeHead(500);
            res.end('Proxy Error');
        });
        
        req.pipe(targetReq);
    }
    
    /**
     * Create normal tunnel for non-SimpleSwap HTTPS
     */
    createNormalTunnel(clientSocket, head, hostname, port) {
        const serverSocket = net.connect(port, hostname, () => {
            clientSocket.write('HTTP/1.1 200 Connection Established\\r\\n\\r\\n');
            serverSocket.write(head);
            serverSocket.pipe(clientSocket);
            clientSocket.pipe(serverSocket);
        });
        
        serverSocket.on('error', (error) => {
            console.error(`❌ Tunnel error for ${hostname}:${port}:`, error.message);
            clientSocket.end();
        });
    }
    
    /**
     * Handle response from target server
     */
    async handleTargetResponse(targetRes, clientRes, targetUrl) {
        const contentType = targetRes.headers['content-type'] || '';
        
        // Only modify HTML responses from SimpleSwap
        if (targetUrl.includes('simpleswap.io') && contentType.includes('text/html')) {
            console.log(`🔧 Modifying SimpleSwap HTML response for Mercuryo forcing`);
            
            let body = '';
            targetRes.on('data', (chunk) => {
                body += chunk.toString();
            });
            
            targetRes.on('end', () => {
                const modifiedBody = this.injectMercuryoForcing(body, targetUrl);
                
                // Update headers for modified content
                const modifiedHeaders = { ...targetRes.headers };
                modifiedHeaders['content-length'] = Buffer.byteLength(modifiedBody, 'utf8');
                modifiedHeaders['x-auralo-modified'] = 'true';
                modifiedHeaders['x-auralo-version'] = this.version;
                
                clientRes.writeHead(targetRes.statusCode, modifiedHeaders);
                clientRes.end(modifiedBody);
                
                this.modificationCount++;
                console.log(`✅ Response modified [${this.modificationCount}]: ${targetUrl}`);
            });
        } else {
            // Pass through non-HTML or non-SimpleSwap responses
            clientRes.writeHead(targetRes.statusCode, targetRes.headers);
            targetRes.pipe(clientRes);
        }
    }
    
    /**
     * Inject Mercuryo forcing script into HTML
     */
    injectMercuryoForcing(html, targetUrl) {
        const forcingScript = `
<script>
/*! Auralo Proxy Mercuryo Forcing v${this.version} */
(function() {
    'use strict';
    
    console.log('🚀 Auralo Proxy Mercuryo Forcing v${this.version} - Injected via Local Proxy');
    console.log('🌐 Target URL: ${targetUrl}');
    
    window.AuraloProxyForcer = {
        version: '${this.version}',
        active: true,
        attempts: 0,
        maxAttempts: 1000,
        injectedVia: 'local-proxy',
        
        config: {
            checkInterval: 600,
            maxRuntime: 900000, // 15 minutes
            forceVisualStyle: {
                border: '8px solid #22c55e',
                borderRadius: '15px',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                boxShadow: '0 0 40px rgba(34, 197, 94, 1), inset 0 0 30px rgba(34, 197, 94, 0.8)',
                outline: '5px solid #22c55e',
                zIndex: '999999',
                transform: 'scale(1.1)',
                transition: 'all 0.5s ease',
                position: 'relative'
            }
        },
        
        init() {
            console.log('🔧 Initializing Proxy-Injected Mercuryo Forcer...');
            
            // Mark page as proxy-modified
            document.documentElement.setAttribute('data-auralo-proxy-modified', 'true');
            document.documentElement.setAttribute('data-auralo-version', this.version);
            
            this.setupProxyForcing();
            this.setupAdvancedObservers();
            this.injectProxyStyles();
            
            console.log('✅ Proxy-Injected Mercuryo Forcer activated');
        },
        
        setupProxyForcing() {
            // Extreme forcing with multiple concurrent strategies
            const strategies = [
                () => this.proxyDomForcing(),
                () => this.proxyAttributeForcing(),
                () => this.proxyEventForcing(),
                () => this.proxyStyleForcing(),
                () => this.proxySelectorForcing(),
                () => this.proxyFormForcing(),
                () => this.proxyScriptForcing()
            ];
            
            const runAllStrategies = () => {
                if (!this.active || this.attempts > this.maxAttempts) return;
                
                this.attempts++;
                
                let totalActions = 0;
                strategies.forEach((strategy, index) => {
                    setTimeout(() => {
                        try {
                            const actions = strategy();
                            totalActions += actions || 0;
                        } catch (error) {
                            console.warn(\`Proxy strategy \${index + 1} failed:\`, error.message);
                        }
                    }, index * 50);
                });
                
                if (this.attempts % 15 === 0) {
                    console.log(\`🔧 Proxy Round \${this.attempts}: Applied \${totalActions} total actions\`);
                    this.reportStatus();
                }
            };
            
            // Initial run
            runAllStrategies();
            
            // Continuous forcing
            const forcingInterval = setInterval(runAllStrategies, this.config.checkInterval);
            
            // Stop after max runtime
            setTimeout(() => {
                this.active = false;
                clearInterval(forcingInterval);
                console.log('⏰ Proxy forcer stopped after 15 minutes');
            }, this.config.maxRuntime);
        },
        
        proxyDomForcing() {
            let actions = 0;
            
            document.querySelectorAll('*').forEach(el => {
                if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
                
                const text = (el.textContent || '').toLowerCase();
                const innerHTML = (el.innerHTML || '').toLowerCase();
                
                // Ultra-extreme Mercuryo forcing
                if ((text.includes('mercuryo') || innerHTML.includes('mercuryo')) && 
                    !text.includes('schema.org') && 
                    text.length < 2000 &&
                    el.tagName !== 'HTML' && 
                    el.tagName !== 'BODY' &&
                    el.tagName !== 'SCRIPT') {
                    
                    // Apply extreme visual forcing
                    Object.assign(el.style, this.config.forceVisualStyle);
                    
                    // Set comprehensive selection attributes
                    const attrs = [
                        'aria-selected', 'data-selected', 'selected', 'checked', 'active',
                        'data-auralo-proxy-forced', 'data-mercuryo-forced', 'data-preferred',
                        'data-chosen', 'data-active', 'data-primary'
                    ];
                    
                    attrs.forEach(attr => el.setAttribute(attr, 'true'));
                    
                    // Add comprehensive selection classes
                    const classes = [
                        'selected', 'active', 'chosen', 'forced', 'preferred', 'primary',
                        'auralo-proxy-forced', 'mercuryo-selected', 'highlighted', 'current',
                        'enabled', 'visible', 'available'
                    ];
                    
                    if (el.classList) {
                        el.classList.add(...classes);
                    }
                    
                    // Ultra-extreme clicking - 20 different attempts
                    for (let i = 0; i < 20; i++) {
                        setTimeout(() => {
                            try {
                                // Direct click
                                el.click();
                                el.focus();
                                
                                // Event dispatching
                                const events = [
                                    'click', 'mousedown', 'mouseup', 'touchstart', 'touchend',
                                    'change', 'input', 'select', 'focus', 'blur'
                                ];
                                
                                events.forEach(eventType => {
                                    el.dispatchEvent(new Event(eventType, { 
                                        bubbles: true, 
                                        cancelable: true,
                                        composed: true
                                    }));
                                });
                                
                                // Form element specific
                                if (el.tagName === 'INPUT') {
                                    if (el.type === 'radio' || el.type === 'checkbox') {
                                        el.checked = true;
                                    }
                                    if (el.type === 'text' || el.type === 'hidden') {
                                        el.value = 'mercuryo';
                                    }
                                }
                                
                                if (el.tagName === 'SELECT') {
                                    el.selectedIndex = 0;
                                    el.value = el.options[0]?.value || '';
                                }
                                
                                if (el.tagName === 'OPTION') {
                                    el.selected = true;
                                    if (el.parentElement) {
                                        el.parentElement.value = el.value;
                                        el.parentElement.selectedIndex = el.index;
                                    }
                                }
                                
                            } catch(e) {}
                        }, i * 25);
                    }
                    
                    actions++;
                }
                
                // Extreme MoonPay destruction
                if ((text.includes('moonpay') || innerHTML.includes('moonpay')) && 
                    !text.includes('schema.org') && 
                    text.length < 2000 &&
                    el.tagName !== 'HTML' && 
                    el.tagName !== 'BODY' &&
                    el.tagName !== 'SCRIPT') {
                    
                    // Complete obliteration
                    el.style.cssText = \`
                        opacity: 0 !important;
                        visibility: hidden !important;
                        display: none !important;
                        pointer-events: none !important;
                        position: absolute !important;
                        left: -99999px !important;
                        top: -99999px !important;
                        width: 0 !important;
                        height: 0 !important;
                        overflow: hidden !important;
                        z-index: -99999 !important;
                        transform: scale(0) !important;
                        filter: blur(100px) grayscale(100%) !important;
                    \`;
                    
                    // Remove all selection
                    const removeAttrs = [
                        'aria-selected', 'data-selected', 'selected', 'checked', 'active'
                    ];
                    
                    removeAttrs.forEach(attr => el.removeAttribute(attr));
                    el.setAttribute('data-auralo-proxy-destroyed', 'true');
                    
                    // Disable form elements
                    if (el.tagName === 'INPUT' || el.tagName === 'BUTTON' || el.tagName === 'SELECT') {
                        el.disabled = true;
                        el.checked = false;
                        el.selected = false;
                    }
                    
                    // Remove from DOM after delay
                    setTimeout(() => {
                        try {
                            if (el.parentNode) {
                                el.parentNode.removeChild(el);
                            }
                        } catch(e) {}
                    }, 1000);
                    
                    actions++;
                }
            });
            
            return actions;
        },
        
        proxyAttributeForcing() {
            let actions = 0;
            
            // Force based on data attributes
            document.querySelectorAll('[data-provider], [data-gateway], [data-payment], [data-method], [data-option]').forEach(el => {
                const attrs = Array.from(el.attributes);
                const hasMercuryo = attrs.some(attr => 
                    attr.value.toLowerCase().includes('mercuryo')
                );
                
                if (hasMercuryo && el.offsetWidth > 0) {
                    Object.assign(el.style, this.config.forceVisualStyle);
                    el.click();
                    el.setAttribute('data-auralo-proxy-attr-forced', 'true');
                    actions++;
                }
                
                const hasMoonpay = attrs.some(attr => 
                    attr.value.toLowerCase().includes('moonpay')
                );
                
                if (hasMoonpay) {
                    el.style.display = 'none';
                    el.disabled = true;
                    el.setAttribute('data-auralo-proxy-attr-destroyed', 'true');
                    actions++;
                }
            });
            
            return actions;
        },
        
        proxyEventForcing() {
            // Simulate user interactions
            const mercuryoSelectors = [
                '[data-provider*="mercuryo" i]',
                '[data-gateway*="mercuryo" i]',
                '[value*="mercuryo" i]',
                '.mercuryo',
                '#mercuryo',
                'input[name*="mercuryo" i]',
                'button[data-value*="mercuryo" i]'
            ];
            
            let actions = 0;
            
            mercuryoSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                        el.click();
                        el.focus();
                        
                        const rect = el.getBoundingClientRect();
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            clientX: rect.left + rect.width / 2,
                            clientY: rect.top + rect.height / 2
                        });
                        
                        el.dispatchEvent(clickEvent);
                        actions++;
                    }
                });
            });
            
            return actions;
        },
        
        proxyStyleForcing() {
            // Force wallet fields and other important elements
            document.querySelectorAll('input, textarea, select').forEach(input => {
                const placeholder = (input.placeholder || '').toLowerCase();
                const name = (input.name || '').toLowerCase();
                const id = (input.id || '').toLowerCase();
                const label = input.labels ? input.labels[0]?.textContent.toLowerCase() : '';
                
                if (placeholder.includes('address') || placeholder.includes('wallet') || 
                    name.includes('address') || name.includes('wallet') ||
                    id.includes('address') || id.includes('wallet') ||
                    label.includes('address') || label.includes('wallet')) {
                    
                    input.style.cssText += \`
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: relative !important;
                        z-index: 99999 !important;
                        background-color: rgba(34, 197, 94, 0.1) !important;
                        border: 3px solid #22c55e !important;
                        box-shadow: 0 0 15px rgba(34, 197, 94, 0.8) !important;
                    \`;
                    
                    input.required = true;
                    input.setAttribute('data-auralo-proxy-wallet-forced', 'true');
                }
            });
            
            return document.querySelectorAll('[data-auralo-proxy-wallet-forced]').length;
        },
        
        proxySelectorForcing() {
            // Advanced selector-based forcing
            const selectors = [
                'input[type="radio"]',
                'input[type="checkbox"]', 
                '[role="radio"]',
                '[role="checkbox"]',
                '[role="option"]',
                '.option', '.choice', '.provider', '.payment-method',
                '.gateway', '.payment-option', '.method-option'
            ];
            
            let actions = 0;
            
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    const text = (el.textContent || el.value || '').toLowerCase();
                    const attrs = Array.from(el.attributes).map(attr => attr.value.toLowerCase()).join(' ');
                    
                    if (text.includes('mercuryo') || attrs.includes('mercuryo')) {
                        el.checked = true;
                        el.selected = true;
                        el.click();
                        Object.assign(el.style, this.config.forceVisualStyle);
                        actions++;
                    }
                    
                    if (text.includes('moonpay') || attrs.includes('moonpay')) {
                        el.checked = false;
                        el.selected = false;
                        el.disabled = true;
                        el.style.display = 'none';
                        actions++;
                    }
                });
            });
            
            return actions;
        },
        
        proxyFormForcing() {
            // Find and manipulate forms
            document.querySelectorAll('form').forEach(form => {
                const formData = new FormData(form);
                
                // Look for provider selection in forms
                for (let [name, value] of formData.entries()) {
                    if (name.toLowerCase().includes('provider') || 
                        name.toLowerCase().includes('gateway') ||
                        name.toLowerCase().includes('payment')) {
                        
                        const input = form.querySelector(\`[name="\${name}"]\`);
                        if (input) {
                            input.value = 'mercuryo';
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }
            });
            
            return document.querySelectorAll('form').length;
        },
        
        proxyScriptForcing() {
            // Intercept and modify JavaScript behavior
            if (window.jQuery) {
                const originalOn = window.jQuery.fn.on;
                window.jQuery.fn.on = function(events, selector, data, handler) {
                    if (typeof selector === 'string' && selector.includes('moonpay')) {
                        console.log('🚫 Blocked MoonPay jQuery event:', events, selector);
                        return this;
                    }
                    return originalOn.apply(this, arguments);
                };
            }
            
            // Override common selection functions
            const originalAddEventListener = Element.prototype.addEventListener;
            Element.prototype.addEventListener = function(type, listener, options) {
                const text = (this.textContent || '').toLowerCase();
                if (text.includes('moonpay') && (type === 'click' || type === 'change')) {
                    console.log('🚫 Blocked MoonPay event listener:', type, text.substring(0, 50));
                    return;
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
            
            return 1;
        },
        
        setupAdvancedObservers() {
            // Multiple observers for different aspects
            
            // DOM changes
            const domObserver = new MutationObserver((mutations) => {
                if (this.active) {
                    setTimeout(() => {
                        this.proxyDomForcing();
                        this.proxyAttributeForcing();
                    }, 100);
                }
            });
            
            domObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'aria-selected', 'data-selected', 'checked', 'selected']
            });
            
            // Intersection observer for visibility changes
            const intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && this.active) {
                        const text = (entry.target.textContent || '').toLowerCase();
                        if (text.includes('mercuryo')) {
                            Object.assign(entry.target.style, this.config.forceVisualStyle);
                            entry.target.click();
                        }
                    }
                });
            });
            
            // Observe all elements containing 'mercuryo'
            document.querySelectorAll('*').forEach(el => {
                const text = (el.textContent || '').toLowerCase();
                if (text.includes('mercuryo')) {
                    intersectionObserver.observe(el);
                }
            });
        },
        
        injectProxyStyles() {
            const styleEl = document.createElement('style');
            styleEl.textContent = \`
                /* Auralo Proxy Styles */
                [data-auralo-proxy-forced="true"] {
                    animation: auralo-pulse 2s infinite !important;
                }
                
                @keyframes auralo-pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                [data-auralo-proxy-destroyed="true"] {
                    display: none !important;
                }
                
                /* Force Mercuryo visibility */
                *[class*="mercuryo" i], 
                *[id*="mercuryo" i],
                *[data-provider*="mercuryo" i] {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    z-index: 99999 !important;
                }
                
                /* Hide MoonPay completely */
                *[class*="moonpay" i], 
                *[id*="moonpay" i],
                *[data-provider*="moonpay" i] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            \`;
            
            document.head.appendChild(styleEl);
        },
        
        reportStatus() {
            const status = this.getStatus();
            console.log('📊 Proxy Status Report:', status);
            
            // Send status to proxy server if possible
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/auralo-proxy-status', JSON.stringify(status));
            }
        },
        
        getStatus() {
            return {
                active: this.active,
                attempts: this.attempts,
                version: this.version,
                injectedVia: this.injectedVia,
                mercuryoForced: document.querySelectorAll('[data-auralo-proxy-forced="true"]').length,
                moonpayDestroyed: document.querySelectorAll('[data-auralo-proxy-destroyed="true"]').length,
                walletForced: document.querySelectorAll('[data-auralo-proxy-wallet-forced="true"]').length,
                timestamp: new Date().toISOString(),
                url: window.location.href
            };
        }
    };
    
    // Auto-initialize based on readiness
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => window.AuraloProxyForcer.init(), 100);
        });
    } else {
        setTimeout(() => window.AuraloProxyForcer.init(), 100);
    }
    
    // Expose globally
    window.AuraloProxyForcer = window.AuraloProxyForcer;
    
})();
</script>
`;
        
        // Inject the script before closing </body> or at the end
        if (html.includes('</body>')) {
            return html.replace('</body>', forcingScript + '</body>');
        } else if (html.includes('</html>')) {
            return html.replace('</html>', forcingScript + '</html>');
        } else {
            return html + forcingScript;
        }
    }
    
    /**
     * Clean headers for forwarding
     */
    cleanHeaders(headers) {
        const cleaned = { ...headers };
        
        // Remove proxy-related headers
        delete cleaned['proxy-connection'];
        delete cleaned['proxy-authorization'];
        
        // Update host header
        if (cleaned.host) {
            // Keep original host for proper forwarding
        }
        
        return cleaned;
    }
    
    /**
     * Parse CONNECT host and port
     */
    parseConnectHost(hostPort) {
        const [hostname, port] = hostPort.split(':');
        return {
            hostname: hostname,
            port: parseInt(port, 10) || 443
        };
    }
    
    /**
     * Get or generate SSL certificate for hostname
     */
    getSSLCertificate(hostname) {
        // For development, create a self-signed certificate
        // In production, you would use proper certificates
        
        const selfsigned = require('selfsigned');
        const attrs = [{ name: 'commonName', value: hostname }];
        const pems = selfsigned.generate(attrs, { days: 365 });
        
        return {
            key: pems.private,
            cert: pems.cert
        };
    }
    
    /**
     * Get proxy statistics
     */
    getStats() {
        return {
            version: this.version,
            requestCount: this.requestCount,
            modificationCount: this.modificationCount,
            activeConnections: this.connections.size,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Stop the proxy server
     */
    async stop() {
        return new Promise((resolve) => {
            if (!this.server) {
                resolve();
                return;
            }
            
            // Close all connections
            for (const socket of this.connections) {
                socket.destroy();
            }
            
            this.server.close(() => {
                console.log('✅ Auralo Proxy Server stopped');
                resolve();
            });
        });
    }
}

// Export and auto-start if run directly
if (require.main === module) {
    const proxy = new AuraloLocalProxyModifier(8080);
    
    proxy.start().then(() => {
        console.log('\\n📋 SETUP INSTRUCTIONS:');
        console.log('1. Configure your browser to use proxy: localhost:8080');
        console.log('2. For Chrome: Settings → Advanced → System → Open proxy settings');
        console.log('3. Set HTTP proxy: localhost:8080');
        console.log('4. Set HTTPS proxy: localhost:8080');
        console.log('5. Navigate to SimpleSwap - all responses will be modified');
        console.log('\\n🚀 Proxy is ready for Mercuryo forcing!');
        
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\\n🛑 Shutting down proxy...');
            const stats = proxy.getStats();
            console.log('📊 Final stats:', stats);
            await proxy.stop();
            process.exit(0);
        });
        
        // Log stats every 30 seconds
        setInterval(() => {
            const stats = proxy.getStats();
            console.log('📊 Proxy stats:', stats);
        }, 30000);
        
    }).catch(console.error);
    
} else {
    module.exports = AuraloLocalProxyModifier;
}

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Install dependencies:
 *    npm install selfsigned
 * 
 * 2. Run the proxy:
 *    node LOCAL_PROXY_MODIFIER.js
 * 
 * 3. Configure browser proxy settings:
 *    - HTTP Proxy: localhost:8080
 *    - HTTPS Proxy: localhost:8080
 * 
 * 4. Navigate to SimpleSwap:
 *    All HTML responses will be automatically modified with Mercuryo forcing
 * 
 * 5. Monitor console output for modification activity
 */