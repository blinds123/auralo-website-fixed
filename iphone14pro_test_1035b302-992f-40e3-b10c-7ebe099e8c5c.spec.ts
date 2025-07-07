
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('iPhone14Pro_Test_2025-07-07', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('file:///Users/nelsonchan/auralo-website-fixed/index.html');

    // Set custom user agent
    await context.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1');

    // Set custom user agent
    await context.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1');

    // Navigate to URL
    await page.goto('file:///Users/nelsonchan/auralo-website-fixed/index.html');

    // Take screenshot
    await page.screenshot({ path: 'iPhone14Pro_Initial_Load.png', { fullPage: true } });

    // Click element
    await page.click('.buy-now-button');

    // Take screenshot
    await page.screenshot({ path: 'iPhone14Pro_Popup_Appeared.png', { fullPage: true } });

    // Set custom user agent
    await context.setUserAgent('Mozilla/5.0 (Linux; Android 12; SM-G996B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36');

    // Navigate to URL
    await page.goto('file:///Users/nelsonchan/auralo-website-fixed/index.html');

    // Click element
    await page.click('.buy-now-button');

    // Set custom user agent
    await context.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36');

    // Navigate to URL
    await page.goto('file:///Users/nelsonchan/auralo-website-fixed/index.html');

    // Click element
    await page.click('.buy-now-button');

    // Set custom user agent
    await context.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1');

    // Navigate to URL
    await page.goto('file:///Users/nelsonchan/auralo-website-fixed/index.html');

    // Click element
    await page.click('.buy-now-button');

    // Set custom user agent
    await context.setUserAgent('Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36');

    // Navigate to URL
    await page.goto('file:///Users/nelsonchan/auralo-website-fixed/index.html');

    // Click element
    await page.click('.buy-now-button');

    // Navigate to URL
    await page.goto('https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercuryo');

    // Take screenshot
    await page.screenshot({ path: 'SimpleSwap_With_Spoofing_Active.png', { fullPage: true } });
});