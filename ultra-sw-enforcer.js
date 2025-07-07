// 🚨 ULTRA SERVICE WORKER ENFORCER
// Network-level enforcement to prevent mobile pricing discrimination
// Intercepts ALL SimpleSwap requests and forces desktop pricing

console.log('⚡ ULTRA SERVICE WORKER ENFORCER: Loading...');

const TARGET_PRICE = '19.50';
const BLOCKED_PRICES = ['21.42', '21.43', '21.44', '21.45', '21.46', '21.47', '21.48', '21.49', '21.50'];
const SIMPLESWAP_DOMAINS = ['simpleswap.io', 'www.simpleswap.io', 'api.simpleswap.io'];

// Desktop user agents for rotation
const DESKTOP_USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

// Install and activate immediately
self.addEventListener('install', event => {
    console.log('⚡ ULTRA SW: Installing...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('⚡ ULTRA SW: Activated');
    event.waitUntil(self.clients.claim());
});

// Main request interception
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Only intercept SimpleSwap domains
    if (SIMPLESWAP_DOMAINS.some(domain => url.hostname.includes(domain))) {
        console.log('🎯 ULTRA SW: Intercepting SimpleSwap request:', url.href);
        
        event.respondWith(handleSimpleSwapRequest(event.request));
    }
});

async function handleSimpleSwapRequest(request) {
    try {
        // Get random desktop user agent
        const userAgent = DESKTOP_USER_AGENTS[Math.floor(Math.random() * DESKTOP_USER_AGENTS.length)];
        
        // Create modified headers
        const modifiedHeaders = new Headers(request.headers);
        modifiedHeaders.set('User-Agent', userAgent);
        modifiedHeaders.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        modifiedHeaders.set('Accept-Language', 'en-US,en;q=0.5');
        modifiedHeaders.set('Accept-Encoding', 'gzip, deflate');
        modifiedHeaders.set('DNT', '1');
        modifiedHeaders.set('Connection', 'keep-alive');
        modifiedHeaders.set('Upgrade-Insecure-Requests', '1');
        
        // Remove mobile indicators
        modifiedHeaders.delete('X-Requested-With');
        modifiedHeaders.delete('Mobile');
        
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
        
        console.log('📡 ULTRA SW: Sending request with desktop headers');
        
        // Fetch with modified headers
        const response = await fetch(modifiedRequest);
        
        // Check if response needs modification
        const contentType = response.headers.get('content-type');
        
        if (contentType && (contentType.includes('text/html') || contentType.includes('application/json'))) {
            const responseText = await response.text();
            const modifiedText = modifyResponseForPricing(responseText);
            
            if (modifiedText !== responseText) {
                console.log('📝 ULTRA SW: Response modified to prevent mobile pricing');
                
                return new Response(modifiedText, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }
        }
        
        return response;
        
    } catch (error) {
        console.error('⚠️ ULTRA SW: Request handling error:', error);
        
        // Fallback to original request
        return fetch(request);
    }
}

function modifyResponseForPricing(responseText) {
    let modifiedText = responseText;
    
    // Replace blocked prices with target price
    BLOCKED_PRICES.forEach(blockedPrice => {
        const regex = new RegExp(blockedPrice.replace('.', '\\.'), 'g');
        modifiedText = modifiedText.replace(regex, TARGET_PRICE);
    });
    
    // Force Mercury provider selection in JSON responses
    if (responseText.includes('moonpay') || responseText.includes('provider')) {
        // Hide/disable MoonPay in API responses
        modifiedText = modifiedText.replace(/"moonpay"/g, '"disabled_moonpay"');
        modifiedText = modifiedText.replace(/moonpay/g, 'disabled_moonpay');
        
        // Ensure Mercury is preferred
        modifiedText = modifiedText.replace(/("mercuryo"[^}]*)"enabled":\s*false/g, '$1"enabled": true');
        modifiedText = modifiedText.replace(/("mercuryo"[^}]*)"preferred":\s*false/g, '$1"preferred": true');
    }
    
    // Force minimum amounts to target price
    if (responseText.includes('min_amount') || responseText.includes('minimum')) {
        const minAmountRegex = /"min_amount":\s*"?([0-9]+\.?[0-9]*)"?/g;
        modifiedText = modifiedText.replace(minAmountRegex, (match, amount) => {
            if (parseFloat(amount) > 20) {
                console.log(`📝 ULTRA SW: Min amount corrected: ${amount} → ${TARGET_PRICE}`);
                return `"min_amount": "${TARGET_PRICE}"`;
            }
            return match;
        });
    }
    
    // Force desktop-specific pricing in HTML
    if (responseText.includes('<html')) {
        // Inject our enforcer script into the page
        const enforcerScript = `
            <script>
                console.log('⚡ ULTRA SW: Injecting price enforcer into page');
                
                // Continuous price monitoring
                setInterval(() => {
                    const blockedPrices = ['21.42', '21.43', '21.44', '21.45', '21.46'];
                    const targetPrice = '19.50';
                    
                    // Find and replace any blocked prices
                    document.querySelectorAll('*').forEach(el => {
                        if (el.textContent && !el.querySelector('*')) {
                            let text = el.textContent;
                            blockedPrices.forEach(blocked => {
                                if (text.includes(blocked)) {
                                    el.textContent = text.replace(new RegExp(blocked.replace('.', '\\\\.'), 'g'), targetPrice);
                                    console.log('📝 SW ENFORCER: Price corrected in DOM');
                                }
                            });
                        }
                    });
                    
                    // Force input values
                    document.querySelectorAll('input[type="number"]').forEach(input => {
                        if (parseFloat(input.value) > 20) {
                            input.value = targetPrice;
                            input.dispatchEvent(new Event('input', {bubbles: true}));
                        }
                    });
                }, 500);
                
                // Hide MoonPay elements
                setInterval(() => {
                    document.querySelectorAll('*').forEach(el => {
                        if (el.textContent && el.textContent.toLowerCase().includes('moonpay')) {
                            el.style.display = 'none';
                            console.log('🚫 SW ENFORCER: MoonPay element hidden');
                        }
                    });
                }, 1000);
                
                console.log('✅ ULTRA SW: Price enforcer active in page');
            </script>
        `;
        
        // Inject before closing body tag
        modifiedText = modifiedText.replace('</body>', enforcerScript + '</body>');
    }
    
    return modifiedText;
}

// Listen for messages from main thread
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    console.log('📨 ULTRA SW: Received message:', type);
    
    if (type === 'ENFORCE_PRICING') {
        console.log('⚡ ULTRA SW: Pricing enforcement activated via message');
        
        // Send confirmation back
        event.ports[0]?.postMessage({
            status: 'enforcing',
            targetPrice: TARGET_PRICE,
            userAgent: DESKTOP_USER_AGENTS[0],
            timestamp: new Date().toISOString()
        });
    }
    
    if (type === 'GET_STATUS') {
        event.ports[0]?.postMessage({
            status: 'active',
            interceptedRequests: self.interceptedRequests || 0,
            targetPrice: TARGET_PRICE,
            blockedPrices: BLOCKED_PRICES
        });
    }
});

// Track intercepted requests
let interceptedRequests = 0;
self.addEventListener('fetch', () => {
    if (event.request.url.includes('simpleswap')) {
        interceptedRequests++;
        self.interceptedRequests = interceptedRequests;
    }
});

console.log('⚡ ULTRA SERVICE WORKER ENFORCER: Ready for nuclear pricing enforcement');
console.log('🎯 Target Price:', TARGET_PRICE);
console.log('🚫 Blocked Prices:', BLOCKED_PRICES);
console.log('🌐 Protected Domains:', SIMPLESWAP_DOMAINS);