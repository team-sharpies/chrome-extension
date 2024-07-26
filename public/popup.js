console.log('Popup script loaded');

async function getLabelValues() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          return extractLabelValues();
        },
      }, (result) => {
        resolve(result[0].result);
      });
    });
  });
}

async function populateForm() {
  const labelValues = await getLabelValues();
  const form = document.getElementById('labelValuesForm');

  labelValues.forEach(({ label, value }) => {
    const labelElement = document.createElement('label');
    labelElement.textContent = label;

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = value;
    inputElement.name = label.replace(/\s/g, '_');

    const formGroup = document.createElement('div');
    formGroup.appendChild(labelElement);
    formGroup.appendChild(inputElement);

    form.appendChild(formGroup);
  });
}

async function submitForm() {
  const form = document.getElementById('labelValuesForm');
  const formData = new FormData(form);
  const jsonData = Object.fromEntries(formData);

  chrome.runtime.sendMessage({ type: 'submitForm', formData: jsonData });
}

document.addEventListener('DOMContentLoaded', populateForm);
document.getElementById('submitButton').addEventListener('click', submitForm);