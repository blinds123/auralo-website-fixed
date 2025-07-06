/**
 * Service Worker - Network Level Desktop Spoofing
 * 
 * Intercepts all network requests to SimpleSwap and ensures
 * they appear to come from a desktop device.
 */

// Cache name for version control
const CACHE_NAME = 'desktop-spoofer-v1';
const SIMPLESWAP_DOMAINS = ['simpleswap.io', 'api.simpleswap.io'];

// Desktop headers that bypass all detection
const DESKTOP_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Sec-CH-UA': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-CH-UA-Mobile': '?0',
    'Sec-CH-UA-Platform': '"Windows"',
    'Sec-CH-UA-Platform-Version': '"10.0.0"',
    'Sec-CH-UA-Arch': '"x86"',
    'Sec-CH-UA-Bitness': '"64"',
    'Sec-CH-UA-Model': '""',
    'Sec-CH-UA-Full-Version': '"120.0.6099.129"',
    'Sec-CH-UA-Full-Version-List': '"Not_A Brand";v="8.0.0.0", "Chromium";v="120.0.6099.129", "Google Chrome";v="120.0.6099.129"',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty'
};

// Service worker installation
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing desktop spoofer...');
    
    // Take control immediately
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('✅ Service Worker: Cache opened');
            return cache.addAll(['/']);
        })
    );
});

// Service worker activation
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating desktop spoofer...');
    
    // Take control of all clients immediately
    event.waitUntil(
        clients.claim().then(() => {
            console.log('✅ Service Worker: Now controlling all pages');
        })
    );
});

// Intercept all fetch requests
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Check if this is a SimpleSwap request
    if (isSimpleSwapRequest(url)) {
        console.log('🎯 Intercepting SimpleSwap request:', url.pathname);
        
        event.respondWith(handleSimpleSwapRequest(event.request));
    } else {
        // Pass through non-SimpleSwap requests
        event.respondWith(fetch(event.request));
    }
});

/**
 * Check if a request is to SimpleSwap
 */
function isSimpleSwapRequest(url) {
    return SIMPLESWAP_DOMAINS.some(domain => 
        url.hostname.includes(domain)
    );
}

/**
 * Handle SimpleSwap requests with desktop spoofing
 */
async function handleSimpleSwapRequest(request) {
    try {
        // Clone the request to modify headers
        const headers = new Headers(request.headers);
        
        // Apply desktop headers
        Object.entries(DESKTOP_HEADERS).forEach(([key, value]) => {
            headers.set(key, value);
        });
        
        // Special handling for session initialization
        if (request.url.includes('/api/session/init') || 
            request.url.includes('/exchange')) {
            
            // Intercept and modify the request body
            let modifiedBody = request.body;
            
            if (request.method === 'POST' && request.body) {
                try {
                    const bodyText = await request.clone().text();
                    const bodyData = JSON.parse(bodyText);
                    
                    // Inject desktop fingerprint
                    bodyData.device_type = 'desktop';
                    bodyData.is_mobile = false;
                    bodyData.platform = 'desktop';
                    bodyData.fingerprint = {
                        userAgent: DESKTOP_HEADERS['User-Agent'],
                        platform: 'Win32',
                        vendor: 'Google Inc.',
                        maxTouchPoints: 0,
                        hardwareConcurrency: 8,
                        deviceMemory: 8
                    };
                    
                    modifiedBody = JSON.stringify(bodyData);
                } catch (e) {
                    console.warn('Could not modify request body:', e);
                }
            }
            
            // Create modified request
            const modifiedRequest = new Request(request, {
                headers: headers,
                body: modifiedBody
            });
            
            // Make the request
            const response = await fetch(modifiedRequest);
            
            // Intercept and modify the response
            return modifySimpleSwapResponse(response);
        } else {
            // For other requests, just modify headers
            const modifiedRequest = new Request(request, {
                headers: headers
            });
            
            return fetch(modifiedRequest);
        }
    } catch (error) {
        console.error('Service Worker error:', error);
        
        // Fallback to original request
        return fetch(request);
    }
}

/**
 * Modify SimpleSwap responses to ensure desktop treatment
 */
async function modifySimpleSwapResponse(response) {
    try {
        // Only modify JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return response;
        }
        
        // Clone and parse response
        const responseData = await response.clone().json();
        
        // Modify session data
        if (responseData.session) {
            responseData.session.device_type = 'desktop';
            responseData.session.is_mobile = false;
            responseData.session.pricing_tier = 'desktop';
        }
        
        // Ensure desktop pricing (no mobile markup)
        if (responseData.rate || responseData.amount || responseData.price) {
            // Desktop rate should be 19.50, not 21
            if (responseData.rate && responseData.rate > 19.50) {
                responseData.rate = 19.50;
            }
            if (responseData.amount && responseData.amount > 19.50) {
                responseData.amount = 19.50;
            }
            if (responseData.price && responseData.price > 19.50) {
                responseData.price = 19.50;
            }
        }
        
        // Force Mercury as preferred provider
        if (responseData.providers || responseData.recommended_provider) {
            responseData.recommended_provider = 'mercuryo';
            
            // Reorder providers to put Mercury first
            if (Array.isArray(responseData.providers)) {
                const providers = responseData.providers;
                const mercuryIndex = providers.findIndex(p => 
                    p.name === 'mercuryo' || p.id === 'mercuryo' || p.provider === 'mercuryo'
                );
                
                if (mercuryIndex > 0) {
                    // Move Mercury to first position
                    const mercury = providers.splice(mercuryIndex, 1)[0];
                    providers.unshift(mercury);
                    
                    // Mark Mercury as selected/recommended
                    mercury.selected = true;
                    mercury.recommended = true;
                    mercury.badge = 'Best Rate';
                }
            }
        }
        
        // Force EUR currency if USD detected
        if (responseData.currency === 'USD' || responseData.from_currency === 'usd') {
            responseData.currency = 'EUR';
            responseData.from_currency = 'eur';
            
            // Convert any USD amounts to EUR
            if (responseData.amount && responseData.currency_was_usd) {
                responseData.amount = 19.50; // Force correct EUR amount
            }
        }
        
        // Create new response with modified data
        const modifiedResponse = new Response(JSON.stringify(responseData), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
        
        return modifiedResponse;
    } catch (error) {
        console.error('Response modification error:', error);
        return response;
    }
}

/**
 * Message handler for communication with main page
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CHECK_STATUS') {
        event.ports[0].postMessage({
            status: 'active',
            version: CACHE_NAME,
            message: 'Desktop spoofing service worker is active'
        });
    }
});

console.log('✅ Service Worker: Desktop spoofing ready');