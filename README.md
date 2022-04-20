# naengjanggo-server
# Comon-server

우리집 냉장고 관리부터

음식물 쓰레기 조회까지

냉장GO

---

![img](https://postfiles.pstatic.net/MjAyMTA4MDdfMTgz/MDAxNjI4MjY3MzYxOTA5.J2yB-WiNvW19GAJ0WKjc2Lm8KOICnSAkf-qvoO2TyLkg.niMml-Um7a02msM9XEbe7iu86rkOuYF2HG29yclRiv4g.PNG.kkhhjj888/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2021-08-07_%EC%98%A4%EC%A0%84_1.27.25.png?type=w966)

<br/>


### 냉장Go API 명세서
https://drive.google.com/file/d/1gukpGicDsIji8MK0dFspFLjctz7x1C0V/view

<br/>

### 냉장Go 프로토타입 영상
https://www.youtube.com/watch?v=3MWks2qQQR0


<br/>

### 핵심 기능

---

1.  냉장고 각 칸별로 식재료 유통기한 및 수량 확인
2. 영수증 인식 혹은 직접 입력을 통한 식재료 등록
3. **장보기 리스트** : 구매하려는 식재료가 냉장고에 있는 경우, 팝업창으로 알려줍니다

1. **맞춤 레시피** : 유통기한이 임박한 식재료들로 요리할 수 있는 레시피를 추천해줍니다
2. **커뮤니티** : 식재료 관리법 및 꿀팁공유 카테고리 안에서 사용자들이 자유롭게 글을 공유합니다
3. RFID 음식물 쓰레기 카드 배출량 및 수수료 조회

<br/>



### 활용한 오픈 API 및 개발 설명

---

1. **사용자별 맞춤 레시피** 

유통기한이 임박한 식재료들로 하여금 요리할 수 있는 레시피를 추천해줍니다

식품의약품안전처의 **[조리식품의 레시피 DB Open API](http://www.foodsafetykorea.go.kr/api/openApiInfo.do?menu_grp=MENU_GRP31&menu_no=661&show_cnt=10&start_idx=1&svc_no=COOKRCP01)** 를 사용하여 개발하였습니다

2. **영수증 글자 인식을 통한 식재료 등록**

[네이버 OCR API](https://www.ncloud.com/product/aiService/ocr) 를 사용하였으며, 수량과 금액 이외의 글자들을 제외하고 상품명만 인식 되도록 개발하였고 , 

디자이너께서 작업해주신 과일, 야채 및 수산식품 등 총 115개의 아이콘들과 일치하는 상품명이 있는 경우 상품명을 동일하게 매칭하였습니다.

3. **PUSH 알림**

FIREBASE FCM 서비스를 활용하여 사용자의 알림 설정 유무 에 맞추어 

식재료 유통기한 알림 및 커뮤니티 댓글 및 대댓글 알림을 해주고 있습니다.

4. **RFID 음식물 쓰레기 수수료 및 배출량 조회**

입력된 사용자 정보들로 [한국 환경 공단의 RFID 음식물 쓰레기 관리시스템 홈페이지](https://www.citywaste.or.kr/main.do) 에 로그인을 하여 배출량 및 수수료를 조회해줍니다. 웹스크래핑에 대한 정보 이용은 한국 환경 공단 폐기물관리처 폐기물정보 관리부의 허락을 받아 개발하였습니다.

---

<br/>

### 팀구성 및 개발 기간
---
`개발 기간` : 2021-06-28일 ~ 2021-08-07일

|역할|이름|역할|이름|
|------|---|------|---|
|PM, SERVER 개발자|김도하|Designer|전혜인|
|IOS 개발자|김우성|AOS 개발자|김민주|


---


<br/>


**로그인 및 회원가입**

- 카카오 로그인
- 애플 로그인
- 네이버 로그인
- 자동 로그인, JWT 토큰 발급

**마이 페이지**

- 회원 탈퇴
- 마이 페이지 조회 / 사용자 프로필 조회
- 냉장고 타입 수정
- 냉장고 삭제
- 냉장고 조회

**사용자 설정**

- 닉네임 / 이미지 수정
- 냉장고 타입 설정
- 닉네임 / 이미지 조회

**장보기 리스트**

- 장보기 리스트 식재료 추가
- 장보기 리스트 식재료 삭제
- [ 가장 최신 날짜 ] 장보기 리스트 조회
- 날짜별 장보기 리스트 조회
- 식재료 메시지

**영수증 인식**

- 네이버 OCR API 영수증 인식
- 영수증 인식 조회
- 식재료 수량 설정
- 식재료 유통기한 설정

**커뮤니티**

- 글 작성
- [ 식재료 관리법 | 꿀팁 공유 ] 전체 화면 조회
- 글 세부 조회
- 북마크 설정 및 해제
- 글 수정
- 글 삭제

**찜**

- 찜 - 커뮤니티 글 조회
- 찜 - 레시피 조회

**신고하기**

- 신고 API = 해당 글 삭제 + 해당 유저 일주일 정지

**댓글 + 대댓글 + 좋아요**

- 댓글 작성 API
- 대댓글 작성 API
- 댓글 조회 API
- 대댓글 조회 API
- 댓글 좋아요 API
- 대댓글 좋아요 API
- 댓글 삭제 API
- 대댓글 삭제 API
- 댓글 편집 API
- 대댓글 편집 API

**메인 홈 화면**

- 냉장고 홈 화면 API
- 냉장고 각 칸별 세부 조회 API

**냉장고 검색화면**

- 냉장고 속 식재료 조회 API
- 최근 검색어 조회 API
- 최근 검색어 전체 지우기 API

**친구**

- 친구 추가 API
- 친구 삭제 API

**RFID 음식물쓰레기**

- 음식물 쓰레기 배출량 간편조회 API
- 음식물 쓰레기 간편 조회 API

**유통기한 FCM 알림설정** 

- 유통기한 푸시 알림



<br/>


### 📚 Requirements

---

### **Language**

- Backend
    - Node.js

### **Framework**

- Backend
    - Express.js

### **Database**

- Backend
    - MySQL

### **Library**

- Backend
    - MySQL
    - Crypto
    - JWT
    - Fcm-node
    - Puppeteer
