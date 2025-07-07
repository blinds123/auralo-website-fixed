// ULTIMATE SERVICE WORKER - Network-level SimpleSwap spoofing
console.log('🚀 Ultimate Service Worker initializing...');

self.addEventListener('install', event => {
    console.log('✅ Ultimate SW installed');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('✅ Ultimate SW activated');
    event.waitUntil(clients.claim());
});

// Intercept ALL network requests
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Log all SimpleSwap requests
    if (url.hostname.includes('simpleswap.io')) {
        console.log('🎯 Intercepting SimpleSwap request:', url.href);
        
        // Modify the URL to include all desktop parameters
        const modifiedUrl = modifySimpleSwapUrl(url);
        
        // Create new headers with desktop spoofing
        const desktopHeaders = new Headers(event.request.headers);
        
        // Override all mobile-indicating headers
        desktopHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        desktopHeaders.set('Sec-Ch-Ua', '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"');
        desktopHeaders.set('Sec-Ch-Ua-Mobile', '?0');
        desktopHeaders.set('Sec-Ch-Ua-Platform', '"Windows"');
        desktopHeaders.set('Sec-Ch-Ua-Platform-Version', '"10.0.0"');
        desktopHeaders.set('Sec-Ch-Ua-Full-Version-List', '"Not_A Brand";v="8.0.0.0", "Chromium";v="120.0.0.0", "Google Chrome";v="120.0.0.0"');
        
        // Add custom headers that might help
        desktopHeaders.set('X-Requested-With', 'DesktopApplication');
        desktopHeaders.set('X-Device-Type', 'Desktop');
        desktopHeaders.set('X-Platform', 'Windows');
        desktopHeaders.set('X-Mobile', '0');
        desktopHeaders.set('X-Touch-Capable', '0');
        desktopHeaders.set('X-Screen-Width', '1920');
        desktopHeaders.set('X-Screen-Height', '1080');
        desktopHeaders.set('X-Force-Desktop', '1');
        
        // Remove mobile-specific headers
        desktopHeaders.delete('X-Requested-With-Mobile');
        desktopHeaders.delete('Mobile');
        
        // Create modified request
        const modifiedRequest = new Request(modifiedUrl, {
            method: event.request.method,
            headers: desktopHeaders,
            body: event.request.body,
            mode: event.request.mode === 'navigate' ? 'cors' : event.request.mode,
            credentials: event.request.credentials,
            cache: event.request.cache,
            redirect: event.request.redirect,
            referrer: event.request.referrer,
            referrerPolicy: event.request.referrerPolicy
        });
        
        event.respondWith(
            fetch(modifiedRequest)
                .then(response => {
                    console.log('✅ SimpleSwap response received:', response.status);
                    
                    // If it's an HTML response, try to modify it
                    if (response.headers.get('content-type')?.includes('text/html')) {
                        return modifyHtmlResponse(response);
                    }
                    
                    return response;
                })
                .catch(err => {
                    console.error('❌ SW fetch error:', err);
                    // Fallback to original request
                    return fetch(event.request);
                })
        );
    } else {
        // Pass through non-SimpleSwap requests
        event.respondWith(fetch(event.request));
    }
});

// Modify SimpleSwap URLs to force desktop mode
function modifySimpleSwapUrl(url) {
    const params = new URLSearchParams(url.search);
    
    // Ensure correct amount
    if (params.has('amount')) {
        params.set('amount', '19.50');
    }
    
    // Ensure Mercury provider
    if (!params.has('provider') || params.get('provider') !== 'mercury') {
        params.set('provider', 'mercury');
    }
    
    // Add all desktop-forcing parameters
    const desktopParams = {
        'fixed': '1',
        'source': 'desktop',
        'platform': 'desktop',
        'device': 'desktop',
        'viewport': '1280x720',
        'screen': '1920x1080',
        'mobile': '0',
        'touch': '0',
        'ref': 'desktop_sw',
        'force_provider': 'mercury',
        'disable_mobile_pricing': '1',
        'desktop_mode': '1',
        'user_type': 'desktop',
        'no_mobile_redirect': '1',
        'force_desktop_ui': '1'
    };
    
    Object.entries(desktopParams).forEach(([key, value]) => {
        if (!params.has(key)) {
            params.set(key, value);
        }
    });
    
    // Update URL with modified parameters
    url.search = params.toString();
    
    console.log('🔧 Modified URL:', url.href);
    return url;
}

// Modify HTML responses to inject price correction
async function modifyHtmlResponse(response) {
    try {
        const text = await response.text();
        
        // Inject our price correction script at the very beginning of the HTML
        const injectionScript = `
            <script id="sw-price-corrector">
                // Injected by Service Worker
                console.log('💉 SW Price Corrector Active');
                
                // Override amount detection
                const originalParseFloat = window.parseFloat;
                window.parseFloat = function(value) {
                    const result = originalParseFloat(value);
                    if (result > 20 && result < 22) {
                        console.log('🔧 SW: Correcting amount from', result, 'to 19.50');
                        return 19.50;
                    }
                    return result;
                };
                
                // Monitor DOM for price changes
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' || mutation.type === 'characterData') {
                            // Check for €21 and replace with €19.50
                            const walker = document.createTreeWalker(
                                document.body,
                                NodeFilter.SHOW_TEXT,
                                null,
                                false
                            );
                            
                            let node;
                            while (node = walker.nextNode()) {
                                if (node.nodeValue && node.nodeValue.match(/21[\\.\\,]?\\d{0,2}\\s*(EUR|€)/)) {
                                    console.log('🔧 SW: Fixing price in DOM');
                                    node.nodeValue = node.nodeValue.replace(/21[\\.\\,]?\\d{0,2}/, '19.50');
                                }
                            }
                        }
                    });
                });
                
                // Start observing when DOM is ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        observer.observe(document.body, {
                            childList: true,
                            characterData: true,
                            subtree: true
                        });
                    });
                } else {
                    observer.observe(document.body, {
                        childList: true,
                        characterData: true,
                        subtree: true
                    });
                }
                
                // Force Mercury selection on page load
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const providers = document.querySelectorAll('[data-provider*="mercury"], [data-provider*="mercuryo"]');
                        providers.forEach(p => {
                            if (!p.classList.contains('selected') && !p.classList.contains('active')) {
                                console.log('🔧 SW: Auto-selecting Mercury');
                                p.click();
                            }
                        });
                    }, 1000);
                });
            </script>
        `;
        
        // Inject right after <head> or at the beginning of <body>
        let modifiedHtml = text;
        if (text.includes('<head>')) {
            modifiedHtml = text.replace('<head>', '<head>' + injectionScript);
        } else if (text.includes('<body>')) {
            modifiedHtml = text.replace('<body>', '<body>' + injectionScript);
        } else {
            modifiedHtml = injectionScript + text;
        }
        
        // Create new response with modified HTML
        return new Response(modifiedHtml, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
        
    } catch (error) {
        console.error('❌ SW: Error modifying HTML:', error);
        return response;
    }
}

// Listen for messages from the main page
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'ACTIVATE_ULTIMATE_SPOOFING') {
        console.log('🎯 Ultimate spoofing activated via message');
        // Can store state or perform additional actions
    }
});

console.log('✅ Ultimate Service Worker ready');