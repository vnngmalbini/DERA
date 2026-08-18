import { apiPost } from './apiClient'

// Uses apiPost (not apiPostAnonymous) so a logged-in donor's session is sent
// along with the request — the backend only attaches the `donor` FK when the
// request is authenticated. Both endpoints are AllowAny, so a guest checkout
// still works exactly the same with no token attached.
export function initializeDonation({ donorName, donorEmail, amount }) {
  return apiPost('/donations/', { donor_name: donorName, donor_email: donorEmail, amount })
}

export function verifyDonation(reference) {
  return apiPost(`/donations/${reference}/verify/`, {})
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
