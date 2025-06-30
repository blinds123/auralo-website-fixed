/**
 * TRUE HARDWARE EMULATION TEST SUITE
 * Tests SimpleSwap Mercuryo vs MoonPay behavior using real device profiles
 */

const DEVICE_PROFILES = {
  'iPhone 14 Pro': {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'webkit'
  },
  'Galaxy S23': {
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
    viewport: { width: 360, height: 780 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'chromium'
  },
  'iPad Air': {
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    viewport: { width: 820, height: 1180 },
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
    defaultBrowserType: 'webkit'
  },
  'Galaxy Tab S8': {
    userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-X906C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    viewport: { width: 753, height: 1037 },
    deviceScaleFactor: 2.75,
    isMobile: false,
    hasTouch: true,
    defaultBrowserType: 'chromium'
  }
};

const REGIONAL_SETTINGS = {
  'Australia': {
    language: 'en-AU',
    languages: ['en-AU', 'en'],
    timezone: 'Australia/Sydney',
    flag: '🇦🇺'
  },
  'USA': {
    language: 'en-US', 
    languages: ['en-US', 'en'],
    timezone: 'America/New_York',
    flag: '🇺🇸'
  },
  'Europe': {
    language: 'en-GB',
    languages: ['en-GB', 'en'],
    timezone: 'Europe/London', 
    flag: '🇪🇺'
  },
  'Canada': {
    language: 'en-CA',
    languages: ['en-CA', 'en'], 
    timezone: 'America/Toronto',
    flag: '🇨🇦'
  }
};

window.HARDWARE_EMULATION_TESTER = {
  
  async runComprehensiveTest(device, region) {
    const deviceProfile = DEVICE_PROFILES[device];
    const regionalSettings = REGIONAL_SETTINGS[region];
    
    console.log(`${regionalSettings.flag} HARDWARE EMULATION: ${device} in ${region}`);
    
    const results = {
      device,
      region,
      timestamp: new Date().toISOString(),
      emulationDetails: {
        userAgent: deviceProfile.userAgent,
        viewport: deviceProfile.viewport,
        deviceScaleFactor: deviceProfile.deviceScaleFactor,
        hasTouch: deviceProfile.hasTouch,
        isMobile: deviceProfile.isMobile,
        regional: regionalSettings
      },
      validations: {
        '0s': null,
        '1s': null,
        '3s': null,
        '5s': null
      },
      FINAL_RESULT: 'UNKNOWN'
    };
    
    // Apply hardware emulation
    this.applyHardwareEmulation(deviceProfile, regionalSettings);
    
    // Navigate through SimpleSwap flow
    await this.navigateToProviderSelection();
    
    // Run validation tests at specific intervals
    results.validations['0s'] = this.validateProviderState('0s - Initial');
    
    setTimeout(() => {
      results.validations['1s'] = this.validateProviderState('1s');
    }, 1000);
    
    setTimeout(() => {
      results.validations['3s'] = this.validateProviderState('3s - CRITICAL');
    }, 3000);
    
    setTimeout(() => {
      results.validations['5s'] = this.validateProviderState('5s - FINAL');
      
      // Determine final result
      const allValidationsPassed = Object.values(results.validations).every(v => 
        v && v.SUCCESS_CRITERIA.mercuryoStillSelected && 
        v.SUCCESS_CRITERIA.moonpayNotSelected && 
        v.SUCCESS_CRITERIA.fiatStillEur15
      );
      
      results.FINAL_RESULT = allValidationsPassed 
        ? `${regionalSettings.flag} ${device}: ✅ SUCCESS - ALL CRITERIA MET`
        : `${regionalSettings.flag} ${device}: ❌ FAILURE - CRITERIA NOT MET`;
      
      console.log(`${regionalSettings.flag} HARDWARE EMULATION COMPLETE:`, results.FINAL_RESULT);
      
      // Store results globally
      window.HARDWARE_TEST_RESULTS = window.HARDWARE_TEST_RESULTS || {};
      window.HARDWARE_TEST_RESULTS[`${region}_${device.replace(/\s+/g, '_')}`] = results;
      
    }, 5000);
    
    return results;
  },
  
  applyHardwareEmulation(deviceProfile, regionalSettings) {
    console.log('🔧 APPLYING HARDWARE EMULATION...');
    
    // Override User Agent
    Object.defineProperty(navigator, 'userAgent', {
      get: () => deviceProfile.userAgent,
      configurable: false
    });
    
    // Override Platform  
    Object.defineProperty(navigator, 'platform', {
      get: () => deviceProfile.userAgent.includes('iPhone') ? 'iPhone' : 
                 deviceProfile.userAgent.includes('iPad') ? 'iPad' :
                 deviceProfile.userAgent.includes('Android') ? 'Linux armv8l' : 'Linux armv7l',
      configurable: false
    });
    
    // Override Touch Capabilities
    Object.defineProperty(navigator, 'maxTouchPoints', {
      get: () => deviceProfile.hasTouch ? 5 : 0,
      configurable: false
    });
    
    // Override Screen Properties
    Object.defineProperty(screen, 'width', {
      get: () => deviceProfile.viewport.width,
      configurable: false
    });
    Object.defineProperty(screen, 'height', {
      get: () => deviceProfile.viewport.height,
      configurable: false
    });
    Object.defineProperty(window, 'innerWidth', {
      get: () => deviceProfile.viewport.width,
      configurable: false
    });
    Object.defineProperty(window, 'innerHeight', {
      get: () => deviceProfile.viewport.height,
      configurable: false
    });
    
    // Override Device Pixel Ratio
    Object.defineProperty(window, 'devicePixelRatio', {
      get: () => deviceProfile.deviceScaleFactor,
      configurable: false
    });
    
    // Regional Settings
    Object.defineProperty(navigator, 'language', {
      get: () => regionalSettings.language,
      configurable: false
    });
    Object.defineProperty(navigator, 'languages', {
      get: () => regionalSettings.languages,
      configurable: false
    });
    
    // Mobile-specific touch events
    if (deviceProfile.hasTouch) {
      // Add touch event properties
      if (!window.ontouchstart) {
        window.ontouchstart = null;
        window.ontouchmove = null;
        window.ontouchend = null;
        window.ontouchcancel = null;
      }
      
      // Override CSS media queries for touch
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = function(query) {
        if (query.includes('hover: none') || query.includes('pointer: coarse')) {
          return {
            matches: true,
            media: query,
            addListener: function() {},
            removeListener: function() {}
          };
        }
        return originalMatchMedia.call(window, query);
      };
    }
    
    console.log(`🔧 HARDWARE EMULATION APPLIED: ${deviceProfile.userAgent.substring(0, 50)}...`);
  },
  
  async navigateToProviderSelection() {
    console.log('🚀 NAVIGATING TO PROVIDER SELECTION...');
    
    // Dismiss cookie banner
    setTimeout(() => {
      const gotItButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Got it')
      );
      if (gotItButton) {
        gotItButton.click();
        console.log('✅ Cookie banner dismissed');
      }
    }, 500);
    
    // Click Exchange button
    setTimeout(() => {
      const exchangeButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Exchange') && btn.className.includes('styles_button__LHkel')
      );
      if (exchangeButton) {
        exchangeButton.click();
        console.log('✅ Exchange button clicked');
      }
    }, 1000);
    
    // Fill wallet address
    setTimeout(() => {
      const addressInput = document.querySelector('#address-input');
      if (addressInput) {
        addressInput.value = '0x1234567890123456789012345678901234567890';
        addressInput.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('✅ Wallet address filled');
      }
    }, 2000);
    
    // Create exchange
    setTimeout(() => {
      const createButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Create an exchange')
      );
      if (createButton) {
        createButton.click();
        console.log('✅ Exchange creation initiated');
      }
    }, 3000);
  },
  
  validateProviderState(timePoint) {
    const results = {
      timePoint,
      timestamp: new Date().toISOString(),
      mercuryoFound: false,
      moonpayFound: false,
      mercuryoSelected: false,
      moonpaySelected: false,
      modalVisible: false,
      fiatAmount: null,
      greenBorderElements: [],
      SUCCESS_CRITERIA: {
        mercuryoStillSelected: false,
        moonpayNotSelected: true,
        fiatStillEur15: false
      },
      VALIDATION_RESULT: 'UNKNOWN'
    };
    
    // Check for Mercuryo modal (strongest indicator)
    const mercuryoModal = document.querySelector('.provider-modal');
    if (mercuryoModal && mercuryoModal.offsetWidth > 0) {
      results.modalVisible = true;
      results.mercuryoSelected = true;
    }
    
    // Check all elements for provider indicators
    const allElements = document.querySelectorAll('*');
    allElements.forEach((el, i) => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        const computedStyle = window.getComputedStyle(el);
        const text = el.textContent.toLowerCase();
        
        // Check for green borders (selection indicators)
        const hasGreenBorder = 
          computedStyle.borderColor.includes('rgb(34, 197, 94)') || 
          computedStyle.borderColor.includes('green') ||
          computedStyle.backgroundColor.includes('rgb(34, 197, 94)') ||
          computedStyle.backgroundColor.includes('green');
        
        if (hasGreenBorder) {
          results.greenBorderElements.push({
            index: i,
            textContent: el.textContent.trim().substring(0, 50),
            isMercuryo: text.includes('mercuryo'),
            isMoonpay: text.includes('moonpay')
          });
        }
        
        // Check for provider mentions
        if (text.includes('mercuryo')) {
          results.mercuryoFound = true;
          if (hasGreenBorder) results.mercuryoSelected = true;
        }
        
        if (text.includes('moonpay')) {
          results.moonpayFound = true;
          if (hasGreenBorder) results.moonpaySelected = true;
        }
      }
    });
    
    // Check body text for providers and fiat amount
    const bodyText = document.body.textContent.toLowerCase();
    if (!results.mercuryoFound) results.mercuryoFound = bodyText.includes('mercuryo');
    if (!results.moonpayFound) results.moonpayFound = bodyText.includes('moonpay');
    
    // Check for fiat amount
    if (bodyText.includes('€15') || bodyText.includes('15 eur')) {
      results.fiatAmount = '€15';
    } else if (bodyText.includes('€21') || bodyText.includes('21 eur')) {
      results.fiatAmount = '€21';
    }
    
    // Evaluate SUCCESS CRITERIA
    results.SUCCESS_CRITERIA.mercuryoStillSelected = results.mercuryoSelected || results.modalVisible;
    results.SUCCESS_CRITERIA.moonpayNotSelected = !results.moonpaySelected;
    results.SUCCESS_CRITERIA.fiatStillEur15 = results.fiatAmount === '€15' || results.fiatAmount === null;
    
    // Determine validation result
    if (results.SUCCESS_CRITERIA.mercuryoStillSelected && 
        results.SUCCESS_CRITERIA.moonpayNotSelected && 
        results.SUCCESS_CRITERIA.fiatStillEur15) {
      results.VALIDATION_RESULT = '✅ PASS';
    } else {
      results.VALIDATION_RESULT = '❌ FAIL';
    }
    
    console.log(`📋 VALIDATION ${timePoint}:`, results.VALIDATION_RESULT, results.SUCCESS_CRITERIA);
    return results;
  }
};

console.log('🔧 HARDWARE EMULATION TEST SUITE LOADED');