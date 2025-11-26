import api from './axios'

// 0) 리뷰 포스트 생성 (review_posts auto increment 생성)
export const createReview = async(travelPlanId)=>{
  const res = await api.post('/review/create', {travelPlanId})
  return res.data
} 

/* 1) 리뷰 사진 그룹 생성 (review_photo_group auto increment 생성) */
export const createReviewPhotoGroup = async () => {
  const res = await api.post('/review/photos/group')
  return res.data   // { groupId: 17 } 이런식
}

/* 2) 리뷰 사진 업로드 */
export const uploadReviewPhotos = async (formData) => {
  return api.post('/review/photos/upload', formData, {
})}

