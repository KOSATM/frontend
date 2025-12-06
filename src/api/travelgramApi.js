import api from './axios'

// 1) 리뷰 포스트 + 리뷰 사진 그룹 생성 (review_posts, review_photo_groups auto increment 생성)
const createReview = async(planId)=>{
  const res = await api.post('/reviews/create', {planId})
  return res.data
} 

/* 2) 리뷰 사진 업로드 */
const uploadReviewPhotos = async (formData) => {
  return api.post('/reviews/photos/upload', formData);
}
// 3) 리뷰 사진 순서 업데이트
const updatePhotoOrder = async (payload) => {
  return api.put('/reviews/photo/order', payload)
}

// 🔥 [추가] 사진 분석 요청 API
const analyzePhotoMood = async(photoGroupId) =>{
    // Post 요청, 파라미터로 photoGroupId 전달
    return api.post('/reviews/photo/analyze', null, {
  params: { photoGroupId: photoGroupId }
})
}
// [추가] 조회용 API
const getReviewPhotos = async(photoGroupId) =>{
    return api.get('/reviews/photos', {
      params: { photoGroupId }
    });
}

const generateAiStyles = async (planId, reviewPostId) => {
  // 백엔드 컨트롤러에 맞게 파라미터 전달
  return api.post('/ai/review/generate-styles', null, {
    params: { planId, reviewPostId }
  });
}
const selectStyle = async (reviewPostId, reviewStyleId) => {
  // 🔥 [수정됨] 
  // 두 번째 인자(Body)는 null로 비우고, 
  // 세 번째 인자(Config)의 params에 데이터를 넣어야 백엔드가 인식합니다.
  return api.post('/reviews/style/select', null, {
    params: {
      reviewPostId: reviewPostId,
      reviewStyleId: reviewStyleId
    }
  });
}
export default {
    createReview,
    uploadReviewPhotos,
    updatePhotoOrder,
    analyzePhotoMood,
    getReviewPhotos,
    generateAiStyles,
    selectStyle
};