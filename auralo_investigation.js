const { chromium, devices } = require('playwright');

async function investigateAuralo() {
  console.log('🔍 INVESTIGATING AURALO WEBSITE BUTTON BEHAVIOR');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--enable-features=TouchEvents', '--disable-web-security', '--enable-touch-events']
  });

  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    locale: 'en-AU',
    timezoneId: 'Australia/Sydney'
  });

  const page = await context.newPage();
  
  try {
    console.log('📱 1. Navigating to Auralo website...');
    await page.goto('https://auralo-website-fixed.netlify.app', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('📱 2. Analyzing page structure...');
    
    // Get all buttons and links
    const allButtons = await page.evaluate(() => {
      const elements = [];
      
      // Get all clickable elements
      document.querySelectorAll('button, a, [role="button"], [onclick], input[type="submit"], input[type="button"]').forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        
        elements.push({
          index,
          tag: el.tagName,
          text: el.textContent?.trim() || '',
          id: el.id || '',
          className: el.className || '',
          href: el.href || '',
          onclick: el.onclick ? el.onclick.toString() : '',
          type: el.type || '',
          visible: rect.width > 0 && rect.height > 0,
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          }
        });
      });
      
      return elements;
    });
    
    console.log(`📊 Found ${allButtons.length} clickable elements:`);
    
    allButtons.forEach((btn, i) => {
      if (btn.visible && (btn.text.toLowerCase().includes('buy') || 
                         btn.text.toLowerCase().includes('exchange') || 
                         btn.text.toLowerCase().includes('coupon') || 
                         btn.text.toLowerCase().includes('complete') ||
                         btn.href.includes('simpleswap'))) {
        console.log(`  ${i + 1}. ${btn.tag} "${btn.text}"`);
        console.log(`     ID: ${btn.id}, Class: ${btn.className}`);
        console.log(`     Href: ${btn.href}`);
        console.log(`     OnClick: ${btn.onclick}`);
        console.log(`     Position: ${btn.position.top}px from top`);
      }
    });
    
    console.log('\n📱 3. Scrolling to bottom...');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(2000);
    
    console.log('📱 4. Looking for buy button...');
    
    // Try different ways to find the button
    const buttonSearchResults = await page.evaluate(() => {
      const results = {
        byText: [],
        byHref: [],
        byClass: [],
        byId: []
      };
      
      // Search by text content
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('copy your custom coupon code') || 
            text.includes('complete your exchange') ||
            text.includes('buy') && text.includes('exchange')) {
          
          const rect = el.getBoundingClientRect();
          results.byText.push({
            tag: el.tagName,
            text: el.textContent?.trim(),
            id: el.id,
            className: el.className,
            href: el.href || '',
            visible: rect.width > 0 && rect.height > 0,
            position: rect.top
          });
        }
      });
      
      // Search by href
      document.querySelectorAll('a[href*="simpleswap"], [href*="simpleswap"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        results.byHref.push({
          tag: el.tagName,
          text: el.textContent?.trim(),
          href: el.href,
          visible: rect.width > 0 && rect.height > 0
        });
      });
      
      // Search by class names
      document.querySelectorAll('[class*="buy"], [class*="exchange"], [class*="button"]').forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('buy') || text.includes('exchange') || text.includes('coupon')) {
          const rect = el.getBoundingClientRect();
          results.byClass.push({
            tag: el.tagName,
            text: el.textContent?.trim(),
            className: el.className,
            visible: rect.width > 0 && rect.height > 0
          });
        }
      });
      
      return results;
    });
    
    console.log('\n📊 Button search results:');
    console.log(`  By text: ${buttonSearchResults.byText.length} elements`);
    console.log(`  By href: ${buttonSearchResults.byHref.length} elements`);
    console.log(`  By class: ${buttonSearchResults.byClass.length} elements`);
    
    buttonSearchResults.byText.forEach((btn, i) => {
      console.log(`  Text ${i + 1}: ${btn.tag} "${btn.text}" (visible: ${btn.visible})`);
    });
    
    buttonSearchResults.byHref.forEach((btn, i) => {
      console.log(`  Href ${i + 1}: ${btn.tag} "${btn.text}" -> ${btn.href}`);
    });
    
    console.log('\n📱 5. Testing button click behavior...');
    
    // Try to find and click the actual button
    const buyButtonSelectors = [
      'text="copy your custom coupon code & complete your exchange"',
      '*:has-text("copy your custom coupon code & complete your exchange")',
      'button:has-text("copy your custom coupon code")',
      'a:has-text("copy your custom coupon code")',
      '*:has-text("complete your exchange")',
      '[href*="simpleswap"]'
    ];
    
    for (const selector of buyButtonSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          console.log(`✅ Found element with selector: ${selector}`);
          
          // Get element details
          const elementInfo = await page.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              text: el.textContent?.trim(),
              id: el.id,
              className: el.className,
              href: el.href || '',
              onclick: el.onclick ? el.onclick.toString() : '',
              addEventListener: el.getAttribute('onclick') || '',
              visible: rect.width > 0 && rect.height > 0,
              position: rect.top,
              styles: window.getComputedStyle(el).display
            };
          }, element);
          
          console.log(`  Element info:`, elementInfo);
          
          // Test clicking
          console.log(`  🖱️  Testing click...`);
          
          // Listen for navigation
          const navigationPromise = page.waitForNavigation({ timeout: 5000 }).catch(() => null);
          const newPagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
          
          await element.click();
          
          // Wait for potential navigation
          await Promise.race([navigationPromise, newPagePromise, page.waitForTimeout(3000)]);
          
          const currentUrl = page.url();
          console.log(`  Current URL after click: ${currentUrl}`);
          
          // Check for new pages
          const pages = context.pages();
          console.log(`  Total pages open: ${pages.length}`);
          
          if (pages.length > 1) {
            const newPage = pages[pages.length - 1];
            const newPageUrl = newPage.url();
            console.log(`  New page URL: ${newPageUrl}`);
            
            if (newPageUrl.includes('simpleswap')) {
              console.log(`  🎉 SUCCESS! SimpleSwap page opened!`);
              
              // Analyze the SimpleSwap page quickly
              await newPage.waitForTimeout(3000);
              const simpleSwapAnalysis = await newPage.evaluate(() => {
                const mercuryoCount = (document.body.textContent || '').toLowerCase().split('mercuryo').length - 1;
                const moonpayCount = (document.body.textContent || '').toLowerCase().split('moonpay').length - 1;
                
                return {
                  url: window.location.href,
                  title: document.title,
                  mercuryoMentions: mercuryoCount,
                  moonpayMentions: moonpayCount
                };
              });
              
              console.log(`  📊 SimpleSwap page analysis:`, simpleSwapAnalysis);
              
              await newPage.screenshot({ path: 'simpleswap_success.png', fullPage: true });
            }
          }
          
          break;
        }
      } catch (e) {
        console.log(`  ❌ Selector ${selector} failed: ${e.message}`);
      }
    }
    
    // Take full page screenshot for analysis
    await page.screenshot({ path: 'auralo_full_analysis.png', fullPage: true });
    console.log('📸 Full page screenshot saved as auralo_full_analysis.png');
    
  } catch (error) {
    console.error('Investigation error:', error);
  }
  
  await browser.close();
}

investigateAuralo();