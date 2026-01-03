# 영동곶감 주문 사이트 (Yeongdong Gotgam Order Site)

영동 명품 곶감 주문 및 관리를 위한 웹 애플리케이션입니다.

## 주요 기능 (Key Features)

### 1. 주문하기 (User)
- **복수 상품 주문**: '30구(대과)', '35구(실속형)' 등 여러 상품을 수량별로 한 번에 주문할 수 있습니다.
- **주소 검색**: 카카오(Daum) 우편번호 서비스를 연동하여 정확한 주소를 간편하게 입력할 수 있습니다.
- **자동 계산**: 선택한 상품 수량에 따라 총 결제 금액을 실시간으로 확인하고, 주문 완료 시 입금해야 할 총액을 안내받습니다.
- **편의 기능**:
  - '보내는 분과 동일' 체크박스로 정보 자동 입력
  - 연락처 자동 포맷팅 (010-xxxx-xxxx)

### 2. 주문 조회 (User)
- **비회원 조회**: 주문자명과 연락처로 본인의 주문 내역(입금 대기/완료 상태 등)을 간편하게 조회할 수 있습니다.
- **입금 계좌 안내**: 입금해야 할 계좌 정보와 금액 합계를 팝업으로 안내합니다.

### 3. 관리자 대시보드 (Admin)
- **주문 관리**: 전체 주문 현황을 테이블 형태로 확인하고, 상태(접수/입금확인/발송완료)를 변경할 수 있습니다.
- **휴지통 (Recycle Bin)**:
  - 주문 취소/삭제 시 '휴지통'으로 이동하여 실수로 인한 데이터 유실을 방지합니다.
  - 휴지통에서 다시 '복구'하거나 '영구 삭제'할 수 있습니다.
- **직관적인 UI**: 긴 주소도 잘림 없이 전체 내용을 확인할 수 있도록 개선되었습니다.

## 기술 스택 (Tech Stack)
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS
- **Utils**: react-daum-postcode

## 시작하기 (Getting Started)

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:3000` 접속

## Supabase 자동화 관리 (Supabase Automation)

프로젝트가 장기간 활동이 없어 Paused 상태가 되는 것을 방지하기 위해, GitHub Actions를 통한 자동화 스크립트가 설정되어 있습니다.

- **스크립트 위치**: `scripts/keep_alive.js`
- **워크플로우**: `.github/workflows/cron_keep_alive.yml` (매주 월요일 00:00 UTC 실행)

### 설정 방법 (GitHub Secrets)
이 기능이 정상 작동하려면 GitHub Repository의 Secrets 설정이 필요합니다.

1. GitHub 저장소 > **Settings** > **Secrets and variables** > **Actions**
2. **New repository secret** 클릭
3. 아래 두 가지 환경 변수 등록:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key
