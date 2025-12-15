import api from './axios'

async function chat(request) {
  const res = await api.post('/api/chat', request )
  return res.data;
}

async function imageSearchChat(userId, placeName, action) {
  const res = await api.post('', {
    params: {
      userId: userId,
      placeName: placeName,
      action: action
    }
  });
  return res.data;
}

export default {
  chat,
  imageSearchChat
};
