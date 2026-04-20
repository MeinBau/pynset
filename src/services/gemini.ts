import { ChatMessage, Place } from "../types";

// 1. MOCK_PLACES: 성수동의 대중적인 핫플레이스로 데이터 업데이트
export const MOCK_PLACES: Record<string, Place[]> = {
  popup: [
    { id: 'p1', name: '몬스터에너지 팝업', type: 'popup', description: '강렬한 에너지와 익스트림 스포츠 감성을 체험해보세요!', time: '14:00', lat: 37.5441, lng: 127.0566 },
    { id: 'p2', name: '메리퓨어 팝업', type: 'popup', description: '은은한 향기와 함께하는 감성적인 라이프스타일 전시', time: '14:00', lat: 37.5455, lng: 127.0523 },
    { id: 'p3', name: '무신사 스탠다드X노홍철', type: 'popup', description: '긍정 에너지 폭발! 노홍철의 럭키가이 컬렉션', time: '14:00', lat: 37.5421, lng: 127.0612 },
  ],
  food: [
    { id: 'f1', name: '살라댕템플', type: 'food', description: '배를 타고 들어가는 이색적인 분위기의 퓨전 타이 다이닝', time: '15:30', lat: 37.5451, lng: 127.0601 },
    { id: 'f2', name: '쵸리상경', type: 'food', description: '정갈하고 든든한 솥밥 한 끼, 성수동 줄 서는 맛집', time: '15:30', lat: 37.5435, lng: 127.0423 },
    { id: 'f3', name: '조와이', type: 'food', description: '세련된 분위기에서 즐기는 생면 파스타와 와인', time: '15:30', lat: 37.5472, lng: 127.0415 },
  ],
  cafe: [
    { id: 'c1', name: '대림창고', type: 'cafe', description: '성수동 카페거리의 상징적인 갤러리 카페', time: '17:00', lat: 37.5414, lng: 127.0586 },
    { id: 'c2', name: '어니언 성수', type: 'cafe', description: '폐공장을 개조한 빈티지한 매력의 베이커리', time: '17:00', lat: 37.5445, lng: 127.0578 },
    { id: 'c3', name: '블루보틀 성수', type: 'cafe', description: '미니멀한 디자인의 스페셜티 커피', time: '17:00', lat: 37.5479, lng: 127.0474 },
  ]
};

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
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  const stepCount = assistantMessages.length;

  // Step 1: 환영 멘트
  if (stepCount === 0) {
    return {
      text: "안녕하세요! 성수동 데이트 메이트 PYNSET입니다. 😊 오늘 어떤 느낌의 하루를 보내고 싶으신가요? 원하시는 코스 무드를 알려주세요!",
      options: [
        { label: "지금 핫한 팝업 코스", value: "hot_popup", icon: "🔥" },
        { label: "조용한 소개팅 필수 코스", value: "quiet_blind_date", icon: "🤫" },
        { label: "힙한 감성의 인스타 맛집", value: "insta_vibe", icon: "📸" }
      ],
      isComplete: false
    };
  }

  // Step 2: 팝업 추천
  if (stepCount === 1) {
    return {
      text: "좋아요! 요즘 성수에서 가장 화제인 팝업스토어들이에요. 가장 가보고 싶은 곳을 골라보세요!",
      options: transformToOptions(MOCK_PLACES.popup),
      isComplete: false
    };
  }

  // Step 3: 맛집 추천 (평범하고 인기 많은 곳으로 수정)
  if (stepCount === 2) {
    return {
      text: "구경하다 보면 배가 고파질 텐데요! 팝업 근처에서 가장 리뷰가 좋고 분위기 있는 식당들을 준비했어요. 어떤 메뉴가 좋을까요?",
      options: transformToOptions(MOCK_PLACES.food),
      isComplete: false
    };
  }

  // Step 4: 카페 추천
  if (stepCount === 3) {
    return {
      text: "마지막으로 대화를 나누며 여유를 즐길 수 있는 카페를 추천해 드릴게요. 성수의 감성을 제대로 느낄 수 있는 곳들이에요.",
      options: transformToOptions(MOCK_PLACES.cafe),
      isComplete: false
    };
  }

  // Step 5: 마무리
  return {
    text: "짠! 당신을 위한 성수동 데이트 코스가 완성되었습니다. ✨ 지도를 확인하며 즐거운 시간 보내시길 바랄게요!",
    options: [],
    isComplete: true
  };
}
