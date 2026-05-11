# ScrapChaos - Infinite Canvas

Một ứng dụng web sáng tạo với giao diện neo-brutalist, cho phép người dùng tạo một "scrapbook" vô hạn với các phần tử có thể kéo, xoay, và tương tác.

## 🎨 Tính năng

- **Infinite Canvas**: Vẽ và sắp xếp các phần tử tự do trên một canvas vô hạn
- **Neo-brutalist Design**: Giao diện thô mộc, táo bạo với bóng đen đặc trưng
- **Responsive**: Hỗ trợ cả desktop (sidebar) và mobile (bottom nav)
- **Interactive Elements**: 
  - Polaroid-style images
  - Sticky notes
  - Badges & stickers
  - Washi tape decorations
  - Vinyl sticker buttons

## 📁 Cấu trúc dự án

```
Kevnet/
├── index.html              # Main HTML file
├── package.json            # NPM dependencies
├── tailwind.config.js      # Tailwind CSS config
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── src/
│   ├── styles/
│   │   └── main.css        # Custom CSS & utilities
│   ├── scripts/
│   │   └── main.js         # Main JavaScript
│   └── assets/             # Images, icons, etc.
└── dist/                   # Build output (generated)
```

## 🚀 Bắt đầu

### Cài đặt
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```
Mở http://localhost:3000 trong trình duyệt.

### Build production
```bash
npm run build
```

## 🛠️ Công nghệ

- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: No frameworks, pure JS
- **Google Fonts**: Syne, JetBrains Mono, Bricolage Grotesque
- **Material Symbols**: Google's icon library

## 📱 Responsive Design

- **Desktop (md+)**: Sidebar toolbox + infinite canvas
- **Mobile**: Bottom navigation + full-screen canvas

## 🎯 Tính năng sắp tới

- [ ] Drag & drop functionality (Partially implemented)
- [ ] Save/export canvas
- [ ] Color picker
- [ ] Text editor
- [ ] Undo/redo
- [ ] Collaboration features
- [ ] Dark mode toggle

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Tác giả**: Vo Pham Gia Kiet  
**Năm**: 2026
