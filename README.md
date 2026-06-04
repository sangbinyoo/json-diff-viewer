# JSON Diff Viewer

두 JSON 파일을 비교하여 추가·삭제·변경된 프로퍼티를 시각화하는 React + TypeScript 포트폴리오 프로젝트입니다.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

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

## 주요 기능

- **깊은 비교** — 중첩 객체를 재귀 탐색, `user.settings.theme` 형태의 경로로 표시
- **좌우 diff 뷰** — 파일 A / B를 나란히 표시, 스크롤 동기화
- **타입별 색상** — string / number / boolean / null / array / object 구분
- **정렬** — 키 이름순 / 변경 유형순 / 원본 순서
- **필터** — 전체 / 변경 / 추가 / 삭제 / 동일
- **라이트/다크 모드** — `prefers-color-scheme` 자동 감지

## 기술 스택

- React 18 + TypeScript 5
- Vite 5
- CSS Modules
