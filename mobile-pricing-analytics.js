/**
 * MOBILE PRICING ANALYTICS SYSTEM
 * 
 * Tracks mobile pricing discrimination impact and solution effectiveness
 * Provides data-driven insights for optimizing the business solution approach
 */

class MobilePricingAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = new Date().toISOString();
        this.analyticsKey = 'auralo_mobile_pricing_analytics';
        this.eventsKey = 'auralo_pricing_events';
        
        // Initialize analytics
        this.initializeSession();
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return 'session_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2);
    }

    /**
     * Initialize analytics session
     */
    initializeSession() {
        const deviceInfo = this.getDeviceInfo();
        const sessionData = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            device: deviceInfo,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            referrer: document.referrer,
            url: window.location.href
        };

        // Track session start
        this.trackEvent('session_start', sessionData);
        
        // Detect mobile pricing issue exposure
        if (deviceInfo.isMobile) {
            this.trackEvent('mobile_pricing_exposure', {
                potentialSavings: 1.50,
                affectedAmount: 21.00,
                fairAmount: 19.50
            });
        }
    }

    /**
     * Get comprehensive device information
     */
    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        
        return {
            isMobile: /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isTablet: /iPad|Android(?=.*\bTablet\b)/i.test(userAgent),
            isIOS: /iPhone|iPad|iPod/i.test(userAgent),
            isAndroid: /Android/i.test(userAgent),
            browser: this.getBrowserInfo(),
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            hasTouch: 'ontouchstart' in window,
            screenSize: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth
            },
            devicePixelRatio: window.devicePixelRatio || 1,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };
    }

    /**
     * Detect browser information
     */
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        
        return 'Unknown';
    }

    /**
     * Track analytics event
     */
    trackEvent(eventName, eventData = {}) {
        const event = {
            sessionId: this.sessionId,
            eventName: eventName,
            timestamp: new Date().toISOString(),
            data: eventData,
            url: window.location.href,
            timeFromStart: Date.now() - new Date(this.startTime).getTime()
        };

        // Store event locally
        const existingEvents = JSON.parse(localStorage.getItem(this.eventsKey) || '[]');
        existingEvents.push(event);
        
        // Keep only last 1000 events to prevent storage overflow
        if (existingEvents.length > 1000) {
            existingEvents.splice(0, existingEvents.length - 1000);
        }
        
        localStorage.setItem(this.eventsKey, JSON.stringify(existingEvents));

        // Log for debugging
        console.log('📊 Analytics Event:', eventName, eventData);

        // In production, send to analytics service
        this.sendToAnalyticsService(event);
    }

    /**
     * Track mobile pricing issue detected
     */
    trackMobilePricingIssueDetected() {
        this.trackEvent('mobile_pricing_issue_detected', {
            expectedPrice: 19.50,
            mobilePrice: 21.00,
            overcharge: 1.50,
            overchargePercentage: 7.69
        });
    }

    /**
     * Track business solution shown
     */
    trackBusinessSolutionShown(solutionType = 'full') {
        this.trackEvent('business_solution_shown', {
            solutionType: solutionType,
            options: ['desktop_mode', 'rebate_payment', 'alternative_provider'],
            recommendedOption: 'desktop_mode'
        });
    }

    /**
     * Track user solution choice
     */
    trackSolutionChoice(chosenSolution, additionalData = {}) {
        this.trackEvent('solution_choice', {
            chosenSolution: chosenSolution,
            timestamp: new Date().toISOString(),
            ...additionalData
        });
    }

    /**
     * Track desktop mode instructions shown
     */
    trackDesktopModeInstructionsShown(browserType) {
        this.trackEvent('desktop_mode_instructions_shown', {
            browserType: browserType,
            deviceType: this.getDeviceInfo().isIOS ? 'iOS' : 'Android'
        });
    }

    /**
     * Track desktop mode attempt
     */
    trackDesktopModeAttempt() {
        this.trackEvent('desktop_mode_attempt', {
            attemptTime: new Date().toISOString(),
            previousViewportWidth: window.innerWidth
        });
    }

    /**
     * Track desktop mode success/failure
     */
    trackDesktopModeResult(success, newViewportWidth = null) {
        this.trackEvent('desktop_mode_result', {
            success: success,
            newViewportWidth: newViewportWidth,
            viewportChange: newViewportWidth ? (newViewportWidth - window.innerWidth) : 0
        });
    }

    /**
     * Track rebate code generation
     */
    trackRebateCodeGenerated(rebateCode) {
        this.trackEvent('rebate_code_generated', {
            rebateCode: rebateCode,
            rebateAmount: 1.50,
            expirationDays: 30
        });
    }

    /**
     * Track SimpleSwap navigation
     */
    trackSimpleSwapNavigation(method, parameters = {}) {
        this.trackEvent('simpleswap_navigation', {
            method: method, // 'desktop_mode', 'mobile_rebate', 'alternative'
            parameters: parameters,
            targetUrl: 'https://simpleswap.io/exchange',
            expectedProvider: 'mercury',
            expectedAmount: method === 'mobile_rebate' ? 21.00 : 19.50
        });
    }

    /**
     * Track payment completion (if detectable)
     */
    trackPaymentCompletion(amount, provider, success = true) {
        this.trackEvent('payment_completion', {
            amount: amount,
            provider: provider,
            success: success,
            savings: amount === 19.50 ? 1.50 : 0,
            method: amount === 19.50 ? 'desktop_mode' : 'mobile_rebate'
        });
    }

    /**
     * Track user returning from SimpleSwap
     */
    trackReturnFromSimpleSwap(outcome = 'unknown') {
        this.trackEvent('return_from_simpleswap', {
            outcome: outcome, // 'completed', 'abandoned', 'error'
            timeAway: Date.now() - new Date(this.startTime).getTime()
        });
    }

    /**
     * Get analytics summary for admin dashboard
     */
    getAnalyticsSummary(days = 7) {
        const events = JSON.parse(localStorage.getItem(this.eventsKey) || '[]');
        const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
        
        const recentEvents = events.filter(event => 
            new Date(event.timestamp) > cutoffDate
        );

        // Calculate key metrics
        const summary = {
            totalSessions: new Set(recentEvents.map(e => e.sessionId)).size,
            mobileUsersAffected: recentEvents.filter(e => e.eventName === 'mobile_pricing_exposure').length,
            solutionChoices: this.aggregateSolutionChoices(recentEvents),
            desktopModeAttempts: recentEvents.filter(e => e.eventName === 'desktop_mode_attempt').length,
            desktopModeSuccessRate: this.calculateDesktopModeSuccessRate(recentEvents),
            rebateCodesGenerated: recentEvents.filter(e => e.eventName === 'rebate_code_generated').length,
            simpleswapNavigations: recentEvents.filter(e => e.eventName === 'simpleswap_navigation').length,
            estimatedLostRevenue: recentEvents.filter(e => e.eventName === 'mobile_pricing_exposure').length * 1.50,
            topDevices: this.getTopDevices(recentEvents),
            topBrowsers: this.getTopBrowsers(recentEvents)
        };

        return summary;
    }

    /**
     * Aggregate solution choices from events
     */
    aggregateSolutionChoices(events) {
        const choices = events.filter(e => e.eventName === 'solution_choice');
        const aggregated = {};
        
        choices.forEach(choice => {
            const solution = choice.data.chosenSolution;
            aggregated[solution] = (aggregated[solution] || 0) + 1;
        });
        
        return aggregated;
    }

    /**
     * Calculate desktop mode success rate
     */
    calculateDesktopModeSuccessRate(events) {
        const attempts = events.filter(e => e.eventName === 'desktop_mode_attempt').length;
        const successes = events.filter(e => 
            e.eventName === 'desktop_mode_result' && e.data.success
        ).length;
        
        return attempts > 0 ? ((successes / attempts) * 100).toFixed(2) : 0;
    }

    /**
     * Get top devices from analytics
     */
    getTopDevices(events) {
        const sessionEvents = events.filter(e => e.eventName === 'session_start');
        const devices = {};
        
        sessionEvents.forEach(event => {
            if (event.data.device) {
                const deviceKey = `${event.data.device.platform} - ${event.data.device.browser}`;
                devices[deviceKey] = (devices[deviceKey] || 0) + 1;
            }
        });
        
        return Object.entries(devices)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([device, count]) => ({ device, count }));
    }

    /**
     * Get top browsers from analytics
     */
    getTopBrowsers(events) {
        const sessionEvents = events.filter(e => e.eventName === 'session_start');
        const browsers = {};
        
        sessionEvents.forEach(event => {
            if (event.data.device && event.data.device.browser) {
                const browser = event.data.device.browser;
                browsers[browser] = (browsers[browser] || 0) + 1;
            }
        });
        
        return Object.entries(browsers)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([browser, count]) => ({ browser, count }));
    }

    /**
     * Send to analytics service (placeholder for production)
     */
    sendToAnalyticsService(event) {
        // In production, integrate with:
        // - Google Analytics 4
        // - Mixpanel
        // - Amplitude
        // - Custom analytics endpoint
        
        // Example implementation:
        /*
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        }).catch(error => {
            console.warn('Failed to send analytics:', error);
        });
        */
        
        console.log('📈 Analytics Event Queued:', event.eventName);
    }

    /**
     * Generate analytics report for admin
     */
    generateAnalyticsReport(days = 30) {
        const summary = this.getAnalyticsSummary(days);
        
        const report = {
            reportDate: new Date().toISOString(),
            period: `Last ${days} days`,
            keyMetrics: {
                totalImpactedUsers: summary.mobileUsersAffected,
                totalLostRevenue: `€${summary.estimatedLostRevenue.toFixed(2)}`,
                averageLossPerUser: summary.mobileUsersAffected > 0 
                    ? `€${(summary.estimatedLostRevenue / summary.mobileUsersAffected).toFixed(2)}` 
                    : '€0.00',
                desktopModeSuccessRate: `${summary.desktopModeSuccessRate}%`,
                mostPopularSolution: this.getMostPopularSolution(summary.solutionChoices)
            },
            recommendations: this.generateRecommendations(summary),
            rawData: summary
        };
        
        return report;
    }

    /**
     * Get most popular solution choice
     */
    getMostPopularSolution(solutionChoices) {
        if (Object.keys(solutionChoices).length === 0) return 'No data';
        
        return Object.entries(solutionChoices)
            .sort(([,a], [,b]) => b - a)[0][0];
    }

    /**
     * Generate recommendations based on analytics
     */
    generateRecommendations(summary) {
        const recommendations = [];
        
        if (summary.desktopModeSuccessRate < 70) {
            recommendations.push({
                priority: 'high',
                issue: 'Low desktop mode success rate',
                recommendation: 'Improve desktop mode instructions with visual guides and video tutorials',
                expectedImpact: 'Increase success rate by 15-25%'
            });
        }
        
        if (summary.rebateCodesGenerated > summary.mobileUsersAffected * 0.3) {
            recommendations.push({
                priority: 'medium',
                issue: 'High rebate code usage',
                recommendation: 'Consider negotiating with SimpleSwap for uniform pricing or find alternative provider',
                expectedImpact: 'Eliminate €1.50 loss per mobile user'
            });
        }
        
        if (summary.mobileUsersAffected > 50) {
            recommendations.push({
                priority: 'high',
                issue: 'Significant mobile user impact',
                recommendation: 'Implement alternative payment provider with uniform pricing',
                expectedImpact: 'Eliminate mobile pricing discrimination entirely'
            });
        }
        
        return recommendations;
    }

    /**
     * Export analytics data for external analysis
     */
    exportAnalyticsData(format = 'json') {
        const events = JSON.parse(localStorage.getItem(this.eventsKey) || '[]');
        const summary = this.getAnalyticsSummary(30);
        
        const exportData = {
            exportDate: new Date().toISOString(),
            totalEvents: events.length,
            summary: summary,
            events: events
        };
        
        if (format === 'csv') {
            return this.convertToCSV(events);
        }
        
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Convert events to CSV format
     */
    convertToCSV(events) {
        if (events.length === 0) return '';
        
        const headers = ['timestamp', 'sessionId', 'eventName', 'url', 'timeFromStart', 'data'];
        const rows = events.map(event => [
            event.timestamp,
            event.sessionId,
            event.eventName,
            event.url,
            event.timeFromStart,
            JSON.stringify(event.data)
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }
}

/**
 * Integration with existing payment flow
 */
function integrateMobilePricingAnalytics() {
    const analytics = new MobilePricingAnalytics();
    
    // Track mobile pricing issue detection when redirecting to business solution
    if (window.location.href.includes('prp-business-solution.html')) {
        analytics.trackMobilePricingIssueDetected();
        analytics.trackBusinessSolutionShown('full');
    }
    
    // Track solution choices
    window.trackSolutionChoice = function(solution, additionalData = {}) {
        analytics.trackSolutionChoice(solution, additionalData);
    };
    
    // Track desktop mode attempts
    window.trackDesktopModeAttempt = function() {
        analytics.trackDesktopModeAttempt();
    };
    
    // Track desktop mode results
    window.trackDesktopModeResult = function(success) {
        analytics.trackDesktopModeResult(success, window.innerWidth);
    };
    
    // Track rebate code generation
    window.trackRebateCodeGenerated = function(code) {
        analytics.trackRebateCodeGenerated(code);
    };
    
    // Track SimpleSwap navigation
    window.trackSimpleSwapNavigation = function(method) {
        analytics.trackSimpleSwapNavigation(method, {
            provider: 'mercury',
            amount: method === 'desktop_mode' ? 19.50 : 21.00
        });
    };
    
    // Make analytics available globally for admin dashboard
    window.mobilePricingAnalytics = analytics;
    
    return analytics;
}

// Initialize analytics system
const mobilePricingAnalytics = integrateMobilePricingAnalytics();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobilePricingAnalytics;
}