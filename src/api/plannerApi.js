import api from './axios'

async function getActivePlan(userId) {
  return api.get(`/plans/${userId}/active/detail`)
}

async function getSuggestPlaces(userId, planPlace) {
  return await api.post(`/${userId}/suggest-places`, planPlace)
}


async function getActivePlanIdAndDayIndex(userId) {
  const res = await api.get(`/plans/${userId}/active/plan/info`, userId)
  return res.data;
}

const getBlogList = async (keyword) => {
  const res = await api.get('api/search/blog', {
    params: {
      keyword: keyword
    }
  })
  return res.data
}
export default {
  getActivePlan,
  getBlogList,
  getSuggestPlaces,
  getActivePlanIdAndDayIndex
};