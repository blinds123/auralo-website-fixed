const { chromium, devices: playwrightDevices } = require('playwright');

class DetailedPageAnalysis {
  async analyzeSimpleSwapFlow() {
    console.log('\n🔍 DETAILED SIMPLESWAP FLOW ANALYSIS');
    console.log('='.repeat(50));
    
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
      console.log('🌐 Loading SimpleSwap with parameters...');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'load',
        timeout: 15000 
      });
      
      await page.waitForTimeout(5000);
      
      // COMPREHENSIVE PAGE ANALYSIS
      const pageAnalysis = await page.evaluate(() => {
        const analysis = {
          url: window.location.href,
          title: document.title,
          forms: [],
          inputs: [],
          buttons: [],
          links: [],
          divs: [],
          spans: [],
          specialElements: []
        };
        
        // Analyze forms
        document.querySelectorAll('form').forEach((form, index) => {
          analysis.forms.push({
            index,
            action: form.action,
            method: form.method,
            inputCount: form.querySelectorAll('input').length,
            buttonCount: form.querySelectorAll('button').length
          });
        });
        
        // Analyze ALL inputs with details
        document.querySelectorAll('input').forEach((input, index) => {
          analysis.inputs.push({
            index,
            type: input.type,
            placeholder: input.placeholder,
            name: input.name,
            id: input.id,
            value: input.value,
            className: input.className,
            visible: input.offsetWidth > 0 && input.offsetHeight > 0,
            parentTag: input.parentElement ? input.parentElement.tagName : null
          });
        });
        
        // Analyze ALL buttons with more details
        document.querySelectorAll('button').forEach((button, index) => {
          const text = button.textContent?.trim() || '';
          const parent = button.parentElement;
          
          analysis.buttons.push({
            index,
            text: text,
            type: button.type,
            className: button.className,
            id: button.id,
            disabled: button.disabled,
            visible: button.offsetWidth > 0 && button.offsetHeight > 0,
            parentTag: parent ? parent.tagName : null,
            parentClass: parent ? parent.className : null,
            onclick: button.onclick ? 'has-onclick' : 'no-onclick',
            ariaLabel: button.getAttribute('aria-label')
          });
        });
        
        // Analyze clickable divs and spans
        document.querySelectorAll('div, span').forEach((el, index) => {
          const text = el.textContent?.trim() || '';
          
          if ((text.toLowerCase().includes('exchange') || 
               text.toLowerCase().includes('swap') ||
               text.toLowerCase().includes('create') ||
               text.toLowerCase().includes('start')) && 
              text.length < 100 && text.length > 2) {
            
            const isClickable = el.onclick !== null || 
                               el.style.cursor === 'pointer' ||
                               el.classList.contains('button') ||
                               el.classList.contains('btn') ||
                               el.getAttribute('role') === 'button';
            
            analysis.specialElements.push({
              index,
              tag: el.tagName,
              text: text.substring(0, 80),
              className: el.className,
              id: el.id,
              isClickable,
              hasClick: el.onclick !== null,
              cursor: window.getComputedStyle(el).cursor,
              role: el.getAttribute('role'),
              visible: el.offsetWidth > 0 && el.offsetHeight > 0
            });
          }
        });
        
        // Look for amount/currency elements
        const amountElements = [];
        document.querySelectorAll('*').forEach(el => {
          const text = el.textContent || '';
          if ((text.includes('€') || text.includes('EUR') || text.includes('15')) && 
              text.length < 50 && el.offsetWidth > 0) {
            amountElements.push({
              tag: el.tagName,
              text: text.trim(),
              className: el.className
            });
          }
        });
        analysis.amountElements = amountElements;
        
        // Look for POL/Polygon elements
        const polElements = [];
        document.querySelectorAll('*').forEach(el => {
          const text = el.textContent || '';
          if ((text.toLowerCase().includes('pol') || text.toLowerCase().includes('polygon')) && 
              text.length < 50 && el.offsetWidth > 0) {
            polElements.push({
              tag: el.tagName,
              text: text.trim(),
              className: el.className
            });
          }
        });
        analysis.polElements = polElements;
        
        return analysis;
      });
      
      console.log('\n📊 COMPREHENSIVE PAGE ANALYSIS:');
      console.log(`   URL: ${pageAnalysis.url}`);
      console.log(`   Forms: ${pageAnalysis.forms.length}`);
      console.log(`   Inputs: ${pageAnalysis.inputs.length}`);
      console.log(`   Buttons: ${pageAnalysis.buttons.length}`);
      console.log(`   Special elements: ${pageAnalysis.specialElements.length}`);
      console.log(`   Amount elements: ${pageAnalysis.amountElements.length}`);
      console.log(`   POL elements: ${pageAnalysis.polElements.length}`);
      
      // Show forms in detail
      if (pageAnalysis.forms.length > 0) {
        console.log('\n📝 FORMS FOUND:');
        pageAnalysis.forms.forEach((form, i) => {
          console.log(`   ${i}: action="${form.action}" method="${form.method}" inputs:${form.inputCount} buttons:${form.buttonCount}`);
        });
      }
      
      // Show relevant inputs
      console.log('\n📥 INPUT FIELDS:');
      pageAnalysis.inputs.forEach((input, i) => {
        if (input.visible && (input.placeholder || input.name)) {
          console.log(`   ${i}: type="${input.type}" placeholder="${input.placeholder}" name="${input.name}" visible:${input.visible}`);
        }
      });
      
      // Show all buttons
      console.log('\n🔘 BUTTONS FOUND:');
      pageAnalysis.buttons.forEach((button, i) => {
        if (button.visible && button.text.trim()) {
          console.log(`   ${i}: "${button.text}" type="${button.type}" class="${button.className}" disabled:${button.disabled}`);
        }
      });
      
      // Show special clickable elements
      if (pageAnalysis.specialElements.length > 0) {
        console.log('\n⭐ SPECIAL CLICKABLE ELEMENTS:');
        pageAnalysis.specialElements.forEach((el, i) => {
          console.log(`   ${i}: ${el.tag} "${el.text}" clickable:${el.isClickable} cursor:${el.cursor}`);
        });
      }
      
      // Show amount elements
      if (pageAnalysis.amountElements.length > 0) {
        console.log('\n💰 AMOUNT ELEMENTS:');
        pageAnalysis.amountElements.forEach((el, i) => {
          console.log(`   ${i}: ${el.tag} "${el.text}"`);
        });
      }
      
      // Show POL elements
      if (pageAnalysis.polElements.length > 0) {
        console.log('\n🔗 POL/POLYGON ELEMENTS:');
        pageAnalysis.polElements.forEach((el, i) => {
          console.log(`   ${i}: ${el.tag} "${el.text}"`);
        });
      }
      
      // Try to identify the actual exchange form and button
      console.log('\n🎯 IDENTIFYING EXCHANGE FLOW:');
      
      // Look for address inputs specifically
      const addressInputs = pageAnalysis.inputs.filter(input => 
        input.visible && (
          input.placeholder?.toLowerCase().includes('address') ||
          input.placeholder?.toLowerCase().includes('wallet') ||
          input.name?.toLowerCase().includes('address') ||
          input.name?.toLowerCase().includes('wallet')
        )
      );
      
      if (addressInputs.length > 0) {
        console.log(`   ✅ Found ${addressInputs.length} wallet address inputs:`);
        addressInputs.forEach((input, i) => {
          console.log(`      ${i}: "${input.placeholder}" name="${input.name}"`);
        });
      } else {
        console.log(`   ❌ No wallet address inputs found on this page`);
      }
      
      // Look for primary action buttons
      const actionButtons = pageAnalysis.buttons.filter(button => 
        button.visible && button.text && (
          button.text.toLowerCase().includes('exchange') ||
          button.text.toLowerCase().includes('swap') ||
          button.text.toLowerCase().includes('create') ||
          button.text.toLowerCase().includes('start') ||
          button.text.toLowerCase().includes('continue') ||
          button.text.toLowerCase().includes('next')
        ) && !button.text.toLowerCase().includes('crypto exchange') // exclude nav menu
      );
      
      if (actionButtons.length > 0) {
        console.log(`   ✅ Found ${actionButtons.length} potential action buttons:`);
        actionButtons.forEach((button, i) => {
          console.log(`      ${i}: "${button.text}" type="${button.type}" class="${button.className}"`);
        });
        
        // Try clicking the most promising button
        console.log('\n🔘 TESTING BUTTON CLICKS:');
        
        for (let i = 0; i < Math.min(actionButtons.length, 3); i++) {
          const button = actionButtons[i];
          console.log(`   Testing button ${i}: "${button.text}"`);
          
          try {
            // Get current URL
            const urlBefore = await page.url();
            
            // Click the button by index
            await page.click(`button >> nth=${button.index}`);
            await page.waitForTimeout(5000);
            
            // Check if URL changed or page content changed
            const urlAfter = await page.url();
            
            const pageChanged = await page.evaluate((urlBefore) => {
              return {
                urlChanged: window.location.href !== urlBefore,
                hasNewElements: document.querySelectorAll('input[placeholder*="address" i]').length > 0,
                mercuryoVisible: Array.from(document.querySelectorAll('*')).some(el => 
                  el.textContent && el.textContent.toLowerCase().includes('mercuryo') && 
                  el.offsetWidth > 0 && el.offsetHeight > 0 && 
                  !el.textContent.includes('schema.org')),
                moonpayVisible: Array.from(document.querySelectorAll('*')).some(el => 
                  el.textContent && el.textContent.toLowerCase().includes('moonpay') && 
                  el.offsetWidth > 0 && el.offsetHeight > 0 && 
                  !el.textContent.includes('schema.org'))
              };
            }, urlBefore);
            
            console.log(`      URL changed: ${pageChanged.urlChanged} (${urlBefore} → ${urlAfter})`);
            console.log(`      New wallet inputs: ${pageChanged.hasNewElements}`);
            console.log(`      Mercuryo visible: ${pageChanged.mercuryoVisible}`);
            console.log(`      MoonPay visible: ${pageChanged.moonpayVisible}`);
            
            if (pageChanged.urlChanged || pageChanged.hasNewElements || 
                (pageChanged.mercuryoVisible && pageChanged.moonpayVisible)) {
              console.log(`   🎉 BREAKTHROUGH: Button "${button.text}" led to provider selection!`);
              
              // Take screenshot of success
              await page.screenshot({ 
                path: '/Users/nelsonchan/auralo-fix/PROVIDER_PAGE_FOUND.png',
                fullPage: true 
              });
              
              break;
            } else {
              console.log(`   ⚠️ Button "${button.text}" didn't lead to provider page`);
              // Go back to try next button
              await page.goto(urlBefore, { waitUntil: 'load', timeout: 10000 });
              await page.waitForTimeout(3000);
            }
            
          } catch (buttonError) {
            console.log(`   ❌ Error clicking button "${button.text}": ${buttonError.message}`);
          }
        }
        
      } else {
        console.log(`   ❌ No clear action buttons found`);
      }
      
    } catch (error) {
      console.error(`❌ Analysis failed: ${error.message}`);
    }
    
    await browser.close();
  }
}

// Run the detailed analysis
const analyzer = new DetailedPageAnalysis();
analyzer.analyzeSimpleSwapFlow().catch(error => {
  console.error('Analysis error:', error);
});