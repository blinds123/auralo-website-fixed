/**
 * SECURITY-COMPLIANT INVESTIGATION
 * 
 * This script only tests publicly documented features
 * No unauthorized injection or modification attempts
 */

const { chromium } = require('playwright');

class CompliantInvestigation {
  constructor() {
    this.findings = [];
  }

  async startInvestigation() {
    console.log('\n🔍 COMPLIANT SECURITY INVESTIGATION');
    console.log('='.repeat(50));
    console.log('🛡️ Only testing publicly available features');
    console.log('✅ No unauthorized access attempts');
    console.log('📋 Documenting legitimate options only');
    console.log('');

    // Test 1: URL Parameter Support (Public Interface)
    await this.testURLParameters();
    
    // Test 2: Public API Documentation Check
    await this.checkPublicDocumentation();
    
    // Test 3: Partner Program Investigation
    await this.investigatePartnerProgram();
    
    // Generate compliant recommendations
    await this.generateCompliantRecommendations();
  }

  async testURLParameters() {
    console.log('\n📊 TESTING PUBLIC URL PARAMETERS');
    console.log('='.repeat(40));
    console.log('🎯 Testing if SimpleSwap accepts provider parameters in URL');
    
    const browser = await chromium.launch({ headless: false });
    
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Test various URL parameter combinations
      const testCases = [
        {
          name: 'Base URL',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=50&partner=auralo'
        },
        {
          name: 'Provider Parameter',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=50&partner=auralo&provider=mercuryo'
        },
        {
          name: 'Preferred Provider',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=50&partner=auralo&preferred_provider=mercuryo'
        },
        {
          name: 'Default Provider',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=50&partner=auralo&default_provider=mercuryo'
        },
        {
          name: 'Method Parameter',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=50&partner=auralo&method=mercuryo'
        }
      ];
      
      for (const testCase of testCases) {
        console.log(`\n   🧪 Testing: ${testCase.name}`);
        console.log(`   🌐 URL: ${testCase.url}`);
        
        try {
          await page.goto(testCase.url, { waitUntil: 'load', timeout: 15000 });
          await page.waitForTimeout(5000);
          
          // Check what happens without any injection
          const pageAnalysis = await page.evaluate(() => {
            return {
              url: window.location.href,
              title: document.title,
              hasExchangeButton: Array.from(document.querySelectorAll('button')).some(btn => 
                btn.textContent && btn.textContent.toLowerCase().includes('exchange')
              ),
              hasProviderElements: {
                mercuryo: Array.from(document.querySelectorAll('*')).some(el => 
                  el.textContent && el.textContent.toLowerCase().includes('mercuryo') && 
                  el.offsetWidth > 0
                ),
                moonpay: Array.from(document.querySelectorAll('*')).some(el => 
                  el.textContent && el.textContent.toLowerCase().includes('moonpay') && 
                  el.offsetWidth > 0
                )
              },
              visibleText: document.body.textContent.toLowerCase()
            };
          });
          
          console.log(`     📊 Page loaded successfully`);
          console.log(`     📊 Exchange button: ${pageAnalysis.hasExchangeButton ? 'Found' : 'Not found'}`);
          console.log(`     📊 Mercuryo mentioned: ${pageAnalysis.hasProviderElements.mercuryo ? 'Yes' : 'No'}`);
          console.log(`     📊 MoonPay mentioned: ${pageAnalysis.hasProviderElements.moonpay ? 'Yes' : 'No'}`);
          
          // Check if URL parameters affected anything
          const urlChanged = pageAnalysis.url !== testCase.url;
          console.log(`     📊 URL modified: ${urlChanged ? 'Yes' : 'No'}`);
          
          this.findings.push({
            testCase: testCase.name,
            url: testCase.url,
            result: pageAnalysis,
            success: true
          });
          
        } catch (error) {
          console.log(`     ❌ Test failed: ${error.message}`);
          this.findings.push({
            testCase: testCase.name,
            url: testCase.url,
            error: error.message,
            success: false
          });
        }
        
        // Wait between tests
        await page.waitForTimeout(3000);
      }
      
    } finally {
      await browser.close();
    }
  }

  async checkPublicDocumentation() {
    console.log('\n📚 CHECKING PUBLIC DOCUMENTATION');
    console.log('='.repeat(40));
    
    const browser = await chromium.launch({ headless: false });
    
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Check for public API documentation
      const docUrls = [
        'https://simpleswap.io/api-doc',
        'https://simpleswap.io/api',
        'https://simpleswap.io/developers',
        'https://simpleswap.io/docs',
        'https://simpleswap.io/partners',
        'https://simpleswap.io/affiliate'
      ];
      
      for (const url of docUrls) {
        console.log(`\n   📖 Checking: ${url}`);
        
        try {
          await page.goto(url, { waitUntil: 'load', timeout: 10000 });
          
          const pageExists = await page.evaluate(() => {
            return !document.title.toLowerCase().includes('not found') &&
                   !document.title.toLowerCase().includes('404') &&
                   document.body.textContent.length > 100;
          });
          
          if (pageExists) {
            console.log(`     ✅ Documentation found`);
            
            // Look for API or partner information
            const hasAPIInfo = await page.evaluate(() => {
              const text = document.body.textContent.toLowerCase();
              return {
                hasAPI: text.includes('api') && text.includes('endpoint'),
                hasPartner: text.includes('partner') && text.includes('integration'),
                hasProvider: text.includes('provider') || text.includes('payment method'),
                hasMercuryo: text.includes('mercuryo'),
                hasParameters: text.includes('parameter') || text.includes('query')
              };
            });
            
            console.log(`     📊 API mentioned: ${hasAPIInfo.hasAPI}`);
            console.log(`     📊 Partner program: ${hasAPIInfo.hasPartner}`);
            console.log(`     📊 Provider selection: ${hasAPIInfo.hasProvider}`);
            console.log(`     📊 Mercuryo mentioned: ${hasAPIInfo.hasMercuryo}`);
            
            this.findings.push({
              type: 'documentation',
              url: url,
              found: true,
              info: hasAPIInfo
            });
          } else {
            console.log(`     ❌ No documentation at this URL`);
          }
          
        } catch (error) {
          console.log(`     ❌ URL not accessible: ${error.message}`);
        }
      }
      
    } finally {
      await browser.close();
    }
  }

  async investigatePartnerProgram() {
    console.log('\n🤝 INVESTIGATING PARTNER PROGRAM');
    console.log('='.repeat(40));
    console.log('🎯 Looking for legitimate partnership opportunities');
    
    const browser = await chromium.launch({ headless: false });
    
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Check main site for partner information
      await page.goto('https://simpleswap.io', { waitUntil: 'load' });
      
      const partnerInfo = await page.evaluate(() => {
        const text = document.body.textContent.toLowerCase();
        const links = Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.textContent.toLowerCase().trim(),
          href: a.href
        }));
        
        return {
          hasPartnerMention: text.includes('partner') || text.includes('affiliate'),
          hasAPISection: text.includes('api'),
          hasBusinessSection: text.includes('business') || text.includes('enterprise'),
          partnerLinks: links.filter(link => 
            link.text.includes('partner') || 
            link.text.includes('affiliate') ||
            link.text.includes('api') ||
            link.text.includes('business')
          )
        };
      });
      
      console.log(`   📊 Partner program mentioned: ${partnerInfo.hasPartnerMention}`);
      console.log(`   📊 API section available: ${partnerInfo.hasAPISection}`);
      console.log(`   📊 Business section: ${partnerInfo.hasBusinessSection}`);
      
      if (partnerInfo.partnerLinks.length > 0) {
        console.log(`   🔗 Relevant links found:`);
        partnerInfo.partnerLinks.forEach(link => {
          console.log(`     - ${link.text}: ${link.href}`);
        });
      }
      
      this.findings.push({
        type: 'partner_investigation',
        result: partnerInfo
      });
      
    } finally {
      await browser.close();
    }
  }

  async generateCompliantRecommendations() {
    console.log('\n📋 COMPLIANT RECOMMENDATIONS');
    console.log('='.repeat(40));
    
    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      alternatives: []
    };
    
    // Analyze findings
    const urlTests = this.findings.filter(f => f.testCase);
    const workingURLs = urlTests.filter(f => f.success);
    const docFindings = this.findings.filter(f => f.type === 'documentation');
    const partnerFindings = this.findings.filter(f => f.type === 'partner_investigation');
    
    console.log(`\n📊 ANALYSIS RESULTS:`);
    console.log(`   URL tests completed: ${urlTests.length}`);
    console.log(`   Working URLs: ${workingURLs.length}`);
    console.log(`   Documentation found: ${docFindings.length}`);
    console.log(`   Partner info found: ${partnerFindings.length}`);
    
    // Generate recommendations based on findings
    if (workingURLs.length > 0) {
      recommendations.immediate.push('✅ Use URL parameters that work without modification');
      recommendations.immediate.push('✅ Create redirect buttons with working parameter combinations');
    }
    
    if (docFindings.some(d => d.found && d.info.hasAPI)) {
      recommendations.shortTerm.push('🔗 Contact SimpleSwap about official API integration');
      recommendations.shortTerm.push('📝 Request documented provider selection parameters');
    }
    
    if (partnerFindings.some(p => p.result.hasPartnerMention)) {
      recommendations.shortTerm.push('🤝 Apply for official SimpleSwap partner program');
      recommendations.shortTerm.push('💼 Negotiate custom integration terms');
    }
    
    // Always include alternatives
    recommendations.alternatives.push('🔍 Research competitor exchanges with better APIs');
    recommendations.alternatives.push('🏗️ Build custom exchange aggregator');
    recommendations.alternatives.push('📱 Partner with exchange that supports provider preference');
    
    recommendations.longTerm.push('🤝 Establish formal partnership with SimpleSwap');
    recommendations.longTerm.push('📊 Build analytics to demonstrate value to SimpleSwap');
    recommendations.longTerm.push('🌐 Expand to multiple exchange platforms');
    
    console.log(`\n✅ IMMEDIATE ACTIONS:`);
    recommendations.immediate.forEach(rec => console.log(`   ${rec}`));
    
    console.log(`\n🚀 SHORT-TERM ACTIONS:`);
    recommendations.shortTerm.forEach(rec => console.log(`   ${rec}`));
    
    console.log(`\n🎯 LONG-TERM STRATEGY:`);
    recommendations.longTerm.forEach(rec => console.log(`   ${rec}`));
    
    console.log(`\n🔄 ALTERNATIVE OPTIONS:`);
    recommendations.alternatives.forEach(rec => console.log(`   ${rec}`));
    
    // Save findings
    const report = {
      timestamp: new Date().toISOString(),
      investigation: 'Security-compliant SimpleSwap integration research',
      findings: this.findings,
      recommendations: recommendations,
      complianceNote: 'All testing performed using publicly available interfaces only'
    };
    
    const fs = require('fs');
    fs.writeFileSync(
      '/Users/nelsonchan/auralo-fix/COMPLIANT_INVESTIGATION_REPORT.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log(`\n📁 Full report saved: COMPLIANT_INVESTIGATION_REPORT.json`);
    
    return recommendations;
  }
}

// Execute compliant investigation
const investigator = new CompliantInvestigation();
investigator.startInvestigation().then(() => {
  console.log('\n🎉 COMPLIANT INVESTIGATION COMPLETE!');
  console.log('✅ All testing performed within security guidelines');
  console.log('🛡️ No unauthorized access attempted');
  console.log('📋 Legitimate options documented');
}).catch(error => {
  console.error('❌ Investigation failed:', error);
});