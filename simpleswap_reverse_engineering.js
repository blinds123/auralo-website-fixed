/**
 * SIMPLESWAP REVERSE ENGINEERING & API DISCOVERY
 * Comprehensive analysis to find hidden parameters and undocumented features
 */

const { chromium } = require('playwright');

async function reverseEngineerSimpleSwap() {
    console.log('🔍 SIMPLESWAP REVERSE ENGINEERING STARTED\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true // Open DevTools
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    });
    
    // Intercept all network requests
    const apiCalls = [];
    const resources = [];
    
    context.on('request', request => {
        const url = request.url();
        if (url.includes('simpleswap.io')) {
            console.log(`📡 Request: ${request.method()} ${url}`);
            
            // Log request headers
            const headers = request.headers();
            if (Object.keys(headers).length > 0) {
                console.log('   Headers:', headers);
            }
            
            // Log POST data
            if (request.method() === 'POST') {
                const postData = request.postData();
                if (postData) {
                    console.log('   Body:', postData);
                }
            }
            
            apiCalls.push({
                method: request.method(),
                url: url,
                headers: headers,
                postData: request.postData()
            });
        }
    });
    
    context.on('response', response => {
        const url = response.url();
        if (url.includes('simpleswap.io')) {
            console.log(`📥 Response: ${response.status()} ${url}`);
        }
    });
    
    const page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        if (msg.type() === 'log') {
            console.log('🖥️ Console:', msg.text());
        }
    });
    
    // Inject comprehensive monitoring script
    await page.addInitScript(() => {
        console.log('🔬 SimpleSwap Monitor Injected');
        
        // Monitor window object changes
        const windowProps = new Set(Object.keys(window));
        setInterval(() => {
            const currentProps = Object.keys(window);
            currentProps.forEach(prop => {
                if (!windowProps.has(prop)) {
                    console.log('New window property:', prop, window[prop]);
                    windowProps.add(prop);
                    
                    // Check if it's SimpleSwap related
                    if (prop.toLowerCase().includes('swap') || 
                        prop.toLowerCase().includes('provider') ||
                        prop.toLowerCase().includes('mercuryo')) {
                        console.log('🎯 SimpleSwap property found:', prop);
                    }
                }
            });
        }, 1000);
        
        // Monitor localStorage
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            console.log('localStorage.setItem:', key, '=', value);
            return originalSetItem.call(this, key, value);
        };
        
        // Monitor fetch calls
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            console.log('Fetch:', args[0]);
            if (args[1] && args[1].body) {
                console.log('Fetch body:', args[1].body);
            }
            
            const response = await originalFetch.apply(this, args);
            const clonedResponse = response.clone();
            
            try {
                const data = await clonedResponse.json();
                console.log('Fetch response:', data);
                
                // Look for provider information
                if (data.providers || data.provider || data.fiat_providers) {
                    console.log('🎯 Provider data found:', data);
                }
            } catch (e) {}
            
            return response;
        };
        
        // Monitor XHR
        const XHR = XMLHttpRequest.prototype;
        const originalOpen = XHR.open;
        const originalSend = XHR.send;
        
        XHR.open = function(method, url) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, arguments);
        };
        
        XHR.send = function(data) {
            console.log('XHR:', this._method, this._url);
            if (data) console.log('XHR data:', data);
            
            this.addEventListener('load', function() {
                console.log('XHR response:', this.responseText);
            });
            
            return originalSend.apply(this, arguments);
        };
        
        // Monitor WebSocket connections
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            console.log('WebSocket connection:', url);
            
            const ws = new originalWebSocket(url, protocols);
            
            ws.addEventListener('message', function(event) {
                console.log('WebSocket message:', event.data);
            });
            
            const originalSend = ws.send;
            ws.send = function(data) {
                console.log('WebSocket send:', data);
                return originalSend.call(this, data);
            };
            
            return ws;
        };
        
        // Look for global SimpleSwap objects
        setTimeout(() => {
            const swapRelated = Object.keys(window).filter(key => 
                key.toLowerCase().includes('swap') || 
                key.toLowerCase().includes('simple') ||
                key.toLowerCase().includes('provider')
            );
            
            if (swapRelated.length > 0) {
                console.log('🎯 SimpleSwap related globals:', swapRelated);
                swapRelated.forEach(key => {
                    console.log(`  ${key}:`, window[key]);
                });
            }
        }, 3000);
    });
    
    // Test various URL parameters
    console.log('\n📊 Testing URL Parameters...\n');
    
    const urlTests = [
        // Hidden parameters
        '?from=usd&to=pol&amount=20&partner=auralo&provider=mercuryo&force=true',
        '?from=usd&to=pol&amount=20&partner=auralo&fiat_provider=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&preferred_provider=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&default_provider=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&p=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&fp=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&provider_id=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&gateway=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&payment_method=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&pm=mercuryo',
        
        // Configuration parameters
        '?from=usd&to=pol&amount=20&partner=auralo&config=mercuryo_only',
        '?from=usd&to=pol&amount=20&partner=auralo&mode=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&preset=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&theme=mercuryo',
        
        // Debug/dev parameters
        '?from=usd&to=pol&amount=20&partner=auralo&debug=true&provider=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&dev=true&force_mercuryo=1',
        '?from=usd&to=pol&amount=20&partner=auralo&test=mercuryo',
        
        // Multiple provider parameters
        '?from=usd&to=pol&amount=20&partner=auralo&providers=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&enabled_providers=mercuryo',
        '?from=usd&to=pol&amount=20&partner=auralo&disabled_providers=moonpay',
        '?from=usd&to=pol&amount=20&partner=auralo&hide_providers=moonpay',
        
        // Hash parameters
        '#provider=mercuryo&force=true',
        '#mercuryo=true&moonpay=false',
        '#fiat_provider=mercuryo'
    ];
    
    for (const params of urlTests) {
        console.log(`\n🧪 Testing: ${params}`);
        
        try {
            await page.goto(`https://simpleswap.io${params}`, {
                waitUntil: 'networkidle'
            });
            
            // Wait a bit for any redirects or dynamic loading
            await page.waitForTimeout(2000);
            
            // Check final URL
            const finalUrl = page.url();
            if (finalUrl !== `https://simpleswap.io${params}`) {
                console.log(`   ↪️ Redirected to: ${finalUrl}`);
            }
            
            // Check for errors
            const errorElement = await page.$('.error, .warning, [class*="error"], [class*="warning"]');
            if (errorElement) {
                const errorText = await errorElement.textContent();
                console.log(`   ⚠️ Error found: ${errorText}`);
            }
            
            // Look for provider elements
            const pageContent = await page.content();
            const hasMercuryo = pageContent.toLowerCase().includes('mercuryo');
            const hasMoonPay = pageContent.toLowerCase().includes('moonpay');
            
            console.log(`   📍 Mercuryo: ${hasMercuryo ? '✅' : '❌'}`);
            console.log(`   📍 MoonPay: ${hasMoonPay ? '✅' : '❌'}`);
            
            // Try clicking exchange if available
            const exchangeButton = await page.$('button:has-text("Exchange"), button:has-text("Continue")');
            if (exchangeButton) {
                await exchangeButton.click();
                await page.waitForTimeout(3000);
                
                // Check providers on second page
                const secondPageContent = await page.content();
                const mercuryoAfter = secondPageContent.toLowerCase().includes('mercuryo');
                const moonPayAfter = secondPageContent.toLowerCase().includes('moonpay');
                
                console.log(`   📍 After Exchange - Mercuryo: ${mercuryoAfter ? '✅' : '❌'}`);
                console.log(`   📍 After Exchange - MoonPay: ${moonPayAfter ? '✅' : '❌'}`);
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
    
    // Extract JavaScript files
    console.log('\n📜 Analyzing JavaScript Files...\n');
    
    const scripts = await page.$$eval('script[src]', scripts => 
        scripts.map(s => s.src).filter(src => src.includes('simpleswap.io'))
    );
    
    for (const scriptUrl of scripts) {
        console.log(`📄 Script: ${scriptUrl}`);
        
        try {
            const response = await page.goto(scriptUrl);
            const scriptContent = await response.text();
            
            // Search for provider-related code
            const providerPatterns = [
                /provider[s]?[:=]\s*['"]([^'"]+)['"]/gi,
                /mercuryo/gi,
                /moonpay/gi,
                /fiat_provider/gi,
                /payment_method/gi,
                /gateway/gi
            ];
            
            providerPatterns.forEach(pattern => {
                const matches = scriptContent.match(pattern);
                if (matches) {
                    console.log(`   Found: ${matches.slice(0, 3).join(', ')}...`);
                }
            });
            
            // Look for configuration objects
            const configPattern = /config[uration]?\s*[:=]\s*\{([^}]+)\}/gi;
            const configMatches = scriptContent.match(configPattern);
            if (configMatches) {
                console.log('   Config objects found:', configMatches.length);
            }
            
        } catch (error) {
            console.log(`   ❌ Failed to analyze: ${error.message}`);
        }
    }
    
    // Save API calls for analysis
    console.log('\n📊 API Calls Summary:\n');
    const uniqueEndpoints = new Set();
    apiCalls.forEach(call => {
        const url = new URL(call.url);
        uniqueEndpoints.add(url.pathname);
    });
    
    console.log('Unique endpoints:');
    uniqueEndpoints.forEach(endpoint => {
        console.log(`  - ${endpoint}`);
    });
    
    await browser.close();
    console.log('\n✅ Reverse engineering complete!');
    
    return {
        apiCalls,
        uniqueEndpoints: Array.from(uniqueEndpoints)
    };
}

// Additional function to test API endpoints directly
async function testSimpleSwapAPIs() {
    console.log('\n🔌 Testing SimpleSwap API Endpoints Directly...\n');
    
    const fetch = require('node-fetch');
    
    const apiEndpoints = [
        '/api/v1/providers',
        '/api/v1/fiat-providers',
        '/api/v1/payment-methods',
        '/api/v1/exchange',
        '/api/v1/currencies',
        '/api/v1/pairs',
        '/api/v1/settings',
        '/api/v1/config',
        '/api/providers/list',
        '/api/providers/available',
        '/api/fiat/providers',
        '/api/fiat/methods'
    ];
    
    for (const endpoint of apiEndpoints) {
        console.log(`\n🧪 Testing: ${endpoint}`);
        
        try {
            const response = await fetch(`https://simpleswap.io${endpoint}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            console.log(`   Status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('   Response:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
}

// Run the reverse engineering
reverseEngineerSimpleSwap()
    .then(() => testSimpleSwapAPIs())
    .catch(console.error);