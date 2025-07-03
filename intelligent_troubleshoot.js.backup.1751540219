const { chromium, devices } = require('playwright');

let attemptNumber = 1;
const MAX_ATTEMPTS = 10;

async function intelligentTroubleshoot() {
  console.log(`\n🔄 ATTEMPT ${attemptNumber}/${MAX_ATTEMPTS}: Intelligent Troubleshooting`);
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--enable-features=TouchEvents', '--disable-web-security']
  });
  
  // Test with Samsung Galaxy S24 (Australia)
  const galaxyDevice = devices['Galaxy S24'];
  const context = await browser.newContext({
    ...galaxyDevice,
    locale: 'en-AU',
    timezoneId: 'Australia/Sydney'
  });
  
  const page = await context.newPage();
  
  try {
    console.log(`📱 Attempt ${attemptNumber}: Testing different SimpleSwap navigation approaches...`);
    
    // Strategy 1: Direct URL with more parameters
    if (attemptNumber === 1) {
      console.log('Strategy 1: Testing direct URL with additional parameters');
      await page.goto('https://simpleswap.io/exchange?from=eur&to=pol&amount=15&partner=auralo&mobile=1');
    }
    
    // Strategy 2: Try without partner parameter
    else if (attemptNumber === 2) {
      console.log('Strategy 2: Testing without partner parameter');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15');
    }
    
    // Strategy 3: Try with different amount to trigger provider selection
    else if (attemptNumber === 3) {
      console.log('Strategy 3: Testing with larger amount to trigger providers');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=100&partner=auralo');
    }
    
    // Strategy 4: Try starting exchange process differently
    else if (attemptNumber === 4) {
      console.log('Strategy 4: Manual exchange initiation');
      await page.goto('https://simpleswap.io/');
      await page.waitForTimeout(2000);
      
      // Set currencies manually
      await page.selectOption('select[name="from"], #from-currency', 'eur');
      await page.selectOption('select[name="to"], #to-currency', 'pol');
      
      // Set amount
      const amountInput = await page.$('input[type="number"], input[placeholder*="amount"]');
      if (amountInput) {
        await amountInput.fill('15');
      }
    }
    
    // Strategy 5: Look for embedded provider selection
    else if (attemptNumber === 5) {
      console.log('Strategy 5: Looking for embedded provider widgets');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
      
      // Wait longer for dynamic content
      await page.waitForTimeout(5000);
      
      // Try to trigger provider selection by interacting with the page
      await page.click('body');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
    }
    
    // Strategy 6: Look for provider selection in different sections
    else if (attemptNumber === 6) {
      console.log('Strategy 6: Analyzing page structure for hidden provider elements');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
      
      // Try clicking different areas that might reveal providers
      const clickableElements = await page.$$('button, div[role="button"], .clickable, [onclick]');
      for (let i = 0; i < Math.min(3, clickableElements.length); i++) {
        try {
          await clickableElements[i].click();
          await page.waitForTimeout(1000);
        } catch (e) {
          // Continue if click fails
        }
      }
    }
    
    // Strategy 7: Test with different user agent to see if desktop shows providers
    else if (attemptNumber === 7) {
      console.log('Strategy 7: Testing with desktop user agent to see provider difference');
      await context.close();
      
      const desktopContext = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 }
      });
      
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
      page = desktopPage; // Use desktop page for analysis
    }
    
    // Strategy 8: Force provider selection by completing exchange setup
    else if (attemptNumber === 8) {
      console.log('Strategy 8: Forcing complete exchange flow');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
      
      // Fill all required fields to trigger provider selection
      const walletInput = await page.$('input[placeholder*="address"], input[placeholder*="wallet"]');
      if (walletInput) {
        await walletInput.fill('0x1234567890123456789012345678901234567890');
        await page.waitForTimeout(1000);
        
        // Try to submit/continue
        const submitButton = await page.$('button[type="submit"], button:has-text("Exchange"), button:has-text("Continue")');
        if (submitButton) {
          await submitButton.click();
          await page.waitForTimeout(3000);
        }
      }
    }
    
    // Strategy 9: Look for providers in modals or popups
    else if (attemptNumber === 9) {
      console.log('Strategy 9: Checking for provider selection in modals/popups');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
      
      // Look for modal triggers
      const modalTriggers = await page.$$('[data-modal], [data-toggle], .modal-trigger, button:has-text("payment"), button:has-text("provider")');
      for (const trigger of modalTriggers) {
        try {
          await trigger.click();
          await page.waitForTimeout(2000);
        } catch (e) {
          // Continue
        }
      }
    }
    
    // Strategy 10: Comprehensive page analysis
    else {
      console.log('Strategy 10: Comprehensive final analysis');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
      await page.waitForTimeout(5000);
    }
    
    await page.waitForTimeout(3000);
    
    // Now perform comprehensive provider detection
    console.log('\n🔍 Performing comprehensive provider detection...');
    
    const providerAnalysis = await page.evaluate(() => {
      const results = {
        pageTitle: document.title,
        pageUrl: window.location.href,
        mercuryoElements: [],
        moonpayElements: [],
        greenElements: [],
        borderElements: [],
        allPaymentRelated: [],
        providerRelated: []
      };
      
      // Find all elements and analyze them
      document.querySelectorAll('*').forEach((el, index) => {
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        
        // Check all possible green variations
        const borderColors = [
          style.borderColor,
          style.borderTopColor,
          style.borderBottomColor,
          style.borderLeftColor,
          style.borderRightColor,
          style.backgroundColor,
          style.color,
          style.boxShadow,
          style.outline
        ].join(' ').toLowerCase();
        
        const hasGreen = borderColors.includes('34, 197, 94') ||
                        borderColors.includes('rgb(34, 197, 94)') ||
                        borderColors.includes('#22c55e') ||
                        borderColors.includes('green') ||
                        borderColors.includes('22c55e');
        
        // Check for Mercuryo
        if (text.includes('mercuryo')) {
          results.mercuryoElements.push({
            index,
            text: el.textContent.substring(0, 100),
            hasGreen,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
            visible: el.offsetWidth > 0 && el.offsetHeight > 0
          });
        }
        
        // Check for MoonPay
        if (text.includes('moonpay')) {
          results.moonpayElements.push({
            index,
            text: el.textContent.substring(0, 100),
            hasGreen,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
            visible: el.offsetWidth > 0 && el.offsetHeight > 0
          });
        }
        
        // Collect green elements
        if (hasGreen && el.offsetWidth > 0 && el.offsetHeight > 0) {
          results.greenElements.push({
            text: el.textContent.substring(0, 60),
            tagName: el.tagName,
            className: el.className,
            colors: borderColors
          });
        }
        
        // Check for payment/provider related content
        if ((text.includes('payment') || text.includes('provider') || 
             text.includes('method') || text.includes('option')) &&
            el.offsetWidth > 0 && el.offsetHeight > 0) {
          results.providerRelated.push({
            text: el.textContent.substring(0, 80),
            hasGreen,
            className: el.className
          });
        }
        
        // Check for elements with borders
        if (style.borderTopWidth !== '0px' && style.borderTopWidth !== '') {
          results.borderElements.push({
            text: el.textContent.substring(0, 40),
            borderWidth: style.borderTopWidth,
            borderColor: style.borderColor,
            hasGreen
          });
        }
      });
      
      return results;
    });
    
    console.log(`\n📊 Analysis Results for Attempt ${attemptNumber}:`);
    console.log(`Page: ${providerAnalysis.pageTitle}`);
    console.log(`URL: ${providerAnalysis.pageUrl}`);
    console.log(`Mercuryo elements: ${providerAnalysis.mercuryoElements.length}`);
    console.log(`MoonPay elements: ${providerAnalysis.moonpayElements.length}`);
    console.log(`Green elements: ${providerAnalysis.greenElements.length}`);
    console.log(`Provider-related elements: ${providerAnalysis.providerRelated.length}`);
    
    // Detailed analysis
    if (providerAnalysis.mercuryoElements.length > 0) {
      console.log('\n💳 Mercuryo Elements Found:');
      providerAnalysis.mercuryoElements.forEach((el, i) => {
        console.log(`  ${i + 1}. ${el.tagName} - "${el.text}"`);
        console.log(`     Green: ${el.hasGreen}, Visible: ${el.visible}`);
        console.log(`     Border: ${el.borderColor}, BG: ${el.backgroundColor}`);
      });
    }
    
    if (providerAnalysis.moonpayElements.length > 0) {
      console.log('\n🌙 MoonPay Elements Found:');
      providerAnalysis.moonpayElements.forEach((el, i) => {
        console.log(`  ${i + 1}. ${el.tagName} - "${el.text}"`);
        console.log(`     Green: ${el.hasGreen}, Visible: ${el.visible}`);
        console.log(`     Border: ${el.borderColor}, BG: ${el.backgroundColor}`);
      });
    }
    
    if (providerAnalysis.greenElements.length > 0) {
      console.log('\n🟢 Green Elements Found:');
      providerAnalysis.greenElements.forEach((el, i) => {
        console.log(`  ${i + 1}. ${el.tagName}.${el.className} - "${el.text}"`);
      });
    }
    
    // Take screenshot for this attempt
    await page.screenshot({ path: `attempt_${attemptNumber}_analysis.png`, fullPage: true });
    console.log(`📸 Screenshot saved: attempt_${attemptNumber}_analysis.png`);
    
    // Check if we found what we're looking for
    const foundMercuryoWithGreen = providerAnalysis.mercuryoElements.some(el => el.hasGreen && el.visible);
    const foundMoonPayWithGreen = providerAnalysis.moonpayElements.some(el => el.hasGreen && el.visible);
    
    console.log(`\n🎯 SUCCESS CHECK for Attempt ${attemptNumber}:`);
    console.log(`✅ Mercuryo with green border: ${foundMercuryoWithGreen}`);
    console.log(`❌ MoonPay with green border: ${foundMoonPayWithGreen}`);
    
    if (foundMercuryoWithGreen) {
      console.log('\n🎉 SUCCESS! Found Mercuryo with green border!');
      console.log('Now testing persistence at 5 seconds...');
      
      await page.waitForTimeout(2000); // Wait 2 more seconds for 5s total
      
      const finalCheck = await page.evaluate(() => {
        let mercuryoStillGreen = false;
        let moonpayGreen = false;
        
        document.querySelectorAll('*').forEach(el => {
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          
          const borderColors = [
            style.borderColor,
            style.borderTopColor,
            style.borderBottomColor,
            style.borderLeftColor,
            style.borderRightColor,
            style.backgroundColor,
            style.boxShadow
          ].join(' ').toLowerCase();
          
          const hasGreen = borderColors.includes('34, 197, 94') ||
                          borderColors.includes('rgb(34, 197, 94)') ||
                          borderColors.includes('#22c55e') ||
                          borderColors.includes('green');
          
          if (text.includes('mercuryo') && hasGreen && el.offsetWidth > 0) {
            mercuryoStillGreen = true;
          }
          if (text.includes('moonpay') && hasGreen && el.offsetWidth > 0) {
            moonpayGreen = true;
          }
        });
        
        return { mercuryoStillGreen, moonpayGreen };
      });
      
      console.log(`\n📊 5-SECOND PERSISTENCE CHECK:`);
      console.log(`✅ Mercuryo still has green border: ${finalCheck.mercuryoStillGreen}`);
      console.log(`❌ MoonPay has green border: ${finalCheck.moonpayGreen}`);
      
      if (finalCheck.mercuryoStillGreen && !finalCheck.moonpayGreen) {
        console.log('\n🏆 MISSION ACCOMPLISHED!');
        console.log('✅ Mercuryo green border detected and persists after 5 seconds');
        console.log('✅ MoonPay does not have green border');
        await browser.close();
        return true;
      }
    }
    
    await browser.close();
    
    // If we haven't found it yet, try next strategy
    if (attemptNumber < MAX_ATTEMPTS) {
      attemptNumber++;
      console.log(`\n🔄 Attempt ${attemptNumber - 1} complete. Trying next strategy...`);
      return await intelligentTroubleshoot();
    } else {
      console.log('\n❌ All attempts exhausted. Provider selection interface may not be accessible or may work differently.');
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Attempt ${attemptNumber} failed:`, error.message);
    await browser.close();
    
    if (attemptNumber < MAX_ATTEMPTS) {
      attemptNumber++;
      return await intelligentTroubleshoot();
    }
    return false;
  }
}

// Start the intelligent troubleshooting loop
intelligentTroubleshoot().then(success => {
  if (success) {
    console.log('\n🎉 FINAL RESULT: SUCCESS - Mercuryo green border detected and persists!');
  } else {
    console.log('\n❌ FINAL RESULT: Could not detect Mercuryo green border selection interface');
  }
});