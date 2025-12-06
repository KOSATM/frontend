import api from './axios'

//이미지 Agent 생성 및 후보자 생성
async function recommendPlacesByImage(placeType, image, address) {
    const formData = new FormData()
    formData.append('placeType', placeType)
    formData.append('image', image) // File 객체
    formData.append('address', address)
    
    // baseURL 확인 및 로깅
    const apiUrl = `${api.defaults.baseURL || 'http://localhost:8080'}/supporter/image-search/candidates`
    console.log('최종 요청 URL:', apiUrl)
    console.log('API baseURL:', api.defaults.baseURL)
    
    const res = await api.post('/supporter/image-search/candidates', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res.data
}

//후보자 저장 (모든 후보지 저장)
async function savePlaceCandidates(dataToSave) {
    // dataToSave 형식:
    // {
    //   selectedPlace: { placeName, location, imageUrl, ... },
    //   candidates: [{ placeName, location, imageUrl, ... }, ...], // 모든 후보지
    //   uploadedImage: base64String,
    //   selectedType: 'landscape|food|activities',
    //   action: 'save|add|replace'
    // }
    
    const allCandidates = dataToSave.candidates || []
    const selectedType = dataToSave.selectedType || 'landscape'
    
    // 모든 후보지를 PlaceCandidateRequest 형식으로 변환
    const candidatesToSave = allCandidates.map(candidate => ({
        name: candidate?.placeName || '',
        address: candidate?.location || '',
        lat: candidate?.lat || 0,
        lng: candidate?.lng || 0,
        placeType: selectedType,
        visualFeatures: candidate?.description || '',
        imageUrl: candidate?.imageUrl || '',
        imageStatus: 'READY' // PENDING, READY, FAILED
    }))
    
    console.log('저장할 모든 후보자 데이터 (3개):', candidatesToSave)
    
    const res = await api.post('/supporter/image-search/candidates/save', candidatesToSave)
    return res.data
}

export default {
    recommendPlacesByImage,
    savePlaceCandidates
}