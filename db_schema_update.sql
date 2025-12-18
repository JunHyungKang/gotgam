-- Supabase 대시보드의 "SQL Editor" 메뉴로 이동하여 아래 스크립트를 붙여넣고 "Run" 버튼을 클릭하세요.

-- orders 테이블에 group_id 컬럼 추가 (UUID 타입)
ALTER TABLE orders ADD COLUMN group_id UUID;

-- (참고) 실행 후 "Success" 메시지가 뜨면 완료된 것입니다.
-- 이후 관리자 페이지나 주문 폼에서 정상적으로 동작하는지 확인하시면 됩니다.
