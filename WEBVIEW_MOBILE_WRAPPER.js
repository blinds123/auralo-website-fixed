/**
 * AURALO WEBVIEW MOBILE WRAPPER
 * 
 * React Native WebView component with integrated Mercuryo forcing
 * for mobile app deployment
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ActivityIndicator, 
    Alert,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';

const AuraloWebViewWrapper = ({ 
    amount = 50, 
    region = 'US',
    onExchangeComplete,
    onError
}) => {
    const [loading, setLoading] = useState(true);
    const [forcingActive, setForcingActive] = useState(false);
    const [forcingStats, setForcingStats] = useState({
        attempts: 0,
        mercuryoForced: 0,
        moonpayDisabled: 0
    });
    const [currentUrl, setCurrentUrl] = useState('');
    
    const webViewRef = useRef(null);
    const { width, height } = Dimensions.get('window');
    
    // Generate the target URL
    const targetUrl = `https://simpleswap.io/?from=eur&to=pol&amount=${amount}&partner=auralo`;
    
    /**
     * Mercuryo forcing script for WebView injection
     */
    const getMercuryoForcingScript = () => {
        return `
        (function() {
            'use strict';
            
            console.log('🚀 Auralo WebView Mercuryo Forcing v1.0.0 - Mobile Native');
            
            window.AuraloWebViewForcer = {
                version: '1.0.0',
                active: true,
                attempts: 0,
                maxAttempts: 2000,
                platform: 'react-native',
                
                config: {
                    checkInterval: 500,
                    maxRuntime: 1800000, // 30 minutes
                    forceVisualStyle: {
                        border: '10px solid #22c55e',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(34, 197, 94, 0.6)',
                        boxShadow: '0 0 50px rgba(34, 197, 94, 1), inset 0 0 40px rgba(34, 197, 94, 0.9)',
                        outline: '6px solid #22c55e',
                        zIndex: '9999999',
                        transform: 'scale(1.15)',
                        transition: 'all 0.8s ease',
                        position: 'relative',
                        animation: 'auralo-mobile-pulse 3s infinite'
                    }
                },
                
                init() {
                    console.log('🔧 Initializing WebView Mercuryo Forcer...');
                    
                    // Mark as mobile WebView
                    document.documentElement.setAttribute('data-auralo-webview', 'true');
                    document.documentElement.setAttribute('data-auralo-mobile', 'true');
                    
                    this.injectMobileStyles();
                    this.setupMobileForcing();
                    this.setupNativeBridge();
                    this.optimizeForMobile();
                    
                    console.log('✅ WebView Mercuryo Forcer activated for mobile');
                },
                
                injectMobileStyles() {
                    const mobileStyles = document.createElement('style');
                    mobileStyles.textContent = \`
                        /* Auralo Mobile WebView Styles */
                        @keyframes auralo-mobile-pulse {
                            0% { transform: scale(1.15) rotate(0deg); }
                            33% { transform: scale(1.2) rotate(1deg); }
                            66% { transform: scale(1.1) rotate(-1deg); }
                            100% { transform: scale(1.15) rotate(0deg); }
                        }
                        
                        [data-auralo-webview-forced="true"] {
                            animation: auralo-mobile-pulse 3s infinite !important;
                            border: 10px solid #22c55e !important;
                            box-shadow: 0 0 50px rgba(34, 197, 94, 1) !important;
                        }
                        
                        /* Mobile-optimized Mercuryo forcing */
                        *[class*="mercuryo" i], 
                        *[id*="mercuryo" i],
                        *[data-provider*="mercuryo" i] {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            z-index: 9999999 !important;
                            position: relative !important;
                            background: linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.6)) !important;
                            border: 8px solid #22c55e !important;
                            border-radius: 15px !important;
                            transform: scale(1.1) !important;
                            box-shadow: 0 0 30px rgba(34, 197, 94, 1) !important;
                        }
                        
                        /* Complete MoonPay destruction on mobile */
                        *[class*="moonpay" i], 
                        *[id*="moonpay" i],
                        *[data-provider*="moonpay" i] {
                            display: none !important;
                            visibility: hidden !important;
                            opacity: 0 !important;
                            pointer-events: none !important;
                            position: absolute !important;
                            left: -999999px !important;
                            top: -999999px !important;
                            width: 0 !important;
                            height: 0 !important;
                            overflow: hidden !important;
                            z-index: -999999 !important;
                            transform: scale(0) !important;
                        }
                        
                        /* Mobile wallet field enhancement */
                        input[placeholder*="address" i],
                        input[placeholder*="wallet" i],
                        input[name*="address" i],
                        input[name*="wallet" i] {
                            background: rgba(34, 197, 94, 0.1) !important;
                            border: 4px solid #22c55e !important;
                            border-radius: 10px !important;
                            font-size: 18px !important;
                            padding: 15px !important;
                            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8) !important;
                        }
                        
                        /* Mobile-friendly button enhancement */
                        button, input[type="button"], input[type="submit"] {
                            min-height: 48px !important;
                            font-size: 16px !important;
                            padding: 12px 20px !important;
                        }
                    \`;
                    
                    document.head.appendChild(mobileStyles);
                },
                
                setupMobileForcing() {
                    // Mobile-optimized forcing strategies
                    const mobileStrategies = [
                        () => this.mobileDomForcing(),
                        () => this.mobileEventForcing(),
                        () => this.mobileAttributeForcing(),
                        () => this.mobileTouchForcing(),
                        () => this.mobileFormForcing(),
                        () => this.mobileAccessibilityForcing()
                    ];
                    
                    const runMobileStrategies = () => {
                        if (!this.active || this.attempts > this.maxAttempts) return;
                        
                        this.attempts++;
                        
                        let totalActions = 0;
                        mobileStrategies.forEach((strategy, index) => {
                            setTimeout(() => {
                                try {
                                    const actions = strategy();
                                    totalActions += actions || 0;
                                } catch (error) {
                                    console.warn(\`Mobile strategy \${index + 1} failed:\`, error.message);
                                }
                            }, index * 100);
                        });
                        
                        // Report to native app
                        this.reportToNative({
                            type: 'forcing_stats',
                            attempts: this.attempts,
                            actions: totalActions,
                            timestamp: new Date().toISOString()
                        });
                        
                        if (this.attempts % 20 === 0) {
                            console.log(\`🔧 Mobile Round \${this.attempts}: Applied \${totalActions} total actions\`);
                        }
                    };
                    
                    // Initial run
                    runMobileStrategies();
                    
                    // Continuous mobile forcing
                    const mobileInterval = setInterval(runMobileStrategies, this.config.checkInterval);
                    
                    // Stop after max runtime
                    setTimeout(() => {
                        this.active = false;
                        clearInterval(mobileInterval);
                        console.log('⏰ Mobile forcer stopped after 30 minutes');
                        this.reportToNative({ type: 'forcing_stopped', reason: 'timeout' });
                    }, this.config.maxRuntime);
                },
                
                mobileDomForcing() {
                    let actions = 0;
                    
                    document.querySelectorAll('*').forEach(el => {
                        if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
                        
                        const text = (el.textContent || '').toLowerCase();
                        const html = (el.innerHTML || '').toLowerCase();
                        
                        // Mobile-optimized Mercuryo forcing
                        if ((text.includes('mercuryo') || html.includes('mercuryo')) && 
                            !text.includes('schema.org') && 
                            text.length < 3000 &&
                            el.tagName !== 'HTML' && 
                            el.tagName !== 'BODY' &&
                            el.tagName !== 'SCRIPT') {
                            
                            // Apply mobile-optimized visual forcing
                            Object.assign(el.style, this.config.forceVisualStyle);
                            
                            // Mobile-specific attributes
                            const mobileAttrs = [
                                'aria-selected', 'data-selected', 'selected', 'checked', 'active',
                                'data-auralo-webview-forced', 'data-mobile-forced', 'data-native-forced',
                                'data-touch-enabled', 'data-mobile-optimized'
                            ];
                            
                            mobileAttrs.forEach(attr => el.setAttribute(attr, 'true'));
                            
                            // Mobile-specific classes
                            const mobileClasses = [
                                'selected', 'active', 'chosen', 'forced', 'mobile-selected',
                                'native-forced', 'touch-enabled', 'mobile-optimized', 'webview-forced'
                            ];
                            
                            if (el.classList) {
                                el.classList.add(...mobileClasses);
                            }
                            
                            // Mobile-optimized interaction - touch events
                            for (let i = 0; i < 30; i++) {
                                setTimeout(() => {
                                    try {
                                        // Touch events for mobile
                                        const rect = el.getBoundingClientRect();
                                        const centerX = rect.left + rect.width / 2;
                                        const centerY = rect.top + rect.height / 2;
                                        
                                        const touchEvents = [
                                            new TouchEvent('touchstart', {
                                                bubbles: true,
                                                cancelable: true,
                                                touches: [{
                                                    clientX: centerX,
                                                    clientY: centerY,
                                                    target: el
                                                }]
                                            }),
                                            new TouchEvent('touchend', {
                                                bubbles: true,
                                                cancelable: true
                                            })
                                        ];
                                        
                                        touchEvents.forEach(event => {
                                            try { el.dispatchEvent(event); } catch(e) {}
                                        });
                                        
                                        // Standard events
                                        el.click();
                                        el.focus();
                                        
                                        const standardEvents = [
                                            'click', 'mousedown', 'mouseup', 'change', 'input',
                                            'focus', 'blur', 'select'
                                        ];
                                        
                                        standardEvents.forEach(eventType => {
                                            el.dispatchEvent(new Event(eventType, { 
                                                bubbles: true, 
                                                cancelable: true 
                                            }));
                                        });
                                        
                                        // Form-specific mobile handling
                                        if (el.tagName === 'INPUT') {
                                            if (el.type === 'radio' || el.type === 'checkbox') {
                                                el.checked = true;
                                            }
                                            if (el.type === 'text' || el.type === 'hidden') {
                                                el.value = 'mercuryo';
                                            }
                                        }
                                        
                                        if (el.tagName === 'SELECT') {
                                            for (let option of el.options) {
                                                if (option.value.toLowerCase().includes('mercuryo')) {
                                                    el.selectedIndex = option.index;
                                                    el.value = option.value;
                                                    break;
                                                }
                                            }
                                        }
                                        
                                    } catch(e) {}
                                }, i * 30);
                            }
                            
                            actions++;
                        }
                        
                        // Mobile MoonPay destruction
                        if ((text.includes('moonpay') || html.includes('moonpay')) && 
                            !text.includes('schema.org') && 
                            text.length < 3000 &&
                            el.tagName !== 'HTML' && 
                            el.tagName !== 'BODY' &&
                            el.tagName !== 'SCRIPT') {
                            
                            // Complete mobile destruction
                            el.style.cssText = \`
                                display: none !important;
                                visibility: hidden !important;
                                opacity: 0 !important;
                                pointer-events: none !important;
                                touch-action: none !important;
                                position: absolute !important;
                                left: -999999px !important;
                                top: -999999px !important;
                                width: 0 !important;
                                height: 0 !important;
                                z-index: -999999 !important;
                                transform: scale(0) !important;
                            \`;
                            
                            el.setAttribute('data-auralo-mobile-destroyed', 'true');
                            
                            if (el.tagName === 'INPUT' || el.tagName === 'BUTTON' || el.tagName === 'SELECT') {
                                el.disabled = true;
                                el.checked = false;
                                el.selected = false;
                            }
                            
                            // Remove from DOM after delay
                            setTimeout(() => {
                                try {
                                    if (el.parentNode) {
                                        el.parentNode.removeChild(el);
                                    }
                                } catch(e) {}
                            }, 2000);
                            
                            actions++;
                        }
                    });
                    
                    return actions;
                },
                
                mobileEventForcing() {
                    // Mobile-specific event forcing
                    const mobileSelectors = [
                        '[data-provider*="mercuryo" i]',
                        '[data-gateway*="mercuryo" i]',
                        '[value*="mercuryo" i]',
                        '.mercuryo',
                        '#mercuryo',
                        'input[name*="mercuryo" i]',
                        'button[data-value*="mercuryo" i]',
                        '[role="radio"][aria-label*="mercuryo" i]',
                        '[role="checkbox"][aria-label*="mercuryo" i]'
                    ];
                    
                    let actions = 0;
                    
                    mobileSelectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => {
                            if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                                // Mobile touch simulation
                                const rect = el.getBoundingClientRect();
                                const touches = [{
                                    clientX: rect.left + rect.width / 2,
                                    clientY: rect.top + rect.height / 2,
                                    target: el
                                }];
                                
                                try {
                                    el.dispatchEvent(new TouchEvent('touchstart', { 
                                        bubbles: true, 
                                        touches: touches 
                                    }));
                                    el.dispatchEvent(new TouchEvent('touchend', { 
                                        bubbles: true 
                                    }));
                                } catch(e) {}
                                
                                el.click();
                                el.focus();
                                actions++;
                            }
                        });
                    });
                    
                    return actions;
                },
                
                mobileAttributeForcing() {
                    // Mobile attribute-based forcing
                    const attrSelectors = [
                        '[data-provider]', '[data-gateway]', '[data-payment]', 
                        '[data-method]', '[data-option]', '[aria-label]'
                    ];
                    
                    let actions = 0;
                    
                    attrSelectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => {
                            const attrs = Array.from(el.attributes);
                            const hasMercuryo = attrs.some(attr => 
                                attr.value.toLowerCase().includes('mercuryo')
                            );
                            
                            if (hasMercuryo && el.offsetWidth > 0) {
                                Object.assign(el.style, this.config.forceVisualStyle);
                                el.click();
                                el.setAttribute('data-auralo-mobile-attr-forced', 'true');
                                actions++;
                            }
                        });
                    });
                    
                    return actions;
                },
                
                mobileTouchForcing() {
                    // Simulate realistic mobile touch interactions
                    let actions = 0;
                    
                    document.querySelectorAll('*').forEach(el => {
                        const text = (el.textContent || '').toLowerCase();
                        
                        if (text.includes('mercuryo') && el.offsetWidth > 0) {
                            const rect = el.getBoundingClientRect();
                            
                            // Simulate realistic touch sequence
                            setTimeout(() => {
                                try {
                                    // Touch start
                                    el.dispatchEvent(new TouchEvent('touchstart', {
                                        bubbles: true,
                                        cancelable: true,
                                        touches: [{
                                            clientX: rect.left + rect.width / 2,
                                            clientY: rect.top + rect.height / 2
                                        }]
                                    }));
                                    
                                    // Touch move (slight)
                                    setTimeout(() => {
                                        el.dispatchEvent(new TouchEvent('touchmove', {
                                            bubbles: true,
                                            touches: [{
                                                clientX: rect.left + rect.width / 2 + 1,
                                                clientY: rect.top + rect.height / 2 + 1
                                            }]
                                        }));
                                    }, 50);
                                    
                                    // Touch end
                                    setTimeout(() => {
                                        el.dispatchEvent(new TouchEvent('touchend', {
                                            bubbles: true,
                                            cancelable: true
                                        }));
                                        
                                        // Follow with click
                                        el.click();
                                    }, 100);
                                    
                                } catch(e) {}
                            }, Math.random() * 200);
                            
                            actions++;
                        }
                    });
                    
                    return actions;
                },
                
                mobileFormForcing() {
                    // Mobile-optimized form handling
                    let actions = 0;
                    
                    document.querySelectorAll('form').forEach(form => {
                        // Look for provider selection in mobile forms
                        const inputs = form.querySelectorAll('input, select, textarea');
                        
                        inputs.forEach(input => {
                            const name = (input.name || '').toLowerCase();
                            const id = (input.id || '').toLowerCase();
                            const placeholder = (input.placeholder || '').toLowerCase();
                            
                            if (name.includes('provider') || name.includes('gateway') ||
                                id.includes('provider') || id.includes('gateway') ||
                                placeholder.includes('provider') || placeholder.includes('gateway')) {
                                
                                input.value = 'mercuryo';
                                input.checked = true;
                                input.selected = true;
                                
                                // Mobile-specific events
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                
                                actions++;
                            }
                        });
                    });
                    
                    return actions;
                },
                
                mobileAccessibilityForcing() {
                    // Use accessibility features for mobile forcing
                    let actions = 0;
                    
                    document.querySelectorAll('[role], [aria-label], [aria-describedby]').forEach(el => {
                        const role = (el.getAttribute('role') || '').toLowerCase();
                        const label = (el.getAttribute('aria-label') || '').toLowerCase();
                        const describedBy = (el.getAttribute('aria-describedby') || '').toLowerCase();
                        
                        if ((role.includes('radio') || role.includes('checkbox') || role.includes('option')) &&
                            (label.includes('mercuryo') || describedBy.includes('mercuryo'))) {
                            
                            el.setAttribute('aria-selected', 'true');
                            el.setAttribute('aria-checked', 'true');
                            el.click();
                            
                            Object.assign(el.style, this.config.forceVisualStyle);
                            actions++;
                        }
                    });
                    
                    return actions;
                },
                
                setupNativeBridge() {
                    // Communication bridge with React Native
                    window.addEventListener('message', (event) => {
                        if (event.data && event.data.type === 'AURALO_NATIVE_COMMAND') {
                            console.log('📱 Received native command:', event.data);
                            
                            switch (event.data.action) {
                                case 'force_mercuryo':
                                    this.mobileDomForcing();
                                    break;
                                    
                                case 'get_status':
                                    this.reportToNative({
                                        type: 'status_response',
                                        ...this.getStatus()
                                    });
                                    break;
                                    
                                case 'take_screenshot':
                                    // Request screenshot from native
                                    this.reportToNative({
                                        type: 'screenshot_request'
                                    });
                                    break;
                            }
                        }
                    });
                },
                
                optimizeForMobile() {
                    // Mobile-specific optimizations
                    
                    // Prevent zoom on input focus
                    document.querySelectorAll('input, select, textarea').forEach(input => {
                        input.style.fontSize = Math.max(16, parseInt(input.style.fontSize) || 16) + 'px';
                    });
                    
                    // Enhance touch targets
                    document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(btn => {
                        btn.style.minHeight = '48px';
                        btn.style.minWidth = '48px';
                        btn.style.padding = '12px';
                    });
                    
                    // Optimize for mobile viewport
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (!viewport) {
                        const meta = document.createElement('meta');
                        meta.name = 'viewport';
                        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                        document.head.appendChild(meta);
                    }
                },
                
                reportToNative(data) {
                    // Send data to React Native WebView
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify(data));
                    }
                },
                
                getStatus() {
                    return {
                        active: this.active,
                        attempts: this.attempts,
                        version: this.version,
                        platform: this.platform,
                        mercuryoForced: document.querySelectorAll('[data-auralo-webview-forced="true"]').length,
                        moonpayDestroyed: document.querySelectorAll('[data-auralo-mobile-destroyed="true"]').length,
                        walletFields: document.querySelectorAll('input[placeholder*="address" i], input[name*="wallet" i]').length,
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        viewport: {
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    };
                }
            };
            
            // Auto-initialize for mobile
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => window.AuraloWebViewForcer.init(), 200);
                });
            } else {
                setTimeout(() => window.AuraloWebViewForcer.init(), 200);
            }
            
            // Expose globally
            window.AuraloWebViewForcer = window.AuraloWebViewForcer;
            
            return 'Auralo WebView Mobile Forcer Initialized';
        })();
        `;
    };
    
    /**
     * Handle WebView navigation state changes
     */
    const handleNavigationStateChange = (navState) => {
        setCurrentUrl(navState.url);
        setLoading(navState.loading);
        
        if (navState.url.includes('simpleswap.io') && !navState.loading) {
            // Inject forcing script when SimpleSwap loads
            setTimeout(() => {
                injectMercuryoForcing();
            }, 1000);
        }
    };
    
    /**
     * Inject Mercuryo forcing script into WebView
     */
    const injectMercuryoForcing = () => {
        if (webViewRef.current) {
            setForcingActive(true);
            const script = getMercuryoForcingScript();
            
            webViewRef.current.injectJavaScript(script);
            
            console.log('📱 Mercuryo forcing script injected into WebView');
        }
    };
    
    /**
     * Handle messages from WebView
     */
    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            
            switch (data.type) {
                case 'forcing_stats':
                    setForcingStats({
                        attempts: data.attempts || 0,
                        mercuryoForced: data.mercuryoForced || 0,
                        moonpayDisabled: data.moonpayDisabled || 0
                    });
                    break;
                    
                case 'forcing_stopped':
                    setForcingActive(false);
                    Alert.alert('Forcing Complete', 'Mercuryo forcing has completed.');
                    break;
                    
                case 'exchange_complete':
                    if (onExchangeComplete) {
                        onExchangeComplete(data);
                    }
                    break;
                    
                case 'error':
                    if (onError) {
                        onError(data.error);
                    }
                    break;
                    
                case 'status_response':
                    console.log('📊 WebView Status:', data);
                    break;
                    
                case 'screenshot_request':
                    takeScreenshot();
                    break;
                    
                default:
                    console.log('📱 WebView message:', data);
            }
        } catch (error) {
            console.warn('Failed to parse WebView message:', error);
        }
    };
    
    /**
     * Send command to WebView
     */
    const sendCommand = (action, data = {}) => {
        if (webViewRef.current) {
            const command = {
                type: 'AURALO_NATIVE_COMMAND',
                action: action,
                ...data
            };
            
            const script = `
                window.dispatchEvent(new MessageEvent('message', {
                    data: ${JSON.stringify(command)}
                }));
            `;
            
            webViewRef.current.injectJavaScript(script);
        }
    };
    
    /**
     * Manual force Mercuryo
     */
    const forceMercuryo = () => {
        sendCommand('force_mercuryo');
    };
    
    /**
     * Get WebView status
     */
    const getStatus = () => {
        sendCommand('get_status');
    };
    
    /**
     * Take screenshot
     */
    const takeScreenshot = () => {
        // This would use react-native-view-shot or similar
        console.log('📸 Screenshot requested');
    };
    
    /**
     * Handle WebView errors
     */
    const handleError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error:', nativeEvent);
        
        if (onError) {
            onError(nativeEvent);
        }
        
        Alert.alert(
            'WebView Error',
            'Failed to load SimpleSwap. Please check your internet connection.',
            [
                { text: 'Retry', onPress: () => {
                    webViewRef.current?.reload();
                }},
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Auralo Exchange</Text>
                <Text style={styles.headerSubtitle}>
                    Secure crypto exchange with Mercuryo forcing
                </Text>
                
                {forcingActive && (
                    <View style={styles.forcingBadge}>
                        <Text style={styles.forcingBadgeText}>
                            ✅ Mercuryo Forcing Active
                        </Text>
                    </View>
                )}
            </View>
            
            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity 
                    style={[styles.button, styles.primaryButton]} 
                    onPress={forceMercuryo}
                >
                    <Text style={styles.buttonText}>Force Mercuryo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.secondaryButton]} 
                    onPress={getStatus}
                >
                    <Text style={styles.buttonTextSecondary}>Get Status</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.secondaryButton]} 
                    onPress={takeScreenshot}
                >
                    <Text style={styles.buttonTextSecondary}>Screenshot</Text>
                </TouchableOpacity>
            </View>
            
            {/* Stats */}
            {forcingActive && (
                <View style={styles.stats}>
                    <Text style={styles.statsText}>
                        Attempts: {forcingStats.attempts} | 
                        Mercuryo: {forcingStats.mercuryoForced} | 
                        MoonPay Disabled: {forcingStats.moonpayDisabled}
                    </Text>
                </View>
            )}
            
            {/* WebView */}
            <View style={styles.webViewContainer}>
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#22c55e" />
                        <Text style={styles.loadingText}>
                            Loading secure exchange...
                        </Text>
                    </View>
                )}
                
                <WebView
                    ref={webViewRef}
                    source={{ uri: targetUrl }}
                    style={styles.webView}
                    onNavigationStateChange={handleNavigationStateChange}
                    onMessage={handleMessage}
                    onError={handleError}
                    onLoadEnd={() => setLoading(false)}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    bounces={false}
                    scrollEnabled={true}
                    userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1 AuraloApp/1.0"
                    mixedContentMode="compatibility"
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    header: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#667eea',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    forcingBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: '#22c55e',
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginTop: 10,
    },
    forcingBadgeText: {
        color: '#22c55e',
        fontWeight: '600',
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#22c55e',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    buttonTextSecondary: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    stats: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    statsText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
    },
    webViewContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    webView: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default AuraloWebViewWrapper;

/**
 * USAGE EXAMPLE:
 * 
 * import AuraloWebViewWrapper from './AuraloWebViewWrapper';
 * 
 * const App = () => {
 *     const handleExchangeComplete = (data) => {
 *         console.log('Exchange completed:', data);
 *     };
 *     
 *     const handleError = (error) => {
 *         console.error('Exchange error:', error);
 *     };
 *     
 *     return (
 *         <AuraloWebViewWrapper
 *             amount={50}
 *             region="US"
 *             onExchangeComplete={handleExchangeComplete}
 *             onError={handleError}
 *         />
 *     );
 * };
 * 
 * INSTALLATION:
 * npm install react-native-webview
 * cd ios && pod install (for iOS)
 */