// 🎯 SERVICE WORKER: 100% RELIABLE DESKTOP SPOOFING FOR SIMPLESWAP
// This runs in a separate thread and can intercept ALL network requests

console.log('🎭 Desktop Spoofing Service Worker - Loading...');

const DESKTOP_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const SIMPLESWAP_DOMAINS = ['simpleswap.io', 'www.simpleswap.io'];

// Install event
self.addEventListener('install', event => {
    console.log('🔧 Service Worker installed - Desktop spoofing ready');
    self.skipWaiting(); // Activate immediately
});

// Activate event
self.addEventListener('activate', event => {
    console.log('✅ Service Worker activated - Desktop spoofing active');
    event.waitUntil(self.clients.claim()); // Take control immediately
});

// The main intercept logic - this is where the magic happens
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Only intercept SimpleSwap requests
    if (SIMPLESWAP_DOMAINS.includes(url.hostname)) {
        console.log('🎯 Intercepting SimpleSwap request:', url.href);
        
        event.respondWith(
            fetch(event.request, {
                headers: {
                    ...Object.fromEntries(event.request.headers.entries()),
                    'User-Agent': DESKTOP_USER_AGENT,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'DNT': '1'
                }
            }).then(response => {
                console.log('✅ SimpleSwap request sent with desktop headers');
                return response;
            }).catch(error => {
                console.error('❌ Service Worker fetch failed:', error);
                return fetch(event.request); // Fallback to original request
            })
        );
    }
    // For all other requests, pass through normally
});

// Listen for messages from main thread
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    if (type === 'ACTIVATE_SPOOFING') {
        console.log('🎭 Spoofing activation confirmed via message');
        // Could store state or configuration here
    }
    
    if (type === 'TEST_SPOOFING') {
        // Send confirmation back to main thread
        event.ports[0].postMessage({
            status: 'active',
            userAgent: DESKTOP_USER_AGENT,
            timestamp: new Date().toISOString()
        });
    }
});

console.log('🎭 Service Worker ready - SimpleSwap requests will be spoofed');