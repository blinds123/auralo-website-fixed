/**
 * PROJECT QUANTUM - Monitoring & Validation System
 * Monitors SimpleSwap for changes and validates spoofing effectiveness
 */

// ============================================================================
// SIMPLESWAP MONITORING SYSTEM
// ============================================================================

class QuantumMonitor {
    constructor() {
        this.simpleSwapFingerprint = null;
        this.validationHistory = [];
        this.isMonitoring = false;
    }
    
    async generateSimpleSwapFingerprint() {
        // Create a fingerprint of SimpleSwap's detection mechanisms
        const fingerprint = {
            timestamp: Date.now(),
            userAgentChecks: this.detectUserAgentChecks(),
            navigatorAPIUsage: this.detectNavigatorAPIUsage(),
            touchDetection: this.detectTouchDetection(),
            screenDetection: this.detectScreenDetection(),
            networkHeaders: this.detectNetworkHeaders()
        };
        
        return btoa(JSON.stringify(fingerprint));
    }
    
    detectUserAgentChecks() {
        // Monitor for user agent string analysis
        const originalUserAgent = navigator.userAgent;
        let checks = [];
        
        // Check if mobile keywords are being searched
        const mobileKeywords = ['Mobile', 'Android', 'iPhone', 'iPad', 'iPod'];
        mobileKeywords.forEach(keyword => {
            if (originalUserAgent.includes(keyword)) {
                checks.push(`userAgent.includes('${keyword}')`);
            }
        });
        
        return checks;
    }
    
    detectNavigatorAPIUsage() {
        // Monitor for navigator property access
        return {
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints,
            userAgentData: navigator.userAgentData ? {
                mobile: navigator.userAgentData.mobile,
                platform: navigator.userAgentData.platform
            } : null
        };
    }
    
    detectTouchDetection() {
        // Monitor for touch capability detection
        return {
            ontouchstart: 'ontouchstart' in window,
            TouchEvent: typeof TouchEvent !== 'undefined',
            maxTouchPoints: navigator.maxTouchPoints
        };
    }
    
    detectScreenDetection() {
        // Monitor for screen dimension analysis
        return {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            devicePixelRatio: window.devicePixelRatio,
            orientation: screen.orientation ? screen.orientation.type : null
        };
    }
    
    detectNetworkHeaders() {
        // Monitor for header analysis (limited by CORS)
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled
        };
    }
    
    async startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('🔍 PROJECT QUANTUM: Starting SimpleSwap monitoring...');
        
        // Generate initial fingerprint
        this.simpleSwapFingerprint = await this.generateSimpleSwapFingerprint();
        localStorage.setItem('quantum_simpleswap_fingerprint', this.simpleSwapFingerprint);
        
        // Set up periodic monitoring
        this.monitoringInterval = setInterval(async () => {
            await this.checkForChanges();
        }, 30000); // Check every 30 seconds
        
        // Monitor URL changes
        this.setupURLMonitoring();
        
        console.log('✅ PROJECT QUANTUM: Monitoring active');
    }
    
    async checkForChanges() {
        try {
            const currentFingerprint = await this.generateSimpleSwapFingerprint();
            const storedFingerprint = localStorage.getItem('quantum_simpleswap_fingerprint');
            
            if (storedFingerprint && currentFingerprint !== storedFingerprint) {
                console.warn('🚨 PROJECT QUANTUM: SimpleSwap detection algorithm may have changed!');
                this.handleDetectionChange(currentFingerprint, storedFingerprint);
            }
            
            localStorage.setItem('quantum_simpleswap_fingerprint', currentFingerprint);
        } catch (error) {
            console.warn('⚠️ PROJECT QUANTUM: Monitoring check failed:', error);
        }
    }
    
    handleDetectionChange(newFingerprint, oldFingerprint) {
        // Log the change for analysis
        const changeLog = {
            timestamp: new Date().toISOString(),
            oldFingerprint: oldFingerprint,
            newFingerprint: newFingerprint,
            action: 'detection_algorithm_change'
        };
        
        const changeHistory = JSON.parse(localStorage.getItem('quantum_change_history') || '[]');
        changeHistory.push(changeLog);
        localStorage.setItem('quantum_change_history', JSON.stringify(changeHistory.slice(-10))); // Keep last 10
        
        // Trigger revalidation
        this.triggerRevalidation();
    }
    
    triggerRevalidation() {
        console.log('🔄 PROJECT QUANTUM: Triggering spoofing revalidation...');
        
        if (window.projectQuantum) {
            // Deactivate and reactivate spoofing
            window.projectQuantum.deactivate();
            setTimeout(() => {
                window.projectQuantum.activate();
                this.validateSpoofingEffectiveness();
            }, 1000);
        }
    }
    
    setupURLMonitoring() {
        // Monitor for navigation to SimpleSwap
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            quantumMonitor.checkURL();
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            quantumMonitor.checkURL();
        };
        
        window.addEventListener('popstate', () => {
            quantumMonitor.checkURL();
        });
        
        // Check URL changes in new windows/tabs
        window.addEventListener('focus', () => {
            quantumMonitor.checkURL();
        });
    }
    
    checkURL() {
        const currentURL = window.location.href;
        const isSimpleSwap = currentURL.includes('simpleswap.io') || 
                           currentURL.includes('simpleswap');
        
        if (isSimpleSwap) {
            console.log('🎯 PROJECT QUANTUM: SimpleSwap detected - validating spoofing');
            this.validateSpoofingEffectiveness();
        }
    }
    
    async validateSpoofingEffectiveness() {
        const validation = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            spoofingActive: window.quantumSpoofing && window.quantumSpoofing.active,
            deviceSignals: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                maxTouchPoints: navigator.maxTouchPoints,
                screenWidth: screen.width,
                screenHeight: screen.height,
                devicePixelRatio: window.devicePixelRatio
            },
            expectedResults: {
                priceStability: '€19.50 should remain €19.50',
                mercurySelection: 'Mercury should have green border',
                walletFunctionality: 'Wallet field should be accessible'
            }
        };
        
        this.validationHistory.push(validation);
        this.validationHistory = this.validationHistory.slice(-5); // Keep last 5
        
        console.log('📊 PROJECT QUANTUM: Validation completed', validation);
        
        // Store validation for debugging
        localStorage.setItem('quantum_validation_history', JSON.stringify(this.validationHistory));
        
        return validation;
    }
    
    stopMonitoring() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        console.log('🛑 PROJECT QUANTUM: Monitoring stopped');
    }
    
    getMonitoringReport() {
        return {
            isMonitoring: this.isMonitoring,
            currentFingerprint: this.simpleSwapFingerprint,
            validationHistory: this.validationHistory,
            changeHistory: JSON.parse(localStorage.getItem('quantum_change_history') || '[]'),
            recommendations: this.generateRecommendations()
        };
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (!window.projectQuantum) {
            recommendations.push('❌ PROJECT QUANTUM not loaded - ensure quantum-spoofing.js is included');
        }
        
        if (!this.isMonitoring) {
            recommendations.push('⚠️ Monitoring not active - call startMonitoring() to enable change detection');
        }
        
        if (this.validationHistory.length === 0) {
            recommendations.push('📊 No validation history - visit SimpleSwap to test effectiveness');
        }
        
        const recentChanges = JSON.parse(localStorage.getItem('quantum_change_history') || '[]');
        if (recentChanges.length > 0) {
            recommendations.push('🚨 Recent detection changes detected - monitor for effectiveness');
        }
        
        return recommendations;
    }
}

// ============================================================================
// PRICE VALIDATION SYSTEM
// ============================================================================

class PriceValidator {
    constructor() {
        this.expectedPrice = '19.50';
        this.allowedCurrencies = ['EUR', '€'];
        this.monitoringActive = false;
    }
    
    startPriceMonitoring() {
        if (this.monitoringActive) return;
        
        this.monitoringActive = true;
        console.log('💰 PROJECT QUANTUM: Starting price monitoring...');
        
        // Monitor for price elements on the page
        this.priceObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this.scanForPriceElements();
                }
            });
        });
        
        this.priceObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Initial scan
        this.scanForPriceElements();
        
        // Periodic validation
        this.priceInterval = setInterval(() => {
            this.validateCurrentPricing();
        }, 5000);
    }
    
    scanForPriceElements() {
        // Look for elements that might contain price information
        const priceSelectors = [
            '[data-testid*="amount"]',
            '[class*="amount"]',
            '[class*="price"]',
            'input[value*="19"]',
            'input[value*="21"]',
            '*:contains("€")',
            '*:contains("EUR")'
        ];
        
        priceSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    this.checkPriceElement(element);
                });
            } catch (e) {
                // Ignore invalid selectors
            }
        });
        
        // Text content scan
        this.scanTextContent();
    }
    
    scanTextContent() {
        // Scan all text content for price mentions
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent;
            if (text.includes('€') || text.includes('EUR')) {
                this.analyzeTextForPrice(text, node.parentElement);
            }
        }
    }
    
    checkPriceElement(element) {
        const value = element.value || element.textContent || element.innerText;
        if (value && (value.includes('€') || value.includes('EUR'))) {
            this.analyzeTextForPrice(value, element);
        }
    }
    
    analyzeTextForPrice(text, element) {
        // Look for price patterns
        const pricePatterns = [
            /€\s*(\d+\.?\d*)/g,
            /(\d+\.?\d*)\s*€/g,
            /EUR\s*(\d+\.?\d*)/g,
            /(\d+\.?\d*)\s*EUR/g
        ];
        
        pricePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    this.validatePriceMatch(match, element);
                });
            }
        });
    }
    
    validatePriceMatch(priceText, element) {
        const numericValue = priceText.replace(/[€EUR\s]/g, '');
        const price = parseFloat(numericValue);
        
        if (isNaN(price)) return;
        
        const validation = {
            timestamp: new Date().toISOString(),
            foundPrice: price,
            expectedPrice: parseFloat(this.expectedPrice),
            priceText: priceText,
            element: element ? element.tagName.toLowerCase() : 'unknown',
            elementClass: element ? element.className : '',
            elementId: element ? element.id : '',
            isCorrect: Math.abs(price - parseFloat(this.expectedPrice)) < 0.01
        };
        
        if (price === 21.00 || price === 21) {
            console.error('🚨 PROJECT QUANTUM: MOBILE MARKUP DETECTED!', validation);
            this.handleMobileMarkupDetected(validation);
        } else if (validation.isCorrect) {
            console.log('✅ PROJECT QUANTUM: Correct price detected', validation);
        } else if (price > 20) {
            console.warn('⚠️ PROJECT QUANTUM: Suspicious price detected', validation);
        }
        
        // Store validation
        const priceHistory = JSON.parse(localStorage.getItem('quantum_price_history') || '[]');
        priceHistory.push(validation);
        localStorage.setItem('quantum_price_history', JSON.stringify(priceHistory.slice(-20)));
    }
    
    handleMobileMarkupDetected(validation) {
        // Critical failure - mobile markup detected despite spoofing
        const alert = {
            type: 'CRITICAL_FAILURE',
            message: 'Mobile price markup detected (€21) - spoofing may have failed',
            validation: validation,
            timestamp: new Date().toISOString(),
            recommendations: [
                'Check if PROJECT QUANTUM is active',
                'Verify all spoofing layers are working',
                'SimpleSwap may have updated detection',
                'Consider alternative spoofing strategies'
            ]
        };
        
        console.error('🚨 CRITICAL FAILURE:', alert);
        
        // Store critical failure
        const failures = JSON.parse(localStorage.getItem('quantum_critical_failures') || '[]');
        failures.push(alert);
        localStorage.setItem('quantum_critical_failures', JSON.stringify(failures.slice(-5)));
        
        // Attempt to reactivate spoofing
        if (window.projectQuantum) {
            console.log('🔄 Attempting spoofing reactivation...');
            window.projectQuantum.deactivate();
            setTimeout(() => {
                window.projectQuantum.activate();
            }, 1000);
        }
    }
    
    validateCurrentPricing() {
        // Force a comprehensive price scan
        this.scanForPriceElements();
        
        const priceHistory = JSON.parse(localStorage.getItem('quantum_price_history') || '[]');
        const recentPrices = priceHistory.filter(p => 
            Date.now() - new Date(p.timestamp).getTime() < 30000 // Last 30 seconds
        );
        
        if (recentPrices.length === 0) {
            console.log('📊 PROJECT QUANTUM: No recent price data found');
            return;
        }
        
        const mobileMarkups = recentPrices.filter(p => p.foundPrice === 21);
        if (mobileMarkups.length > 0) {
            console.error('🚨 PROJECT QUANTUM: Mobile markups still detected!');
        } else {
            console.log('✅ PROJECT QUANTUM: No mobile markups detected');
        }
    }
    
    stopPriceMonitoring() {
        if (!this.monitoringActive) return;
        
        this.monitoringActive = false;
        
        if (this.priceObserver) {
            this.priceObserver.disconnect();
        }
        
        if (this.priceInterval) {
            clearInterval(this.priceInterval);
        }
        
        console.log('🛑 PROJECT QUANTUM: Price monitoring stopped');
    }
    
    getPriceReport() {
        const priceHistory = JSON.parse(localStorage.getItem('quantum_price_history') || '[]');
        const failures = JSON.parse(localStorage.getItem('quantum_critical_failures') || '[]');
        
        return {
            isMonitoring: this.monitoringActive,
            expectedPrice: this.expectedPrice,
            recentPrices: priceHistory.slice(-10),
            criticalFailures: failures,
            summary: {
                totalPricesDetected: priceHistory.length,
                correctPrices: priceHistory.filter(p => p.isCorrect).length,
                mobileMarkups: priceHistory.filter(p => p.foundPrice === 21).length,
                successRate: priceHistory.length > 0 ? 
                    (priceHistory.filter(p => p.isCorrect).length / priceHistory.length * 100).toFixed(1) + '%' : 
                    'No data'
            }
        };
    }
}

// ============================================================================
// MERCURY PROVIDER VALIDATION
// ============================================================================

class MercuryValidator {
    constructor() {
        this.isMonitoring = false;
        this.mercuryIdentifiers = [
            '[data-provider="mercuryo"]',
            '[class*="mercuryo"]',
            '[class*="mercury"]',
            'button:contains("Mercuryo")',
            'div:contains("Mercuryo")'
        ];
    }
    
    startMercuryMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('🏆 PROJECT QUANTUM: Starting Mercury provider monitoring...');
        
        this.mercuryObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this.scanForMercuryElements();
                }
            });
        });
        
        this.mercuryObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Initial scan
        this.scanForMercuryElements();
        
        // Periodic validation
        this.mercuryInterval = setInterval(() => {
            this.validateMercurySelection();
        }, 3000);
    }
    
    scanForMercuryElements() {
        this.mercuryIdentifiers.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    this.checkMercuryElement(element);
                });
            } catch (e) {
                // Ignore invalid selectors
            }
        });
        
        // Scan for green borders (Mercury selection indicator)
        this.scanForGreenBorders();
    }
    
    scanForGreenBorders() {
        // Look for elements with green borders (common Mercury selection indicator)
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const borderColor = style.borderColor;
            
            if (borderColor.includes('rgb(34, 197, 94)') || // Green
                borderColor.includes('#22c55e') ||
                borderColor.includes('green') ||
                style.backgroundColor.includes('rgb(34, 197, 94)')) {
                
                // Check if this element is related to Mercury
                const text = element.textContent || element.innerText || '';
                if (text.toLowerCase().includes('mercur') || 
                    element.className.toLowerCase().includes('mercur') ||
                    element.getAttribute('data-provider') === 'mercuryo') {
                    
                    this.validateMercurySelection(element);
                }
            }
        });
    }
    
    checkMercuryElement(element) {
        const validation = {
            timestamp: new Date().toISOString(),
            element: element.tagName.toLowerCase(),
            className: element.className,
            id: element.id,
            textContent: element.textContent || element.innerText || '',
            isSelected: this.isMercurySelected(element),
            hasGreenBorder: this.hasGreenBorder(element)
        };
        
        if (validation.isSelected && validation.hasGreenBorder) {
            console.log('✅ PROJECT QUANTUM: Mercury correctly selected with green border', validation);
        } else if (validation.isSelected) {
            console.warn('⚠️ PROJECT QUANTUM: Mercury selected but no green border detected', validation);
        } else {
            console.log('📊 PROJECT QUANTUM: Mercury element found but not selected', validation);
        }
        
        // Store validation
        const mercuryHistory = JSON.parse(localStorage.getItem('quantum_mercury_history') || '[]');
        mercuryHistory.push(validation);
        localStorage.setItem('quantum_mercury_history', JSON.stringify(mercuryHistory.slice(-10)));
    }
    
    isMercurySelected(element) {
        // Check various indicators of selection
        return element.classList.contains('selected') ||
               element.classList.contains('active') ||
               element.getAttribute('aria-selected') === 'true' ||
               element.querySelector('.selected') !== null ||
               element.querySelector('.active') !== null;
    }
    
    hasGreenBorder(element) {
        const style = window.getComputedStyle(element);
        const borderColor = style.borderColor;
        const backgroundColor = style.backgroundColor;
        
        return borderColor.includes('rgb(34, 197, 94)') ||
               borderColor.includes('#22c55e') ||
               borderColor.includes('green') ||
               backgroundColor.includes('rgb(34, 197, 94)');
    }
    
    validateMercurySelection(specificElement = null) {
        let mercurySelected = false;
        let hasGreenBorder = false;
        
        if (specificElement) {
            mercurySelected = this.isMercurySelected(specificElement);
            hasGreenBorder = this.hasGreenBorder(specificElement);
        } else {
            // Scan all Mercury elements
            this.scanForMercuryElements();
            
            const mercuryHistory = JSON.parse(localStorage.getItem('quantum_mercury_history') || '[]');
            const recent = mercuryHistory.filter(m => 
                Date.now() - new Date(m.timestamp).getTime() < 10000 // Last 10 seconds
            );
            
            mercurySelected = recent.some(m => m.isSelected);
            hasGreenBorder = recent.some(m => m.hasGreenBorder);
        }
        
        const validation = {
            timestamp: new Date().toISOString(),
            mercurySelected: mercurySelected,
            hasGreenBorder: hasGreenBorder,
            success: mercurySelected && hasGreenBorder
        };
        
        if (validation.success) {
            console.log('✅ PROJECT QUANTUM: Mercury provider validation successful');
        } else {
            console.warn('⚠️ PROJECT QUANTUM: Mercury provider validation failed', validation);
        }
        
        return validation;
    }
    
    stopMercuryMonitoring() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        
        if (this.mercuryObserver) {
            this.mercuryObserver.disconnect();
        }
        
        if (this.mercuryInterval) {
            clearInterval(this.mercuryInterval);
        }
        
        console.log('🛑 PROJECT QUANTUM: Mercury monitoring stopped');
    }
    
    getMercuryReport() {
        const mercuryHistory = JSON.parse(localStorage.getItem('quantum_mercury_history') || '[]');
        
        return {
            isMonitoring: this.isMonitoring,
            recentValidations: mercuryHistory.slice(-5),
            summary: {
                totalValidations: mercuryHistory.length,
                successfulSelections: mercuryHistory.filter(m => m.isSelected && m.hasGreenBorder).length,
                successRate: mercuryHistory.length > 0 ? 
                    (mercuryHistory.filter(m => m.isSelected && m.hasGreenBorder).length / mercuryHistory.length * 100).toFixed(1) + '%' : 
                    'No data'
            }
        };
    }
}

// ============================================================================
// UNIFIED MONITORING SYSTEM
// ============================================================================

// Initialize global monitoring instances
window.quantumMonitor = new QuantumMonitor();
window.priceValidator = new PriceValidator();
window.mercuryValidator = new MercuryValidator();

// Unified monitoring control
window.quantumSentinel = {
    startAll() {
        console.log('🎭 PROJECT QUANTUM SENTINEL: Starting all monitoring systems...');
        window.quantumMonitor.startMonitoring();
        window.priceValidator.startPriceMonitoring();
        window.mercuryValidator.startMercuryMonitoring();
        console.log('✅ All monitoring systems active');
    },
    
    stopAll() {
        console.log('🛑 PROJECT QUANTUM SENTINEL: Stopping all monitoring systems...');
        window.quantumMonitor.stopMonitoring();
        window.priceValidator.stopPriceMonitoring();
        window.mercuryValidator.stopMercuryMonitoring();
        console.log('✅ All monitoring systems stopped');
    },
    
    getFullReport() {
        return {
            timestamp: new Date().toISOString(),
            quantum: window.quantumMonitor.getMonitoringReport(),
            pricing: window.priceValidator.getPriceReport(),
            mercury: window.mercuryValidator.getMercuryReport(),
            overall: this.generateOverallStatus()
        };
    },
    
    generateOverallStatus() {
        const quantumActive = window.projectQuantum && window.quantumSpoofing && window.quantumSpoofing.active;
        const monitoringActive = window.quantumMonitor.isMonitoring;
        const priceMonitoringActive = window.priceValidator.monitoringActive;
        const mercuryMonitoringActive = window.mercuryValidator.isMonitoring;
        
        return {
            spoofingActive: quantumActive,
            monitoringActive: monitoringActive,
            priceValidationActive: priceMonitoringActive,
            mercuryValidationActive: mercuryMonitoringActive,
            status: quantumActive && monitoringActive ? 'FULLY_OPERATIONAL' : 'DEGRADED',
            recommendations: this.generateRecommendations()
        };
    },
    
    generateRecommendations() {
        const recommendations = [];
        
        if (!window.projectQuantum) {
            recommendations.push('❌ Load quantum-spoofing.js');
        }
        
        if (!window.quantumMonitor.isMonitoring) {
            recommendations.push('🔍 Start monitoring with quantumSentinel.startAll()');
        }
        
        const failures = JSON.parse(localStorage.getItem('quantum_critical_failures') || '[]');
        if (failures.length > 0) {
            recommendations.push('🚨 Review critical failures in console');
        }
        
        return recommendations;
    }
};

// Auto-start monitoring when on SimpleSwap
if (window.location.hostname.includes('simpleswap.io')) {
    setTimeout(() => {
        window.quantumSentinel.startAll();
    }, 2000);
}

console.log('🎭 PROJECT QUANTUM SENTINEL: Monitoring system loaded and ready');