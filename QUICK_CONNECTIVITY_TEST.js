const { chromium, devices: playwrightDevices } = require('playwright');

class QuickConnectivityTest {
  async testConnection() {
    console.log('\n🔍 QUICK CONNECTIVITY TEST');
    console.log('='.repeat(40));
    
    const browser = await chromium.launch({ 
      headless: false,
      args: ['--disable-web-security', '--no-sandbox']
    });

    const context = await browser.newContext({
      ...playwrightDevices['iPhone 14 Pro'],
      locale: 'en-US'
    });

    const page = await context.newPage();
    
    try {
      console.log('🌐 Testing basic connectivity...');
      
      // Test with shorter timeout and different wait strategy
      await page.goto('https://simpleswap.io', { 
        waitUntil: 'load',
        timeout: 15000 
      });
      
      console.log('✅ Basic connection successful');
      
      // Wait a bit
      await page.waitForTimeout(3000);
      
      // Try with parameters
      console.log('🎯 Testing with parameters...');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'load',
        timeout: 15000 
      });
      
      console.log('✅ Parameter URL successful');
      
      // Quick analysis
      const pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          bodyLength: document.body ? document.body.textContent.length : 0,
          elementCount: document.querySelectorAll('*').length,
          hasEuroAmount: document.body ? document.body.textContent.includes('€') : false,
          hasPolygon: document.body ? document.body.textContent.toLowerCase().includes('pol') : false,
          hasMercuryo: document.body ? document.body.textContent.toLowerCase().includes('mercuryo') : false,
          hasMoonpay: document.body ? document.body.textContent.toLowerCase().includes('moonpay') : false,
          hasExchangeButton: Array.from(document.querySelectorAll('button')).some(btn => 
            btn.textContent && btn.textContent.toLowerCase().includes('exchange'))
        };
      });
      
      console.log('\n📊 PAGE ANALYSIS:');
      console.log(`   Title: ${pageInfo.title}`);
      console.log(`   URL: ${pageInfo.url}`);
      console.log(`   Elements: ${pageInfo.elementCount}`);
      console.log(`   Text length: ${pageInfo.bodyLength}`);
      console.log(`   Has € amount: ${pageInfo.hasEuroAmount}`);
      console.log(`   Has Polygon: ${pageInfo.hasPolygon}`);
      console.log(`   Has Mercuryo: ${pageInfo.hasMercuryo}`);
      console.log(`   Has MoonPay: ${pageInfo.hasMoonpay}`);
      console.log(`   Has Exchange button: ${pageInfo.hasExchangeButton}`);
      
      if (pageInfo.elementCount > 0) {
        console.log('\n✅ Page loaded successfully - proceeding with quick test');
        
        // Quick navigation test
        console.log('\n🚀 Testing navigation to second page...');
        
        try {
          // Try to find and fill wallet input
          const walletInput = await page.$('input[placeholder*="address" i]');
          if (walletInput) {
            await walletInput.fill('0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e');
            console.log('   ✅ Wallet filled');
          }
          
          // Try to click exchange
          const buttons = await page.$$('button');
          for (const button of buttons) {
            const text = await button.textContent();
            if (text && text.toLowerCase().includes('exchange')) {
              console.log('   🔘 Clicking exchange...');
              await button.click();
              await page.waitForTimeout(5000);
              break;
            }
          }
          
          // Check if we're on second page
          const secondPageInfo = await page.evaluate(() => {
            return {
              url: window.location.href,
              hasMercuryo: document.body ? document.body.textContent.toLowerCase().includes('mercuryo') : false,
              hasMoonpay: document.body ? document.body.textContent.toLowerCase().includes('moonpay') : false,
              hasWalletInput: document.querySelectorAll('input[placeholder*="address" i]').length > 0
            };
          });
          
          console.log('\n📊 SECOND PAGE ANALYSIS:');
          console.log(`   URL: ${secondPageInfo.url}`);
          console.log(`   Has Mercuryo: ${secondPageInfo.hasMercuryo}`);
          console.log(`   Has MoonPay: ${secondPageInfo.hasMoonpay}`);
          console.log(`   Has wallet input: ${secondPageInfo.hasWalletInput}`);
          
          if (secondPageInfo.hasMercuryo || secondPageInfo.hasMoonpay) {
            console.log('\n🎉 SUCCESS: Reached provider selection page!');
            
            // Take screenshot
            await page.screenshot({ 
              path: '/Users/nelsonchan/auralo-fix/CONNECTIVITY_SUCCESS.png',
              fullPage: true 
            });
            
            console.log('📸 Screenshot saved: CONNECTIVITY_SUCCESS.png');
            
          } else {
            console.log('\n⚠️ WARNING: May not have reached provider page');
          }
          
        } catch (navError) {
          console.log(`   ❌ Navigation error: ${navError.message}`);
        }
        
      } else {
        console.log('\n❌ Page appears empty or failed to load');
      }
      
    } catch (error) {
      console.error(`❌ Connection test failed: ${error.message}`);
    }
    
    await browser.close();
  }
}

// Run the connectivity test
const tester = new QuickConnectivityTest();
tester.testConnection().catch(error => {
  console.error('Critical connectivity error:', error);
});