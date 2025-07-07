// SIMPLE VALIDATION - Check local index.html content

const fs = require('fs');
const path = require('path');

console.log('🎯 SIMPLE VALIDATION TEST - Local File Analysis\n');

// Read the index.html file
const indexPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(indexPath, 'utf8');

// Remove template literals and base64 content for accurate USD check
const cleanedHtml = htmlContent
    .replace(/\$\{[^}]+\}/g, 'TEMPLATE_LITERAL') // Replace template literals
    .replace(/PHN2Z[^"]+/g, 'BASE64_CONTENT'); // Replace base64 content

// 1. CURRENCY CHECK
console.log('1️⃣ CURRENCY VALIDATION');
const eurCount = (htmlContent.match(/€/g) || []).length;
const dollarCount = (cleanedHtml.match(/\$/g) || []).length;
const usdTextCount = (htmlContent.match(/USD/gi) || []).length;

console.log(`   EUR (€) symbols: ${eurCount} ${eurCount > 0 ? '✅' : '❌'}`);
console.log(`   Dollar ($) symbols: ${dollarCount} ${dollarCount === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   USD text occurrences: ${usdTextCount}`);

if (dollarCount > 0) {
    // Find dollar signs
    const dollarMatches = cleanedHtml.match(/[^\n]*\$[^\n]*/g) || [];
    console.log('\n   Dollar sign locations:');
    dollarMatches.slice(0, 5).forEach(match => {
        console.log(`   - ${match.trim().substring(0, 100)}...`);
    });
}

// 2. PRICE CHECK
console.log('\n2️⃣ PRICE VALIDATION');
const has1950 = htmlContent.includes('19.50') || htmlContent.includes('19,50');
const has21 = htmlContent.includes('€21') || htmlContent.includes('21.00') || htmlContent.includes('21,00') || htmlContent.includes('21€');

console.log(`   €19.50 found: ${has1950 ? '✅' : '❌'}`);
console.log(`   €21 found: ${has21 ? '❌ FAIL' : '✅ PASS'}`);

// 3. SIMPLESWAP URL CHECK
console.log('\n3️⃣ SIMPLESWAP URL VALIDATION');
const mercuryUrlCount = (htmlContent.match(/provider=mercury(?!o)/g) || []).length;
const mercuryoUrlCount = (htmlContent.match(/provider=mercuryo/g) || []).length;

console.log(`   provider=mercury URLs: ${mercuryUrlCount} ${mercuryUrlCount > 0 ? '✅' : '❌'}`);
console.log(`   provider=mercuryo URLs: ${mercuryoUrlCount} ${mercuryoUrlCount === 0 ? '✅' : '❌ (should be mercury)'}`);

// 4. COMPONENT CHECK
console.log('\n4️⃣ COMPONENT VALIDATION');
const components = {
    'ultimate-desktop-spoofing.js': htmlContent.includes('ultimate-desktop-spoofing.js'),
    'enhanced-payment-gateway.js': htmlContent.includes('enhanced-payment-gateway.js'),
    'fallback-payment-interface.js': htmlContent.includes('fallback-payment-interface.js'),
    'anti-reward-hacking-validation.js': htmlContent.includes('anti-reward-hacking-validation.js'),
    'desktop-session-hijacker.js': htmlContent.includes('desktop-session-hijacker.js'),
    'timing-attack-solution.js': htmlContent.includes('timing-attack-solution.js'),
    'quantum-spoofing-advanced.js': htmlContent.includes('quantum-spoofing-advanced.js')
};

Object.entries(components).forEach(([component, loaded]) => {
    console.log(`   ${component}: ${loaded ? '✅' : '❌'}`);
});

// 5. WALLET ADDRESS CHECK
console.log('\n5️⃣ WALLET ADDRESS VALIDATION');
const walletAddress = '0xE5173e7c3089bD89cd1341b637b8e1951745ED5C';
const walletCount = (htmlContent.match(new RegExp(walletAddress, 'g')) || []).length;

console.log(`   Wallet address occurrences: ${walletCount} ${walletCount > 0 ? '✅' : '❌'}`);

// FINAL RESULTS
console.log('\n==================================================');
console.log('📊 VALIDATION SUMMARY');
console.log('==================================================');

const results = {
    currency: eurCount > 0 && dollarCount === 0 && usdTextCount === 0,
    price: has1950 && !has21,
    urlParams: mercuryUrlCount > 0 && mercuryoUrlCount === 0,
    components: Object.values(components).filter(v => v).length >= 5,
    wallet: walletCount > 0
};

console.log(`1. Currency (EUR only, no USD): ${results.currency ? '✅ PASS' : '❌ FAIL'}`);
console.log(`2. Price (€19.50, no €21): ${results.price ? '✅ PASS' : '❌ FAIL'}`);
console.log(`3. URL Parameters (mercury): ${results.urlParams ? '✅ PASS' : '❌ FAIL'}`);
console.log(`4. Components Loaded (≥5): ${results.components ? '✅ PASS' : '❌ FAIL'}`);
console.log(`5. Wallet Address Present: ${results.wallet ? '✅ PASS' : '❌ FAIL'}`);

const allPassed = Object.values(results).every(v => v);
console.log(`\n🎯 OVERALL: ${allPassed ? '✅ ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);

// Additional debugging info
if (!results.currency && usdTextCount > 0) {
    console.log('\n⚠️  USD text found in:');
    const usdMatches = htmlContent.match(/[^\n]*USD[^\n]*/gi) || [];
    usdMatches.slice(0, 3).forEach(match => {
        console.log(`   - ${match.trim().substring(0, 100)}...`);
    });
}