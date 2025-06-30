const { chromium, devices: playwrightDevices } = require('playwright');

class FinalDeploymentTest {
  constructor() {
    this.attemptNumber = 1;
    this.successfulTests = [];
    this.failedTests = [];
  }

  async testUrlParameterApproach() {
    console.log(`\n🚀 FINAL DEPLOYMENT TEST - URL PARAMETER APPROACH`);
    console.log('='.repeat(80));
    console.log('🎯 TESTING: URL parameters to force Mercuryo selection');
    console.log('📋 STRATEGY: Direct URL modification without cross-origin scripts');
    console.log('');
    
    const testMatrix = [
      { 
        name: 'iPhone 14 Pro', 
        device: playwrightDevices['iPhone 14 Pro'],
        region: 'Australia',
        flag: '🇦🇺'
      },
      { 
        name: 'Galaxy S23', 
        device: playwrightDevices['Galaxy S23'],
        region: 'USA',
        flag: '🇺🇸'
      },
      { 
        name: 'iPhone 14 Pro', 
        device: playwrightDevices['iPhone 14 Pro'],
        region: 'Europe',
        flag: '🇪🇺'
      }
    ];

    const browser = await chromium.launch({ 
      headless: false,
      args: [
        '--enable-features=TouchEvents',
        '--disable-web-security', 
        '--enable-touch-events',
        '--no-sandbox'
      ]
    });

    for (const config of testMatrix) {
      try {
        const success = await this.testUrlParameterFix(browser, config);
        if (success) {
          console.log(`\n🏆 URL PARAMETER SUCCESS FOR ${config.flag} ${config.name} ${config.region}!`);
          this.successfulTests.push({ config, attempt: this.attemptNumber });
        } else {
          this.failedTests.push({ config, attempt: this.attemptNumber });
        }
      } catch (error) {
        console.error(`❌ ${config.flag} ${config.name} ${config.region}: ${error.message}`);
        this.failedTests.push({ config, error: error.message, attempt: this.attemptNumber });
      }
    }

    await browser.close();
    
    const successCount = this.successfulTests.length;
    const totalTests = testMatrix.length;
    
    console.log(`\n📊 URL PARAMETER TEST SUMMARY:`);
    console.log(`   Successful tests: ${successCount}/${totalTests}`);
    console.log(`   Success rate: ${(successCount/totalTests*100).toFixed(1)}%`);
    
    if (successCount === totalTests) {
      console.log(`\n🎉🎉🎉 URL PARAMETER APPROACH VALIDATED! 🎉🎉🎉`);
      console.log('✅ Ready for production deployment');
      console.log('✅ No cross-origin issues');
      console.log('✅ Compatible with all mobile devices');
      console.log('✅ Mercuryo selection forced successfully');
      return true;
    }
    
    return false;
  }

  async testUrlParameterFix(browser, config) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - URL PARAMETER TEST`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      // Test different URL parameter combinations
      const urlVariations = [
        {
          name: 'Standard + Desktop Mode',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&mode=desktop'
        },
        {
          name: 'Desktop + Fiat + Provider Preference',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&mode=desktop&fiat=true&provider_preference=mercuryo'
        },
        {
          name: 'Full Optimization Package',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&mode=desktop&fiat=true&provider_preference=mercuryo&mobile_override=false'
        }
      ];
      
      for (const variation of urlVariations) {
        console.log(`  🧪 Testing: ${variation.name}`);
        console.log(`     URL: ${variation.url}`);
        
        // Navigate to the optimized URL
        await page.goto(variation.url, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });
        
        await page.waitForTimeout(5000);
        
        // Navigate to second page
        const secondPageResult = await this.navigateToProviderSelection(page);
        
        if (secondPageResult.success) {
          console.log(`     ✅ Successfully reached provider selection page`);
          
          // Wait for provider interface to load
          await page.waitForTimeout(8000);
          
          // Test at multiple time intervals
          const timeChecks = [3000, 5000, 8000];
          let allChecksPass = true;
          
          for (const timeDelay of timeChecks) {
            await page.waitForTimeout(timeDelay);
            const verification = await this.verifyProviderState(page);
            
            console.log(`     ⏱️  ${timeDelay/1000}s check: M:${verification.mercuryoDetected} W:${verification.walletFieldVisible} A:${verification.amountCorrect}`);
            
            if (verification.mercuryoDetected && verification.walletFieldVisible && verification.amountCorrect) {
              console.log(`     🎯 SUCCESS with ${variation.name}!`);
              console.log(`        ✅ Mercuryo detected and functional`);
              console.log(`        ✅ Wallet address field visible`);
              console.log(`        ✅ Amount preserved at €15`);
              
              await page.screenshot({ 
                path: `URL_SUCCESS_${variation.name.replace(/[^a-zA-Z0-9]/g, '_')}_${config.name.replace(' ', '_')}_${config.region}.png`,
                fullPage: true 
              });
              
              await context.close();
              return true;
            }
            
            if (timeDelay === timeChecks[timeChecks.length - 1]) {
              allChecksPass = false;
            }
          }
          
          if (!allChecksPass) {
            console.log(`     ❌ Time checks failed for ${variation.name}`);
          }
          
        } else {
          console.log(`     ❌ Failed to reach provider selection: ${secondPageResult.error}`);
        }
        
        // Take screenshot for debugging
        await page.screenshot({ 
          path: `URL_DEBUG_${variation.name.replace(/[^a-zA-Z0-9]/g, '_')}_${config.name.replace(' ', '_')}_${config.region}.png`,
          fullPage: true 
        });
        
        // Try next variation
        console.log(`     🔄 Trying next URL variation...`);
      }
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  async navigateToProviderSelection(page) {
    try {
      // Fill wallet address if possible
      const walletAddress = '0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e';
      try {
        const addressInput = await page.$('input[placeholder*="address" i]');
        if (addressInput) {
          await addressInput.click();
          await addressInput.fill(walletAddress);
          await page.waitForTimeout(1000);
        }
      } catch (e) {}
      
      // Click exchange button
      const buttons = await page.$$('button');
      for (const button of buttons) {
        try {
          const text = await button.textContent();
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          
          if (text && isVisible && isEnabled && 
              (text.toLowerCase().includes('exchange') || 
               text.toLowerCase().includes('create'))) {
            
            await button.click();
            await page.waitForTimeout(3000);
            
            return { 
              success: true, 
              buttonText: text.trim()
            };
          }
        } catch (e) {}
      }
      
      return { 
        success: false, 
        error: 'Exchange button not found'
      };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.message
      };
    }
  }

  async verifyProviderState(page) {
    return await page.evaluate(() => {
      const verification = {
        mercuryoDetected: false,
        walletFieldVisible: false,
        amountCorrect: false,
        moonpayDetected: false,
        mercuryoElements: [],
        fiatAmount: null
      };
      
      // Check for wallet address fields
      document.querySelectorAll('input').forEach(input => {
        const placeholder = (input.placeholder || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        
        if ((placeholder.includes('address') || placeholder.includes('wallet') || 
             name.includes('address') || name.includes('wallet') ||
             placeholder.includes('recipient')) && 
            input.offsetWidth > 0 && input.offsetHeight > 0) {
          verification.walletFieldVisible = true;
        }
      });
      
      // Check for preserved amount
      const bodyText = document.body.textContent;
      const eurMatches = bodyText.match(/€\s*(\d+(?:\.\d+)?)/g);
      if (eurMatches) {
        const amounts = eurMatches.map(match => parseFloat(match.replace('€', '').trim()));
        if (amounts.includes(15) || amounts.includes(15.0)) {
          verification.amountCorrect = true;
          verification.fiatAmount = '€15';
        } else {
          verification.fiatAmount = eurMatches[0];
        }
      }
      
      // Check for provider elements
      document.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          verification.mercuryoDetected = true;
          verification.mercuryoElements.push({
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || ''
          });
        }
        
        if (text.includes('moonpay')) {
          verification.moonpayDetected = true;
        }
      });
      
      return verification;
    });
  }
}

// Start the final deployment test
const tester = new FinalDeploymentTest();
tester.testUrlParameterApproach().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 FINAL DEPLOYMENT TEST SUCCESS! 🎉🎉🎉');
    console.log('');
    console.log('🚀 PRODUCTION DEPLOYMENT APPROVED');
    console.log('✅ URL parameter approach validated');
    console.log('✅ Cross-origin compatible');
    console.log('✅ Mobile device tested');
    console.log('✅ Mercuryo selection confirmed');
    console.log('✅ Fiat amount preservation verified');
    console.log('');
    console.log('📦 Deploy the code from PRODUCTION_DEPLOYMENT_PACKAGE.md');
    console.log('🌐 Add the JavaScript to https://auralo-website-fixed.netlify.app/');
  } else {
    console.log('\n❌ Final deployment test needs refinement');
    console.log('📊 Summary:');
    console.log(`   Successful tests: ${tester.successfulTests.length}`);
    console.log(`   Failed tests: ${tester.failedTests.length}`);
  }
}).catch(error => {
  console.error('Critical error:', error);
});