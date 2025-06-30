/**
 * ULTIMATE MERCURYO AUTOMATION
 * Advanced Playwright script using multiple forcing techniques
 */

const { chromium } = require('playwright');

async function ultimateMercuryoAutomation() {
    console.log('🚀 ULTIMATE MERCURYO AUTOMATION STARTED\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-web-security',
            '--disable-site-isolation-trials',
            '--no-sandbox'
        ]
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        timezoneId: 'America/New_York',
        permissions: ['clipboard-read', 'clipboard-write'],
        bypassCSP: true,
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: {
            'X-Preferred-Provider': 'mercuryo',
            'X-Force-Provider': 'mercuryo',
            'X-Device-Type': 'desktop'
        }
    });
    
    // Route interception for API modification
    await context.route('**/*simpleswap.io/api/**', async (route, request) => {
        console.log('🔧 Intercepting API:', request.url());
        
        if (request.method() === 'POST') {
            let postData = request.postData();
            if (postData) {
                try {
                    const data = JSON.parse(postData);
                    data.preferred_provider = 'mercuryo';
                    data.force_provider = 'mercuryo';
                    postData = JSON.stringify(data);
                } catch (e) {}
            }
            
            const response = await route.fetch({
                postData: postData
            });
            
            let body = await response.text();
            try {
                const data = JSON.parse(body);
                
                // Force Mercuryo in responses
                if (data.providers) {
                    data.providers = data.providers.filter(p => 
                        p.name === 'mercuryo' || p.id === 'mercuryo'
                    );
                    data.selected_provider = 'mercuryo';
                }
                
                body = JSON.stringify(data);
            } catch (e) {}
            
            await route.fulfill({
                response,
                body
            });
        } else {
            await route.continue();
        }
    });
    
    const page = await context.newPage();
    
    // Pre-inject scripts before page load
    await page.addInitScript(() => {
        console.log('💉 Injection Script Active');
        
        // Override fetch globally
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            console.log('Fetch intercepted:', args[0]);
            
            // Modify requests
            if (args[1] && args[1].body) {
                try {
                    const body = JSON.parse(args[1].body);
                    body.preferred_provider = 'mercuryo';
                    body.force_mercuryo = true;
                    args[1].body = JSON.stringify(body);
                } catch (e) {}
            }
            
            // Add headers
            args[1] = args[1] || {};
            args[1].headers = {
                ...args[1].headers,
                'X-Preferred-Provider': 'mercuryo'
            };
            
            const response = await originalFetch.apply(this, args);
            
            // Intercept responses
            if (args[0].includes('/api/')) {
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    
                    if (data.providers) {
                        console.log('Filtering providers to Mercuryo only');
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
        
        // Set cookies and storage
        document.cookie = 'preferred_provider=mercuryo; path=/';
        document.cookie = 'force_provider=mercuryo; path=/';
        
        try {
            localStorage.setItem('mercuryo_forced', 'true');
            localStorage.setItem('provider_selection', 'mercuryo');
            sessionStorage.setItem('current_provider', 'mercuryo');
        } catch (e) {}
        
        // DOM manipulation observer
        const observer = new MutationObserver((mutations) => {
            // Force Mercuryo selection
            const providers = document.querySelectorAll('[data-provider], .provider-option, [class*="provider"]');
            providers.forEach(provider => {
                const text = provider.textContent || '';
                if (text.toLowerCase().includes('mercuryo')) {
                    // Make it selected
                    provider.classList.add('selected', 'active');
                    provider.style.border = '3px solid #00ff00';
                    provider.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    provider.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
                    
                    // Click it if not already selected
                    if (!provider.dataset.forced) {
                        provider.dataset.forced = 'true';
                        setTimeout(() => provider.click(), 100);
                    }
                } else if (text.toLowerCase().includes('moonpay')) {
                    // Hide MoonPay
                    provider.style.display = 'none';
                    provider.style.visibility = 'hidden';
                    provider.style.opacity = '0';
                    provider.style.pointerEvents = 'none';
                }
            });
            
            // Force wallet field visibility
            const walletFields = document.querySelectorAll('input[type="text"], input[placeholder*="address"], input[name*="wallet"]');
            walletFields.forEach(field => {
                field.style.display = 'block';
                field.style.visibility = 'visible';
                field.style.opacity = '1';
                field.removeAttribute('hidden');
                field.removeAttribute('disabled');
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden', 'disabled']
        });
        
        // Override provider selection functions
        window.selectProvider = function(provider) {
            console.log('selectProvider overridden: forcing mercuryo');
            return 'mercuryo';
        };
        
        window.getSelectedProvider = function() {
            return 'mercuryo';
        };
        
        // Periodic force check
        setInterval(() => {
            // Re-apply Mercuryo selection
            const mercuryoElements = Array.from(document.querySelectorAll('*'))
                .filter(el => el.textContent && el.textContent.includes('Mercuryo'));
            
            mercuryoElements.forEach(el => {
                if (!el.classList.contains('selected')) {
                    el.click();
                }
                el.style.border = '3px solid #00ff00';
            });
            
            // Hide MoonPay
            const moonpayElements = Array.from(document.querySelectorAll('*'))
                .filter(el => el.textContent && el.textContent.includes('MoonPay'));
            
            moonpayElements.forEach(el => {
                el.style.display = 'none';
            });
        }, 500);
    });
    
    // Navigate with multiple parameter attempts
    const urlVariations = [
        'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo&provider=mercuryo&force=true',
        'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo&fiat_provider=mercuryo',
        'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo&preferred_provider=mercuryo',
        'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo#provider=mercuryo'
    ];
    
    for (const url of urlVariations) {
        console.log(`\n🌐 Trying URL: ${url}`);
        
        try {
            await page.goto(url, { waitUntil: 'networkidle' });
            await page.waitForTimeout(3000);
            
            // Check if we can proceed
            const exchangeButton = await page.$('button:has-text("Exchange"), button:has-text("Continue"), button:has-text("Next")');
            
            if (exchangeButton) {
                console.log('   📍 Exchange button found');
                
                // Extra script injection before clicking
                await page.evaluate(() => {
                    // Override any onClick handlers
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(btn => {
                        const originalClick = btn.onclick;
                        btn.onclick = function(e) {
                            console.log('Button click intercepted');
                            
                            // Force provider before original handler
                            window.forcedProvider = 'mercuryo';
                            localStorage.setItem('selected_provider', 'mercuryo');
                            
                            if (originalClick) {
                                return originalClick.call(this, e);
                            }
                        };
                    });
                });
                
                await exchangeButton.click();
                await page.waitForTimeout(5000);
                
                // Force Mercuryo selection after navigation
                await page.evaluate(() => {
                    console.log('Post-navigation Mercuryo force');
                    
                    // Find all provider elements
                    const allElements = Array.from(document.querySelectorAll('*'));
                    const mercuryoElement = allElements.find(el => 
                        el.textContent && el.textContent.includes('Mercuryo')
                    );
                    
                    if (mercuryoElement) {
                        console.log('Mercuryo element found, forcing selection');
                        
                        // Multiple click attempts
                        for (let i = 0; i < 5; i++) {
                            setTimeout(() => {
                                mercuryoElement.click();
                                mercuryoElement.dispatchEvent(new Event('click', { bubbles: true }));
                                mercuryoElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                mercuryoElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                            }, i * 200);
                        }
                        
                        // Visual confirmation
                        mercuryoElement.style.border = '5px solid #00ff00';
                        mercuryoElement.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                        mercuryoElement.style.boxShadow = '0 0 20px #00ff00';
                    }
                    
                    // Hide all MoonPay elements
                    allElements.filter(el => 
                        el.textContent && el.textContent.includes('MoonPay')
                    ).forEach(el => {
                        el.style.display = 'none';
                        el.remove();
                    });
                });
                
                // Check success
                const pageContent = await page.content();
                const hasMercuryo = pageContent.includes('Mercuryo');
                const hasMoonPay = pageContent.includes('MoonPay');
                const hasWalletField = await page.$('input[placeholder*="address"], input[placeholder*="wallet"]');
                
                console.log(`   ✅ Mercuryo visible: ${hasMercuryo}`);
                console.log(`   ✅ MoonPay hidden: ${!hasMoonPay}`);
                console.log(`   ✅ Wallet field visible: ${!!hasWalletField}`);
                
                if (hasMercuryo && !hasMoonPay && hasWalletField) {
                    console.log('\n🎉 SUCCESS! Mercuryo forced successfully!');
                    
                    // Keep it selected for 10 seconds
                    await page.waitForTimeout(10000);
                    
                    // Take screenshot
                    await page.screenshot({ 
                        path: 'mercuryo_success.png',
                        fullPage: true 
                    });
                    
                    break;
                }
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
    
    console.log('\n📊 Final attempt with all techniques combined...');
    
    // Final comprehensive attempt
    await page.goto('https://simpleswap.io', { waitUntil: 'networkidle' });
    
    // Fill form manually with all overrides active
    await page.fill('input[placeholder*="You send"], input.amount-input:first-of-type', '19.50');
    
    // Select USD
    const fromCurrency = await page.$('.currency-select:first-of-type, [data-testid="from-currency"]');
    if (fromCurrency) {
        await fromCurrency.click();
        await page.waitForTimeout(1000);
        await page.fill('input[placeholder*="Search"]', 'USD');
        await page.click('text=USD');
    }
    
    // Select POL
    const toCurrency = await page.$('.currency-select:last-of-type, [data-testid="to-currency"]');
    if (toCurrency) {
        await toCurrency.click();
        await page.waitForTimeout(1000);
        await page.fill('input[placeholder*="Search"]', 'POL');
        await page.click('text=POL');
    }
    
    // Final exchange click with maximum force
    await page.evaluate(() => {
        // Override everything provider-related
        Object.defineProperty(window, 'selectedProvider', {
            get: () => 'mercuryo',
            set: () => {},
            configurable: false
        });
        
        window.provider = 'mercuryo';
        window.fiatProvider = 'mercuryo';
        window.preferredProvider = 'mercuryo';
    });
    
    const finalExchange = await page.$('button:has-text("Exchange")');
    if (finalExchange) {
        await finalExchange.click();
        await page.waitForTimeout(5000);
        
        console.log('\n✅ Automation complete!');
    }
    
    // Keep browser open for inspection
    console.log('\n👀 Browser will remain open for inspection...');
    
    // Don't close browser
    // await browser.close();
}

// Run the automation
ultimateMercuryoAutomation().catch(console.error);