// ADVANCED SERVICE WORKER - Intercepts and modifies requests to SimpleSwap
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Intercept all fetch requests
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Only modify SimpleSwap requests
    if (url.hostname.includes('simpleswap.io')) {
        console.log('🎯 Intercepting SimpleSwap request:', url.href);
        
        // Create modified headers
        const modifiedHeaders = new Headers(event.request.headers);
        
        // Force desktop user agent
        modifiedHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        modifiedHeaders.set('Sec-Ch-Ua', '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"');
        modifiedHeaders.set('Sec-Ch-Ua-Mobile', '?0');
        modifiedHeaders.set('Sec-Ch-Ua-Platform', '"Windows"');
        
        // Add custom headers that might help
        modifiedHeaders.set('X-Requested-With', 'DesktopApplication');
        modifiedHeaders.set('X-Client-Type', 'Desktop');
        modifiedHeaders.set('X-Device-Type', 'Desktop');
        
        // Create new request with modified headers
        const modifiedRequest = new Request(event.request, {
            headers: modifiedHeaders,
            mode: 'navigate',
            credentials: 'include'
        });
        
        event.respondWith(
            fetch(modifiedRequest)
                .then(response => {
                    console.log('✅ SimpleSwap response intercepted');
                    return response;
                })
                .catch(err => {
                    console.error('❌ Service worker fetch error:', err);
                    return fetch(event.request);
                })
        );
    } else {
        // Don't modify other requests
        event.respondWith(fetch(event.request));
    }
});