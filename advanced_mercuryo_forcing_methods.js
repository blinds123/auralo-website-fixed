/**
 * ADVANCED MERCURYO FORCING METHODS
 * Comprehensive exploration of all possible techniques to force Mercuryo selection
 */

console.log('🔬 ADVANCED MERCURYO FORCING METHODS - COMPREHENSIVE EXPLORATION');

// METHOD 1: IFRAME INJECTION APPROACH
window.iframeInjectionMethod = function() {
    console.log('🔧 METHOD 1: Iframe Injection Approach');
    
    // Create invisible iframe with desktop context
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);
    
    // Inject custom script into iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
        <html>
        <head>
            <script>
                // Override navigator properties in iframe context
                Object.defineProperty(navigator, 'userAgent', {
                    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                    writable: false
                });
                
                // Intercept fetch/XHR requests
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                    console.log('Intercepted fetch:', args[0]);
                    
                    // Modify SimpleSwap API requests
                    if (args[0].includes('simpleswap.io/api')) {
                        // Inject Mercuryo preference
                        if (args[1] && args[1].body) {
                            try {
                                const body = JSON.parse(args[1].body);
                                body.preferred_provider = 'mercuryo';
                                body.force_provider = 'mercuryo';
                                args[1].body = JSON.stringify(body);
                            } catch (e) {}
                        }
                    }
                    
                    return originalFetch.apply(this, args);
                };
                
                // Navigate to SimpleSwap with forced parameters
                parent.postMessage({
                    type: 'navigate',
                    url: 'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo&provider=mercuryo'
                }, '*');
            </script>
        </head>
        <body></body>
        </html>
    `);
    iframeDoc.close();
    
    // Listen for messages from iframe
    window.addEventListener('message', (event) => {
        if (event.data.type === 'navigate') {
            window.location.href = event.data.url;
        }
    });
    
    return 'Iframe injection method applied';
};

// METHOD 2: SERVICE WORKER INTERCEPTION
window.serviceWorkerMethod = function() {
    console.log('🔧 METHOD 2: Service Worker Interception');
    
    const swCode = `
        // Service Worker for intercepting SimpleSwap requests
        self.addEventListener('install', event => {
            self.skipWaiting();
        });
        
        self.addEventListener('activate', event => {
            event.waitUntil(clients.claim());
        });
        
        self.addEventListener('fetch', event => {
            const url = new URL(event.request.url);
            
            // Intercept SimpleSwap API calls
            if (url.hostname === 'simpleswap.io') {
                console.log('SW: Intercepting SimpleSwap request:', url.pathname);
                
                // Modify provider selection API calls
                if (url.pathname.includes('/api/providers') || 
                    url.pathname.includes('/api/exchange')) {
                    
                    event.respondWith(
                        fetch(event.request).then(response => {
                            return response.text().then(text => {
                                try {
                                    const data = JSON.parse(text);
                                    
                                    // Force Mercuryo as primary provider
                                    if (data.providers) {
                                        data.providers = data.providers.filter(p => 
                                            p.name === 'mercuryo' || p.id === 'mercuryo'
                                        );
                                        data.selected_provider = 'mercuryo';
                                        data.default_provider = 'mercuryo';
                                    }
                                    
                                    // Modify provider list to only show Mercuryo
                                    if (data.available_providers) {
                                        data.available_providers = ['mercuryo'];
                                    }
                                    
                                    const modifiedResponse = new Response(
                                        JSON.stringify(data),
                                        {
                                            status: response.status,
                                            statusText: response.statusText,
                                            headers: response.headers
                                        }
                                    );
                                    
                                    return modifiedResponse;
                                } catch (e) {
                                    return new Response(text, {
                                        status: response.status,
                                        statusText: response.statusText,
                                        headers: response.headers
                                    });
                                }
                            });
                        })
                    );
                    return;
                }
                
                // Modify HTML responses to inject Mercuryo selection
                if (event.request.destination === 'document') {
                    event.respondWith(
                        fetch(event.request).then(response => {
                            return response.text().then(html => {
                                // Inject script to force Mercuryo selection
                                const modifiedHtml = html.replace(
                                    '</body>',
                                    \`<script>
                                        // Force Mercuryo selection on page load
                                        document.addEventListener('DOMContentLoaded', () => {
                                            const interval = setInterval(() => {
                                                // Find and click Mercuryo
                                                const mercuryoElement = Array.from(document.querySelectorAll('*'))
                                                    .find(el => el.textContent.includes('Mercuryo'));
                                                
                                                if (mercuryoElement) {
                                                    mercuryoElement.click();
                                                    
                                                    // Add green border
                                                    mercuryoElement.style.border = '3px solid #00ff00';
                                                    mercuryoElement.style.boxShadow = '0 0 10px #00ff00';
                                                    
                                                    clearInterval(interval);
                                                }
                                            }, 100);
                                        });
                                    </script></body>\`
                                );
                                
                                return new Response(modifiedHtml, {
                                    status: response.status,
                                    statusText: response.statusText,
                                    headers: response.headers
                                });
                            });
                        })
                    );
                    return;
                }
            }
            
            event.respondWith(fetch(event.request));
        });
    `;
    
    // Create blob URL for service worker
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(swUrl, {
            scope: '/'
        }).then(registration => {
            console.log('Service Worker registered:', registration);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    }
    
    return 'Service Worker interception method applied';
};

// METHOD 3: BROWSER EXTENSION MANIFEST V3
window.browserExtensionMethod = function() {
    console.log('🔧 METHOD 3: Browser Extension Manifest V3');
    
    const manifestV3 = {
        "manifest_version": 3,
        "name": "Mercuryo Force Extension",
        "version": "1.0",
        "description": "Forces Mercuryo selection on SimpleSwap",
        
        "permissions": [
            "webRequest",
            "webRequestBlocking",
            "storage",
            "declarativeNetRequest",
            "scripting"
        ],
        
        "host_permissions": [
            "https://simpleswap.io/*",
            "https://*.simpleswap.io/*"
        ],
        
        "background": {
            "service_worker": "background.js"
        },
        
        "content_scripts": [{
            "matches": ["https://simpleswap.io/*"],
            "js": ["content.js"],
            "run_at": "document_start"
        }],
        
        "declarative_net_request": {
            "rule_resources": [{
                "id": "ruleset_1",
                "enabled": true,
                "path": "rules.json"
            }]
        }
    };
    
    const backgroundJs = `
        // Background service worker for Manifest V3
        
        // Intercept and modify API responses
        chrome.webRequest.onBeforeRequest.addListener(
            (details) => {
                console.log('Intercepting request:', details.url);
                
                // Modify request to force Mercuryo
                if (details.url.includes('/api/providers')) {
                    // Can't modify request body in V3, but can redirect
                    return {
                        redirectUrl: details.url + '&force_provider=mercuryo'
                    };
                }
            },
            { urls: ["https://simpleswap.io/api/*"] },
            ["blocking"]
        );
        
        // Inject content script dynamically
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && 
                tab.url && tab.url.includes('simpleswap.io')) {
                
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: forceMercuryoSelection
                });
            }
        });
        
        function forceMercuryoSelection() {
            // This runs in the page context
            const observer = new MutationObserver(() => {
                // Find Mercuryo option and force selection
                const providers = document.querySelectorAll('[data-provider], .provider-option');
                providers.forEach(provider => {
                    if (provider.textContent.includes('Mercuryo')) {
                        provider.click();
                        provider.style.border = '3px solid #00ff00';
                        provider.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    } else if (provider.textContent.includes('MoonPay')) {
                        provider.style.display = 'none';
                    }
                });
                
                // Force wallet address field visibility
                const walletField = document.querySelector('input[placeholder*="wallet"], input[name*="address"]');
                if (walletField) {
                    walletField.style.display = 'block';
                    walletField.style.visibility = 'visible';
                    walletField.style.opacity = '1';
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    `;
    
    const contentJs = `
        // Content script injected at document_start
        
        // Override fetch to intercept API calls
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const [url, options] = args;
            
            // Intercept provider API calls
            if (url.includes('/api/providers') || url.includes('/api/exchange')) {
                console.log('Content Script: Intercepting API call:', url);
                
                // Modify request body to force Mercuryo
                if (options && options.body) {
                    try {
                        const body = JSON.parse(options.body);
                        body.preferred_provider = 'mercuryo';
                        body.force_mercuryo = true;
                        options.body = JSON.stringify(body);
                    } catch (e) {}
                }
            }
            
            // Call original fetch and modify response
            const response = await originalFetch.apply(this, [url, options]);
            
            if (url.includes('/api/providers')) {
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    
                    // Filter to only show Mercuryo
                    if (data.providers) {
                        data.providers = data.providers.filter(p => 
                            p.name === 'mercuryo' || p.id === 'mercuryo'
                        );
                    }
                    
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                } catch (e) {
                    return new Response(text, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            }
            
            return response;
        };
        
        // Override XMLHttpRequest
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;
            
            xhr.open = function(method, url, ...args) {
                xhr._url = url;
                return originalOpen.apply(this, [method, url, ...args]);
            };
            
            xhr.send = function(data) {
                if (xhr._url && xhr._url.includes('/api/')) {
                    console.log('XHR Intercept:', xhr._url);
                    
                    // Modify request data
                    if (data) {
                        try {
                            const parsed = JSON.parse(data);
                            parsed.preferred_provider = 'mercuryo';
                            data = JSON.stringify(parsed);
                        } catch (e) {}
                    }
                }
                
                return originalSend.apply(this, [data]);
            };
            
            return xhr;
        };
    `;
    
    const rulesJson = {
        "rules": [{
            "id": 1,
            "priority": 1,
            "action": {
                "type": "modifyHeaders",
                "requestHeaders": [{
                    "header": "X-Preferred-Provider",
                    "operation": "set",
                    "value": "mercuryo"
                }]
            },
            "condition": {
                "urlFilter": "*simpleswap.io/api/*",
                "resourceTypes": ["xmlhttprequest", "fetch"]
            }
        }]
    };
    
    console.log('Extension files generated:');
    console.log('manifest.json:', JSON.stringify(manifestV3, null, 2));
    console.log('background.js:', backgroundJs);
    console.log('content.js:', contentJs);
    console.log('rules.json:', JSON.stringify(rulesJson, null, 2));
    
    return 'Browser Extension method details logged to console';
};

// METHOD 4: PROXY SERVER APPROACH
window.proxyServerMethod = function() {
    console.log('🔧 METHOD 4: Proxy Server Approach');
    
    const proxyServerCode = `
const express = require('express');
const httpProxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.text());

// Create proxy middleware
const simpleSwapProxy = httpProxy.createProxyMiddleware({
    target: 'https://simpleswap.io',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq: (proxyReq, req, res) => {
        // Modify request headers
        proxyReq.setHeader('X-Preferred-Provider', 'mercuryo');
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0');
        
        // Modify request body
        if (req.body) {
            const body = typeof req.body === 'string' ? 
                JSON.parse(req.body) : req.body;
            
            body.preferred_provider = 'mercuryo';
            body.force_provider = 'mercuryo';
            body.device_type = 'desktop';
            
            const newBody = JSON.stringify(body);
            proxyReq.setHeader('Content-Length', Buffer.byteLength(newBody));
            proxyReq.write(newBody);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        let body = '';
        
        proxyRes.on('data', (chunk) => {
            body += chunk;
        });
        
        proxyRes.on('end', () => {
            // Modify response
            try {
                if (req.url.includes('/api/providers')) {
                    const data = JSON.parse(body);
                    
                    // Filter providers to only show Mercuryo
                    if (data.providers) {
                        data.providers = data.providers.filter(p => 
                            p.name === 'mercuryo' || p.id === 'mercuryo'
                        );
                        data.selected_provider = 'mercuryo';
                    }
                    
                    body = JSON.stringify(data);
                } else if (proxyRes.headers['content-type']?.includes('text/html')) {
                    // Inject script into HTML
                    body = body.replace('</body>', \`
                        <script>
                            // Force Mercuryo selection
                            document.addEventListener('DOMContentLoaded', () => {
                                const forceInterval = setInterval(() => {
                                    const mercuryo = document.querySelector('[data-provider="mercuryo"]');
                                    if (mercuryo && !mercuryo.classList.contains('selected')) {
                                        mercuryo.click();
                                        mercuryo.style.border = '3px solid #00ff00';
                                    }
                                    
                                    const moonpay = document.querySelector('[data-provider="moonpay"]');
                                    if (moonpay) {
                                        moonpay.style.display = 'none';
                                    }
                                }, 100);
                                
                                setTimeout(() => clearInterval(forceInterval), 10000);
                            });
                        </script>
                    </body>\`);
                }
            } catch (e) {
                console.error('Error modifying response:', e);
            }
            
            // Send modified response
            res.statusCode = proxyRes.statusCode;
            Object.keys(proxyRes.headers).forEach(key => {
                res.setHeader(key, proxyRes.headers[key]);
            });
            res.end(body);
        });
    }
});

// Apply proxy to all routes
app.use('/', simpleSwapProxy);

app.listen(port, () => {
    console.log(\`Mercuryo Force Proxy running on http://localhost:\${port}\`);
    console.log('Configure your browser to use this proxy for simpleswap.io');
});
    `;
    
    console.log('Proxy server code:', proxyServerCode);
    console.log('\nTo use: Save as proxy-server.js and run with Node.js');
    console.log('npm install express http-proxy-middleware body-parser');
    console.log('node proxy-server.js');
    
    return 'Proxy server method details logged to console';
};

// METHOD 5: DNS MANIPULATION
window.dnsManipulationMethod = function() {
    console.log('🔧 METHOD 5: DNS Manipulation Approach');
    
    const dnsApproach = `
# DNS Manipulation Approach

## Option 1: Local DNS Override (hosts file)
# Add to /etc/hosts (Mac/Linux) or C:\\Windows\\System32\\drivers\\etc\\hosts (Windows)
127.0.0.1 simpleswap.io
127.0.0.1 www.simpleswap.io

# Then run local server that proxies to real SimpleSwap with modifications

## Option 2: DNS Server with Custom Responses
# Using dnsmasq or similar
address=/simpleswap.io/YOUR_PROXY_SERVER_IP

## Option 3: DNS-over-HTTPS Interception
# Intercept DoH requests and modify responses
# Requires MITM certificate installation
    `;
    
    console.log(dnsApproach);
    
    return 'DNS manipulation method details logged to console';
};

// METHOD 6: WEBSOCKET HIJACKING
window.websocketHijackingMethod = function() {
    console.log('🔧 METHOD 6: WebSocket Hijacking');
    
    // Override WebSocket constructor
    const originalWebSocket = window.WebSocket;
    
    window.WebSocket = function(url, protocols) {
        console.log('WebSocket connection intercepted:', url);
        
        // Create real WebSocket
        const ws = new originalWebSocket(url, protocols);
        
        // Override send method
        const originalSend = ws.send;
        ws.send = function(data) {
            console.log('WebSocket send intercepted:', data);
            
            try {
                // Modify outgoing messages
                if (typeof data === 'string') {
                    const parsed = JSON.parse(data);
                    
                    // Force Mercuryo in WebSocket messages
                    if (parsed.type === 'provider_selection' || 
                        parsed.type === 'get_providers') {
                        parsed.preferred_provider = 'mercuryo';
                        parsed.force_provider = 'mercuryo';
                        data = JSON.stringify(parsed);
                    }
                }
            } catch (e) {}
            
            return originalSend.call(this, data);
        };
        
        // Intercept incoming messages
        ws.addEventListener('message', function(event) {
            console.log('WebSocket message received:', event.data);
            
            try {
                const data = JSON.parse(event.data);
                
                // Modify provider lists
                if (data.providers) {
                    data.providers = data.providers.filter(p => 
                        p.name === 'mercuryo' || p.id === 'mercuryo'
                    );
                }
                
                // Create modified event
                const modifiedEvent = new MessageEvent('message', {
                    data: JSON.stringify(data),
                    origin: event.origin,
                    lastEventId: event.lastEventId,
                    source: event.source,
                    ports: event.ports
                });
                
                // Prevent original event and dispatch modified
                event.stopImmediatePropagation();
                ws.dispatchEvent(modifiedEvent);
            } catch (e) {}
        }, true);
        
        return ws;
    };
    
    // Copy static properties
    Object.setPrototypeOf(window.WebSocket, originalWebSocket);
    Object.setPrototypeOf(window.WebSocket.prototype, originalWebSocket.prototype);
    
    return 'WebSocket hijacking method applied';
};

// METHOD 7: HTTP HEADER MODIFICATION
window.httpHeaderMethod = function() {
    console.log('🔧 METHOD 7: HTTP Header Modification');
    
    // This requires browser extension or proxy
    const headerRules = {
        "X-Preferred-Provider": "mercuryo",
        "X-Force-Provider": "mercuryo",
        "X-Device-Type": "desktop",
        "X-Platform": "windows",
        "X-Mobile-Override": "false",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"
    };
    
    console.log('Headers to inject:', headerRules);
    
    // For client-side, we can only modify fetch/XHR
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        options.headers = {
            ...options.headers,
            ...headerRules
        };
        
        return originalFetch(url, options);
    };
    
    return 'HTTP header modification method applied';
};

// METHOD 8: COOKIE MANIPULATION
window.cookieManipulationMethod = function() {
    console.log('🔧 METHOD 8: Cookie Manipulation');
    
    // Set cookies that might influence provider selection
    const cookiesToSet = [
        'preferred_provider=mercuryo',
        'force_provider=mercuryo',
        'device_type=desktop',
        'mobile_override=false',
        'provider_selection=mercuryo',
        'last_provider=mercuryo',
        'default_fiat_provider=mercuryo',
        'simpleswap_prefs=' + encodeURIComponent(JSON.stringify({
            provider: 'mercuryo',
            device: 'desktop',
            force_mercuryo: true
        }))
    ];
    
    cookiesToSet.forEach(cookie => {
        document.cookie = cookie + '; path=/; domain=.simpleswap.io';
        document.cookie = cookie + '; path=/';
    });
    
    // Also try localStorage
    try {
        localStorage.setItem('preferred_provider', 'mercuryo');
        localStorage.setItem('force_provider', 'mercuryo');
        localStorage.setItem('provider_settings', JSON.stringify({
            default: 'mercuryo',
            force: true,
            hide_moonpay: true
        }));
    } catch (e) {}
    
    // And sessionStorage
    try {
        sessionStorage.setItem('current_provider', 'mercuryo');
        sessionStorage.setItem('selected_provider', 'mercuryo');
    } catch (e) {}
    
    console.log('Cookies and storage set');
    
    return 'Cookie manipulation method applied';
};

// METHOD 9: LOCALSTORAGE INJECTION
window.localStorageInjectionMethod = function() {
    console.log('🔧 METHOD 9: LocalStorage Injection');
    
    // Override localStorage methods
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    
    localStorage.setItem = function(key, value) {
        console.log('LocalStorage setItem:', key, value);
        
        // Intercept provider-related keys
        if (key.includes('provider') || key.includes('selection')) {
            try {
                const data = JSON.parse(value);
                data.provider = 'mercuryo';
                data.selected = 'mercuryo';
                value = JSON.stringify(data);
            } catch (e) {
                if (typeof value === 'string') {
                    value = 'mercuryo';
                }
            }
        }
        
        return originalSetItem.call(this, key, value);
    };
    
    localStorage.getItem = function(key) {
        const value = originalGetItem.call(this, key);
        
        // Force Mercuryo for provider keys
        if (key.includes('provider') || key.includes('selection')) {
            try {
                const data = JSON.parse(value);
                data.provider = 'mercuryo';
                data.selected = 'mercuryo';
                return JSON.stringify(data);
            } catch (e) {
                return 'mercuryo';
            }
        }
        
        return value;
    };
    
    // Pre-populate with Mercuryo preferences
    const storageData = {
        'simpleswap_provider': 'mercuryo',
        'selected_fiat_provider': 'mercuryo',
        'provider_preferences': JSON.stringify({
            default: 'mercuryo',
            force: true,
            hide_others: true
        }),
        'user_settings': JSON.stringify({
            preferred_provider: 'mercuryo',
            device_override: 'desktop'
        })
    };
    
    Object.entries(storageData).forEach(([key, value]) => {
        originalSetItem.call(localStorage, key, value);
    });
    
    return 'LocalStorage injection method applied';
};

// METHOD 10: POSTMESSAGE API EXPLOITATION
window.postMessageExploitMethod = function() {
    console.log('🔧 METHOD 10: PostMessage API Exploitation');
    
    // Listen for all postMessage events
    window.addEventListener('message', function(event) {
        console.log('PostMessage intercepted:', event.data);
        
        // Modify provider-related messages
        if (event.data && typeof event.data === 'object') {
            if (event.data.type === 'provider_list' || 
                event.data.providers || 
                event.data.selected_provider) {
                
                // Modify the data
                const modifiedData = { ...event.data };
                
                if (modifiedData.providers) {
                    modifiedData.providers = modifiedData.providers.filter(p => 
                        p === 'mercuryo' || p.name === 'mercuryo'
                    );
                }
                
                modifiedData.selected_provider = 'mercuryo';
                modifiedData.force_provider = 'mercuryo';
                
                // Re-dispatch the modified message
                event.stopImmediatePropagation();
                window.postMessage(modifiedData, event.origin);
            }
        }
    }, true);
    
    // Send messages to force Mercuryo
    const forceMessages = [
        {
            type: 'select_provider',
            provider: 'mercuryo',
            force: true
        },
        {
            type: 'provider_preference',
            preference: 'mercuryo',
            hide_others: true
        },
        {
            type: 'update_selection',
            selected: 'mercuryo',
            timestamp: Date.now()
        }
    ];
    
    // Send messages to various possible targets
    forceMessages.forEach(msg => {
        // To parent frame
        if (window.parent !== window) {
            window.parent.postMessage(msg, '*');
        }
        
        // To all iframes
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.contentWindow.postMessage(msg, '*');
        });
        
        // To self
        window.postMessage(msg, '*');
    });
    
    return 'PostMessage exploitation method applied';
};

// MASTER FUNCTION: Apply all methods
window.applyAllMercuryoForcingMethods = function() {
    console.log('🚀 APPLYING ALL MERCURYO FORCING METHODS');
    
    const results = [];
    
    // Apply each method
    results.push(window.cookieManipulationMethod());
    results.push(window.localStorageInjectionMethod());
    results.push(window.websocketHijackingMethod());
    results.push(window.httpHeaderMethod());
    results.push(window.postMessageExploitMethod());
    
    // These require more setup
    console.log('\n📋 Additional methods requiring setup:');
    console.log('- window.iframeInjectionMethod()');
    console.log('- window.serviceWorkerMethod()');
    console.log('- window.browserExtensionMethod()');
    console.log('- window.proxyServerMethod()');
    console.log('- window.dnsManipulationMethod()');
    
    return results;
};

// AUTO-EXECUTE ON LOAD
if (window.location.hostname.includes('simpleswap.io')) {
    console.log('🎯 Detected SimpleSwap - Auto-applying methods');
    window.applyAllMercuryoForcingMethods();
}

console.log('✅ ADVANCED MERCURYO FORCING METHODS LOADED');
console.log('🎯 Main function: window.applyAllMercuryoForcingMethods()');
console.log('📋 Individual methods available - see console for list');