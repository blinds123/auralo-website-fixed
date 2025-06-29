# MOBILE MERCURYO TEST RESULTS

## Current Issue Confirmed ✅

**Test Date:** 2025-06-29
**Test Device:** Simulated iPhone (375x812, Mobile Safari)

### Direct EUR Test Results:
1. **URL:** `https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo`
2. **Currency:** EUR 15 → POL correctly set
3. **Provider Display:** 
   - ✅ Mercuryo shows with GREEN CHECKMARK (selected appearance)
   - ❌ Two MoonPay options also displayed
   - ⚠️ Despite visual selection, MoonPay likely defaults when proceeding

**Screenshot Evidence:** Provider selection shows Mercuryo "selected" but system may override

## Root Cause Analysis 🔍

SimpleSwap's mobile algorithm appears to:
1. Visually show Mercuryo as selected (green check)
2. But internally default to MoonPay on mobile devices
3. EUR currency alone does NOT prevent this override

## Enhanced Solution Testing 🚀

### Approach: Desktop User Agent Spoofing
- **Strategy:** Make iPhone appear as Windows Desktop
- **Enhanced Features:**
  - User Agent: Windows Chrome 120
  - Screen Resolution: 1920x1080
  - Vendor Override: "Google Inc."
  - Multiple URL Parameters: `preferred=mercuryo`, `provider=mercuryo`

### Next Steps Required:
1. Test enhanced desktop spoofing solution
2. Verify if desktop spoofing prevents MoonPay override
3. Check if URL parameters actually influence provider selection
4. Validate solution on real iPhone 12 Pro

## Current Status: TESTING IN PROGRESS ⏳