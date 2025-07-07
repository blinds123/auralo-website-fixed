# 🎯 COMPREHENSIVE CONTEXT PROMPT FOR NEW CLAUDE SESSION

Copy and paste this entire prompt to start a new session with full context:

---

## PROMPT START:

I need help fixing a critical mobile pricing issue on an e-commerce website. Here's the complete context from extensive testing and attempts:

### 🎯 CORE MISSION
Fix SimpleSwap payment gateway showing €21 instead of €19.50 on mobile phones, and ensure Mercury provider is selected by default (with green border).

### 📁 PROJECT LOCATION
`/Users/nelsonchan/auralo-website-fixed/`

### 🔍 THE PROBLEM IN DETAIL
1. **Desktop behavior (CORRECT)**: SimpleSwap shows €19.50 with Mercury provider auto-selected
2. **Mobile behavior (BROKEN)**: SimpleSwap shows €21 with MoonPay selected instead of Mercury
3. **Root cause**: SimpleSwap detects mobile devices SERVER-SIDE using HTTP User-Agent headers that JavaScript CANNOT modify

### 📱 SCREENSHOT EVIDENCE
User provided screenshot showing:
- SimpleSwap on mobile displaying "You send: 21.42 EUR"
- Mercury provider NOT selected (no green border)
- URL shows no parameters were passed through
- This proves client-side spoofing attempts failed

### 🧪 WHAT HAS BEEN TRIED AND FAILED

#### 1. **Client-Side JavaScript Spoofing** ❌
- Overriding `navigator.userAgent`, `navigator.platform`, `navigator.maxTouchPoints`
- Removing touch event support
- Spoofing screen dimensions
- Result: FAILED - SimpleSwap's server still detected mobile

#### 2. **Service Worker Approach** ❌
- Created `sw-ultimate.js` to intercept and modify HTTP headers
- Modified requests to add desktop headers
- Result: FAILED - Service workers can't modify navigation request headers
- Note: Doesn't work in incognito mode at all

#### 3. **Proxy/Redirect Pages** ❌
Multiple attempts created:
- `simpleswap-proxy.html` - Pre-spoofing before redirect
- `mobile-interceptor.html` - Attempted iframe approach (SimpleSwap blocks iframes)
- `mobile-gateway-spoofer.html` - 8-phase spoofing attempt
- `force-desktop-mode.html` - Ultra aggressive spoofing
- Result: ALL FAILED - Server-side detection happens before JavaScript runs

#### 4. **URL Parameter Attempts** ❌
Tried numerous parameters:
- `&provider=mercury` (works for selection but not pricing)
- `&desktop=1`, `&force_desktop=1`, `&mobile=0`
- `&device=desktop`, `&platform=desktop`
- Result: FAILED - SimpleSwap ignores these for pricing

#### 5. **PRP Mode (Pre-Render Proxy)** ❌
Created 4 different implementations:
- `prp-advanced.html` - Document/window override approach
- `prp-sandbox.html` - Sandboxed iframe approach
- `prp-ultimate.html` - Nuclear option freezing all objects
- `pre-render-proxy.html` - Blob URL and worker approach
- Result: ALL FAILED - Can't override HTTP headers sent by browser

### ✅ WHAT ACTUALLY WORKS

#### 1. **Desktop Mode in Mobile Browser** ✅
- Chrome: Menu → "Desktop site"
- Safari: "aA" button → "Request Desktop Website"
- This sends desktop User-Agent to server
- Result: Shows €19.50 with Mercury selected

#### 2. **Using Desktop Computer** ✅
- 100% reliable solution

### 💡 KEY DISCOVERIES
1. The "loading bug" where Polygon conversion got stuck wasn't a fix - just broken functionality
2. SimpleSwap's detection is 100% server-side based on HTTP headers
3. JavaScript runs AFTER the server has already decided pricing
4. No client-side solution can work because the detection happens before our code runs
5. The ONLY real fix is changing the HTTP User-Agent header (desktop mode or desktop browser)

### 🏗️ CURRENT IMPLEMENTATION
After discovering technical spoofing is impossible, implemented a **Product Requirements Prompt (PRP)** business solution:

1. **`prp-business-solution.html`** - Offers users three options:
   - Enable desktop mode (with instructions)
   - Pay €21 and get €1.50 rebate code
   - Future alternative provider option

2. **`desktop-mode-guide.html`** - Clear instructions for enabling desktop mode

3. **`test-desktop-mode.html`** - Verification tool to check if desktop mode is active

### 📋 TODO LIST FOR NEW SESSION
1. ✅ Understand that client-side spoofing is impossible
2. ✅ Accept that SimpleSwap's server-side detection cannot be bypassed
3. Consider business solutions:
   - Negotiate with SimpleSwap for uniform pricing
   - Find alternative payment provider without mobile discrimination
   - Implement automatic rebate system
   - Consider absorbing the €1.50 difference as business cost
4. Improve user experience:
   - Make desktop mode instructions clearer
   - Automate rebate process
   - Add analytics to track how many users face this issue

### 🚫 WHAT NOT TO WASTE TIME ON
- Any JavaScript spoofing attempts
- Service workers for header modification
- Proxy pages with pre-spoofing
- URL parameter tricks
- Client-side navigator overrides
- iframe embedding (SimpleSwap blocks it)

### 🎯 THE REAL SOLUTION PATH
Since technical workarounds are impossible, focus on:
1. **Business negotiation** with SimpleSwap
2. **Alternative providers** research
3. **User education** about desktop mode
4. **Compensation strategies** (rebates, discounts)
5. **Transparent communication** about the issue

### 📊 IMPORTANT CONTEXT
- Main file: `index.html` contains the payment gateway logic
- Function `initiatePaymentGateway()` handles payment flow
- Mobile detection happens around line 1998
- Currently redirects to `prp-business-solution.html` for mobile users
- All spoofing attempts are still in the codebase but don't work

### 🔑 KEY INSIGHT
The user initially asked for "prp mode" which I misunderstood as "Pre-Render Proxy" (technical hack) when they actually meant "Product Requirements Prompt" (business-focused solution). This highlights that the answer isn't technical but business-oriented.

### 💬 FINAL USER FEEDBACK
"it didnt work in incognito mode and in non incognito it kind of worked but only because it never stopped trying to load the amount that it was converting to in polygon that second part under euro was still loading non stop and didnt load and thats why it stayed on 19.5 and mercury I think"

This confirms that what looked like a "fix" was just the page being broken/stuck loading.

### 🎯 MISSION SUMMARY
Help implement a sustainable solution for mobile users to pay €19.50 instead of €21 on SimpleSwap, knowing that:
- Technical spoofing is impossible (server-side detection)
- Desktop mode in browser is the only technical workaround
- Business solutions (rebates, alternatives) are the sustainable path forward

Please help me refine and implement the business solution approach, as all technical workarounds have been exhaustively tested and proven impossible.

---

## PROMPT END

### Additional Files in Project:
- Multiple failed spoofing attempts (*-proxy.html, *-interceptor.html, force-*.html)
- PRP implementations (prp-*.html)
- Business solution (prp-business-solution.html)
- Documentation (*.md files)
- Service workers (sw-*.js)
- Test files (test-*.html, validate-*.js)

All are in `/Users/nelsonchan/auralo-website-fixed/` if you need to reference them.