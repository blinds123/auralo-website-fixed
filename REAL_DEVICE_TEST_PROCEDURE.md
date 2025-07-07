# 🔬 REAL DEVICE TESTING PROCEDURE - SimpleSwap Pricing Validation

## 🎯 OBJECTIVE
Validate SimpleSwap mobile pricing discrimination and test solutions with 100% certainty using real mobile devices.

## 📋 TEST PROCEDURE

### TEST A: Baseline Mobile Pricing (Document the Problem)
**Device**: Your actual iPhone/Android phone
**URL**: `https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercuryo`

**Steps**:
1. Open Safari/Chrome on your phone
2. Navigate to the URL above
3. Fill in form: EUR → MATIC, 19.50 amount
4. Enter wallet address: `0xE5173e7c3089bD89cd1341b637b8e1951745ED5C`
5. Click "Create Exchange"
6. **DOCUMENT**: Screenshot the payment page showing:
   - Final amount (€19.50 vs €21+)
   - Selected provider (Mercury vs MoonPay)
   - Payment options displayed

### TEST B: Desktop Mode Workaround (Test the Solution)
**Same device, same URL**

**iPhone Steps**:
1. Tap "aA" icon in Safari address bar
2. Select "Request Desktop Website"
3. Repeat TEST A steps
4. **DOCUMENT**: Screenshots showing pricing difference

**Android Steps**:
1. Tap ⋮ menu in Chrome
2. Check "Desktop site"
3. Repeat TEST A steps
4. **DOCUMENT**: Screenshots showing pricing difference

### TEST C: Desktop Baseline (Control Group)
**Device**: Desktop computer
**URL**: Same as above

**Steps**:
1. Open Chrome/Safari on desktop
2. Complete same form process
3. **DOCUMENT**: Desktop pricing and provider selection

## 📊 DATA COLLECTION

### Required Screenshots:
- [ ] Mobile pricing page (before desktop mode)
- [ ] Mobile with desktop mode enabled
- [ ] Desktop pricing page
- [ ] Provider selection comparisons

### Required Data Points:
- [ ] Exact final amount shown
- [ ] Provider selected (Mercury/MoonPay/other)
- [ ] Payment methods available
- [ ] Page load time and stability

## 🔬 EXPECTED RESULTS

If pricing discrimination exists:
- **Mobile**: €21+ amount, possibly MoonPay selected
- **Desktop Mode**: €19.50 amount, Mercury selected
- **Desktop**: €19.50 amount, Mercury selected

## 🚀 NEXT STEPS

Based on test results:
1. If discrimination confirmed → Build automated solution
2. If no discrimination → Document findings
3. If inconsistent → Test edge cases and timing

---

**📱 Run this test procedure on your actual phone NOW to get definitive proof.**