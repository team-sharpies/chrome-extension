import { HtmlHTMLAttributes, useState } from 'react'
import { fetchStream } from './api'

function App() {
  const data = fetchStream()

  console.log(data)

  const [labelValues, setLabelValues] = useState<
    { label: string; value: string }[]
  >([])

  function submitReferral(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const nhi = data['NHI Number'].valueOf() as string
    const firstnameComplex = data['First Name'].valueOf() as string
    const firstname = firstnameComplex.includes('preferred')
      ? firstnameComplex.split(' ')[0]
      : firstnameComplex
    const preferredName = firstnameComplex.includes('preferred')
      ? firstnameComplex.split(' ')[0]
      : ''
    const lastname = data['Family Name'].valueOf() as string
    const dob = data['Date of Birth'].valueOf() as string
    const middleName = data['Second Name'].valueOf() as string
    const gender = data['Gender'].valueOf() as string
    const dateOfReferral = data['hfnz_dateofreferral'].valueOf() as Date
    const immigrationStatus = data['hfnz_immigrationstatus'].valueOf() as string

    const fieldMapping: Record<string, string | Date | number> = {
      hfnz_nhi: nhi,
      lastname: lastname,
      hfnz_internalfirstname: firstname,
      firstname: `${firstname} (${nhi})`,
      hfnz_preferredname: preferredName,
      middlename: middleName,
      hfnz_dateofbirth: dob,
      hfnz_dateofreferral: dateOfReferral,
      hfnz_gendercode: gender === 'M' ? 173440001 : 173440000,
      hfnz_immigrationstatuscode: immigrationStatus,
    }

    const domain = ''
    const entity = `main.aspx?etn=lead&pagetype=entityrecord`

    let extraqs = ''

    for (const key in fieldMapping) {
      extraqs += `${key}=${fieldMapping[key]}&`
    }

    const newTabUrl = `${domain}/${entity}&extraqs=${encodeURIComponent(
      extraqs,
    )}`

    window.open(newTabUrl, '_blank')
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-2">
        <form className="space-y-2">
          <Button>Create Address</Button>
          <Input
            label={'Address'}
            name={'Address'}
            defaultValue={getLabelValues('Address', labelValues)}
          />
          <Input
            label={'Suburb'}
            name={'Suburb'}
            defaultValue={getLabelValues('Suburb', labelValues)}
          />
          <Input
            label={'City'}
            name={'City'}
            defaultValue={getLabelValues('City/Town/Region', labelValues)}
          />
          <Input
            label={'Domicile Code'}
            name={'Domicile Code'}
            defaultValue={getLabelValues('Domicile Code', labelValues)}
          />
        </form>
        <form className="space-y-2" onSubmit={submitReferral}>
          <Button>Create referral</Button>
          <Input
            label={'NHI'}
            name="NHI Number"
            defaultValue={getLabelValues('NHI Number', labelValues)}
          />
          <Input
            label={'Family Name'}
            name="Family Name"
            defaultValue={getLabelValues('Family Name', labelValues)}
          />
          <Input
            label={'First Name'}
            name="First Name"
            defaultValue={getLabelValues('First Name', labelValues)}
          />
          <Input
            label={'Second Name'}
            name="Second Name"
            defaultValue={getLabelValues('Second Name', labelValues)}
          />
          <div className="flex flex-col">
            <label className="text-zinc-50">Ethnicity</label>
            <p>Please select the ethnicity after the form is opened</p>
          </div>
          <Input
            label={'Gender'}
            name="Gender"
            defaultValue={getLabelValues('Gender', labelValues)}
          />
          <div className="flex flex-col">
            <label className="text-zinc-50">Date of Birth</label>
            <input
              type="date"
              name="Date of Birth"
              className="text-lg h-10 border border-gray-300 rounded p-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors"
              defaultValue={getLabelValues('Date of Birth', labelValues)
                .split('-')
                .reverse()
                .join('-')}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-zinc-50">Immigration Status</label>
          </div>
          <div className="flex flex-col">
            <label className="text-zinc-50">Date of Referral</label>
            <input
              type="date"
              name="hfnz_dateofreferral"
              className="text-lg h-10 border border-gray-300 rounded p-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

function getLabelValues(
  label: string,
  labelValues: { label: string; value: string }[],
) {
  return labelValues.find((x) => x.label === label)?.value || ''
}

type InputProps = HtmlHTMLAttributes<HTMLInputElement>

function Input({
  label,
  name,
  ...rest
}: InputProps & { label: string; name: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-zinc-50">{label}</label>
      <input
        name={name}
        {...rest}
        className="text-lg h-10 border border-gray-300 rounded p-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors"
      />
    </div>
  )
}

type ButtonProps = HtmlHTMLAttributes<HTMLButtonElement>

function Button({ children, ...rest }: ButtonProps) {
  return (
    <button
      className="bg-zinc-700 text-white rounded p-2 w-full text-lg hover:bg-zinc-400 transition-colors"
      {...rest}
    >
      {children}
    </button>
  )
}

export default App
