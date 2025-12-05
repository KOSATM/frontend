import api from './axios'

async function chat(msg) {
  const res = await api.get('/test', { params: { msg } })
  return res.data;
}

export default {
  chat
};