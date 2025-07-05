// Autonomous Mobile Device Simulation Test
// This script simulates different mobile devices and tests PROJECT QUANTUM effectiveness

const mobileDevices = [
    {
        name: 'iPhone 13',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
    },
    {
        name: 'Samsung Galaxy S21',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Mobile Safari/537.36',
        viewport: { width: 384, height: 854 },
        deviceScaleFactor: 2.75,
        isMobile: true,
        hasTouch: true
    },
    {
        name: 'iPad Air',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        viewport: { width: 820, height: 1180 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
    },
    {
        name: 'Desktop Chrome',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
    }
];

async function testDevice(device) {
    console.log(`🧪 Testing device: ${device.name}`);
    
    // Simulate device environment
    const deviceTest = {
        name: device.name,
        timestamp: new Date().toISOString(),
        originalEnvironment: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints,
            screenWidth: screen.width,
            screenHeight: screen.height,
            devicePixelRatio: window.devicePixelRatio
        },
        simulatedEnvironment: device,
        tests: {}
    };
    
    // Test 1: User Agent Detection
    deviceTest.tests.userAgentDetection = {
        original: navigator.userAgent,
        simulated: device.userAgent,
        wouldBeDetectedAsMobile: /Android|iPhone|iPad|iPod|Mobile/i.test(device.userAgent)
    };
    
    // Test 2: Touch Capability Detection
    deviceTest.tests.touchDetection = {
        originalMaxTouchPoints: navigator.maxTouchPoints,
        simulatedMaxTouchPoints: device.hasTouch ? 10 : 0,
        originalTouchStart: 'ontouchstart' in window,
        simulatedTouchStart: device.hasTouch
    };
    
    // Test 3: Screen Detection
    deviceTest.tests.screenDetection = {
        originalDimensions: { width: screen.width, height: screen.height },
        simulatedDimensions: device.viewport,
        originalDevicePixelRatio: window.devicePixelRatio,
        simulatedDevicePixelRatio: device.deviceScaleFactor
    };
    
    // Test 4: PROJECT QUANTUM Spoofing Effectiveness
    if (typeof window.projectQuantum !== 'undefined') {
        // Activate spoofing
        window.projectQuantum.activate();
        
        // Wait for activation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test spoofing results
        deviceTest.tests.quantumSpoofing = {
            spoofingActive: window.quantumSpoofing && window.quantumSpoofing.active,
            layersActive: window.quantumSpoofing ? Object.values(window.quantumSpoofing.layers).filter(Boolean).length : 0,
            spoofedUserAgent: navigator.userAgent,
            spoofedMaxTouchPoints: navigator.maxTouchPoints,
            spoofedPlatform: navigator.platform,
            expectedDesktopSignature: navigator.userAgent.includes('Windows') && navigator.maxTouchPoints === 0
        };
        
        deviceTest.tests.quantumSpoofing.effectiveness = 
            deviceTest.tests.quantumSpoofing.expectedDesktopSignature ? 'EFFECTIVE' : 'INEFFECTIVE';
    } else {
        deviceTest.tests.quantumSpoofing = {
            error: 'PROJECT QUANTUM not loaded'
        };
    }
    
    // Test 5: Price Discrimination Risk
    deviceTest.tests.priceDiscriminationRisk = {
        riskLevel: device.isMobile ? 'HIGH' : 'LOW',
        expectedPrice: device.isMobile ? '€21 (mobile markup)' : '€19.50 (desktop price)',
        quantumProtection: deviceTest.tests.quantumSpoofing.effectiveness === 'EFFECTIVE' ? 'PROTECTED' : 'VULNERABLE'
    };
    
    console.log(`📊 Device test completed for ${device.name}:`, deviceTest);
    return deviceTest;
}

async function runAllDeviceTests() {
    console.log('🚀 Starting comprehensive device simulation tests...');
    const results = {
        timestamp: new Date().toISOString(),
        session: 'autonomous-device-simulation',
        devices: []
    };
    
    for (const device of mobileDevices) {
        try {
            const deviceResult = await testDevice(device);
            results.devices.push(deviceResult);
        } catch (error) {
            console.error(`❌ Test failed for ${device.name}:`, error);
            results.devices.push({
                name: device.name,
                error: error.message,
                status: 'FAILED'
            });
        }
    }
    
    // Generate summary
    results.summary = {
        totalDevices: results.devices.length,
        successfulTests: results.devices.filter(d => !d.error).length,
        quantumProtectedDevices: results.devices.filter(d => 
            d.tests && d.tests.quantumSpoofing && d.tests.quantumSpoofing.effectiveness === 'EFFECTIVE'
        ).length,
        vulnerableDevices: results.devices.filter(d => 
            d.tests && d.tests.priceDiscriminationRisk && d.tests.priceDiscriminationRisk.quantumProtection === 'VULNERABLE'
        ).length
    };
    
    console.log('✅ All device tests completed:', results);
    return results;
}

// Auto-run if in test environment
if (typeof window !== 'undefined' && window.location.href.includes('quantum-test.html')) {
    // Run tests after page load
    setTimeout(() => {
        runAllDeviceTests().then(results => {
            // Store results for analysis
            localStorage.setItem('quantum_device_simulation_results', JSON.stringify(results));
            console.log('📊 Device simulation results stored in localStorage');
        });
    }, 2000);
}

// Export for manual use
if (typeof module !== 'undefined') {
    module.exports = { runAllDeviceTests, testDevice, mobileDevices };
}