/**
 * AURALO SERVICE WORKER INTERCEPTOR
 * 
 * Advanced approach using Service Worker to intercept and modify
 * SimpleSwap responses to force Mercuryo selection
 */

class AuraloServiceWorkerInterceptor {
    constructor() {
        this.version = '1.0.0';
        this.forcingActive = false;
        this.interceptorRegistered = false;
        
        console.log('🚀 Auralo Service Worker Interceptor v1.0.0');
    }
    
    /**
     * Register and install the service worker
     */
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Workers not supported');
        }
        
        try {
            // Create the service worker script as a blob
            const serviceWorkerScript = this.getServiceWorkerScript();
            const blob = new Blob([serviceWorkerScript], { type: 'application/javascript' });
            const serviceWorkerUrl = URL.createObjectURL(blob);
            
            const registration = await navigator.serviceWorker.register(serviceWorkerUrl, {
                scope: '/'
            });
            
            console.log('✅ Service Worker registered:', registration);
            
            // Wait for service worker to be active
            await this.waitForServiceWorker(registration);
            
            this.interceptorRegistered = true;
            return registration;
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
            throw error;
        }
    }
    
    /**
     * Wait for service worker to become active
     */
    async waitForServiceWorker(registration) {
        return new Promise((resolve) => {
            if (registration.active) {
                resolve();
                return;
            }
            
            const worker = registration.installing || registration.waiting;
            if (worker) {
                worker.addEventListener('statechange', () => {
                    if (worker.state === 'activated') {
                        resolve();
                    }
                });
            }
        });
    }
    
    /**
     * Generate the service worker script
     */
    getServiceWorkerScript() {
        return `
// AURALO SERVICE WORKER - RESPONSE INTERCEPTOR
const CACHE_NAME = 'auralo-mercuryo-forcer-v1';
const AURALO_VERSION = '1.0.0';

console.log('🔧 Auralo Service Worker installed v' + AURALO_VERSION);

// Install event
self.addEventListener('install', (event) => {
    console.log('⚙️ Service Worker installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker activated');
    event.waitUntil(clients.claim());
});

// Fetch event - intercept all network requests
self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    
    // Only intercept SimpleSwap requests
    if (!url.includes('simpleswap.io')) {
        return;
    }
    
    console.log('🔍 Intercepting:', url);
    
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone the response so we can modify it
                const clonedResponse = response.clone();
                
                // Only modify HTML responses
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('text/html')) {
                    return response;
                }
                
                console.log('🔧 Modifying HTML response for Mercuryo forcing');
                
                return clonedResponse.text().then(html => {
                    // Inject our Mercuryo forcing script
                    const modifiedHtml = injectMercuryoForcing(html);
                    
                    return new Response(modifiedHtml, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                });
            })
            .catch(error => {
                console.error('❌ Fetch failed:', error);
                return new Response('Service Worker Error', { status: 500 });
            })
    );
});

/**
 * Inject Mercuryo forcing script into HTML
 */
function injectMercuryoForcing(html) {
    const forcingScript = \`
<script>
(function() {
    'use strict';
    
    console.log('🚀 Auralo Mercuryo Forcing - Service Worker Injection');
    
    const AuraloMercuryoForcer = {
        version: '1.0.0',
        active: false,
        attempts: 0,
        maxAttempts: 100,
        
        config: {
            checkInterval: 500,
            maxRuntime: 60000,
            forceVisualStyle: {
                border: '4px solid #22c55e',
                borderRadius: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                boxShadow: '0 0 20px rgba(34, 197, 94, 1)',
                outline: '2px solid #22c55e'
            }
        },
        
        init() {
            console.log('🔧 Initializing Service Worker Mercuryo Forcer...');
            this.active = true;
            this.startForcing();
            this.setupMutationObserver();
            console.log('✅ Service Worker Mercuryo Forcer activated');
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
                console.log('⏰ Service Worker forcer stopped after 60s');
            }, this.config.maxRuntime);
        },
        
        forceMercuryoSelection() {
            if (!this.active || this.attempts > this.maxAttempts) return;
            
            let actionsApplied = 0;
            
            document.querySelectorAll('*').forEach(el => {
                if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
                
                const text = (el.textContent || '').toLowerCase();
                
                // Force Mercuryo selection
                if (text.includes('mercuryo') && 
                    !text.includes('schema.org') && 
                    text.length < 500 &&
                    el.tagName !== 'HTML' && 
                    el.tagName !== 'BODY') {
                    
                    // Apply strong visual forcing
                    Object.assign(el.style, this.config.forceVisualStyle);
                    
                    el.setAttribute('aria-selected', 'true');
                    el.setAttribute('data-auralo-sw-forced', 'true');
                    
                    if (el.classList) {
                        el.classList.add('selected', 'active', 'auralo-sw-forced');
                    }
                    
                    // Multiple click attempts
                    setTimeout(() => { try { el.click(); } catch(e) {} }, 50);
                    setTimeout(() => { try { el.click(); } catch(e) {} }, 100);
                    setTimeout(() => { try { el.click(); } catch(e) {} }, 300);
                    
                    actionsApplied++;
                }
                
                // Disable MoonPay
                if (text.includes('moonpay') && 
                    !text.includes('schema.org') && 
                    text.length < 500 &&
                    el.tagName !== 'HTML' && 
                    el.tagName !== 'BODY') {
                    
                    el.style.opacity = '0.3';
                    el.style.pointerEvents = 'none';
                    el.style.filter = 'grayscale(100%)';
                    
                    el.setAttribute('aria-selected', 'false');
                    el.setAttribute('data-auralo-sw-disabled', 'true');
                    
                    if (el.classList) {
                        el.classList.remove('selected', 'active');
                        el.classList.add('disabled', 'auralo-sw-disabled');
                    }
                    
                    actionsApplied++;
                }
            });
            
            if (actionsApplied > 0) {
                console.log(\`🔧 SW Round \${this.attempts}: Applied \${actionsApplied} forcing actions\`);
            }
        },
        
        setupMutationObserver() {
            const observer = new MutationObserver(() => {
                if (this.active) {
                    this.forceMercuryoSelection();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'aria-selected']
            });
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AuraloMercuryoForcer.init());
    } else {
        AuraloMercuryoForcer.init();
    }
    
    // Expose to global scope
    window.AuraloMercuryoForcer = AuraloMercuryoForcer;
    
})();
</script>
\`;
    
    // Inject the script before closing </head> or before closing </body>
    if (html.includes('</head>')) {
        return html.replace('</head>', forcingScript + '</head>');
    } else if (html.includes('</body>')) {
        return html.replace('</body>', forcingScript + '</body>');
    } else {
        return html + forcingScript;
    }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'AURALO_COMMAND') {
        console.log('📨 Service Worker received command:', event.data);
        
        // Handle commands from main thread
        switch (event.data.action) {
            case 'status':
                event.ports[0].postMessage({
                    type: 'AURALO_STATUS',
                    active: true,
                    version: AURALO_VERSION
                });
                break;
                
            case 'force_mercuryo':
                console.log('🔧 Manual Mercuryo forcing triggered');
                break;
                
            default:
                console.log('❓ Unknown command:', event.data.action);
        }
    }
});
`;
    }
    
    /**
     * Start the interceptor
     */
    async start() {
        try {
            console.log('🔧 Starting Auralo Service Worker Interceptor...');
            
            await this.registerServiceWorker();
            
            // Set up communication with service worker
            this.setupServiceWorkerCommunication();
            
            this.forcingActive = true;
            
            console.log('✅ Service Worker Interceptor active');
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to start Service Worker Interceptor:', error);
            return false;
        }
    }
    
    /**
     * Set up communication with service worker
     */
    setupServiceWorkerCommunication() {
        if (!navigator.serviceWorker.controller) {
            console.log('⚠️ No service worker controller available');
            return;
        }
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'AURALO_STATUS') {
                console.log('📨 Received from service worker:', event.data);
            }
        });
    }
    
    /**
     * Send command to service worker
     */
    sendCommand(action, data = {}) {
        if (!navigator.serviceWorker.controller) {
            console.log('⚠️ No service worker available for command');
            return;
        }
        
        const message = {
            type: 'AURALO_COMMAND',
            action: action,
            ...data
        };
        
        navigator.serviceWorker.controller.postMessage(message);
        console.log('📤 Sent command to service worker:', message);
    }
    
    /**
     * Manual force Mercuryo selection
     */
    forceMercuryo() {
        this.sendCommand('force_mercuryo');
    }
    
    /**
     * Get status
     */
    async getStatus() {
        return new Promise((resolve) => {
            if (!navigator.serviceWorker.controller) {
                resolve({ active: false, error: 'No service worker' });
                return;
            }
            
            const channel = new MessageChannel();
            channel.port1.onmessage = (event) => {
                resolve(event.data);
            };
            
            this.sendCommand('status');
            
            // Timeout after 5 seconds
            setTimeout(() => {
                resolve({ active: false, error: 'Timeout' });
            }, 5000);
        });
    }
    
    /**
     * Stop the interceptor
     */
    async stop() {
        try {
            if (!this.interceptorRegistered) {
                console.log('ℹ️ Service Worker not registered');
                return;
            }
            
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                await registration.unregister();
                console.log('✅ Service Worker unregistered');
            }
            
            this.forcingActive = false;
            this.interceptorRegistered = false;
            
        } catch (error) {
            console.error('❌ Failed to stop Service Worker:', error);
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuraloServiceWorkerInterceptor;
} else if (typeof window !== 'undefined') {
    window.AuraloServiceWorkerInterceptor = AuraloServiceWorkerInterceptor;
}

/**
 * USAGE EXAMPLE:
 * 
 * const interceptor = new AuraloServiceWorkerInterceptor();
 * 
 * // Start the interceptor
 * interceptor.start().then(success => {
 *     if (success) {
 *         console.log('✅ Service Worker Interceptor active');
 *         
 *         // Navigate to SimpleSwap - responses will be automatically modified
 *         window.location.href = 'https://simpleswap.io/?from=eur&to=pol&amount=50&partner=auralo';
 *     }
 * });
 * 
 * // Manual force
 * interceptor.forceMercuryo();
 * 
 * // Check status
 * interceptor.getStatus().then(status => console.log('Status:', status));
 * 
 * // Stop when done
 * interceptor.stop();
 */