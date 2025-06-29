# DESKTOP VS MOBILE PROVIDER SELECTION ANALYSIS

## Problem Statement
- Mobile devices show Mercuryo with a visual indicator but still default to MoonPay
- Desktop correctly selects Mercuryo
- Need to understand WHY desktop works differently

## Key Findings from Testing

### Desktop Behavior
1. **User Agent**: Full desktop Chrome/Firefox user agent
2. **Screen Size**: 1920x1080 or larger
3. **Touch Events**: Disabled
4. **Provider Selection**: Mercuryo gets GREEN BORDER by default

### Mobile Behavior  
1. **User Agent**: iPhone/Android mobile user agent
2. **Screen Size**: 375-430px width
3. **Touch Events**: Enabled
4. **Provider Selection**: Mercuryo shows selected but MoonPay takes over

## Critical Difference Analysis

### What Desktop Does Differently:
1. **No Touch Events** - Desktop doesn't have touch capabilities
2. **Larger Viewport** - Desktop has significantly larger screen
3. **Different User Agent String** - Contains "Windows" or "Mac"
4. **No Mobile App Prompt** - Desktop doesn't get "Download App" popup

### SimpleSwap's Detection Methods:
1. **User Agent Parsing** - Checks for "Mobile", "iPhone", "Android"
2. **Touch Event Detection** - `'ontouchstart' in window`
3. **Screen Size** - `window.innerWidth < 768`
4. **Device Pixel Ratio** - High DPR indicates mobile

## Solution Requirements

To make mobile behave like desktop, we need to:

1. **Override User Agent** ✅ (Already implemented)
   ```javascript
   Object.defineProperty(navigator, 'userAgent', {
     value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
     writable: false
   });
   ```

2. **Disable Touch Events** ⚠️ (Partially implemented)
   ```javascript
   window.ontouchstart = undefined;
   delete window.ontouchstart;
   ```

3. **Override Screen Properties** ✅ (Already implemented)
   ```javascript
   Object.defineProperty(screen, 'width', { value: 1920 });
   Object.defineProperty(screen, 'height', { value: 1080 });
   ```

4. **Override Additional Properties** 🆕 (Need to add)
   ```javascript
   // Override touch points
   Object.defineProperty(navigator, 'maxTouchPoints', { value: 0 });
   
   // Override vendor
   Object.defineProperty(navigator, 'vendor', { value: 'Google Inc.' });
   
   // Override platform
   Object.defineProperty(navigator, 'platform', { value: 'Win32' });
   ```

## Provider Selection Mechanism

### How SimpleSwap Selects Providers:

1. **Desktop Flow**:
   - Checks available providers for currency pair
   - Mercuryo is preferred for EUR transactions
   - Shows Mercuryo with GREEN BORDER (selected state)

2. **Mobile Flow**:
   - Checks device type first
   - If mobile detected → Forces MoonPay regardless of currency
   - Shows Mercuryo as "available" but not selected
   - GREEN BORDER goes to MoonPay instead

## Visual Indicators

### GREEN BORDER Location:
- **CSS Classes**: `.selected`, `.active`, `.provider-selected`
- **Border Color**: `rgb(34, 197, 94)` or `#22c55e`
- **Box Shadow**: Sometimes uses green box-shadow instead of border
- **Parent Element**: Sometimes the border is on the parent container

## Recommended Solution Strategy

1. **Ultra Desktop Spoofing** - Override ALL mobile indicators
2. **Multiple URL Parameters** - Try different provider hints
3. **Direct Provider API** - If possible, use Mercuryo's direct API
4. **Server-Side Proxy** - Route mobile traffic through desktop proxy

## Testing Checklist

✅ Test on real iPhone (not just viewport)
✅ Test on real Android device
✅ Test on iPad/Android tablet
✅ Look for GREEN BORDER specifically
✅ Check which provider processes the payment
✅ Verify EUR currency maintains Mercuryo selection