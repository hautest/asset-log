# CLAUDE.md

## 🔒 프로젝트 개요 (수정 금지 - 본인만 수정)

### 서비스 정보

- **이름**: 자산로그 (AssetLog)
- **한 줄 설명**: 마이데이터가 못 잡는 숨은 자산까지 포함한 전체 자산을 차트로 시각화
- **타겟**: 자신의 모든 자산을 한 눈에 보고 싶은 사람들

### 핵심 문제

- 다른 서비스들은 연동된 계좌만 보여줌
- 전세 보증금, 빌려준 돈, 부동산, 해외 자산 등은 포함 안 됨
- 사용자가 머릿속으로 계산해야 함
- 작년 대비 자산 증감을 한눈에 볼 수 없음

### 핵심 기능 (MVP)

README.md에 기획이 있으니 참고해서 작업을 해야함.

1. **회원가입/로그인**
2. **자산 등록** (월 1회 수동 입력, 이전 입력 정보를 수정, 삭제도 가능)
   - 카테고리별 자산 등록
   - 금액, 메모 입력
3. **차트 시각화**
   - 차트로 자산 움직임 확인
4. **자산 상세 내역 조회**
   - 차트에서 특정 월 클릭 → 상세 내역

### 자산 카테고리

기본 카테고리로 주식, 현금, 금, 채권, 보증금, 부동산, 코인, 적금, 연금, 빌려준 돈이 있고 사용자가 커스텀으로 카테고리를 추가할 수 있음.

### 사용자 플로우

```
가입 → 첫 자산 입력 → 대시보드 차트 확인 → 매월 말 자산 업데이트 → 차트에 봉 추가
```

### 향후 기능 (v2+)

- [ ] 년봉 차트
- [ ] 목표 자산 설정
- [ ] 자산 분석 리포트 (월별 증감률, 카테고리별 비중)
- [ ] 리마인더 알림 (월말 입력 알림)
- [ ] 커뮤니티 (익명 또래 비교, 꿀팁 공유)
- [ ] 데이터 내보내기 (CSV, PDF)

### 수익 모델 (참고용)

- MVP: 무료
- 향후: 프리미엄 구독 (상세 분석, 무제한 자산 등록)

---

## 🔧 기술 스택

### 프레임워크 & 라이브러리

- **프레임워크**: Waku (React Server Components)
- **인증**: Better Auth
- **ORM**: Drizzle ORM
- **DB**: PostgreSQL
- **차트**: TradingView Lightweight Charts
- **스타일**: Tailwind CSS
- **UI 컴포넌트**: Shadcn/ui
- **페키지 매니저**: pnpm

### 배포 환경

- **서버**: 홈서버 (N100, 16GB RAM, 512GB SSD)
- **배포 도구**: Dokploy
- **도메인**: 미정

---

## 🔧 디렉토리 구조

기본적인 FSD 구조를 커스텀해서 사용.

```
- src
    - shared: 도메인과 상관 없고 재사용이 가능한 추상화된 코드
        - components
        - hooks
        - utils
        - ui
    - features: 도메인이 포함되어 있고 재사용이 가능한 추상화된 모듈
        - user
            - queries
            - components
    - pages: waku의 파일기반 라우트 구조
        - api: api routes
        - ... 여기는 일반 페이지들
    - entities: 서버와 클라이언트에서 사용한 도메인 타입
```

---

## 🔧 코딩 컨벤션

### 네이밍

- **컴포넌트**: PascalCase (`AssetForm.tsx`)
- **함수/변수**: camelCase (`getAssetList`)
- **상수**: UPPER_SNAKE_CASE (`MAX_ASSET_COUNT`)
- **타입/인터페이스**: PascalCase (`AssetFormProps`, `User`)
- **파일명**: 컴포넌트는 PascalCase, 나머지는 camelCase

### 컴포넌트 구조

```tsx
// 1. imports
import { useState } from 'react'

// 2. types
interface AssetFormProps {
  onSubmit: (data: AssetData) => void
}

// 3. component
export function AssetForm({ onSubmit }: AssetFormProps) {
  // hooks
  const [loading, setLoading] = useState(false)

  // handlers
  const handleSubmit = () => { ... }

  // render
  return ( ... )
}
```

### 타입 규칙

- `any` 사용 금지
- Props는 `interface`로 정의
- 추론이 가능한 타입은 불필요하게 선언 금지

### 스타일 규칙

- Tailwind CSS만 사용
- 인라인 스타일 금지(단, 정적 분석이 불가능한 스타일은 인라인 스타일 허용)

---

## ❌ 금지 사항

- `console.log` 남겨두기 (디버깅 후 삭제)
- 의미 없는 주석 사용 금지(주석이 있어야만 이해할 수 있는 복잡한 부분에만 주석 사용 허용)
- 하드코딩된 문자열 (상수로 분리)
- 중복 코드는 2번까지는 허용하고 그 이상은 개발자에게 허락을 받고 분리를 함.

---

## ✅ 필수 사항

- 에러 처리 필수
- 새 기능 추가 시 기존 패턴 따르기
- 커밋 전 lint/type 체크

---

## 🔧 자주 쓰는 패턴

### 폼 처리 (react-hook-form + zod)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "이름을 입력하세요"),
  amount: z.number().min(0, "금액은 0 이상이어야 합니다"),
});

type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### 기본적인 데이터 fetching, mutation 방법

- queries, mutations 폴더에서 훅 생성
- 파일 이름과 함수 이름 끝에 Query, SuspenseQuery, Mutation을 붙어야 함.

```ts
const useUserQuery = (options?: 이 옵션은 tanstack query의 옵션을 사용하며, 재네릭 타입을 넣어줌)=>{
    return useQuery(
        {
            queryKey: queryKey,
            queryFn:getUser()
     ,...options})
}

// 꼭 queryFn을 별도의 함수로 분리하고 export해야함 (서버 컴포넌트에서 사용할 수 있게)
export const getUser = ()=>{
    const result = fetch(...)
}

// queryKey도 별도로 분리를 해야하며, queryFn과 useQuery에 queryKey를 object의 key로 할당해야함.
const queryKey = ['user']
getUser.queryKey = queryKey
useUserQuery.queryKey= queryKey

```

---

## 📋 현재 진행 상황

- [ ] 프로젝트 초기 세팅 (Waku + Tailwind + Shadcn)
- [ ] DB 스키마 설계 (Drizzle)
- [ ] 인증 구현 (Better Auth)
- [ ] 자산 CRUD
- [ ] 대시보드 UI
- [ ] 월봉 차트 (TradingView Lightweight Charts)

---

## 📚 참고 문서

- Waku: https://waku.gg/docs
- Better Auth: https://www.better-auth.com/docs
- Drizzle ORM: https://orm.drizzle.team/docs
- TradingView Lightweight Charts: https://tradingview.github.io/lightweight-charts/docs
- Shadcn/ui: https://ui.shadcn.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
