# Hướng Dẫn Cấu Hình và Deploy Cloudflare cho Dự Án Next.js (OpenNext)

Tài liệu này tổng hợp cách cấu hình và quy trình build/deploy dự án `dev-knowledge-hub` lên Cloudflare Workers sử dụng `@opennextjs/cloudflare`.

## 1. Tổng Quan

Dự án sử dụng **OpenNext** để chạy Next.js App Router trên hạ tầng **Cloudflare Workers** (thay vì Cloudflare Pages).
Quy trình deploy được thực hiện thông qua `wrangler CLI` được bọc bởi các scripts trong `package.json`.

## 2. Các File Cấu Hình Chính

### `wrangler.jsonc`
Đây là file cấu hình chính cho Cloudflare Worker.
- **Compatibility Date**: `2024-09-23`
- **Compatibility Flags**: `nodejs_compat`, `global_fetch_strictly_public`
- **Main**: `.open-next/worker.js`
- **Assets**: `.open-next/assets`

**Các Môi Trường (Environments):**
1.  **Production** (Mặc định)
    *   Worker Name: `dev-knowledge-hub`
2.  **Staging** (`--env staging`)
    *   Worker Name: `dev-knowledge-hub-staging`
    *   (Xem `wrangler.jsonc` để biết thêm chi tiết)

### `open-next.config.ts`
Cấu hình cho OpenNext với các override bắt buộc cho Cloudflare:
- Wrapper: `cloudflare-node` / `cloudflare-edge`
- Converter: `edge`
- Proxy External Request: `fetch`

## 3. Biến Môi Trường (Environment Variables)

Các biến sau cần được thiết lập trong `wrangler.jsonc` hoặc secrets trên Cloudflare Dashboard:

| Biến | Mô Tả |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL của Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key ẩn danh của Supabase |

Ví dụ cấu hình trong `wrangler.jsonc`:
```jsonc
"vars": {
  "NEXT_PUBLIC_SUPABASE_URL": "...",
  // ...
}
```

## 4. Các Lệnh Build & Deploy (Scripts)

Các script đã được định nghĩa sẵn trong `package.json`:

### Deploy Production
Build và deploy lên môi trường Production.
```bash
yarn deploy
# Chạy: opennextjs-cloudflare build && wrangler deploy
# Lưu ý: Trong môi trường CI/CD hoặc local, lệnh 'yarn deploy' sẽ thực thi build và deploy.
# Trên Cloudflare Dashboard "Create Worker", cấu hình:
# Build command: yarn run deploy
# Deploy command: npx wrangler deploy
```

### Deploy Preview (Staging)
Build và deploy lên môi trường Staging để kiểm thử.
```bash
yarn preview
# Chạy: opennextjs-cloudflare build && opennextjs-cloudflare preview
```

### Sinh Types cho Cloudflare Env
Nếu bạn thay đổi variables trong `wrangler.jsonc`, chạy lệnh này để cập nhật TypeScript types (`cloudflare-env.d.ts`).
```bash
yarn cf-typegen
# Chạy: opennextjs-cloudflare-typegen
```

## 5. Lưu ý Quan Trọng

- Dự án đã chuyển từ `next-on-pages` sang `OpenNext` để hỗ trợ tốt hơn cho Cloudflare Workers.
- File `open-next.config.ts` chứa các cấu hình quan trọng để đảm bảo tương thích, không nên thay đổi nếu không hiểu rõ.
