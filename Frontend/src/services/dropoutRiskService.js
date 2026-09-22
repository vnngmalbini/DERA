import { apiGet, apiPost } from './apiClient'

export const fetchDropoutRiskSummary = () => apiGet('/dropout/summary/')

export const predictDropoutRisk = ({ youthId, educationLevel, data }) =>
  apiPost('/dropout/predict/', {
    youth_id: youthId,
    education_level: educationLevel,
    data,
  })