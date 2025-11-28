import api from './axios'

// 1) 리뷰 포스트 + 리뷰 사진 그룹 생성 (review_posts, review_photo_groups auto increment 생성)
export const createReview = async(travelPlanId)=>{
  const res = await api.post('/reviews/create', {travelPlanId})
  return res.data
} 

/* 2) 리뷰 사진 업로드 */
export const uploadReviewPhotos = async (formData) => {
  return api.post('/reviews/photos/upload', formData, {
})}

// 3) 리뷰 사진 순서 업데이트
export const updatePhotoOrder = async (payload) => {
  return api.put('/reviews/photo/order', payload)
}
