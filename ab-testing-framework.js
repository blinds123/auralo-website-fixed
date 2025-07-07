/**
 * A/B TESTING FRAMEWORK FOR MOBILE PRICING SOLUTIONS
 * 
 * Tests different approaches to communicating and solving the mobile pricing issue
 * Optimizes user experience and solution effectiveness through data-driven experiments
 */

class MobilePricingABTestFramework {
    constructor() {
        this.testingKey = 'auralo_ab_tests';
        this.assignmentKey = 'auralo_ab_assignment';
        this.resultsKey = 'auralo_ab_results';
        this.currentTests = this.loadActiveTests();
        this.userAssignment = this.getUserAssignment();
        
        this.initializeFramework();
    }

    /**
     * Initialize A/B testing framework
     */
    initializeFramework() {
        // Set up default test configurations
        this.setupDefaultTests();
        
        // Assign user to test group if not already assigned
        if (!this.userAssignment) {
            this.assignUserToTests();
        }
        
        // Track test exposure
        this.trackTestExposure();
    }

    /**
     * Setup default A/B test configurations
     */
    setupDefaultTests() {
        const defaultTests = {
            'messaging_approach': {
                name: 'Messaging Approach Test',
                description: 'Test different ways to communicate the mobile pricing issue',
                variations: {
                    'problem_focused': {
                        weight: 25,
                        name: 'Problem-Focused',
                        config: {
                            headline: '⚠️ Mobile Pricing Alert',
                            tone: 'problem_identification',
                            emphasis: 'issue_explanation'
                        }
                    },
                    'solution_focused': {
                        weight: 25,
                        name: 'Solution-Focused', 
                        config: {
                            headline: '💰 Save €1.50 - Choose Your Method',
                            tone: 'solution_oriented',
                            emphasis: 'available_solutions'
                        }
                    },
                    'benefit_focused': {
                        weight: 25,
                        name: 'Benefit-Focused',
                        config: {
                            headline: '🎉 Great News! We Found You Savings',
                            tone: 'positive_framing',
                            emphasis: 'user_benefits'
                        }
                    },
                    'transparency_focused': {
                        weight: 25,
                        name: 'Transparency-Focused',
                        config: {
                            headline: '🤝 Fair Pricing Guarantee',
                            tone: 'transparent_honest',
                            emphasis: 'trust_building'
                        }
                    }
                },
                metrics: ['conversion_rate', 'desktop_mode_success', 'user_satisfaction'],
                status: 'active'
            },

            'solution_ordering': {
                name: 'Solution Priority Order Test',
                description: 'Test different orders of presenting solutions to users',
                variations: {
                    'desktop_first': {
                        weight: 33.33,
                        name: 'Desktop Mode First',
                        config: {
                            order: ['desktop_mode', 'rebate_system', 'alternative_provider'],
                            recommended: 'desktop_mode'
                        }
                    },
                    'rebate_first': {
                        weight: 33.33,
                        name: 'Rebate System First',
                        config: {
                            order: ['rebate_system', 'desktop_mode', 'alternative_provider'],
                            recommended: 'rebate_system'
                        }
                    },
                    'choice_equal': {
                        weight: 33.34,
                        name: 'Equal Choice Presentation',
                        config: {
                            order: ['desktop_mode', 'rebate_system', 'alternative_provider'],
                            recommended: null
                        }
                    }
                },
                metrics: ['solution_selection', 'completion_rate', 'time_to_decision'],
                status: 'active'
            },

            'instruction_format': {
                name: 'Instruction Format Test',
                description: 'Test different formats for desktop mode instructions',
                variations: {
                    'text_only': {
                        weight: 25,
                        name: 'Text Instructions Only',
                        config: {
                            format: 'text',
                            visual_aids: false,
                            step_emphasis: 'numbered_list'
                        }
                    },
                    'visual_enhanced': {
                        weight: 25,
                        name: 'Visual Enhanced Instructions',
                        config: {
                            format: 'text_with_images',
                            visual_aids: true,
                            step_emphasis: 'visual_steps'
                        }
                    },
                    'video_tutorial': {
                        weight: 25,
                        name: 'Video Tutorial',
                        config: {
                            format: 'video',
                            visual_aids: true,
                            step_emphasis: 'demonstration'
                        }
                    },
                    'interactive_guide': {
                        weight: 25,
                        name: 'Interactive Step Guide',
                        config: {
                            format: 'interactive',
                            visual_aids: true,
                            step_emphasis: 'guided_interaction'
                        }
                    }
                },
                metrics: ['desktop_mode_success_rate', 'instruction_completion', 'user_confusion'],
                status: 'active'
            },

            'ui_design': {
                name: 'UI Design Approach Test',
                description: 'Test different visual designs for the business solution page',
                variations: {
                    'minimal_clean': {
                        weight: 25,
                        name: 'Minimal Clean Design',
                        config: {
                            style: 'minimal',
                            colors: 'subtle',
                            layout: 'single_column'
                        }
                    },
                    'bold_colorful': {
                        weight: 25,
                        name: 'Bold Colorful Design',
                        config: {
                            style: 'vibrant',
                            colors: 'high_contrast',
                            layout: 'card_based'
                        }
                    },
                    'professional_trust': {
                        weight: 25,
                        name: 'Professional Trust-Building',
                        config: {
                            style: 'corporate',
                            colors: 'professional',
                            layout: 'structured'
                        }
                    },
                    'gamified_fun': {
                        weight: 25,
                        name: 'Gamified Fun Approach',
                        config: {
                            style: 'playful',
                            colors: 'energetic',
                            layout: 'interactive'
                        }
                    }
                },
                metrics: ['visual_appeal', 'trust_perception', 'engagement_time'],
                status: 'planned'
            },

            'urgency_level': {
                name: 'Urgency Communication Test',
                description: 'Test different levels of urgency in messaging',
                variations: {
                    'high_urgency': {
                        weight: 33.33,
                        name: 'High Urgency',
                        config: {
                            urgency_level: 'high',
                            language: 'immediate_action',
                            visual_cues: 'warning_styles'
                        }
                    },
                    'moderate_urgency': {
                        weight: 33.33,
                        name: 'Moderate Urgency',
                        config: {
                            urgency_level: 'moderate',
                            language: 'helpful_guidance',
                            visual_cues: 'information_styles'
                        }
                    },
                    'no_urgency': {
                        weight: 33.34,
                        name: 'No Urgency',
                        config: {
                            urgency_level: 'none',
                            language: 'casual_informative',
                            visual_cues: 'neutral_styles'
                        }
                    }
                },
                metrics: ['stress_level', 'completion_rate', 'brand_perception'],
                status: 'planned'
            }
        };

        // Save default tests if none exist
        const existingTests = this.loadActiveTests();
        if (Object.keys(existingTests).length === 0) {
            localStorage.setItem(this.testingKey, JSON.stringify(defaultTests));
            this.currentTests = defaultTests;
        }
    }

    /**
     * Assign user to test variations
     */
    assignUserToTests() {
        const sessionId = this.generateSessionId();
        const assignment = {
            sessionId: sessionId,
            assignedAt: new Date().toISOString(),
            tests: {}
        };

        // Assign to each active test
        Object.entries(this.currentTests).forEach(([testId, test]) => {
            if (test.status === 'active') {
                const variation = this.selectVariation(test.variations);
                assignment.tests[testId] = {
                    variation: variation,
                    assignedAt: new Date().toISOString()
                };
            }
        });

        localStorage.setItem(this.assignmentKey, JSON.stringify(assignment));
        this.userAssignment = assignment;

        // Track assignment
        this.trackEvent('ab_test_assignment', assignment);
    }

    /**
     * Select variation based on weights
     */
    selectVariation(variations) {
        const rand = Math.random() * 100;
        let cumulative = 0;

        for (const [variationId, variation] of Object.entries(variations)) {
            cumulative += variation.weight;
            if (rand <= cumulative) {
                return variationId;
            }
        }

        // Fallback to first variation
        return Object.keys(variations)[0];
    }

    /**
     * Get user's current test assignment
     */
    getUserAssignment() {
        const assignment = localStorage.getItem(this.assignmentKey);
        return assignment ? JSON.parse(assignment) : null;
    }

    /**
     * Load active tests
     */
    loadActiveTests() {
        const tests = localStorage.getItem(this.testingKey);
        return tests ? JSON.parse(tests) : {};
    }

    /**
     * Generate session ID
     */
    generateSessionId() {
        return 'ab_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2);
    }

    /**
     * Get variation for specific test
     */
    getVariation(testId) {
        if (!this.userAssignment || !this.userAssignment.tests[testId]) {
            return null;
        }
        
        return this.userAssignment.tests[testId].variation;
    }

    /**
     * Get test configuration for current user
     */
    getTestConfig(testId) {
        const variation = this.getVariation(testId);
        if (!variation || !this.currentTests[testId]) {
            return null;
        }

        return this.currentTests[testId].variations[variation].config;
    }

    /**
     * Track test exposure
     */
    trackTestExposure() {
        if (!this.userAssignment) return;

        Object.entries(this.userAssignment.tests).forEach(([testId, testData]) => {
            this.trackEvent('ab_test_exposure', {
                testId: testId,
                variation: testData.variation,
                exposureTime: new Date().toISOString()
            });
        });
    }

    /**
     * Track test conversion event
     */
    trackConversion(testId, conversionType, additionalData = {}) {
        const variation = this.getVariation(testId);
        if (!variation) return;

        this.trackEvent('ab_test_conversion', {
            testId: testId,
            variation: variation,
            conversionType: conversionType,
            conversionTime: new Date().toISOString(),
            ...additionalData
        });

        // Store result for analysis
        this.storeTestResult(testId, variation, conversionType, additionalData);
    }

    /**
     * Store test result for analysis
     */
    storeTestResult(testId, variation, conversionType, data) {
        const results = JSON.parse(localStorage.getItem(this.resultsKey) || '[]');
        
        results.push({
            sessionId: this.userAssignment.sessionId,
            testId: testId,
            variation: variation,
            conversionType: conversionType,
            timestamp: new Date().toISOString(),
            data: data
        });

        // Keep only last 1000 results
        if (results.length > 1000) {
            results.splice(0, results.length - 1000);
        }

        localStorage.setItem(this.resultsKey, JSON.stringify(results));
    }

    /**
     * Track analytics event
     */
    trackEvent(eventName, eventData) {
        // Integration with analytics system
        if (window.mobilePricingAnalytics) {
            window.mobilePricingAnalytics.trackEvent(eventName, eventData);
        }
        
        console.log('🧪 A/B Test Event:', eventName, eventData);
    }

    /**
     * Generate business solution page based on test assignments
     */
    generateBusinessSolutionPage() {
        const messagingConfig = this.getTestConfig('messaging_approach');
        const orderingConfig = this.getTestConfig('solution_ordering');
        const instructionConfig = this.getTestConfig('instruction_format');
        
        // Default configurations if no test assignment
        const config = {
            messaging: messagingConfig || { 
                headline: '€19.50 Price Guarantee',
                tone: 'solution_oriented',
                emphasis: 'available_solutions'
            },
            ordering: orderingConfig || {
                order: ['desktop_mode', 'rebate_system', 'alternative_provider'],
                recommended: 'desktop_mode'
            },
            instructions: instructionConfig || {
                format: 'text',
                visual_aids: false,
                step_emphasis: 'numbered_list'
            }
        };

        return this.buildPageHTML(config);
    }

    /**
     * Build HTML for business solution page based on test configuration
     */
    buildPageHTML(config) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Complete Your Purchase - €19.50</title>
                <style>${this.getPageStyles(config)}</style>
            </head>
            <body>
                <div class="container">
                    ${this.generateHeaderSection(config.messaging)}
                    ${this.generateSolutionsSection(config.ordering)}
                    ${this.generateInformationSection()}
                </div>
                
                <script>
                    ${this.generatePageScript(config)}
                </script>
            </body>
            </html>
        `;

        return html;
    }

    /**
     * Generate header section based on messaging test
     */
    generateHeaderSection(messagingConfig) {
        const headlines = {
            'problem_identification': '⚠️ Mobile Pricing Alert',
            'solution_oriented': '💰 Save €1.50 - Choose Your Method',
            'positive_framing': '🎉 Great News! We Found You Savings',
            'transparent_honest': '🤝 Fair Pricing Guarantee'
        };

        const subtitles = {
            'problem_identification': 'We detected a mobile pricing discrepancy and created solutions',
            'solution_oriented': 'Multiple ways to ensure you pay the fair price',
            'positive_framing': 'We ensure you get the best price on any device',
            'transparent_honest': 'We ensure you pay the same price on any device'
        };

        const headline = headlines[messagingConfig.tone] || headlines['solution_oriented'];
        const subtitle = subtitles[messagingConfig.tone] || subtitles['solution_oriented'];

        return `
            <div class="price-guarantee">
                <h1>${headline}</h1>
                <div class="subtitle">${subtitle}</div>
            </div>
        `;
    }

    /**
     * Generate solutions section based on ordering test
     */
    generateSolutionsSection(orderingConfig) {
        const solutions = {
            'desktop_mode': this.generateDesktopModeSolution(orderingConfig.recommended === 'desktop_mode'),
            'rebate_system': this.generateRebateSystemSolution(orderingConfig.recommended === 'rebate_system'),
            'alternative_provider': this.generateAlternativeProviderSolution(orderingConfig.recommended === 'alternative_provider')
        };

        let html = '<h2>Choose Your Payment Method:</h2><div class="options-container">';
        
        orderingConfig.order.forEach(solutionId => {
            html += solutions[solutionId];
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Generate desktop mode solution HTML
     */
    generateDesktopModeSolution(isRecommended) {
        const recommendedClass = isRecommended ? ' recommended' : '';
        const recommendedBadge = isRecommended ? '<span class="option-badge">RECOMMENDED</span>' : '';

        return `
            <div class="option${recommendedClass}" onclick="selectOption(1)">
                <div class="option-header">
                    <span class="option-title">🖥️ Desktop Mode Payment</span>
                    ${recommendedBadge}
                </div>
                <div class="option-description">
                    Enable desktop mode in your browser to get €19.50 pricing directly
                </div>
                <button class="proceed-button primary" onclick="proceedDesktopMode(event)">
                    Enable Desktop Mode & Pay €19.50
                </button>
            </div>
        `;
    }

    /**
     * Generate rebate system solution HTML
     */
    generateRebateSystemSolution(isRecommended) {
        const recommendedClass = isRecommended ? ' recommended' : '';
        const recommendedBadge = isRecommended ? '<span class="option-badge">RECOMMENDED</span>' : '';

        return `
            <div class="option${recommendedClass}" onclick="selectOption(2)">
                <div class="option-header">
                    <span class="option-title">💳 Mobile Payment + Rebate</span>
                    ${recommendedBadge}
                </div>
                <div class="option-description">
                    Pay the €21 mobile price and receive an instant €1.50 rebate code
                </div>
                <button class="proceed-button" onclick="proceedWithRebate(event)">
                    Pay €21 & Get €1.50 Rebate
                </button>
            </div>
        `;
    }

    /**
     * Generate alternative provider solution HTML
     */
    generateAlternativeProviderSolution(isRecommended) {
        const recommendedClass = isRecommended ? ' recommended' : '';
        const recommendedBadge = isRecommended ? '<span class="option-badge">RECOMMENDED</span>' : '';

        return `
            <div class="option${recommendedClass}" onclick="selectOption(3)">
                <div class="option-header">
                    <span class="option-title">🔄 Alternative Payment</span>
                    ${recommendedBadge}
                </div>
                <div class="option-description">
                    Use our alternative payment provider with guaranteed €19.50 pricing
                </div>
                <button class="proceed-button" onclick="useAlternative(event)">
                    Use Alternative Provider
                </button>
            </div>
        `;
    }

    /**
     * Generate information section
     */
    generateInformationSection() {
        return `
            <div class="info-box">
                <strong>Why the price difference?</strong><br>
                Our payment partner applies different rates for mobile devices. We believe in fair pricing, so we offer these solutions to ensure you pay the correct amount.
            </div>
        `;
    }

    /**
     * Get page styles (placeholder - implement based on UI design test)
     */
    getPageStyles(config) {
        // Return CSS based on test configuration
        // This would be expanded based on ui_design test results
        return `
            body {
                margin: 0;
                padding: 20px;
                background: #0a0a0a;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
            }
            
            .price-guarantee {
                background: linear-gradient(135deg, #4CAF50, #45a049);
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                margin-bottom: 30px;
                box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
            }
            
            /* Additional styles would be added based on test configurations */
        `;
    }

    /**
     * Generate page script based on test configuration
     */
    generatePageScript(config) {
        return `
            // Track page view
            if (window.abTestFramework) {
                window.abTestFramework.trackConversion('messaging_approach', 'page_view');
                window.abTestFramework.trackConversion('solution_ordering', 'page_view');
            }
            
            // Track solution selection
            function selectOption(option) {
                if (window.abTestFramework) {
                    const solutions = ['desktop_mode', 'rebate_system', 'alternative_provider'];
                    window.abTestFramework.trackConversion('solution_ordering', 'solution_selected', {
                        selectedOption: solutions[option - 1]
                    });
                }
            }
            
            // Enhanced tracking for specific actions
            function proceedDesktopMode(event) {
                if (window.abTestFramework) {
                    window.abTestFramework.trackConversion('messaging_approach', 'desktop_mode_chosen');
                    window.abTestFramework.trackConversion('instruction_format', 'desktop_mode_attempt');
                }
                // Original functionality here
            }
        `;
    }

    /**
     * Analyze test results
     */
    analyzeTestResults(testId, days = 7) {
        const results = JSON.parse(localStorage.getItem(this.resultsKey) || '[]');
        const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
        
        const testResults = results.filter(result => 
            result.testId === testId && 
            new Date(result.timestamp) > cutoffDate
        );

        if (testResults.length === 0) {
            return { error: 'No results found for this test' };
        }

        // Group by variation
        const byVariation = {};
        testResults.forEach(result => {
            if (!byVariation[result.variation]) {
                byVariation[result.variation] = {
                    exposures: 0,
                    conversions: 0,
                    conversionsByType: {}
                };
            }
            
            byVariation[result.variation].exposures++;
            
            if (result.conversionType !== 'page_view') {
                byVariation[result.variation].conversions++;
                
                const type = result.conversionType;
                byVariation[result.variation].conversionsByType[type] = 
                    (byVariation[result.variation].conversionsByType[type] || 0) + 1;
            }
        });

        // Calculate conversion rates
        Object.keys(byVariation).forEach(variation => {
            const data = byVariation[variation];
            data.conversionRate = data.exposures > 0 ? 
                ((data.conversions / data.exposures) * 100).toFixed(2) : 0;
        });

        return {
            testId: testId,
            period: `Last ${days} days`,
            totalResults: testResults.length,
            variations: byVariation,
            winner: this.determineWinner(byVariation),
            statisticalSignificance: this.calculateSignificance(byVariation)
        };
    }

    /**
     * Determine winning variation
     */
    determineWinner(variations) {
        let winner = null;
        let highestRate = 0;

        Object.entries(variations).forEach(([variation, data]) => {
            const rate = parseFloat(data.conversionRate);
            if (rate > highestRate) {
                highestRate = rate;
                winner = variation;
            }
        });

        return winner;
    }

    /**
     * Calculate statistical significance (simplified)
     */
    calculateSignificance(variations) {
        const variationNames = Object.keys(variations);
        if (variationNames.length < 2) return 'Insufficient data';

        // Simplified significance calculation
        // In production, use proper statistical testing
        const totalSamples = Object.values(variations)
            .reduce((sum, v) => sum + v.exposures, 0);

        if (totalSamples < 100) return 'Insufficient sample size';
        if (totalSamples < 1000) return 'Low confidence';
        
        return 'Statistically significant';
    }

    /**
     * Export test results for analysis
     */
    exportTestResults(format = 'json') {
        const results = JSON.parse(localStorage.getItem(this.resultsKey) || '[]');
        const tests = this.currentTests;
        
        const exportData = {
            exportDate: new Date().toISOString(),
            tests: tests,
            results: results,
            summary: this.generateTestSummary()
        };

        if (format === 'csv') {
            return this.convertResultsToCSV(results);
        }

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Generate test summary
     */
    generateTestSummary() {
        const summary = {};
        
        Object.keys(this.currentTests).forEach(testId => {
            summary[testId] = this.analyzeTestResults(testId, 30);
        });

        return summary;
    }

    /**
     * Convert results to CSV
     */
    convertResultsToCSV(results) {
        if (results.length === 0) return '';
        
        const headers = ['timestamp', 'sessionId', 'testId', 'variation', 'conversionType', 'data'];
        const rows = results.map(result => [
            result.timestamp,
            result.sessionId,
            result.testId,
            result.variation,
            result.conversionType,
            JSON.stringify(result.data)
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }
}

/**
 * Initialize A/B testing framework
 */
function initializeABTesting() {
    const abTestFramework = new MobilePricingABTestFramework();
    window.abTestFramework = abTestFramework;
    
    // Generate page content based on test assignments
    if (window.location.href.includes('prp-business-solution.html')) {
        // Replace page content with A/B test version
        const testPageHTML = abTestFramework.generateBusinessSolutionPage();
        // Implementation would replace current page content
    }
    
    return abTestFramework;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobilePricingABTestFramework;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeABTesting();
    });
}