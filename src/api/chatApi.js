import api from './axios'

async function chat(request) {
  const res = await api.post('/chat', request )
  return res.data;
}

export default {
  chat
};