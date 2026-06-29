# JSON Comparator

> React + TypeScript 포트폴리오 프로젝트 #1  
> Angular 7년 6개월 경력 개발자의 React 학습 목적 프로젝트

---

## 프로젝트 목적

실무에서 API 응답 스키마 변경, 환경별 설정 파일 차이, 배포 전후 config 비교 등의 상황에서 JSON을 육안으로 비교하는 불편함을 해소하고자 기획했습니다.

단순한 기능 구현에 그치지 않고 React의 핵심 패턴인 **Custom Hook**, **CSS Modules**, **순수 함수 분리**, **컴포넌트 단위 설계**를 의도적으로 적용하여 Angular와의 패러다임 차이를 체득하는 데 초점을 맞췄습니다.

---

## 기획 컨셉

### 배경
- 환경별(dev/staging/prod) JSON config 파일 비교
- API 버전 간 응답 스키마 변경 확인
- 설정 파일 PR 리뷰 시 변경 내역 공유

### 핵심 방향
- 별도 설치 없이 브라우저에서 바로 사용 가능한 클라이언트 사이드 도구
- 중첩 구조(`user.settings.theme` 형태)까지 재귀적으로 탐색하는 깊은 비교
- 직관적인 트리 구조 시각화 — 색상 칩으로 변경 유형 즉시 파악
- 비교 결과를 HTML 리포트로 내보내기

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **파일 업로드** | 두 개의 `.json` 파일 동시 업로드 |
| **JSON 미리보기** | 업로드된 파일 내용을 pretty print로 표시 |
| **깊은 비교** | 중첩 객체 재귀 탐색, `a.b.c` 경로 형태로 모든 프로퍼티 비교 |
| **트리 뷰** | 결과를 접기/펼치기 가능한 트리 구조로 시각화 |
| **색상 칩** | 추가(초록) / 삭제(빨강) / 변경(노랑) / 동일(회색) 구분 |
| **값 표시** | 각 프로퍼티의 origin/target 값을 우측 고정 영역에 표시 |
| **정렬** | 키 이름순 / 변경 유형순 / 원본 순서 |
| **드래그 앤 드롭** | 결과 트리에서 노드를 드래그하여 순서 변경 (라이브러리 없이 순수 구현) |
| **HTML Export** | 비교 결과를 독립 실행형 HTML 파일로 내보내기 |
| **Export 필터** | 내보낸 HTML에서 타입별 summary 카드 클릭으로 행 필터링 |

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | React 18 |
| 언어 | TypeScript 5 |
| 빌드 도구 | Vite 5 |
| 스타일 | CSS Modules |
| 서버사이드 렌더링 | ReactDOMServer (Export용) |
| 패키지 매니저 | npm |

---

## 프로젝트 구조

```
src/
├── App.tsx                      # 루트 페이지 — 상태 관리 및 조립
├── App.module.css
├── main.tsx
├── custom.d.ts
├── styles/
│   └── global.css
├── assets/
│   ├── complex-origin.json      # 테스트용 샘플 데이터 (4 depth)
│   ├── complex-target.json      # 테스트용 샘플 데이터 (4 depth)
│   ├── data-v1.json.txt
│   └── data-v2.json.txt
├── components/
│   ├── index.ts
│   ├── ExportResultPanel.tsx    # HTML Export 전용 컴포넌트 (인라인 스타일)
│   └── MainLayout/
│       ├── MainLayout.tsx
│       ├── MainLayout.module.css
│       ├── FilePanel/
│       │   ├── FilePanel.tsx    # origin / target JSON 미리보기 패널
│       │   └── FilePanel.module.css
│       ├── ResultPanel/
│       │   ├── ResultPanel.tsx  # 비교 결과 트리 뷰 (드래그 앤 드롭 포함)
│       │   ├── ResultPanel.module.css
│       │   └── PropertyChip/
│       │       ├── PropertyChip.tsx  # 변경 유형별 색상 칩 + 값 표시
│       │       └── PropertyChip.module.css
│       └── ToolBar/
│           ├── Toolbar.tsx      # Upload / Compare / Sort / Export 도구모음
│           └── Toolbar.module.css
└── utils/
    ├── ResultNode.ts            # JSON 재귀 비교 → ResultNode 트리 생성
    └── jsonPrettier.ts          # JSON pretty print 유틸
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

## 사용 방법

1. **Upload files** 버튼으로 비교할 JSON 파일 2개 선택
2. **Compare** 버튼 클릭 → 우측 Result 패널에 트리 형태로 결과 표시
3. **Sort** 셀렉트로 정렬 기준 변경 (key / type / original)
4. 결과 트리에서 노드 라벨을 드래그하여 순서 재정렬
5. **Export** 버튼으로 비교 결과를 HTML 파일로 저장
6. 저장된 HTML 파일을 브라우저에서 열어 타입별 필터 카드 활용

---

## Angular → React 주요 패턴 대응

| Angular | React (이 프로젝트) |
|---------|-------------------|
| `Component + Service` | `Component + Custom Hook` |
| `Pipe` | 순수 유틸 함수 (`getResultNodes`, `jsonPrettier`) |
| `ChangeDetectionStrategy.OnPush` | `useMemo`, `useCallback` |
| `ViewEncapsulation.Emulated` | CSS Modules |
| `*ngFor` | `.map()` |
| `[(ngModel)]` | `useState` + `onChange` |
| `@Input()` | `props` |
| `@Output() EventEmitter` | 콜백 함수 props (`onDrop`, `onCompare`) |

---

## Export HTML 기능 상세

내보낸 HTML 파일은 외부 의존성 없이 브라우저에서 독립 실행됩니다.

- **Summary 카드** — 전체 / 추가 / 삭제 / 변경 / 동일 카운트 표시
- **필터 기능** — 카드 클릭 시 해당 타입 행만 표시 (순수 JS)
- **트리 구조 유지** — 중첩 depth 들여쓰기 표현
- **인라인 스타일** — CSS 파일 없이 완전 독립 동작

---
## 디자인 문서
https://www.figma.com/design/hSkUuBc4uswZ236wXkVdqZ/JSON-Comparator?node-id=0-1&p=f&t=FhC2WeaTDSuQPD5U-0

---
## 문서 업데이트 히스토리

| No. | 내용 | 날짜 | 비고 |
|-----|------|------|------|
| 1 | 최초 문서 작성 — 프로젝트 주제 및 초기 컨셉 정의 | 2026-01-01 | 초안 |
| 2 | 프로젝트 구조 확정 — 컴포넌트 분리 구조 반영 | 2026-06-29 | mockup 폴더 구조 확정 |
| 3 | 기능 업데이트 반영 — 트리뷰, 드래그앤드롭, HTML Export 추가 | 2026-06-29 | 최종 기능 완성 |
| 4 | 전체 문서 개정 — 컨셉 변경 및 최종 기능 기준으로 전면 수정 | 2026-06-29 | 최종본 |
| 5 | 디자인 문서 링크 추가 | 2026-06-29 | 최종본 |