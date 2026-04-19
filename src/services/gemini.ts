import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, Place } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
You are "PYNSET AI", a high-end date course curator for Seongsu-dong, Seoul.
Your goal is to provide a "Toss-style" minimal and precise conversation to help users build a perfect date course.

Follow these rules:
1. Be polite, professional, and helpful in Korean.
2. Focus on one step at a time.
3. Steps:
   - Step 1: Ask for the general mood or purpose (e.g., "지금 핫한 팝업 코스", "조용한 소개팅 필수 코스").
   - Step 2: Recommend a real Pop-up store in Seongsu-dong based on the mood.
   - Step 3: Recommend a real Food place in Seongsu-dong near the selected Pop-up.
   - Step 4: Recommend a real Cafe in Seongsu-dong to finish the course.
4. When recommending, provide 3-4 distinct options with clear labels and emojis.
5. ALWAYS ensure the places are REAL and located in Seongsu-dong (성수동).
6. Return the response in a structured JSON format if the user is making a selection or if you are providing recommendations.

Response Format:
{
  "text": "The message to display to the user",
  "options": [
    { "label": "Display Name", "value": "internal_id_or_name", "icon": "emoji", "metadata": { "name": "Real Name", "lat": number, "lng": number, "description": "Short desc", "time": "HH:MM" } }
  ],
  "isComplete": boolean
}
`;

export async function getNextResponse(messages: ChatMessage[]): Promise<any> {
  try {
    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      options: []
    };
  }
}

// Real Seongsu-dong places for fallback/initial state
export const MOCK_PLACES: Record<string, Place[]> = {
  popup: [
    { id: 'p1', name: '디올 성수', type: 'popup', description: '화려한 외관과 럭셔리한 경험', time: '14:00', lat: 37.5441, lng: 127.0566 },
    { id: 'p2', name: '무신사 테라스 성수', type: 'popup', description: '패션 트렌드를 한눈에 보는 공간', time: '14:00', lat: 37.5455, lng: 127.0523 },
    { id: 'p3', name: 'LCDC SEOUL', type: 'popup', description: '다양한 브랜드가 모인 복합문화공간', time: '14:00', lat: 37.5421, lng: 127.0612 },
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
