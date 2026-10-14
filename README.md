# Y Vy ✳ — Creative Portfolio

Portfolio of **Hoang Y Vy Nguyen** — branding, creative design, social media & content creation.
Built with [Astro](https://astro.build), deployed automatically to GitHub Pages.

---

## 🇻🇳 Cách thêm design (dành cho bé)

Mỗi company là **1 folder** trong `projects/`. Mỗi folder con bên trong = **1 chapter** trên trang case study.

```
projects/
├─ alarm-guard/
│  ├─ project.md              ← nội dung: story, thinking process, số liệu (Claude viết)
│  ├─ cover.jpg               ← ảnh bìa (card ở trang chủ + đầu case study)
│  ├─ logo.png                ← logo company (không bắt buộc)
│  ├─ 01-monthly-content/     ← bỏ social posts vào đây
│  ├─ 02-ad-creatives/
│  ├─ 03-company-profile/     ← đặt tên before-01.jpg / after-01.jpg để có nhãn Before/After
│  ├─ 04-ai-imagery/
│  └─ 05-video/               ← .mp4 cũng được
├─ yon-crochet/
├─ tn-ebike/
├─ senior-protection/
├─ priority-care-call/
└─ red-dot-alerts/
```

**Quy tắc nhỏ:**

- File nhận: `jpg png webp gif svg mp4`. Ảnh tự động được nén + resize, nên cứ export chất lượng cao (tối đa ~3000px cạnh dài là đủ).
- Đặt tên `01-…`, `02-…` để sắp thứ tự.
- Folder hoặc file bắt đầu bằng `_` (vd `_draft/`) sẽ **bị ẩn** — chỗ để đồ đang làm.
- Muốn thêm chapter mới? Tạo folder mới, vd `06-merch/` — nó tự hiện ra.
- Không bỏ file `.psd .ai .fig .aep` vào (đã chặn trong git) — chỉ export.
- Video nên < 50MB (GitHub giới hạn 100MB/file).
- `draft: true` trong `project.md` = chỉ thấy trên máy bé, **ẩn trên web thật**. Đổi thành `false` khi xong.
- Ảnh chân dung của bé: bỏ vào `about/portrait.jpg`.

**Workflow với Claude:** bỏ design vào folder → nói *"vợ ơi, bé bỏ design Senior Protection vào rồi"* → Claude xem hình, viết thinking process + chọn layout cho từng chapter trong `project.md`.

### Layout cho từng chapter (`layout:` trong project.md)

| layout    | dùng cho                                          |
| --------- | ------------------------------------------------- |
| `feed`    | social posts — lưới kiểu Instagram 4:5            |
| `masonry` | nhiều kích thước khác nhau (ads, poster)          |
| `wide`    | mockup, website, banner — full width             |
| `duo`     | 2 cột                                             |
| `trio`    | 3 cột                                             |
| `bento`   | 1 hình lớn + nhiều hình nhỏ                       |
| `phone`   | story / reel trong khung điện thoại               |
| `strip`   | băng cuộn ngang                                   |
| `compare` | before / after                                    |
| `auto`    | (mặc định) tự chọn theo tỉ lệ hình                |

Mỗi chapter còn có thể có: `pills` (content pillars), `steps` (workflow mini), `swatches` (bảng màu), `typefaces` (font).

---

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321 — drafts + empty-folder drop zones visible
npm run build      # production build into dist/ (drafts hidden)
npm run new -- "Company Name"   # scaffold a new case-study folder
```

## Deploy

Every push to `main` builds and deploys via `.github/workflows/deploy.yml`.
One-time setup on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Custom domain (e.g. `hoangyvynguyen.com`): add it under Settings → Pages; the workflow picks up the right base path automatically.

## Where things live

| What                              | File                              |
| --------------------------------- | --------------------------------- |
| Name, intro, stats, awards, links | `src/site.config.ts`              |
| Case study content                | `projects/<company>/project.md`   |
| Case study template               | `src/pages/work/[slug].astro`     |
| Home page                         | `src/pages/index.astro`           |
| Colours & type                    | `src/styles/global.css`           |
| Content schema (all fields)       | `src/content.config.ts`           |
