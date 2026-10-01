import { http, HttpResponse } from "msw";

export const familiesHandler = [
  // "/api/families/my" 계열은 "/api/families/:familyId"보다 먼저 와야 매칭이 안 가로채짐
  http.get("/api/families/my", ()=>{
    // TODO: 내 가족 목록
    return HttpResponse.json(null);
  }),
  http.get("/api/families/my/primary", ()=>{
    // TODO: 내 대표 가족
    return HttpResponse.json(null);
  }),
  http.post("/api/families", ()=>{
    // TODO: 가족 생성
    return HttpResponse.json(null);
  }),
  http.get("/api/families/join/my", ()=>{
    // TODO: 내 가입 요청 목록
    return HttpResponse.json(null);
  }),
  http.post("/api/families/join", ()=>{
    // TODO: 초대 코드로 가입 요청
    return HttpResponse.json(null);
  }),
  http.post("/api/families/join/:requestId", ()=>{
    // TODO: 가입 요청 승인/거절
    return HttpResponse.json(null);
  }),
  http.get("/api/families/:familyId", ()=>{
    // TODO: 가족 상세
    return HttpResponse.json(null);
  }),
  http.put("/api/families/:familyId", ()=>{
    // TODO: 가족 정보 수정
    return HttpResponse.json(null);
  }),
  http.get("/api/families/:familyId/members", ()=>{
    // TODO: 가족 멤버 목록
    return HttpResponse.json(null);
  }),
  http.post("/api/families/:familyId/regenerate-invitation-code", ()=>{
    // TODO: 초대 코드 재발급
    return HttpResponse.json(null);
  }),
  http.get("/api/families/:familyId/join", ()=>{
    // TODO: 가족에 들어온 가입 요청 목록
    return HttpResponse.json(null);
  }),
]
