<!-- filepath: c:\kosa-course\userProject\ATM\projects\frontend\src\components\supporter\NaverMap.vue -->
<template>
    <div class="map-gradient position-relative rounded" style="height: 600px;">
        <!-- 로딩 중 표시 -->
        <div v-if="isMapLoading" class="map-loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">지도 로딩 중...</p>
        </div>

        <!-- 지도 -->
        <div id="map" style="width: 100%; height: 100%;"></div>
    </div>
</template>
<script setup>
import store from '@/store'
import { useSupporterStore } from '@/store/supporterStore'
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const isMapLoading = ref(true)
const map = ref(null)
const infowindow = ref(null)
const userLocation = ref(null)
const userAddress = ref('') //사용자 주소를 저장할 ref

const props = defineProps({
    //지도에 표시할 마커 배열 (lat, lng, title, info 포함)
    markers: {
        type: Array,
        default: () => [
            { lat: 37.3595704, lng: 127.105399, title: '강남역' },
            { lat: 37.4979, lng: 127.0276, title: '서울역' }
        ]
    },
    //지도 초기 중심 좌표 (위도, 경도)
    initialCenter: {
        type: Object,
        default: () => ({ lat: 37.3595704, lng: 127.105399 })
    },
    //지도 초기 줌 레벨 (기본값: 10)
    initialZoom: {
        type: Number,
        default: 10
    },
    //true: 모든 마커가 보이도록 자동 조정 / false: 초기 설정 유지(사용자 위치 중심)
    fitBoundsMode: {
        type: Boolean,
        default: false
    }
})

// Naver Maps API를 Promise로 로드
const loadNaverMaps = () => {
    return new Promise((resolve) => {
        // 이미 로드되어 있으면 즉시 resolve
        if (window.naver) {
            resolve()
            return
        }

        // Callback 함수 정의
        window.onNaverMapsLoad = () => {
            resolve()
        }

        // script 태그 동적 생성
        const script = document.createElement('script')
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${window.NAVER_CLIENT_ID}&submodules=geocoder&callback=onNaverMapsLoad&language=en`
        script.type = 'text/javascript'
        document.head.appendChild(script)
    })
}

onMounted(async () => {
    try {
        // Naver Maps API 로드 대기
        await loadNaverMaps()
        initializeMap()
    } catch (error) {
        console.error('Naver Maps API 로드 실패:', error)
        isMapLoading.value = false
    }
})

function initializeMap() {
    const mapOptions = {
        center: new window.naver.maps.LatLng(props.initialCenter.lat, props.initialCenter.lng),
        zoom: props.initialZoom,
        mapTypeId: window.naver.maps.MapTypeId.NORMAL,
    }
    map.value = new window.naver.maps.Map('map', mapOptions)

    // InfoWindow 생성
    infowindow.value = new window.naver.maps.InfoWindow()

    // Geolocation 요청 먼저 (fitBounds 전에)
    requestGeolocation()

    // Marker 추가 (fitBounds가 필요하면 여기서 실행)
    addMarkers()

    isMapLoading.value = false
}

function addMarkers() {
    // fitBoundsMode가 true면 모든 마커가 보이도록 조정
    if (props.fitBoundsMode && props.markers.length > 1) {
        const bounds = new window.naver.maps.LatLngBounds()
        
        props.markers.forEach((marker) => {
            const position = new window.naver.maps.LatLng(marker.lat, marker.lng)
            bounds.extend(position)
            
            const markerObj = new window.naver.maps.Marker({
                position: position,
                map: map.value,
                title: marker.title
            })

            window.naver.maps.Event.addListener(markerObj, 'click', async function() {
                let content = marker.info
                if (!content) {
                    content = await getReverseGeocodeInfo(marker.lat, marker.lng, marker.title)
                }
                infowindow.value.setContent(content)
                infowindow.value.open(map.value, markerObj)
            })
        })
        
        // 모든 마커가 보이도록 지도 범위 조정
        if (!bounds.isEmpty()) {
            map.value.fitBounds(bounds)
            map.value.setZoom(map.value.getZoom() - 1)
        }
    } else {
        // fitBoundsMode가 false면 기본 방식
        props.markers.forEach((marker) => {
            const markerObj = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(marker.lat, marker.lng),
                map: map.value,
                title: marker.title
            })

            window.naver.maps.Event.addListener(markerObj, 'click', async function() {
                let content = marker.info
                if (!content) {
                    content = await getReverseGeocodeInfo(marker.lat, marker.lng, marker.title)
                }
                infowindow.value.setContent(content)
                infowindow.value.open(map.value, markerObj)
            })
        })
    }
}

// Reverse Geocoding API 호출 (백엔드)
async function getReverseGeocodeInfo(lat, lng, title) {
    try {
        // 백엔드 API 호출
        const response = await fetch(
            `/api/geo/reverse?lat=${lat}&lng=${lng}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        
        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('백엔드 API 응답:', data)
        
        if (data.results && data.results.length > 0) {
            // 법정동/행정동 주소 찾기
            const addrResult = data.results.find(r => r.name === 'addr')
            // 도로명 주소 찾기
            const roadResult = data.results.find(r => r.name === 'roadaddr')
            
            let addr = ''
            let roadAddr = ''
            let buildingName = ''
            let zipcode = ''
            
            // 법정동 주소
            if (addrResult?.region) {
                const area1 = addrResult.region.area1?.name || ''
                const area2 = addrResult.region.area2?.name || ''
                const area3 = addrResult.region.area3?.name || ''
                const area4 = addrResult.region.area4?.name || ''
                
                addr = `${area1} ${area2} ${area3}`
                if (area4) addr += ` ${area4}`
                
                // 지번 추가
                if (addrResult.land?.number1) {
                    addr += ` ${addrResult.land.number1}`
                    if (addrResult.land?.number2) {
                        addr += `-${addrResult.land.number2}`
                    }
                }
            }
            
            // 도로명 주소
            if (roadResult?.region) {
                const area1 = roadResult.region.area1?.name || ''
                const area2 = roadResult.region.area2?.name || ''
                const area3 = roadResult.region.area3?.name || ''
                
                roadAddr = `${area1} ${area2} ${area3}`
                
                // 도로명 추가
                if (roadResult.land?.name) {
                    roadAddr += ` ${roadResult.land.name}`
                }
                
                // 번호 추가
                if (roadResult.land?.number1) {
                    roadAddr += ` ${roadResult.land.number1}`
                }
                
                // 건물명 추출 (addition0)
                if (roadResult.land?.addition0?.value) {
                    buildingName = roadResult.land.addition0.value
                }
                
                // 우편번호 추출 (addition1)
                if (roadResult.land?.addition1?.value) {
                    zipcode = roadResult.land.addition1.value
                }
            }
            
            console.log('추출된 주소:', { addr, roadAddr, buildingName, zipcode })
            
            return `
                <div style="padding: 15px; min-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
                    <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 10px;">
                        <strong style="font-size: 18px; color: #333;">${title}</strong>
                        ${buildingName ? `<div style="color: #666; font-size: 12px; margin-top: 4px;">${buildingName}</div>` : ''}
                    </div>
                    
                    ${addr ? `
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 12px; color: #999; margin-bottom: 4px;">법정동</div>
                        <div style="font-size: 12px; color: #333; line-height: 1.5;">${addr}</div>
                    </div>
                    ` : ''}
                    
                    ${roadAddr ? `
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 12px; color: #999; margin-bottom: 4px;">도로명</div>
                        <div style="font-size: 12px; color: #333; line-height: 1.5;">${roadAddr}</div>
                    </div>
                    ` : ''}
                    
                    ${zipcode ? `
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 12px; color: #999; margin-bottom: 4px;">우편번호</div>
                        <div style="font-size: 12px; color: #333;">${zipcode}</div>
                    </div>
                    ` : ''}
                    
                    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                        <div style="font-size: 11px; color: #999;">
                            좌표: ${lat.toFixed(6)}, ${lng.toFixed(6)}
                        </div>
                    </div>
                </div>
            `
        }
    } catch (error) {
        console.error('백엔드 API 오류:', error)
    }
    
    // 기본값 (실패 시) - 가짜 데이터
    return getDefaultPlaceInfo(lat, lng, title)
}

// 기본값 정보 (API 실패 시 표시)
function getDefaultPlaceInfo(lat, lng, title) {
    // 장소별 기본 정보
    const defaultData = {
        '강남역': {
            addr: '서울시 강남구 강남대로 396',
            roadAddr: '서울시 강남구 테헤란로 강남역',
            zipcode: '06000',
            building: '강남역 쇼핑몰'
        },
        '서울역': {
            addr: '서울시 중구 중로 1 서울역',
            roadAddr: '서울시 중구 한강로 1',
            zipcode: '04402',
            building: '서울역'
        }
    }
    
    const placeInfo = defaultData[title] || {
        addr: `위치 ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        roadAddr: '주소 정보 없음',
        zipcode: '',
        building: ''
    }
    
    return `
        <div style="padding: 15px; min-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
            <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 10px;">
                <strong style="font-size: 18px; color: #333;">${title}</strong>
                ${placeInfo.building ? `<div style="color: #666; font-size: 12px; margin-top: 4px;">${placeInfo.building}</div>` : ''}
            </div>
            
            ${placeInfo.addr ? `
            <div style="margin-bottom: 10px;">
                <div style="font-size: 12px; color: #999; margin-bottom: 4px;">법정동</div>
                <div style="font-size: 12px; color: #333; line-height: 1.5;">${placeInfo.addr}</div>
            </div>
            ` : ''}
            
            ${placeInfo.roadAddr ? `
            <div style="margin-bottom: 10px;">
                <div style="font-size: 12px; color: #999; margin-bottom: 4px;">도로명</div>
                <div style="font-size: 12px; color: #333; line-height: 1.5;">${placeInfo.roadAddr}</div>
            </div>
            ` : ''}
            
            ${placeInfo.zipcode ? `
            <div style="margin-bottom: 10px;">
                <div style="font-size: 12px; color: #999; margin-bottom: 4px;">우편번호</div>
                <div style="font-size: 12px; color: #333;">${placeInfo.zipcode}</div>
            </div>
            ` : ''}
            
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                <div style="font-size: 11px; color: #999;">
                    좌표: ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </div>
            </div>
        </div>
    `
}

// Geolocation API 사용
function requestGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            onSuccessGeolocation,
            onErrorGeolocation
        )
    } else {
        showInfoWindow('Geolocation not supported', map.value.getCenter())
    }
}

function onSuccessGeolocation(position) {
    const location = new window.naver.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
    )

    // 사용자 위치 저장
    userLocation.value = location
    
    // 사용자 위치를 주소로 변환
    window.naver.maps.Service.reverseGeocode({
        coords: new window.naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
    }, function(status, response) {
        if (status !== window.naver.maps.Service.Status.OK) {
            console.error('Reverse Geocode 오류:', status)
        }
        var result = response.v2, // 검색 결과의 컨테이너
        address = result.address; //검색 결과로 만든 주소
        const store = useSupporterStore()
        store.setUserAddress(address);

        console.log(store.getUserAddress.jibunAddress);
    }
)

    // 현재 위치에 Marker 추가 (빨간색) - 항상 표시
    new window.naver.maps.Marker({
        position: location,
        map: map.value,
        title: '현재 위치',
        icon: {
            content: '<div style="background-color:red; width:20px; height:20px; border-radius:50%; border:3px solid white;"></div>',
            anchor: new window.naver.maps.Point(10, 10)
        }
    })

    // 현재 위치로 이동 버튼 추가 - 항상 표시
    addMyLocationButton(location)

    // fitBoundsMode가 false (Restroom 탭)일 때만 지도 중심을 사용자 위치로 변경
    if (!props.fitBoundsMode) {
        map.value.setCenter(location)
        map.value.setZoom(15)
    }

    console.log('사용자 위치:', location.toString())
}

function onErrorGeolocation(error) {
    console.error('Geolocation 오류:', error)
    const center = map.value.getCenter()

    let errorMessage = '위치 정보를 가져올 수 없습니다'
    
    if (error.code === error.PERMISSION_DENIED) {
        errorMessage = '위치 정보 공유가 거부되었습니다'
    } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = '위치 정보를 사용할 수 없습니다'
    } else if (error.code === error.TIMEOUT) {
        errorMessage = '위치 정보 요청이 시간 초과했습니다'
    }

    showInfoWindow(
        `<h5 style="color:#f00; margin:0;">${errorMessage}</h5>`,
        center
    )
}

function showInfoWindow(content, location) {
    infowindow.value.setContent(
        `<div style="padding:15px;">${content}</div>`
    )
    infowindow.value.open(map.value, location)
}

// 현재 위치로 이동 버튼 추가
function addMyLocationButton(location) {
    // SVG 나침반 아이콘 (사진과 동일한 십자 나침반)
    const compassSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #333;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
    </svg>`

    // CustomControl HTML - SVG 아이콘 사용
    const locationBtnHtml = `<div style="background-color: white; border: 1px solid #ddd; border-radius: 6px; padding: 10px; cursor: pointer; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s ease; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">${compassSvg}</div>`

    // CustomControl 생성 (오른쪽 하단에서 여백 추가)
    const customControl = new window.naver.maps.CustomControl(locationBtnHtml, {
        position: window.naver.maps.Position.BOTTOM_RIGHT
    })

    customControl.setMap(map.value)

    // 버튼 스타일 개선
    const buttonElement = customControl.getElement()
    buttonElement.style.position = 'absolute'
    buttonElement.style.bottom = '20px'   // 하단으로부터 거리
    buttonElement.style.right = '20px'    // 우측으로부터 거리

    // 버튼 호버 효과
    buttonElement.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'
        this.style.transform = 'scale(1.1)'
    })

    buttonElement.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
        this.style.transform = 'scale(1)'
    })

    // 버튼 클릭 이벤트
    window.naver.maps.Event.addDOMListener(buttonElement, 'click', function() {
        // 현재 위치로 지도 이동
        map.value.setCenter(location)
        map.value.setZoom(15)
    })
}


// expose를 통해 부모 컴포넌트에서 접근 가능하게
defineExpose({
    isMapLoading,
    map
})
</script>

<style scoped>
.map-gradient {
    height: 100%;
    background: #f3fffb;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
}

.map-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 10;
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-loading .spinner-border {
    width: 3rem;
    height: 3rem;
}

.map-loading p {
    color: #666;
    font-size: 14px;
    margin: 0;
    font-weight: 500;
}
</style>
