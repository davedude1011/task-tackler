"use strict";
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.notifications.create('installNotification', {
            type: 'basic',
            iconUrl: './../pfp.png',
            title: 'Extension Installed',
            message: 'To use this extension, please pin it to your toolbar by clicking the puzzle icon and pinning it.',
            priority: 2
        });
    }
});
//# sourceMappingURL=install.js.map