// WORKING MERCURYO FORCING BOOKMARKLET
// Copy this entire line and save as bookmark:

javascript:(function(){let a=0;function f(){a++;if(a>50)return;document.querySelectorAll('*').forEach(e=>{const t=(e.textContent||'').toLowerCase();if(t.includes('moonpay')&&t.length<500){e.style.display='none';e.remove();}if(t.includes('mercuryo')&&t.length<500){e.style.border='4px solid #22c55e';e.style.background='rgba(34,197,94,0.3)';e.click();if(e.type==='radio')e.checked=true;}});setTimeout(f,1000);}f();})();