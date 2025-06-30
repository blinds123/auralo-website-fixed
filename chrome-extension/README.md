# 🚀 Auralo Mercuryo Forcer Chrome Extension

## Overview
Automatically forces Mercuryo selection on SimpleSwap exchanges, preventing auto-switching to MoonPay and maintaining user preferences.

## Features
- ✅ **Automatic Mercuryo Selection** - Forces Mercuryo provider on SimpleSwap
- ❌ **MoonPay Disabling** - Grays out and disables MoonPay options  
- 🎯 **Visual Confirmation** - Green borders show forced selections
- 📱 **Mobile Compatible** - Works on all device types
- 🔄 **Persistent Forcing** - Maintains selection through page changes
- 🎮 **User Controls** - Start/stop functionality via popup

## Installation

### From Source (Development)
1. Download or clone this extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" 
5. Select the `chrome-extension` folder
6. Extension will appear in your browser toolbar

### For Distribution
1. Zip the entire `chrome-extension` folder
2. Submit to Chrome Web Store for review
3. Or distribute the .zip file for manual installation

## Usage

### Automatic Mode
1. Install the extension
2. Navigate to https://simpleswap.io
3. Start any EUR to POL exchange
4. Extension automatically:
   - Forces Mercuryo selection
   - Disables MoonPay options
   - Maintains preferences

### Manual Controls
1. Click the extension icon in your toolbar
2. Use the popup to:
   - Start/stop forcing
   - View status and statistics
   - Monitor attempts and success rate

## Technical Details

### How It Works
- **Content Script Injection** - Runs on all SimpleSwap pages
- **DOM Manipulation** - Directly modifies page elements
- **Event Interception** - Captures and overrides user interactions
- **CSS Forcing** - Applies visual styles to show selection
- **Mutation Observation** - Monitors dynamic content changes

### Files Structure
```
chrome-extension/
├── manifest.json     # Extension configuration
├── content.js        # Main forcing logic
├── popup.html        # User interface
├── popup.js          # Popup functionality  
├── icon.png          # Extension icon
└── README.md         # This file
```

### Configuration
Edit these values in `content.js`:
```javascript
const CONFIG = {
  checkInterval: 300,   // Milliseconds between checks
  maxAttempts: 200,     // Maximum forcing attempts
  debug: true           // Console logging
};
```

## Security & Privacy

### What the Extension Does
- ✅ Only runs on SimpleSwap.io domains
- ✅ Modifies page display and interaction
- ✅ No data collection or transmission
- ✅ No external network requests

### What the Extension Doesn't Do  
- ❌ No access to personal data
- ❌ No tracking or analytics
- ❌ No access to other websites
- ❌ No financial transaction modification

### Permissions Explained
- **activeTab** - Access current SimpleSwap tab
- **storage** - Save extension settings
- **scripting** - Inject content scripts
- **host_permissions** - Run only on simpleswap.io

## Browser Compatibility
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave (Chromium-based)
- ✅ Opera (Chromium-based)
- ❌ Firefox (Manifest V2 version needed)
- ❌ Safari (Different extension system)

## Troubleshooting

### Extension Not Working
1. Check you're on https://simpleswap.io
2. Refresh the page after installing
3. Click extension icon and verify status
4. Check browser console for error messages

### Mercuryo Not Selected
1. Try manually clicking start in popup
2. Refresh page and try again
3. Check for SimpleSwap interface changes
4. Verify extension permissions are granted

### Performance Issues
1. Disable debug logging in CONFIG
2. Increase checkInterval to 500ms or higher
3. Clear browser cache and restart

## Development

### Testing Changes
1. Make code modifications
2. Go to `chrome://extensions/`
3. Click refresh icon on extension
4. Test on SimpleSwap page

### Adding Features
- Modify `content.js` for new forcing logic
- Update `popup.html/js` for UI changes
- Adjust `manifest.json` for new permissions

### Debugging
1. Open Chrome DevTools on SimpleSwap page
2. Check Console tab for extension logs
3. Use Elements tab to inspect forced styling
4. Monitor Network tab for blocked requests

## Support
- **Issues**: Report bugs and problems
- **Features**: Request new functionality
- **Updates**: Check for extension updates

## Legal
- Extension respects SimpleSwap's terms of service
- Only modifies client-side display, not transactions
- User controls all interactions and decisions
- No warranty or guarantees provided

---

**Version**: 1.0.0  
**Last Updated**: June 30, 2025  
**Made by**: Auralo Team