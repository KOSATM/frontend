import api from './axios'

//지도 영역 내 화장실 조회
async function getToiletsInBounds(bounds) {
  const res = await api.get('/toilets/in-bounds', {
    params: bounds
  });
  return res.data;
}

//사용자 위치의 가까운 화장실 조회
async function getNearestToilets(userLat, userLng, limit) {
  const res = await api.get('/toilets/nearest', {
    params: {
      userLat: userLat,
      userLng: userLng,
      limit: limit
    }
  });
  return res.data;
}

export default {
  getToiletsInBounds,
  getNearestToilets
};