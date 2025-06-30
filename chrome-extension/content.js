// AURALO MERCURYO FORCER - CHROME EXTENSION
// Automatically forces Mercuryo selection on SimpleSwap

console.log('🚀 Auralo Mercuryo Forcer Extension Active');

// Configuration
const CONFIG = {
  checkInterval: 300,
  maxAttempts: 200,
  debug: true
};

let attempts = 0;
let forcingActive = true;

// Main forcing function
function forceMercuryoSelection() {
  if (!forcingActive || attempts > CONFIG.maxAttempts) return;
  
  attempts++;
  let actionsThisRound = 0;
  
  // Find and force all Mercuryo elements
  document.querySelectorAll('*').forEach(el => {
    if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
    
    const text = (el.textContent || '').toLowerCase();
    
    // Force Mercuryo elements
    if (text.includes('mercuryo') && 
        !text.includes('schema.org') && 
        text.length < 500 &&
        el.tagName !== 'HTML' && 
        el.tagName !== 'BODY') {
      
      // Apply ultra-strong visual forcing
      el.style.cssText += `
        border: 4px solid #22c55e !important;
        background-color: rgba(34, 197, 94, 0.2) !important;
        box-shadow: 0 0 20px rgba(34, 197, 94, 1) !important;
        outline: 2px solid #22c55e !important;
      `;
      
      // Force selection attributes
      el.setAttribute('aria-selected', 'true');
      el.setAttribute('data-auralo-forced', 'true');
      
      if (el.classList) {
        el.classList.add('selected', 'active', 'auralo-forced');
      }
      
      // Multiple aggressive click attempts
      setTimeout(() => { try { el.click(); } catch(e) {} }, 50);
      setTimeout(() => { try { el.click(); } catch(e) {} }, 100);
      setTimeout(() => { try { el.click(); } catch(e) {} }, 300);
      
      // Dispatch events
      try {
        el.dispatchEvent(new Event('click', { bubbles: true }));
        el.dispatchEvent(new Event('mousedown', { bubbles: true }));
        el.dispatchEvent(new Event('touchstart', { bubbles: true }));
      } catch(e) {}
      
      actionsThisRound++;
      
      if (CONFIG.debug) {
        console.log(`✅ Forced Mercuryo: ${el.tagName} "${text.substring(0, 50)}"`);
      }
    }
    
    // Disable MoonPay elements
    if (text.includes('moonpay') && 
        !text.includes('schema.org') && 
        text.length < 500 &&
        el.tagName !== 'HTML' && 
        el.tagName !== 'BODY') {
      
      el.style.cssText += `
        opacity: 0.2 !important;
        pointer-events: none !important;
        filter: grayscale(100%) blur(2px) !important;
        cursor: not-allowed !important;
      `;
      
      el.setAttribute('aria-selected', 'false');
      el.setAttribute('data-auralo-disabled', 'true');
      
      if (el.classList) {
        el.classList.remove('selected', 'active');
        el.classList.add('disabled', 'auralo-disabled');
      }
      
      actionsThisRound++;
      
      if (CONFIG.debug) {
        console.log(`❌ Disabled MoonPay: ${el.tagName} "${text.substring(0, 50)}"`);
      }
    }
  });
  
  // Force wallet fields visible
  document.querySelectorAll('input').forEach(input => {
    const placeholder = (input.placeholder || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    
    if ((placeholder.includes('address') || placeholder.includes('wallet') || 
         name.includes('address') || name.includes('wallet')) &&
         input.offsetWidth > 0) {
      
      input.style.cssText += `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        border: 2px solid #22c55e !important;
      `;
      
      input.required = true;
      actionsThisRound++;
    }
  });
  
  if (actionsThisRound > 0 && CONFIG.debug) {
    console.log(`🔧 Applied ${actionsThisRound} forcing actions (attempt ${attempts})`);
  }
}

// Inject custom CSS
function injectCustomCSS() {
  const style = document.createElement('style');
  style.id = 'auralo-mercuryo-styles';
  style.textContent = `
    .auralo-forced {
      border: 4px solid #22c55e !important;
      background-color: rgba(34, 197, 94, 0.2) !important;
      box-shadow: 0 0 20px rgba(34, 197, 94, 1) !important;
    }
    
    .auralo-disabled {
      opacity: 0.2 !important;
      pointer-events: none !important;
      filter: grayscale(100%) blur(2px) !important;
    }
    
    /* Add pulsing animation for forced elements */
    @keyframes auraloPulse {
      0% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); }
      50% { box-shadow: 0 0 30px rgba(34, 197, 94, 1); }
      100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); }
    }
    
    .auralo-forced {
      animation: auraloPulse 2s infinite;
    }
  `;
  
  document.head.appendChild(style);
  console.log('✅ Custom Auralo CSS injected');
}

// Setup MutationObserver for dynamic content
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    if (!forcingActive) return;
    
    let shouldForce = false;
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldForce = true;
      }
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'class' || mutation.attributeName === 'aria-selected')) {
        shouldForce = true;
      }
    });
    
    if (shouldForce) {
      setTimeout(forceMercuryoSelection, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'aria-selected', 'style']
  });
  
  console.log('👁️ MutationObserver setup for dynamic content monitoring');
}

// Initialize the extension
function initializeExtension() {
  console.log('🔧 Initializing Auralo Mercuryo Forcer Extension');
  
  // Inject CSS immediately
  injectCustomCSS();
  
  // Start forcing immediately
  forceMercuryoSelection();
  
  // Setup continuous forcing
  const forceInterval = setInterval(() => {
    if (forcingActive && attempts < CONFIG.maxAttempts) {
      forceMercuryoSelection();
    } else if (attempts >= CONFIG.maxAttempts) {
      clearInterval(forceInterval);
      console.log('⏰ Max attempts reached, stopping continuous forcing');
    }
  }, CONFIG.checkInterval);
  
  // Setup mutation observer after DOM is ready
  if (document.body) {
    setupMutationObserver();
  } else {
    document.addEventListener('DOMContentLoaded', setupMutationObserver);
  }
  
  // Re-force on user interactions
  ['click', 'touchstart', 'change', 'focus'].forEach(eventType => {
    document.addEventListener(eventType, () => {
      if (forcingActive) {
        setTimeout(forceMercuryoSelection, 200);
      }
    }, true);
  });
  
  console.log('✅ Auralo Mercuryo Forcer fully initialized');
}

// Start immediately
initializeExtension();

// Global controls (accessible from popup)
window.auraloForcer = {
  stop: () => {
    forcingActive = false;
    console.log('🛑 Auralo Mercuryo Forcer stopped');
  },
  start: () => {
    forcingActive = true;
    attempts = 0;
    forceMercuryoSelection();
    console.log('▶️ Auralo Mercuryo Forcer restarted');
  },
  status: () => ({
    active: forcingActive,
    attempts: attempts,
    maxAttempts: CONFIG.maxAttempts
  })
};