import { ChatMessage, Place } from "../types";

// 기존 MOCK_PLACES 데이터 활용
export const MOCK_PLACES: Record<string, Place[]> = {
  popup: [
    { id: 'p1', name: '몬스터에너지 팝업', type: 'popup', description: '에너지 드링크 팝업', time: '14:00', lat: 37.5441, lng: 127.0566 },
    { id: 'p2', name: '메리퓨어 팝업', type: 'popup', description: '메리퓨어의 향기 컬렉션', time: '14:00', lat: 37.5455, lng: 127.0523 },
    { id: 'p3', name: '무신사 스탠다드X노홍철 팝업', type: 'popup', description: '노홍철의 에너지가 담긴 럭키 가이 컬렉션 출시!', time: '14:00', lat: 37.5421, lng: 127.0612 },
  ],
  food: [
    { id: 'f1', name: '칙피스 성수점', type: 'food', description: '현지의 맛을 느낄 수 있는 지중해식 할랄 푸드', time: '15:30', lat: 37.5471, lng: 127.0435 },
    { id: 'f2', name: '르베지왕 성수공간', type: 'food', description: '귀리밥이 들어있는 샐러드볼 맛집', time: '15:30', lat: 37.5427, lng: 127.0571 },
    { id: 'f3', name: '라지라프', type: 'food', description: '', time: '15:30', lat: 37.5478, lng: 127.0421 },
    { id: 'f4', name: 'PYNSET의 추천', type: 'popup', description: '', time: '15:30', lat: 37.5478, lng: 127.0421 },
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
      text: "무슬림 일행과 함께 성수를 여행하신다면, 할랄 음식과 기도실 접근성을 고려해보는 게 좋아요. 먼저 할랄 인증을 받은 식당을 골라봤어요. 어떤 메뉴가 좋으실까요?",
      options: transformToOptions(MOCK_PLACES.food),
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
