import { ChatMessage, Place } from "../types";

// 기존 MOCK_PLACES 데이터 활용
export const MOCK_PLACES: Record<string, Place[]> = {
  popup: [
    { id: 'p1', name: '몬스터에너지 팝업', type: 'popup', description: '에너지 드링크 팝업', time: '14:00', lat: 37.5441, lng: 127.0566 },
    { id: 'p2', name: '메리퓨어 팝업', type: 'popup', description: '메리퓨어의 향기 컬렉션', time: '14:00', lat: 37.5455, lng: 127.0523 },
    { id: 'p3', name: '무신사 스탠다드X노홍철 팝업', type: 'popup', description: '노홍철의 에너지가 담긴 럭키 가이 컬렉션 출시!', time: '14:00', lat: 37.5421, lng: 127.0612 },
  ],
  food: [
    { id: 'f1', name: '대성갈비', type: 'food', description: '수요미식회에 나온 성수동 갈비 맛집', time: '15:30', lat: 37.5471, lng: 127.0435 },
    { id: 'f2', name: '소문난 성수 감자탕', type: 'food', description: '24시간 줄 서서 먹는 감자탕 명소', time: '15:30', lat: 37.5427, lng: 127.0571 },
    { id: 'f3', name: '할머니의 레시피', type: 'food', description: '깔끔하고 정갈한 한식 가정식', time: '15:30', lat: 37.5478, lng: 127.0421 },
  ],
  cafe: [
    { id: 'c1', name: '대림창고', type: 'cafe', description: '성수동 카페거리의 상징적인 갤러리 카페', time: '17:00', lat: 37.5414, lng: 127.0586 },
    { id: 'c2', name: '어니언 성수', type: 'cafe', description: '폐공장을 개조한 빈티지한 매력의 베이커리', time: '17:00', lat: 37.5445, lng: 127.0578 },
    { id: 'c3', name: '블루보틀 성수', type: 'cafe', description: '미니멀한 디자인의 스페셜티 커피', time: '17:00', lat: 37.5479, lng: 127.0474 },
  ]
};

/**
 * 헬퍼 함수: Place 객체를 API 응답용 Option 형식으로 변환
 */
const transformToOptions = (places: Place[]) => {
  return places.map(p => ({
    label: p.name,
    value: p.id,
    icon: p.type === 'popup' ? '✨' : p.type === 'food' ? '🍽️' : '☕',
    metadata: {
      name: p.name,
      lat: p.lat,
      lng: p.lng,
      description: p.description,
      time: p.time
    }
  }));
};

export async function getNextResponse(messages: ChatMessage[]): Promise<any> {
  // 1. 대화 내역에서 어시스턴트 응답 개수를 파악하여 현재 Step 결정
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  const stepCount = assistantMessages.length;

  // Step 1: 초기 진입 (무드 선택)
  if (stepCount === 0) {
    return {
      text: "반갑습니다. PYNSET AI입니다. 성수동에서의 완벽한 데이트를 위해 먼저 원하시는 데이트의 무드를 알려주시겠어요?",
      options: [
        { label: "지금 핫한 팝업 코스", value: "hot_popup", icon: "🔥" },
        { label: "조용한 소개팅 필수 코스", value: "quiet_blind_date", icon: "🤫" },
        { label: "힙한 감성의 인스타 맛집", value: "insta_vibe", icon: "📸" }
      ],
      isComplete: false
    };
  }

  // Step 2: 팝업 스토어 추천
  if (stepCount === 1) {
    return {
      text: "좋은 선택입니다! 먼저 방문하실 만한 성수동의 팝업 스토어들을 모아봤어요. 마음에 드는 곳을 골라주세요.",
      options: transformToOptions(MOCK_PLACES.popup),
      isComplete: false
    };
  }

  // Step 3: 맛집 추천
  if (stepCount === 2) {
    return {
      text: "근처에서 식사하기 좋은 맛집들입니다. 어떤 메뉴가 좋으실까요?",
      options: transformToOptions(MOCK_PLACES.food),
      isComplete: false
    };
  }

  // Step 4: 카페 추천
  if (stepCount === 3) {
    return {
      text: "마지막으로 대화를 나누며 쉬어갈 수 있는 카페를 추천해 드릴게요.",
      options: transformToOptions(MOCK_PLACES.cafe),
      isComplete: false
    };
  }

  // Step 5: 마무리
  return {
    text: "모든 코스가 완성되었습니다! 즐거운 데이트 되시길 바랍니다. 지도를 확인해 보세요.",
    options: [],
    isComplete: true
  };
}
