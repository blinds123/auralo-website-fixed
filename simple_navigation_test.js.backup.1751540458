const { chromium, devices: playwrightDevices } = require('playwright');

class SimpleNavigationTest {
  constructor() {
    this.attemptNumber = 1;
  }

  async testNavigation() {
    console.log(`\n🎯 SIMPLE NAVIGATION TEST - ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(70));
    
    const browser = await chromium.launch({ 
      headless: false,
      args: [
        '--enable-features=TouchEvents',
        '--disable-web-security', 
        '--enable-touch-events',
        '--no-sandbox'
      ]
    });

    const context = await browser.newContext({
      ...playwrightDevices['iPhone 14 Pro'],
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      // STEP 1: Navigate to SimpleSwap
      console.log(`  🚀 Step 1: Loading SimpleSwap EUR → POL (15 EUR)...`);
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(5000);
      
      console.log(`  📄 Current URL: ${page.url()}`);
      console.log(`  📄 Page title: ${await page.title()}`);
      
      // STEP 2: Analyze the page content
      const pageAnalysis = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const inputs = Array.from(document.querySelectorAll('input'));
        
        return {
          pageText: document.body.textContent.substring(0, 500),
          buttonTexts: buttons.map(b => b.textContent?.trim()).filter(t => t),
          inputPlaceholders: inputs.map(i => ({
            type: i.type,
            placeholder: i.placeholder,
            name: i.name,
            value: i.value
          })),
          hasExchangeInText: document.body.textContent.toLowerCase().includes('exchange'),
          hasCurrencyPairs: document.body.textContent.toLowerCase().includes('eur') && 
                           document.body.textContent.toLowerCase().includes('pol')
        };
      });
      
      console.log(`  📊 Page Analysis:`);
      console.log(`     Has exchange text: ${pageAnalysis.hasExchangeInText}`);
      console.log(`     Has currency pairs: ${pageAnalysis.hasCurrencyPairs}`);
      console.log(`     Button texts: ${pageAnalysis.buttonTexts.slice(0, 5).join(', ')}${pageAnalysis.buttonTexts.length > 5 ? '...' : ''}`);
      console.log(`     Input count: ${pageAnalysis.inputPlaceholders.length}`);
      
      // STEP 3: Try to fill wallet address
      console.log(`  🏦 Step 2: Filling wallet address...`);
      
      const walletAddress = '0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e';
      let walletFilled = false;
      
      // Find address input by placeholder
      for (const inputInfo of pageAnalysis.inputPlaceholders) {
        if (inputInfo.placeholder && 
            (inputInfo.placeholder.toLowerCase().includes('address') ||
             inputInfo.placeholder.toLowerCase().includes('recipient') ||
             inputInfo.placeholder.toLowerCase().includes('wallet'))) {
          
          try {
            const selector = `input[placeholder="${inputInfo.placeholder}"]`;
            const input = await page.$(selector);
            if (input) {
              await input.click();
              await input.fill(walletAddress);
              await page.waitForTimeout(1000);
              
              const value = await input.inputValue();
              if (value === walletAddress) {
                console.log(`    ✅ Wallet filled in: ${inputInfo.placeholder}`);
                walletFilled = true;
                break;
              }
            }
          } catch (e) {
            console.log(`    ⚠️ Failed to fill ${inputInfo.placeholder}: ${e.message}`);
          }
        }
      }
      
      if (!walletFilled) {
        console.log(`    ⚠️ Wallet address not filled - proceeding anyway`);
      }
      
      // STEP 4: Find and click exchange button
      console.log(`  🔵 Step 3: Looking for exchange button...`);
      
      let exchangeClicked = false;
      
      // Look for buttons with "Exchange" text
      const exchangeButton = await page.$('button');
      if (exchangeButton) {
        const buttons = await page.$$('button');
        
        for (const button of buttons) {
          try {
            const text = await button.textContent();
            const isVisible = await button.isVisible();
            const isEnabled = await button.isEnabled();
            
            if (text && isVisible && isEnabled && 
                (text.toLowerCase().includes('exchange') || 
                 text.toLowerCase().includes('create') ||
                 text.toLowerCase().includes('continue'))) {
              
              console.log(`    🔘 Clicking button: "${text.trim()}"`);
              await button.click();
              await page.waitForTimeout(5000);
              exchangeClicked = true;
              break;
            }
          } catch (e) {}
        }
      }
      
      if (!exchangeClicked) {
        console.log(`    ❌ No exchange button found or clicked`);
      } else {
        console.log(`    ✅ Exchange button clicked successfully`);
      }
      
      // STEP 5: Check if we're on the second page
      console.log(`  📱 Step 4: Checking for second page...`);
      
      await page.waitForTimeout(8000);
      
      const newUrl = page.url();
      const newTitle = await page.title();
      
      console.log(`  📄 New URL: ${newUrl}`);
      console.log(`  📄 New title: ${newTitle}`);
      
      // STEP 6: Analyze for provider selection
      const providerAnalysis = await page.evaluate(() => {
        const bodyText = document.body.textContent.toLowerCase();
        
        return {
          hasMercuryo: bodyText.includes('mercuryo'),
          hasMoonPay: bodyText.includes('moonpay'),
          hasWalletField: !!document.querySelector('input[placeholder*="address" i], input[placeholder*="wallet" i], input[placeholder*="recipient" i]'),
          hasProviderText: bodyText.includes('provider') || bodyText.includes('payment method'),
          pageContent: document.body.textContent.substring(0, 800)
        };
      });
      
      console.log(`  📊 Provider Analysis:`);
      console.log(`     Has Mercuryo: ${providerAnalysis.hasMercuryo}`);
      console.log(`     Has MoonPay: ${providerAnalysis.hasMoonPay}`);
      console.log(`     Has wallet field: ${providerAnalysis.hasWalletField}`);
      console.log(`     Has provider text: ${providerAnalysis.hasProviderText}`);
      
      if (providerAnalysis.hasMercuryo && providerAnalysis.hasMoonPay) {
        console.log(`\n  🎉 SUCCESS! Reached provider selection page!`);
        console.log(`     ✅ Both Mercuryo and MoonPay detected`);
        console.log(`     ✅ Wallet address field: ${providerAnalysis.hasWalletField}`);
        
        // Take success screenshot
        await page.screenshot({ 
          path: `provider_selection_SUCCESS_${this.attemptNumber}.png`,
          fullPage: true 
        });
        
        await context.close();
        await browser.close();
        return true;
      } else if (providerAnalysis.hasMercuryo || providerAnalysis.hasMoonPay) {
        console.log(`  🔶 PARTIAL: Found ${providerAnalysis.hasMercuryo ? 'Mercuryo' : 'MoonPay'} but not both`);
      } else {
        console.log(`  ❌ No provider selection detected`);
      }
      
      // Take debug screenshot
      await page.screenshot({ 
        path: `navigation_debug_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      await browser.close();
      
      this.attemptNumber++;
      if (this.attemptNumber <= 5) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.testNavigation();
      }
      
      return false;
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      await context.close();
      await browser.close();
      
      this.attemptNumber++;
      if (this.attemptNumber <= 5) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.testNavigation();
      }
      
      return false;
    }
  }
}

// Start the test
const test = new SimpleNavigationTest();
test.testNavigation().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 NAVIGATION TEST SUCCESS! 🎉🎉🎉');
    console.log('✅ Successfully reached provider selection page');
  } else {
    console.log('\n❌ Navigation test failed after 5 attempts');
  }
}).catch(error => {
  console.error('Critical error:', error);
});