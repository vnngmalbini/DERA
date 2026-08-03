import { apiPostAnonymous } from './apiClient'

export function initializeDonation({ donorName, donorEmail, amount }) {
  return apiPostAnonymous('/donations/', { donor_name: donorName, donor_email: donorEmail, amount })
}

export function verifyDonation(reference) {
  return apiPostAnonymous(`/donations/${reference}/verify/`, {})
}

let paystackScriptPromise = null

export function loadPaystackScript() {
  if (window.PaystackPop) return Promise.resolve()
  if (paystackScriptPromise) return paystackScriptPromise

  paystackScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      paystackScriptPromise = null
      reject(new Error('Could not load Paystack checkout. Check your connection and try again.'))
    }
    document.body.appendChild(script)
  })

  return paystackScriptPromise
}
