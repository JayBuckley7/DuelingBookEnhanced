function polling() {
  setTimeout(polling, 1000 * 30);
}

polling();

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.tabs.create({url: 'chrome-extension://cbjnilkbeknnlohlemgbeaebaedokcbb/new-features.html'})
    console.log("new tab firing");
  } 

})
