const ipRangeCheck = require('ip-range-check');

const isCloudflareIP = (ip) => {
  return ipRangeCheck(ip, CLOUD_FLARE_IPS);
};

const cloudflareIcon = require('../icons/icon-cloudflare.png');
const defaultIcon = require('../icons/icon.png');

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const ip = details.ip; // Get the resolved IP address
    if (isCloudflareIP(ip)) {
      chrome.action.setIcon({ path: cloudflareIcon, tabId: details.tabId });
      console.log(`Cloudflare IP found: ${details.url}`);
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.webNavigation.onCommitted.addListener((details) => {
  const { tabId, frameId } = details;
  if (frameId === 0) { // Main frame (new page load)
    chrome.action.setIcon({ path: defaultIcon, tabId: details.tabId });
    console.log(`Reset Cloudflare status for tab ${tabId} on navigation to ${details.url}`);
  }
});

