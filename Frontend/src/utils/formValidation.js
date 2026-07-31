export function validateRequiredFields(values, requiredFields) {
  const errors = {}
  requiredFields.forEach((field) => {
    if (!String(values[field] ?? '').trim()) {
      errors[field] = 'This field is required.'
    }
  })
  return errors
}
