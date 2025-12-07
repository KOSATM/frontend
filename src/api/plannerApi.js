import api from './axios'

async function getActivePlan(userId) {
  return api.get(`/plans/${userId}/active/detail`)
}

export default {
  getActivePlan
};