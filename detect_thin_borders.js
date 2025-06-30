const { chromium, devices } = require('playwright');

(async () => {
  console.log('🔍 Looking for THIN borders on mobile...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--enable-features=TouchEvents']
  });
  
  // Test Australia with Samsung
  console.log('📱 AUSTRALIA - Samsung Galaxy S24');
  const galaxyDevice = devices['Galaxy S24'];
  const context = await browser.newContext({
    ...galaxyDevice,
    locale: 'en-AU',
    timezoneId: 'Australia/Sydney'
  });
  
  const page = await context.newPage();
  
  // Navigate directly to SimpleSwap
  await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
  
  // Wait 5 seconds
  await page.waitForTimeout(5000);
  
  console.log('\n🔍 Checking for THIN borders at 5 seconds...\n');
  
  const borderAnalysis = await page.evaluate(() => {
    const results = {
      mercuryoElements: [],
      moonpayElements: [],
      greenBorderElements: [],
      allBorderedElements: []
    };
    
    // Check ALL elements for any borders
    document.querySelectorAll('*').forEach((el, index) => {
      const style = window.getComputedStyle(el);
      const text = (el.textContent || '').toLowerCase();
      
      // Get all border properties
      const borderTop = style.borderTopWidth;
      const borderColor = style.borderColor;
      const borderStyle = style.borderStyle;
      const backgroundColor = style.backgroundColor;
      const boxShadow = style.boxShadow;
      const outline = style.outline;
      
      // Check if element has Mercuryo or MoonPay text
      if (text.includes('mercuryo') && el.children.length < 3) {
        results.mercuryoElements.push({
          index,
          text: el.textContent.substring(0, 50),
          borderWidth: borderTop,
          borderColor: borderColor,
          borderStyle: borderStyle,
          backgroundColor: backgroundColor,
          boxShadow: boxShadow,
          outline: outline,
          className: el.className,
          tagName: el.tagName
        });
      }
      
      if (text.includes('moonpay') && el.children.length < 3) {
        results.moonpayElements.push({
          index,
          text: el.textContent.substring(0, 50),
          borderWidth: borderTop,
          borderColor: borderColor,
          borderStyle: borderStyle,
          backgroundColor: backgroundColor,
          boxShadow: boxShadow,
          outline: outline,
          className: el.className,
          tagName: el.tagName
        });
      }
      
      // Check for ANY green color in borders, backgrounds, shadows
      const hasGreen = 
        borderColor.includes('34') && borderColor.includes('197') && borderColor.includes('94') ||
        borderColor.includes('#22c55e') ||
        borderColor.includes('rgb(34, 197, 94)') ||
        backgroundColor.includes('34') && backgroundColor.includes('197') && backgroundColor.includes('94') ||
        backgroundColor.includes('#22c55e') ||
        boxShadow.includes('34') && boxShadow.includes('197') && boxShadow.includes('94') ||
        outline.includes('34') && outline.includes('197') && outline.includes('94');
      
      // If has any border at all
      if (borderTop !== '0px' && borderTop !== '') {
        results.allBorderedElements.push({
          index,
          text: el.textContent.substring(0, 30),
          borderWidth: borderTop,
          borderColor: borderColor,
          hasGreen: hasGreen,
          isMercuryo: text.includes('mercuryo'),
          isMoonpay: text.includes('moonpay')
        });
        
        if (hasGreen) {
          results.greenBorderElements.push({
            text: el.textContent.substring(0, 50),
            borderWidth: borderTop,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            isMercuryo: text.includes('mercuryo'),
            isMoonpay: text.includes('moonpay'),
            className: el.className
          });
        }
      }
    });
    
    return results;
  });
  
  console.log('🏦 MERCURYO Elements Found:', borderAnalysis.mercuryoElements.length);
  borderAnalysis.mercuryoElements.forEach(el => {
    console.log(`  - Text: "${el.text}"`);
    console.log(`    Border: ${el.borderWidth} ${el.borderStyle} ${el.borderColor}`);
    console.log(`    Background: ${el.backgroundColor}`);
    console.log(`    Class: ${el.className}\n`);
  });
  
  console.log('💳 MOONPAY Elements Found:', borderAnalysis.moonpayElements.length);
  borderAnalysis.moonpayElements.forEach(el => {
    console.log(`  - Text: "${el.text}"`);
    console.log(`    Border: ${el.borderWidth} ${el.borderStyle} ${el.borderColor}`);
    console.log(`    Background: ${el.backgroundColor}`);
    console.log(`    Class: ${el.className}\n`);
  });
  
  console.log('🟢 Elements with GREEN borders/colors:', borderAnalysis.greenBorderElements.length);
  borderAnalysis.greenBorderElements.forEach(el => {
    console.log(`  - Text: "${el.text}"`);
    console.log(`    Border: ${el.borderWidth} ${el.borderColor}`);
    console.log(`    Is Mercuryo: ${el.isMercuryo}`);
    console.log(`    Is MoonPay: ${el.isMoonpay}\n`);
  });
  
  console.log('📊 Total elements with ANY border:', borderAnalysis.allBorderedElements.length);
  console.log('Elements with thin borders (1px or 2px):');
  borderAnalysis.allBorderedElements
    .filter(el => el.borderWidth === '1px' || el.borderWidth === '2px')
    .forEach(el => {
      console.log(`  - "${el.text}" - ${el.borderWidth} ${el.borderColor} ${el.hasGreen ? '✅ GREEN' : ''}`);
    });
  
  // Take a screenshot
  await page.screenshot({ path: 'thin_border_check.png', fullPage: true });
  console.log('\n📸 Screenshot saved: thin_border_check.png');
  
  // Also check parent containers
  console.log('\n🔍 Checking PARENT containers of provider elements...');
  const parentCheck = await page.evaluate(() => {
    const results = [];
    
    // Find Mercuryo/MoonPay elements and check their parents
    document.querySelectorAll('*').forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      if ((text.includes('mercuryo') || text.includes('moonpay')) && el.children.length < 3) {
        // Check parent and grandparent
        let current = el;
        for (let i = 0; i < 3; i++) {
          if (current.parentElement) {
            current = current.parentElement;
            const style = window.getComputedStyle(current);
            const borderColor = style.borderColor;
            const borderWidth = style.borderTopWidth;
            
            if (borderWidth !== '0px' && borderWidth !== '') {
              results.push({
                level: `Parent level ${i + 1}`,
                providerText: el.textContent.substring(0, 30),
                borderWidth: borderWidth,
                borderColor: borderColor,
                backgroundColor: style.backgroundColor,
                className: current.className
              });
            }
          }
        }
      }
    });
    
    return results;
  });
  
  console.log('Parent containers with borders:');
  parentCheck.forEach(item => {
    console.log(`  ${item.level} of "${item.providerText}"`);
    console.log(`    Border: ${item.borderWidth} ${item.borderColor}`);
    console.log(`    Class: ${item.className}\n`);
  });
  
  await browser.close();
})();