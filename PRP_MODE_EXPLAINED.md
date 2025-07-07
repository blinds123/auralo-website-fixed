# 🔐 PRP Mode Implementation

## What is PRP Mode?

PRP (Pre-Render Proxy) Mode is an aggressive approach to force desktop behavior before SimpleSwap loads. It attempts to:

1. **Pre-render** the SimpleSwap page with desktop parameters
2. **Proxy** all requests through a desktop-spoofed environment  
3. **Prevent** mobile detection by overriding everything before page load

## Implementation Files

### 1. `prp-advanced.html` (Currently Active)
- Overrides document, window, and navigator before DOM loads
- Creates fake desktop environment with Linux user agent
- Uses MutationObserver to catch dynamic changes
- Multiple redirect methods for reliability

### 2. `pre-render-proxy.html` 
- Uses blob URLs and web workers
- Pre-render links for faster loading
- Worker-based fetch with desktop headers

### 3. `prp-sandbox.html`
- Creates sandboxed iframe environment
- Isolated desktop context
- Multiple redirect strategies
- Cache-busting parameters

## How It Works

1. **Mobile user clicks payment button**
2. **Redirects to PRP page** (instead of SimpleSwap)
3. **PRP page creates desktop environment**
4. **Applies all possible spoofing methods**
5. **Redirects to SimpleSwap with desktop context**

## Technical Details

### Spoofing Layers
- Navigator object (userAgent, platform, etc.)
- Screen dimensions (2560x1440)
- Window dimensions (1920x1080)
- Remove all touch support
- Override media queries
- Modify fetch/XHR headers

### URL Parameters
```
https://simpleswap.io/exchange?
  from=eur-eur&
  to=pol-matic&
  amount=19.50&
  provider=mercury&
  device=desktop&
  platform=windows&
  prp=1&
  ...
```

## Testing PRP Mode

1. Upload files to Netlify
2. Open site on mobile
3. Click "Buy Now"
4. Should redirect to PRP page
5. Then to SimpleSwap with desktop context

## ⚠️ Important Notes

**This may or may not work** because:
- SimpleSwap's server-side detection happens before JavaScript runs
- HTTP headers are set by the browser, not JavaScript
- The only guaranteed fix is still desktop mode in browser

## If PRP Mode Fails

Fall back to:
1. Enable desktop mode in mobile browser
2. Use `desktop-mode-guide.html`
3. Use an actual desktop computer

---

**Status**: Experimental - Test to see if it bypasses mobile detection