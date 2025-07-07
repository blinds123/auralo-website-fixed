// Service Worker Network Interceptor - Test Site 01
// Aggressively intercepts all SimpleSwap requests and modifies headers

const DESKTOP_USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
];

const SIMPLESWAP_DOMAINS = [
    'simpleswap.io',
    'api.simpleswap.io', 
    'widget.simpleswap.io'
];

console.log('🛡️ SERVICE WORKER TEST 01: Network Interceptor activated');

self.addEventListener('install', event => {
    console.log('⚡ SW: Installing network interceptor...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('🎯 SW: Network interceptor activated');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Only intercept SimpleSwap domains
    if (SIMPLESWAP_DOMAINS.some(domain => url.hostname.includes(domain))) {
        console.log('🎯 SW: Intercepting SimpleSwap request:', url.href);
        event.respondWith(handleSimpleSwapRequest(event.request));
    }
});

async function handleSimpleSwapRequest(request) {
    try {
        // Get random desktop user agent
        const userAgent = DESKTOP_USER_AGENTS[Math.floor(Math.random() * DESKTOP_USER_AGENTS.length)];
        
        // Create modified headers with desktop signatures
        const modifiedHeaders = new Headers(request.headers);
        
        // Core desktop headers
        modifiedHeaders.set('User-Agent', userAgent);
        modifiedHeaders.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        modifiedHeaders.set('Accept-Language', 'en-US,en;q=0.9');
        modifiedHeaders.set('Accept-Encoding', 'gzip, deflate, br');
        modifiedHeaders.set('DNT', '1');
        modifiedHeaders.set('Connection', 'keep-alive');
        modifiedHeaders.set('Upgrade-Insecure-Requests', '1');
        
        // Desktop-specific headers
        modifiedHeaders.set('Sec-Fetch-Site', 'none');
        modifiedHeaders.set('Sec-Fetch-Mode', 'navigate'); 
        modifiedHeaders.set('Sec-Fetch-User', '?1');
        modifiedHeaders.set('Sec-Fetch-Dest', 'document');
        
        // Remove mobile signatures
        modifiedHeaders.delete('Sec-CH-UA-Mobile');
        modifiedHeaders.delete('Sec-CH-UA-Platform');
        
        // Create modified request
        const modifiedRequest = new Request(request.url, {
            method: request.method,
            headers: modifiedHeaders,
            body: request.body,
            credentials: request.credentials,
            cache: request.cache,
            redirect: request.redirect,
            referrer: request.referrer
        });
        
        console.log('📡 SW: Sending request with desktop headers');
        console.log('🖥️ SW: User-Agent:', userAgent);
        
        // Fetch with modified headers
        const response = await fetch(modifiedRequest);
        
        console.log('✅ SW: Response received:', response.status);
        return response;
        
    } catch (error) {
        console.error('⚠️ SW: Request handling error:', error);
        return fetch(request);
    }
}