chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'submitForm') {
    const formData = message.formData
    try {
      // entity to use is lead
      const obj = {
        hfnz_nhi: 'test',
        hfnz_preferredname: 'email@email.com',
      }
      //   const encodedObj = encodeURIComponent(JSON.stringify(obj))
      const domain = ''
      const entity = ``

      let extraqs = ''

      for (const key in obj) {
        extraqs += `${key}=${obj[key]}&`
      }

      const newTabUrl = `${domain}/${entity}&extraqs=${encodeURIComponent(
        extraqs,
      )}`

      console.log(newTabUrl)
      chrome.tabs.create({ url: newTabUrl })
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
})

const fieldMap = {
  'NHI Number': 'hfnz_nhi',
  'Family Name': 'hfnz_familyname',
  'First Name': 'hfnz_firstname',
  'Ethnicity 1': 'hfnz_ethnicityid',
  'Second Name': 'hfnz_middlename',
  Address: 'hfnz_address1',
  Gender: 'hfnz_gendercode',
  Suburb: 'hfnz_address2',
  'Date of Birth': 'hfnz_dateofbirth',
  'City/Town/Region': 'hfnz_address3',
  'New Zealand Resident': 'hfnz_nzresident',
}

chrome.runtime.onMessageExternal.addListener(function (
  request,
  _sender,
  _sendResponse,
) {
  console.log('chrome.runtime.onMessageExternal.addListener')

  if (request.authenticate) {
    var redirectUrl = chrome.identity.getRedirectURL()

    chrome.identity.launchWebAuthFlow(
      {
        interactive: true,
      },
      function (responseWithToken) {
        console.log(responseWithToken)
      },
    )
  }
})

