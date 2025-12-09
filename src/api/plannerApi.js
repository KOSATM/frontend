import api from './axios'

async function getActivePlan(userId) {
  return api.get(`/plans/${userId}/active/detail`)
}

const getBlogList=async(keyword)=>{
    const res = await api.get('api/search/blog',{
        params:{
            keyword: keyword
        }
    })
    return res.data
}
export default {
  getActivePlan,
  getBlogList
};