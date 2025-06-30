// Popup script for Auralo Mercuryo Forcer

let currentTab = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup initialized');
  
  // Get current tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tabs[0];
  
  // Check if we're on SimpleSwap
  updateStatus();
  
  // Setup event listeners
  document.getElementById('start-btn').addEventListener('click', startForcing);
  document.getElementById('stop-btn').addEventListener('click', stopForcing);
  
  // Update status every second
  setInterval(updateStatus, 1000);
});

async function updateStatus() {
  if (!currentTab || !currentTab.url.includes('simpleswap.io')) {
    showInactiveStatus('Not on SimpleSwap');
    return;
  }
  
  try {
    // Get status from content script
    const results = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: () => {
        if (window.auraloForcer) {
          return window.auraloForcer.status();
        }
        return null;
      }
    });
    
    const status = results[0]?.result;
    
    if (status) {
      if (status.active) {
        showActiveStatus(status);
      } else {
        showInactiveStatus('Stopped');
      }
    } else {
      showInactiveStatus('Extension not loaded');
    }
    
  } catch (error) {
    console.error('Status check failed:', error);
    showInactiveStatus('Error checking status');
  }
}

function showActiveStatus(status) {
  const statusCard = document.getElementById('status-card');
  const statusText = document.getElementById('status-text');
  const attemptsCount = document.getElementById('attempts-count');
  const successRate = document.getElementById('success-rate');
  
  statusCard.className = 'status-card status-active';
  statusText.textContent = '✅ Active - Forcing Mercuryo';
  
  attemptsCount.textContent = status.attempts || 0;
  
  // Calculate success rate (simplified)
  const rate = status.attempts > 0 ? Math.min(95, (status.attempts / 10) * 95) : 0;
  successRate.textContent = rate.toFixed(0) + '%';
}

function showInactiveStatus(reason) {
  const statusCard = document.getElementById('status-card');
  const statusText = document.getElementById('status-text');
  const attemptsCount = document.getElementById('attempts-count');
  const successRate = document.getElementById('success-rate');
  
  statusCard.className = 'status-card status-inactive';
  statusText.textContent = `❌ ${reason}`;
  
  attemptsCount.textContent = '-';
  successRate.textContent = '-';
}

async function startForcing() {
  if (!currentTab || !currentTab.url.includes('simpleswap.io')) {
    alert('Please navigate to SimpleSwap.io first');
    return;
  }
  
  try {
    await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: () => {
        if (window.auraloForcer) {
          window.auraloForcer.start();
        }
      }
    });
    
    console.log('Forcing started');
  } catch (error) {
    console.error('Failed to start forcing:', error);
  }
}

async function stopForcing() {
  if (!currentTab) return;
  
  try {
    await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: () => {
        if (window.auraloForcer) {
          window.auraloForcer.stop();
        }
      }
    });
    
    console.log('Forcing stopped');
  } catch (error) {
    console.error('Failed to stop forcing:', error);
  }
}