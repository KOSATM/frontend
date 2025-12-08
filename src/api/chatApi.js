import api from './axios'

async function chat(msg, userId) {
  const res = await api.get('/test', { params: { msg, userId } })
  return res.data;
}

export default {
  chat
};