# 에듀지니 (EduGenie) 프론트엔드 - 개발자 인수인계 문서

> 맞춤형 학습 자료 생성 서비스 - 프론트엔드 기술 문서

**버전**: 1.0.1
**최종 업데이트**: 2026-02-03
**개발 환경**: Vue 3 + Vite + Tailwind CSS + EduGenie 백엔드 API

---

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [시스템 아키텍처](#시스템-아키텍처)
- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 구조 상세](#프로젝트-구조-상세)
- [주요 기능 구현](#주요-기능-구현)
- [데이터 흐름](#데이터-흐름)
- [API 통신](#api-통신)
- [배포 가이드](#배포-가이드)
- [유지보수 가이드](#유지보수-가이드)
- [트러블슈팅](#트러블슈팅)

---

## 프로젝트 개요

### 서비스 목적

NestJS 기반 EduGenie 백엔드 API(Google Gemini 연동, 디바이스 지문, 사용량 제한, OAuth 로그인 포함)를 호출하여  
학습 주제에 맞춘 완전한 교육 자료를 자동 생성하는 웹 애플리케이션의 **프론트엔드**입니다.

### 주요 기능

1. **수준별 맞춤 지문 생성**: 학년 수준에 맞춘 읽기 지문 자동 생성
2. **핵심 어휘 사전**: 자동 추출 및 정의 제공
3. **인터랙티브 지식맵**: 개념 간 관계 시각화
4. **종합 평가 시스템**: 객관식, 단답형, 서술형, 지식맵 분석 문제 생성

### 기술 스택

- **프론트엔드**: Vue 3 (Composition API), Vite, Tailwind CSS
- **백엔드 API**: EduGenie NestJS 서버 (`/auth`, `/gemini`, `/fingerprint` 등)
- **언어**: JavaScript (ES Modules)
- **스타일링**: Tailwind CSS (PostCSS 빌드)

---

## 시스템 아키텍처

### 전체 구조 (프론트엔드 관점)

```
┌─────────────────────────────────────────┐
│              사용자 인터페이스              │
│            (Vue 3 Components)           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            상태 관리 (뷰 컴포넌,            │
│         composable, auth.store)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        서비스 레이어 (services/*)          │
│  - geminiService: 교육 자료 생성 API       │
│  - api: 백엔드 엔드포인트 상수               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          EduGenie 백엔드 API              │
│  - /gemini/educational-content          │
│  - /gemini/usage                        │
│  - /fingerprint                         │
│  - /auth/google, /auth/status           │
└─────────────────────────────────────────┘
```

### 컴포넌트 계층 구조

```
App.vue
├── Layout
│   ├── Header.vue
│   └── Footer.vue
├── Main
│   ├── HeroSection.vue
│   └── InputForm/
│       ├── FormField.vue
│       ├── SelectField.vue
│       └── index.vue (InputForm 루트)
├── Common
│   ├── LoadingSpinner.vue
│   ├── Toast.vue
│   ├── Modal.vue
│   └── FeatureCards.vue
└── ResultView
    ├── ResultHeader.vue
    ├── ResultTabs.vue
    ├── Sections/
    │   ├── PassageSection.vue
    │   ├── VocabularySection.vue
    │   ├── MapSection/
    │   │   ├── ConceptMap.vue
    │   │   ├── GraphNode.vue
    │   │   ├── GraphEdge.vue
    │   │   └── EdgeLabel.vue
    │   └── AssessmentSection/
    │       ├── MultipleChoiceQuestion.vue
    │       ├── QuestionOption.vue
    │       ├── AnswerExplanation.vue
    │       ├── ShortAnswerSection.vue
    │       └── MapAnalysisSection.vue
    └── EdgeDetailModal.vue
```

---

## 개발 환경 설정

### 필수 요구사항

- **Node.js**: 18.x 이상 (권장: 20.x 이상)
- **npm**: 8.x 이상
- **EduGenie 백엔드 서버**: `http://localhost:3002` (기본)

### 초기 설정

1. **의존성 설치**

   ```bash
   npm install
   ```

2. **환경 변수 설정**

   프로젝트 루트에 `.env.local` 파일 생성:

   ```env
   VITE_API_BASE_URL=http://localhost:3002/api
   ```

   > ⚠️ **중요**: `.env.local`은 Git에 커밋하지 않습니다. `.gitignore`에 포함되어 있습니다.

3. **개발 서버 실행**

   ```bash
   npm run dev
   ```

   기본 포트: `http://localhost:5173`

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

---

## 프로젝트 구조 상세

### 핵심 파일 설명

#### `App.vue`

- **역할**: 애플리케이션의 루트 컴포넌트
- **주요 상태**:
  - `status`: 'idle' | 'loading' | 'success' | 'error'
  - `content`: 생성된 교육 자료 객체
  - `error`: 에러 메시지
- **주요 함수**:
  - `handleGenerate()`: 자료 생성 요청 처리
  - `handleCopy()`: 클립보드 복사 처리

#### `services/geminiService.js`

- **역할**: Gemini API와의 통신을 담당하는 메인 서비스
- **주요 함수**:
  - `generateEducationalContent(params)`: 교육 자료 생성
- **의존성**:
  - `geminiClient.js`: API 클라이언트 초기화
  - `prompts/educationalPrompt.js`: 프롬프트 생성
  - `schemas/educationalContentSchema.js`: JSON 스키마 정의
  - `utils/imageGenerator.js`: 이미지 생성
  - `utils/sourceProcessor.js`: 출처 정보 처리

#### `constants.js`

- **역할**: 전역 상수 정의
- **주요 상수**:
  - `GRADE_LEVELS`: 학년 목록 (12단계)
  - `LANGUAGES`: 지원 언어 목록
  - `PASSAGE_LENGTHS`: 지문 길이 옵션
  - `MAP_COMPLEXITIES`: 지식맵 복잡도 옵션

### 디렉토리별 역할

#### `src/stores/`

- `auth.store.js`: 로그인 사용자 정보 및 디바이스 fingerprint 관리
- `usage.store.js`: 오늘 토큰 사용량, 호출 횟수, 일일 한도 상태 관리

#### `components/Common/`

공통으로 사용되는 UI 컴포넌트

- `ErrorAlert.vue`: 에러 메시지 표시
- `LoadingSpinner.vue`: 로딩 상태 표시 (동적 메시지)
- `Toast.vue`: 토스트 알림 (성공/에러/정보)

#### `components/InputForm/`

입력 폼 관련 컴포넌트

- `FormField.vue`: 폼 필드 래퍼 (라벨 + 입력)
- `TextInputField.vue`: 텍스트 입력 필드
- `SelectField.vue`: 드롭다운 선택 필드
- `SubmitButton.vue`: 제출 버튼

#### `components/ResultView/Sections/`

결과 표시 섹션 컴포넌트

- `PassageSection.vue`: 지문 및 요약 표시
- `VocabularySection.vue`: 어휘 목록 표시
- `AssessmentSection/`: 평가 문제 표시
- `MapSection/`: 지식맵 시각화

#### `services/`

서비스 레이어

- `geminiClient.js`: API 클라이언트 초기화 및 관리
- `geminiConfig.js`: API 설정 및 상수
- `prompts/`: 프롬프트 템플릿
- `schemas/`: JSON 스키마 정의
- `utils/`: 유틸리티 함수

#### `composables/`

Vue Composables

- `useToast.js`: 토스트 알림 상태 관리

#### `utils/`

공통 유틸리티 함수

- `clipboard.js`: 클립보드 복사 기능

---

## 주요 기능 구현

### 1. 교육 자료 생성 프로세스

#### 데이터 흐름

```
사용자 입력 (InputForm)
    ↓
App.vue (handleGenerate)
    ↓
geminiService.generateEducationalContent()
    ↓
1. 설정값 가져오기 (constants.js)
2. 언어 코드 변환 (geminiConfig.js)
3. 프롬프트 생성 (prompts/educationalPrompt.js)
4. API 호출 (geminiClient.js)
   - 모델: gemini-3-flash-preview
   - 도구: googleSearch
   - 응답 형식: JSON
5. JSON 파싱 및 검증
6. 이미지 생성 (utils/imageGenerator.js)
7. 출처 정보 보강 (utils/sourceProcessor.js)
    ↓
생성된 자료 반환
    ↓
ResultView에 표시
```

#### 주요 로직

**프롬프트 생성** (`services/prompts/educationalPrompt.js`)

- 사용자 입력값을 기반으로 Gemini API에 전달할 프롬프트 생성
- 학년 수준, 언어, 지문 길이, 맵 복잡도 등을 반영

**JSON 스키마 검증** (`services/schemas/educationalContentSchema.js`)

- API 응답이 정확한 구조를 가지도록 스키마 정의
- 필수 필드 검증

**에러 처리**

- API 호출 실패 시 사용자 친화적 메시지 표시
- 네트워크 오류, API 키 오류, 파싱 오류 등 구분

### 2. 지식맵 렌더링

#### Force-directed 레이아웃 알고리즘

**구현 위치**: `components/ResultView/Sections/MapSection/useGraphLayout.js`

**주요 단계**:

1. **연결도 계산**: 각 노드의 연결 수 계산
2. **중심 노드 선택**: 연결도가 가장 높은 노드를 중심으로 설정
3. **초기 배치**: 중심 노드를 중심으로 원형 배치
4. **Force 계산**:
   - 반발력: 모든 노드 쌍에 대해 계산 (충돌 방지)
   - 인력: 연결된 노드 간 계산
5. **위치 업데이트**: 반복적으로 위치 조정 (150회)
6. **충돌 해결**: 마지막 50회 반복에서 추가 충돌 방지

**주요 상수** (`components/ResultView/Sections/MapSection/graphConstants.js`):

- `LAYOUT_ITERATIONS`: 150회
- `MIN_DISTANCE_MULTIPLIER`: 1.5 (노드 간 최소 거리 배수)
- `BOUNDARY_MARGIN`: 20px (경계 여백)

### 3. 평가 문제 상태 관리

**구현 위치**: `components/ResultView/Sections/AssessmentSection/`

**상태 관리**:

- 각 문제별 선택된 답안을 `selectedAnswers` 객체로 관리
- 키: 문제 인덱스, 값: 선택한 옵션 라벨 (A, B, C, D)

**답안 검증 로직**:

- 선택된 옵션의 실제 텍스트와 정답 비교
- 대소문자 구분 없이 비교
- 정답/오답에 따라 스타일 변경

### 4. 토스트 알림 시스템

**구현 위치**: `composables/useToast.js`, `components/Common/Toast.vue`

**동작 방식**:

1. `useToast()` composable로 토스트 목록 관리
2. `showSuccess()`, `showError()`, `showInfo()` 함수로 토스트 표시
3. 자동 닫기: 기본 3초 (에러는 5초)
4. 여러 토스트 동시 표시 가능

---

## 데이터 흐름

### 입력 → 생성 → 표시

```
1. 사용자 입력
   InputForm 컴포넌트
   ├── topic: string (학습 주제)
   ├── gradeLevel: string (대상 학년)
   ├── language: string (출력 언어)
   ├── passageLength: string (지문 길이 ID)
   └── mapComplexity: string (맵 복잡도 ID)
        ↓
2. 상태 변경
   App.vue
   status = 'loading'
        ↓
3. API 호출
   geminiService.generateEducationalContent()
        ↓
4. 응답 처리
   {
     topic: string,
     gradeLevel: string,
     language: string,
     adaptedReadingPassage: string,
     summary: string,
     vocabulary: Array<{word, definition, example}>,
     multipleChoiceQuestions: Array<{question, options, correctAnswer, explanation}>,
     shortAnswerQuestions: Array<{question, answer, explanation}>,
     openEndedQuestions: Array<string>,
     graphAssessmentQuestions: Array<{question, answer, explanation}>,
     keywordGraph: {
       nodes: Array<{id, label, importance, wikiUrl}>,
       edges: Array<{source, target, relationship, contextSnippet, explanation}>
     },
     sources: Array<{uri, title}>,
     imageUrl?: string
   }
        ↓
5. 상태 업데이트
   App.vue
   status = 'success'
   content = 응답 데이터
        ↓
6. 결과 표시
   ResultView 컴포넌트
   ├── PassageSection (지문)
   ├── MapSection (지식맵)
   ├── VocabularySection (어휘)
   └── AssessmentSection (평가)
```

### 상태 관리 패턴

애플리케이션은 Vue 3의 Composition API를 사용하여 상태를 관리합니다:

- **로컬 상태**: 각 컴포넌트 내부에서 `ref()` 사용
- **전역 상태**: App.vue에서 관리하고 props로 전달
- **Composables**: 재사용 가능한 로직 분리 (`useToast`, `useGraphLayout`)

---

## API 통신

### Gemini API 호출 구조

#### 1. 텍스트 생성 API

**엔드포인트**: `ai.models.generateContent()`

**요청 파라미터**:

```javascript
{
  model: 'gemini-3-flash-preview',
  contents: textPrompt, // 프롬프트 문자열
  config: {
    tools: [{ googleSearch: {} }], // Wikipedia 검색 도구
    responseMimeType: 'application/json',
    responseSchema: getEducationalContentSchema() // JSON 스키마
  }
}
```

**응답 처리**:

1. `textResponse.text`에서 JSON 문자열 추출
2. `JSON.parse()`로 파싱
3. 스키마 검증 (필수 필드 확인)
4. 에러 발생 시 상세 메시지와 함께 throw

#### 2. 이미지 생성 API

**엔드포인트**: `ai.models.generateContent()`

**요청 파라미터**:

```javascript
{
  model: 'gemini-2.5-flash-image',
  contents: [{ parts: [{ text: imagePrompt }] }],
  config: {
    imageConfig: { aspectRatio: '16:9' }
  }
}
```

**응답 처리**:

1. `candidates[0].content.parts`에서 이미지 데이터 추출
2. Base64 데이터를 `data:image/png;base64,{data}` 형식으로 변환
3. 실패해도 계속 진행 (선택적 기능)

### 에러 처리

**에러 타입별 처리**:

- **API 키 오류**: "API 키가 설정되지 않았습니다"
- **네트워크 오류**: "네트워크 연결을 확인해주세요"
- **파싱 오류**: "서버 응답을 처리하는 중 오류가 발생했습니다"
- **기타 오류**: 원본 에러 메시지 표시

---

## 배포 가이드

### 프로덕션 빌드

1. **환경 변수 확인**

   ```bash
   # .env.local 파일 확인
   cat .env.local
   ```

2. **빌드 실행**

   ```bash
   npm run build
   ```

3. **빌드 결과 확인**
   - `dist/` 디렉토리에 정적 파일 생성
   - `dist/index.html`이 진입점

### 배포 옵션

#### 정적 호스팅 (권장)

**Vercel**:

```bash
npm install -g vercel
vercel --prod
```

**Netlify**:

- Netlify 대시보드에서 `dist/` 디렉토리 배포
- 빌드 명령: `npm run build`
- 배포 디렉토리: `dist`

**GitHub Pages**:

```bash
npm run build
# dist/ 디렉토리 내용을 gh-pages 브랜치에 배포
```

#### 환경 변수 설정 (배포 환경)

배포 플랫폼의 환경 변수 설정에서:

- `GEMINI_API_KEY`: Gemini API 키

> ⚠️ **보안**: API 키는 환경 변수로만 관리하고 코드에 하드코딩하지 않습니다.

### 빌드 최적화

**Vite 설정** (`vite.config.js`):

- 자동 코드 분할
- Tree-shaking
- 압축 최적화

**추가 최적화 옵션**:

```javascript
// vite.config.js에 추가 가능
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['vue'],
        'gemini': ['@google/genai']
      }
    }
  }
}
```

---

## 유지보수 가이드

### 코드 수정 시 주의사항

#### 1. 컴포넌트 추가/수정

- **컴포넌트 위치**: 기능별로 적절한 디렉토리에 배치
- **Props 검증**: `defineProps()`에 `validator` 함수 추가
- **JSDoc 주석**: 모든 컴포넌트와 함수에 설명 추가
- **이벤트 명명**: `kebab-case` 사용 (예: `@edge-click`)

#### 2. API 변경

**프롬프트 수정** (`services/prompts/educationalPrompt.js`):

- 프롬프트 변경 시 API 응답 구조 확인 필요
- 스키마와 일치하는지 검증

**스키마 수정** (`services/schemas/educationalContentSchema.js`):

- 필드 추가/삭제 시 관련 컴포넌트도 함께 수정
- 하위 호환성 고려

#### 3. 상수값 변경

**학년/언어 추가** (`constants.js`):

- `GRADE_LEVELS` 또는 `LANGUAGES` 배열에 추가
- UI에 자동 반영됨

**지문 길이/맵 복잡도 변경**:

- `PASSAGE_LENGTHS` 또는 `MAP_COMPLEXITIES` 배열 수정
- `prompt` 필드도 함께 수정 필요

### 성능 최적화

#### 1. 지식맵 렌더링 최적화

**현재 구현**:

- `computed` 속성으로 레이아웃 계산 (캐싱)
- 노드 수에 따라 캔버스 높이 조정

**개선 가능 영역**:

- 노드가 많을 경우 (20개 이상) Web Worker 사용 고려
- 레이아웃 계산을 비동기로 처리

#### 2. 이미지 최적화

**현재 구현**:

- Base64 인라인 이미지 사용
- Lazy loading 적용

**개선 가능 영역**:

- 이미지를 별도 파일로 저장하고 URL 사용
- CDN 활용

### 로깅 및 모니터링

**현재 로깅**:

- `console.error()`: 에러 로깅
- `console.warn()`: 경고 로깅

**추가 가능**:

- 에러 추적 서비스 연동 (Sentry 등)
- 사용자 행동 분석 (Google Analytics 등)

---

## 트러블슈팅

### 일반적인 문제

#### 1. API 키 오류

**증상**: "API 키가 설정되지 않았습니다"

**원인**:

- `.env.local` 파일이 없음
- 환경 변수 이름 오타
- 서버 재시작 안 함

**해결**:

```bash
# 1. 파일 확인
ls -la .env.local

# 2. 내용 확인 (키는 마스킹)
cat .env.local | sed 's/=.*/=***/'

# 3. 서버 재시작
# Ctrl+C로 중지 후
npm run dev
```

#### 2. 빌드 실패

**증상**: `npm run build` 실행 시 오류

**원인**:

- 의존성 버전 충돌
- Node.js 버전 불일치

**해결**:

```bash
# 1. node_modules 삭제
rm -rf node_modules package-lock.json

# 2. 재설치
npm install

# 3. Node.js 버전 확인 (16.x 이상)
node --version
```

#### 3. 지식맵 노드 겹침

**증상**: 노드들이 겹쳐서 표시됨

**원인**:

- 노드 수가 너무 많음 (20개 이상)
- 레이아웃 알고리즘 파라미터 조정 필요

**해결**:
`components/ResultView/Sections/MapSection/graphConstants.js`에서:

- `MIN_DISTANCE_MULTIPLIER` 값 증가 (1.5 → 2.0)
- `LAYOUT_ITERATIONS` 값 증가 (150 → 200)

#### 4. 이미지가 표시되지 않음

**증상**: 지문은 생성되지만 이미지가 없음

**원인**:

- 이미지 생성 API 실패 (선택적 기능)
- Base64 데이터 파싱 오류

**해결**:

- 콘솔에서 경고 메시지 확인
- 이미지 생성 실패해도 다른 기능은 정상 작동
- 필요시 `services/utils/imageGenerator.js`의 에러 처리 로직 확인

### 디버깅 팁

#### 1. 브라우저 개발자 도구 활용

**콘솔 확인**:

```javascript
// Vue DevTools 설치 권장
// Chrome Extension: Vue.js devtools
```

**네트워크 탭**:

- API 요청/응답 확인
- 응답 시간 측정
- 에러 상태 코드 확인

#### 2. Vue DevTools

**설치**: Chrome/Firefox 확장 프로그램

**활용**:

- 컴포넌트 트리 탐색
- Props/State 확인
- 이벤트 추적

#### 3. 로컬 디버깅

**중단점 설정**:

```javascript
// services/geminiService.js
export async function generateEducationalContent(params) {
  debugger // 브라우저에서 중단
  // ...
}
```

**로깅 추가**:

```javascript
console.log('API Response:', textResponse)
console.log('Parsed Content:', content)
```

---

## 주요 파일 참조

### 설정 파일

- **`vite.config.js`**: Vite 빌드 설정, 환경 변수 주입
- **`package.json`**: 프로젝트 메타데이터, 의존성 목록
- **`src/utils/constants.js`**: 전역 상수 정의

### 진입점

- **`src/main.js`**: Vue 앱 초기화
- **`index.html`**: HTML 템플릿
- **`src/App.vue`**: 루트 컴포넌트

### 서비스 레이어

- **`src/services/geminiService.js`**: 백엔드 Gemini API 호출 메인 서비스
- **`src/services/api.js`**: 백엔드 엔드포인트 상수 관리

### 상태 관리 (Stores)

- **`src/stores/auth.store.js`**: 로그인 사용자 정보 및 fingerprint 상태
- **`src/stores/usage.store.js`**: 토큰 사용량/호출 수/일일 한도 상태

### 핵심 컴포넌트

- **`src/components/Main/InputForm/index.vue`**: 입력 폼
- **`src/components/ResultView/index.vue`**: 결과 표시
- **`src/components/ResultView/Sections/MapSection/ConceptMap.vue`**: 지식맵 시각화

---

## 추가 리소스

### 공식 문서

- [Vue 3 문서](https://vuejs.org/)
- [Vite 문서](https://vitejs.dev/)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### 내부 문서

- 각 컴포넌트와 함수에는 JSDoc 주석이 포함되어 있습니다
- IDE에서 호버 시 설명 확인 가능

---

## 연락처 및 지원

기술적 문제나 질문이 있으시면:

1. 프로젝트 관리자에게 문의
2. 코드 리뷰 요청
3. 기술 문서 업데이트 제안