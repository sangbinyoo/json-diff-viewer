# JSON Diff Viewer

> React + TypeScript 포트폴리오 프로젝트 #1

---

## 프로젝트 주제

두 개의 JSON 파일을 업로드하거나 직접 입력하면, 프로퍼티별로 **추가·삭제·변경·동일** 여부를 시각적으로 비교해주는 웹 애플리케이션입니다.

Angular 기반 7년 6개월 경력을 가진 프론트엔드 개발자가 **React 학습을 목적으로** 시작한 포트폴리오 시리즈의 첫 번째 프로젝트입니다. 단순한 기능 구현에 그치지 않고, React의 핵심 패턴(Custom Hook, CSS Modules, 순수 함수 분리)을 의도적으로 적용하여 Angular와의 패러다임 차이를 체득하는 데 초점을 맞췄습니다.

---

## 기획 컨셉

### 배경
실무에서 API 응답 스키마 변경, 설정 파일 버전 비교, 환경별 config 차이 확인 등의 상황에서 JSON을 육안으로 비교하는 불편함을 해소하고자 기획했습니다.

### 핵심 방향
- 별도 설치 없이 브라우저에서 바로 사용 가능한 클라이언트 사이드 도구
- 중첩 구조(`user.settings.theme` 형태)까지 재귀적으로 탐색하는 깊은 비교
- 개발자 친화적인 diff 뷰 — 좌우 나란히 표시, 타입별 색상, 동기화 스크롤

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 파일 업로드 | `.json` 파일 드래그 앤 드롭 또는 클릭 업로드 |
| 직접 입력 | 텍스트 에디터에 JSON 붙여넣기, 실시간 유효성 검사 |
| 깊은 비교 | 중첩 객체 재귀 탐색, 키 경로 형태로 펼쳐서 표시 |
| diff 뷰 | 파일 A / B를 좌우 나란히 표시, 스크롤 동기화 |
| 변경 마커 | `+` 추가 / `−` 삭제 / `~` 변경 / 공백 동일 |
| 타입 색상 | string / number / boolean / null / array / object 구분 |
| 정렬 | 키 이름순 / 변경 유형순 / 원본 순서 |
| 필터 | 전체 / 변경 / 추가 / 삭제 / 동일 탭 |
| 요약 통계 | 전체·추가·삭제·변경 카운트 표시 |
| 다크 모드 | `prefers-color-scheme` 자동 감지 |

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | React 18 |
| 언어 | TypeScript 5 |
| 빌드 도구 | Vite 5 |
| 스타일 | CSS Modules |
| 패키지 매니저 | npm |

---

## 프로젝트 구조

```
src/
├── types/
│   └── diff.ts              # 공유 타입 정의 (DiffRow, DiffStats 등)
├── utils/
│   ├── deepDiff.ts          # 재귀 diff 알고리즘 (순수 함수)
│   ├── formatValue.ts       # 값 → 토큰 변환 유틸
│   └── sampleData.ts        # 데모용 샘플 JSON
├── hooks/
│   ├── useJsonInput.ts      # JSON 입력 상태 관리 (파일/텍스트)
│   └── useDiff.ts           # diff 결과 + 정렬/필터 상태
├── components/
│   ├── JsonInputPanel.tsx   # 파일 드롭존 + 텍스트 에디터
│   ├── StatsBar.tsx         # 요약 통계 + 필터 탭
│   ├── DiffViewer.tsx       # 좌우 나란히 diff 뷰 (동기화 스크롤)
│   └── ValueToken.tsx       # JSON 값 타입별 색상 렌더링
├── styles/
│   └── global.css           # CSS 변수 (라이트/다크 모드) + 리셋
├── App.tsx                  # 루트 컴포넌트
└── main.tsx                 # React DOM 엔트리
```

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:5173

# 프로덕션 빌드
npm run build
```

---

## 문서 업데이트 히스토리

| No. | 내용 | 날짜 | 비고 |
|-----|------|------|------|
| 1 | 최초 문서 작성 — 프로젝트 주제 및 초기 컨셉 정의 | 2025-06-04 | 초안 |
