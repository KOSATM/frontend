import api from './axios'

export const uploadReviewPhotos = async (formData) => {
  return api.post('/api/review/photos/upload', formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}