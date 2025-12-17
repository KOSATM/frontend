import api from './axios'

async function chat(request) {
  const res = await api.post('/api/chat', request )
  return res.data;
}


export default {
  chat
};
