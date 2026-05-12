# ScrapChaos - Kế hoạch phát triển theo giai đoạn

## 🎯 Tổng quan chiến lược
Phát triển theo mô hình **MVP → Core Features → Advanced Features → Scale**

---

## 📅 PHASE 1: Foundation & Core Interactions (Tuần 1-2)
**Mục tiêu:** Xây dựng nền tảng tương tác cơ bản, người dùng có thể thêm/xóa/di chuyển scrap

### 1.1 Data Structure & State Management
- [ ] Thiết kế data model cho Canvas State
  ```javascript
  {
    scraps: [
      { id, type, position: {x, y}, rotation, zIndex, content, ... }
    ]
  }
  ```
- [ ] Tạo `CanvasState` class để quản lý state
- [ ] Implement event system (Observer pattern)

### 1.2 Drag & Drop hoàn chỉnh
- [ ] Cải thiện drag & drop hiện tại
- [ ] Lưu vị trí mới vào state khi thả chuột
- [ ] Giới hạn boundary (không kéo ra ngoài canvas)
- [ ] Touch support cho mobile

### 1.3 LocalStorage Persistence
- [ ] Save canvas state vào LocalStorage
- [ ] Load state khi refresh trang
- [ ] Auto-save mỗi 5 giây hoặc khi có thay đổi

### 1.4 Thêm Scrap mới (FAB)
- [ ] Modal chọn loại scrap (Image / Note / Badge / Sticker)
- [ ] Thêm Sticky Note với text mặc định
- [ ] Thêm Badge với icon picker
- [ ] Render scrap mới lên canvas

### 1.5 Xóa Scrap
- [ ] Click chọn scrap (highlight border)
- [ ] Nút Delete hoặc phím Delete để xóa
- [ ] Confirm dialog trước khi xóa

**Deliverable:** Người dùng có thể thêm note/badge, kéo thả, xóa, và giữ lại khi reload trang.

---

## 📅 PHASE 2: Content Editing (Tuần 3)
**Mục tiêu:** Cho phép chỉnh sửa nội dung các scrap

### 2.1 Edit Sticky Note
- [ ] Double-click để vào chế độ edit
- [ ] Inline contenteditable hoặc textarea overlay
- [ ] Save khi blur hoặc nhấn Enter
- [ ] Thay đổi màu note (color picker)

### 2.2 Upload & Display Images
- [ ] Input file upload (accept image/*)
- [ ] Preview ảnh trước khi thêm
- [ ] Resize ảnh về kích thước phù hợp
- [ ] Lưu ảnh dưới dạng base64 vào LocalStorage (tạm thời)
- [ ] Hiển thị ảnh trong khung Polaroid

### 2.3 Badge Customization
- [ ] Icon picker (Material Symbols)
- [ ] Color picker cho background
- [ ] Text label cho badge

### 2.4 Washi Tape Tool
- [ ] Toolbar để chọn washi tape
- [ ] Click vào scrap để gắn tape
- [ ] Chọn màu và kiểu (6 shapes đã có)
- [ ] Xóa tape

**Deliverable:** Người dùng có thể sửa text, upload ảnh thật, tùy chỉnh badge và tape.

---

## 📅 PHASE 3: Advanced Canvas Controls (Tuần 4)
**Mục tiêo:** Nâng cao trải nghiệm canvas

### 3.1 Zoom & Pan
- [ ] Zoom in/out bằng Ctrl + Scroll
- [ ] Pan canvas bằng Space + Drag
- [ ] Zoom controls UI (+ / - buttons)
- [ ] Fit to screen button

### 3.2 Transform Controls
- [ ] Resize scrap (drag corners)
- [ ] Rotate handle (drag to rotate)
- [ ] Maintain aspect ratio (Shift key)

### 3.3 Z-Index Management
- [ ] Bring to front / Send to back
- [ ] Context menu (right-click)
- [ ] Keyboard shortcuts (Ctrl+] / Ctrl+[)

### 3.4 Selection & Multi-select
- [ ] Click để chọn 1 scrap
- [ ] Ctrl+Click để chọn nhiều
- [ ] Drag box để chọn vùng
- [ ] Group move cho multi-select

**Deliverable:** Canvas có đầy đủ công cụ điều khiển như một design tool cơ bản.

---

## 📅 PHASE 4: Drawing & Creative Tools (Tuần 5)
**Mục tiêu:** Thêm công cụ vẽ tay và sticker

### 4.1 Freehand Drawing
- [ ] Canvas drawing layer (HTML5 Canvas overlay)
- [ ] Brush tool với size/color picker
- [ ] Eraser tool
- [ ] Clear all drawings

### 4.2 Sticker Library
- [ ] Tạo thư viện sticker có sẵn (emoji, shapes, doodles)
- [ ] Drag & drop sticker vào canvas
- [ ] Tìm kiếm sticker

### 4.3 Text Tool
- [ ] Thêm text box tự do (không phải sticky note)
- [ ] Font picker
- [ ] Text color, size, alignment

**Deliverable:** Người dùng có thể vẽ tay, thêm sticker và text tự do.

---

## 📅 PHASE 5: UX Polish & Settings (Tuần 6)
**Mục tiêu:** Hoàn thiện trải nghiệm người dùng

### 5.1 Undo/Redo
- [ ] History stack cho mọi thao tác
- [ ] Ctrl+Z / Ctrl+Y
- [ ] Giới hạn history (50 bước gần nhất)

### 5.2 Settings Panel
- [ ] Toggle grid background
- [ ] Change grid size/color
- [ ] Canvas background color
- [ ] Export settings

### 5.3 Lock/Unlock Canvas
- [ ] Lock button để khóa mọi scrap
- [ ] Prevent drag khi locked
- [ ] Visual indicator (lock icon overlay)

### 5.4 Dark Mode
- [ ] Toggle dark/light theme
- [ ] Update Tailwind colors
- [ ] Save preference

### 5.5 Keyboard Shortcuts
- [ ] Shortcuts panel (? key)
- [ ] Delete, Undo, Redo, Select All, etc.

**Deliverable:** Ứng dụng mượt mà, có đầy đủ shortcuts và settings.

---

## 📅 PHASE 6: Export & Share (Tuần 7)
**Mục tiêu:** Cho phép xuất và chia sẻ canvas

### 6.1 Export Canvas
- [ ] Export as PNG (html2canvas hoặc canvas.toDataURL)
- [ ] Export as PDF
- [ ] Export as JSON (backup data)
- [ ] Download button

### 6.2 Import Canvas
- [ ] Import từ JSON file
- [ ] Merge hoặc replace canvas hiện tại

### 6.3 Share Link (Optional - cần backend)
- [ ] Generate shareable link
- [ ] View-only mode

**Deliverable:** Người dùng có thể lưu và chia sẻ tác phẩm.

---

## 📅 PHASE 7: Backend Integration (Tuần 8-10)
**Mục tiêu:** Chuyển từ LocalStorage sang backend thật

### 7.1 Backend Setup
- [ ] Chọn stack: Node.js + Express + MongoDB / Firebase
- [ ] Setup project structure
- [ ] Database schema design

### 7.2 API Development
- [ ] POST /api/canvas - Create new canvas
- [ ] GET /api/canvas/:id - Load canvas
- [ ] PUT /api/canvas/:id - Update canvas
- [ ] DELETE /api/canvas/:id - Delete canvas

### 7.3 Image Storage
- [ ] Setup Cloudinary / AWS S3 / Firebase Storage
- [ ] Upload API endpoint
- [ ] Replace base64 với image URLs

### 7.4 User Authentication
- [ ] Firebase Auth / Auth0 / JWT
- [ ] Login/Signup UI
- [ ] Protected routes
- [ ] User canvas list

**Deliverable:** Ứng dụng có backend, lưu trữ đám mây, đa người dùng.

---

## 📅 PHASE 8: Collaboration (Tuần 11-12) - Optional
**Mục tiêu:** Real-time collaboration

### 8.1 WebSocket Setup
- [ ] Socket.io server
- [ ] Room-based collaboration

### 8.2 Real-time Sync
- [ ] Broadcast scrap movements
- [ ] Show other users' cursors
- [ ] Conflict resolution

### 8.3 Permissions
- [ ] Owner / Editor / Viewer roles
- [ ] Invite system

**Deliverable:** Nhiều người có thể cùng chỉnh sửa 1 canvas real-time.

---

## 📊 Tổng kết Timeline

| Phase | Thời gian | Độ khó | Phụ thuộc |
|-------|-----------|--------|-----------|
| Phase 1 | 2 tuần | ⭐⭐ | - |
| Phase 2 | 1 tuần | ⭐⭐ | Phase 1 |
| Phase 3 | 1 tuần | ⭐⭐⭐ | Phase 1 |
| Phase 4 | 1 tuần | ⭐⭐⭐ | Phase 1 |
| Phase 5 | 1 tuần | ⭐⭐ | Phase 1-4 |
| Phase 6 | 1 tuần | ⭐⭐ | Phase 1-5 |
| Phase 7 | 3 tuần | ⭐⭐⭐⭐ | Phase 1-6 |
| Phase 8 | 2 tuần | ⭐⭐⭐⭐⭐ | Phase 7 |

**Tổng thời gian:** 12 tuần (3 tháng) cho full-featured app

---

## 🚀 Khuyến nghị bắt đầu

**Bắt đầu ngay:** Phase 1.1 → 1.2 → 1.3 (Foundation)

Sau khi hoàn thành Phase 1, bạn đã có một MVP hoạt động được, có thể demo và thu thập feedback.
