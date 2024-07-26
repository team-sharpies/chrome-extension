console.log('Content script loaded')

function extractLabelValues() {
  const labelValues = [];
  const labels = document.querySelectorAll('.Labels');
  labels.forEach((label) => {
    const labelText = label.textContent.trim();
    const value = label.nextElementSibling ? label.nextElementSibling.textContent.trim() : '';
    labelValues.push({ label: labelText, value });
  });
  return labelValues;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getLabelValues') {
    const labelValues = extractLabelValues();
    sendResponse({ labelValues });
  }
});