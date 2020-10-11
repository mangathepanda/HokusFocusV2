var url = window.location.href;
var tabId;

chrome.runtime.sendMessage({
    url : url,
    tabId : tabId
})