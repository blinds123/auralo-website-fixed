# Mercuryo Integration Options for Auralo

## Current Situation
SimpleSwap doesn't provide a URL parameter to force Mercuryo selection. The provider is chosen automatically based on:
- User location
- Currency pair
- Availability
- Internal algorithms

## Alternative Solutions:

### Option 1: Direct Mercuryo Widget Integration
Instead of using SimpleSwap, integrate Mercuryo directly:

```javascript
// Direct Mercuryo URL (replace SimpleSwap URL)
const MERCURYO_URL = 'https://exchange.mercuryo.io/?' + 
    'widget_id=30c56e3c-7ac2-4d06-8ff3-026cf8d8b6f6' + // SimpleSwap's Mercuryo widget ID
    '&type=buy' +
    '&currency=POL' +
    '&network=POLYGON' +
    '&amount=25' +
    '&fiat_currency=USD' +
    '&address=' + encodeURIComponent('0xE5173e7c3089bD89cd1341b637b8e1951745ED5C');
```

### Option 2: Custom Landing Page
Create an intermediate page that:
1. Shows payment provider options
2. Pre-selects Mercuryo
3. Redirects to the chosen provider

### Option 3: Conditional Redirect
Detect the provider on SimpleSwap and auto-redirect if not Mercuryo:
```javascript
// Add to your site or as a browser extension
if (window.location.href.includes('simpleswap.io') && !document.querySelector('[alt*="mercuryo"]')) {
    // Redirect to Mercuryo directly
}
```

### Option 4: SimpleSwap White Label Solution
Contact SimpleSwap about their white label or API solutions that might allow provider selection.

## Recommended Approach:
1. **Keep current implementation** - SimpleSwap with visual guidance
2. **Add fallback option** - Direct Mercuryo link if users have issues
3. **Monitor user feedback** - See if MoonPay selection is actually a problem

## Testing Required:
- Test from different locations
- Test at different times
- Test with different amounts
- Document which provider appears when