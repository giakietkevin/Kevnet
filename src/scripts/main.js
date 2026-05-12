/* ============================================
   ScrapChaos - Interactive Scripts
   Phase 1: Foundation (State, Drag/Drop, LocalStorage)
   ============================================ */

/**
 * Quản lý trạng thái của Canvas (State Management)
 */
class CanvasState {
  constructor() {
    this.STORAGE_KEY = 'scrapchaos_canvas_state';
    // State mặc định nếu chưa có trong LocalStorage
    this.state = {
      scraps: []
    };
    this.listeners = [];
    this.loadState();
  }

  // Khôi phục state từ LocalStorage
  loadState() {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        this.state = JSON.parse(savedState);
      } else {
        // Lần đầu chạy, quét DOM để tạo state ban đầu
        this.initFromDOM();
      }
    } catch (e) {
      console.error('Error loading state from LocalStorage:', e);
      this.initFromDOM();
    }
  }

  // Quét các .scrap-item hiện có trên màn hình để khởi tạo state
  initFromDOM() {
    const items = document.querySelectorAll('.scrap-item');
    const newScraps = [];

    items.forEach((item, index) => {
      // Gắn ID nếu chưa có
      if (!item.dataset.id) {
        item.dataset.id = `scrap_${Date.now()}_${index}`;
      }

      // Tính toán vị trí ban đầu (x, y) từ top/left hoặc bounding client rect
      const rect = item.getBoundingClientRect();
      const parentRect = item.parentElement.getBoundingClientRect();

      // Nếu có dùng absolute top/left %, cố gắng dịch ra px
      let x = parseFloat(item.style.left) || (rect.left - parentRect.left);
      let y = parseFloat(item.style.top)  || (rect.top - parentRect.top);

      newScraps.push({
        id: item.dataset.id,
        x: x,
        y: y,
        zIndex: parseInt(getComputedStyle(item).zIndex) || 10 + index
      });

      // Update DOM to use px for consistent drag drop
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.position = 'absolute'; // Đảm bảo absolute
    });

    this.state.scraps = newScraps;
    this.saveState();
  }

  // Lưu state vào LocalStorage
  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to LocalStorage:', e);
    }
  }

  // Cập nhật vị trí của 1 scrap
  updateScrapPosition(id, x, y) {
    const scrap = this.state.scraps.find(s => s.id === id);
    if (scrap) {
      scrap.x = x;
      scrap.y = y;
      this.notifyListeners();
    }
  }

  // Đưa scrap lên trên cùng
  bringToFront(id) {
    // Tìm zIndex lớn nhất hiện tại
    const maxZ = this.state.scraps.reduce((max, s) => Math.max(max, s.zIndex || 0), 0);
    const scrap = this.state.scraps.find(s => s.id === id);

    if (scrap && scrap.zIndex !== maxZ) {
      scrap.zIndex = maxZ + 1;
      this.notifyListeners();
    }
  }

  // Đăng ký listener để UI tự update khi state đổi
  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}


/**
 * Controller chính điều khiển UI và Events
 */
class ScrapChaos {
  constructor() {
    this.canvas = document.querySelector('main');
    this.stateManager = new CanvasState();
    this.selectedScrap = null; // Track scrap đang được chọn

    // Bind methods để không bị mất context 'this'
    this.render = this.render.bind(this);

    this.init();
  }

  init() {
    // Lắng nghe thay đổi từ State
    this.stateManager.subscribe(this.render);

    // Gắn ID cho các DOM elements đã có nếu chưa khớp với state
    this.syncDOMWithState();

    this.setupEventListeners();
    this.setupDragAndDrop();

    // Render lần đầu
    this.render(this.stateManager.state);

    // Auto-save loop (backup mỗi 5s)
    setInterval(() => this.stateManager.saveState(), 5000);
  }

  // Khớp DOM hiện tại với State đã load từ LocalStorage
  syncDOMWithState() {
    const domItems = Array.from(document.querySelectorAll('.scrap-item'));
    const stateItems = this.stateManager.state.scraps;

    domItems.forEach((item, index) => {
      // Nếu là lần load đầu từ DB, gán ID từ DB cho DOM theo thứ tự (tạm thời)
      // Trong tương lai, việc render DOM sẽ hoàn toàn dựa vào State data (JSON -> HTML)
      if (stateItems[index] && !item.dataset.id) {
        item.dataset.id = stateItems[index].id;
      }
    });
  }

  setupEventListeners() {
    // Top app bar buttons
    const lockBtn = document.querySelector('header button:nth-child(1)');
    const settingsBtn = document.querySelector('header button:nth-child(2)');

    if (lockBtn) lockBtn.addEventListener('click', () => this.toggleLock());
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.openSettings());

    // FAB button
    const fabBtn = document.querySelector('#fab-add');
    if (fabBtn) fabBtn.addEventListener('click', () => this.addNewScrap());

    // Cần delegate event cho canvas vì scraps có thể được add dynamically
    this.canvas.addEventListener('mousedown', (e) => {
      const scrapItem = e.target.closest('.scrap-item');
      if (scrapItem) {
        this.selectScrap(scrapItem);
        // Đưa item lên trên cùng khi click
        this.stateManager.bringToFront(scrapItem.dataset.id);
      } else {
        // Click ra ngoài -> bỏ chọn tất cả
        this.clearSelection();
      }
    });

    // Touch support basic cho click
    this.canvas.addEventListener('touchstart', (e) => {
      const scrapItem = e.target.closest('.scrap-item');
      if (scrapItem) {
        this.selectScrap(scrapItem);
        this.stateManager.bringToFront(scrapItem.dataset.id);
      }
    }, { passive: true });

    // Phím Delete / Backspace để xóa scrap đang chọn
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedScrap) {
        // Tránh xóa khi đang edit text trong contenteditable
        if (document.activeElement.contentEditable === 'true') return;
        this.deleteSelectedScrap();
      }

      // Escape để bỏ chọn
      if (e.key === 'Escape') {
        this.clearSelection();
      }
    });
  }

  setupDragAndDrop() {
    let draggedElement = null;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    // Mouse Events
    const onMouseDown = (e) => {
      const scrapItem = e.target.closest('.scrap-item');
      if (scrapItem && !e.target.closest('button')) { // Ko drag nếu bấm vào button bên trong
        draggedElement = scrapItem;
        isDragging = true;

        // Tính khoảng cách từ điểm click đến góc top-left của phần tử
        const rect = scrapItem.getBoundingClientRect();
        // Cần tính đến scroll của canvas (dù đang fixed)
        const canvasRect = this.canvas.getBoundingClientRect();

        // offsetX = điểm click chuột (clientX) - mép trái của element
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Thêm class báo hiệu đang kéo
        draggedElement.style.transition = 'none'; // Tắt transition để kéo mượt
        draggedElement.classList.add('cursor-grabbing');

        e.preventDefault(); // Ngăn browser drag ảnh mặc định
      }
    };

    const onMouseMove = (e) => {
      if (!isDragging || !draggedElement) return;

      const canvasRect = this.canvas.getBoundingClientRect();

      // Tính x, y mới tương đối so với canvas
      let newX = e.clientX - canvasRect.left - offsetX + this.canvas.scrollLeft;
      let newY = e.clientY - canvasRect.top - offsetY + this.canvas.scrollTop;

      // Cập nhật DOM tạm thời để mượt (chưa save state vội để tránh lag)
      draggedElement.style.left = `${newX}px`;
      draggedElement.style.top = `${newY}px`;
    };

    const onMouseUp = () => {
      if (draggedElement && isDragging) {
        draggedElement.style.transition = ''; // Bật lại transition
        draggedElement.classList.remove('cursor-grabbing');

        // Lấy vị trí cuối cùng
        const finalX = parseFloat(draggedElement.style.left);
        const finalY = parseFloat(draggedElement.style.top);

        // Lưu vào State
        const id = draggedElement.dataset.id;
        if (id) {
          this.stateManager.updateScrapPosition(id, finalX, finalY);
          this.stateManager.saveState(); // Save ngay lập tức khi thả chuột
        }

        draggedElement = null;
        isDragging = false;
      }
    };

    // Touch Events (Mobile)
    const onTouchStart = (e) => {
      const touch = e.touches[0];
      // Reuse mousedown logic but inject touch coords
      const pseudoEvent = {
        target: e.target,
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => {}
      };
      onMouseDown(pseudoEvent);
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      // Ngăn cuộn trang khi đang kéo
      e.preventDefault();
      const touch = e.touches[0];
      onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };

    // Attach Listeners
    this.canvas.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    this.canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onMouseUp);
  }

  // Render cập nhật UI dựa trên State
  render(state) {
    state.scraps.forEach(scrapData => {
      // Tìm DOM element tương ứng
      const el = document.querySelector(`.scrap-item[data-id="${scrapData.id}"]`);
      if (el) {
        // Cập nhật vị trí
        el.style.left = `${scrapData.x}px`;
        el.style.top = `${scrapData.y}px`;
        // Chuyển position về absolute (ghi đè Tailwind top-[x%] left-[x%])
        el.style.position = 'absolute';
        // Cập nhật z-index
        el.style.zIndex = scrapData.zIndex;
      }
    });
  }

  toggleLock() {
    console.log('Lock toggled');
  }

  openSettings() {
    console.log('Settings opened');
  }

  addNewScrap() {
    // Hiển thị modal chọn loại scrap
    this.showScrapTypeModal();
  }

  showScrapTypeModal() {
    // Tạo modal động
    const modal = document.createElement('div');
    modal.id = 'scrap-type-modal';
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[999] backdrop-blur-sm';
    modal.innerHTML = `
      <div class="bg-surface border-4 border-inverse-surface shadow-brutal-xl p-8 rounded-xl max-w-md w-full mx-4">
        <h2 class="font-headline-lg text-headline-lg mb-6 text-on-surface">Chọn loại Scrap</h2>

        <div class="grid grid-cols-2 gap-4">
          <button class="scrap-type-btn bg-secondary-fixed text-on-secondary-fixed-variant border-2 border-inverse-surface shadow-brutal p-4 rounded-lg hover:scale-105 transition-transform" data-type="note">
            <span class="material-symbols-outlined text-2xl block mb-2">note_stack</span>
            <span class="font-technical-sm">Sticky Note</span>
          </button>

          <button class="scrap-type-btn bg-primary-fixed text-on-primary-fixed border-2 border-inverse-surface shadow-brutal p-4 rounded-lg hover:scale-105 transition-transform" data-type="image">
            <span class="material-symbols-outlined text-2xl block mb-2">image</span>
            <span class="font-technical-sm">Image</span>
          </button>

          <button class="scrap-type-btn bg-primary-container text-on-primary-container border-2 border-inverse-surface shadow-brutal p-4 rounded-lg hover:scale-105 transition-transform" data-type="badge">
            <span class="material-symbols-outlined text-2xl block mb-2">stars</span>
            <span class="font-technical-sm">Badge</span>
          </button>

          <button class="scrap-type-btn bg-[#00ffcc] text-inverse-surface border-2 border-inverse-surface shadow-brutal p-4 rounded-lg hover:scale-105 transition-transform" data-type="sticker">
            <span class="material-symbols-outlined text-2xl block mb-2">emoji_emotions</span>
            <span class="font-technical-sm">Sticker</span>
          </button>
        </div>

        <button id="close-modal" class="mt-6 w-full bg-surface-container border-2 border-inverse-surface shadow-brutal p-3 rounded-lg hover:bg-surface-container-high transition-colors">
          Hủy
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelectorAll('.scrap-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.createScrap(type);
        modal.remove();
      });
    });

    modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());

    // Close khi click ngoài modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  createScrap(type) {
    // Tạo ID duy nhất
    const id = `scrap_${Date.now()}`;

    // Vị trí ngẫu nhiên trên canvas
    const x = Math.random() * 200 + 100;
    const y = Math.random() * 200 + 100;
    const zIndex = Math.max(...this.stateManager.state.scraps.map(s => s.zIndex || 0)) + 1;

    // Thêm vào state
    this.stateManager.state.scraps.push({
      id,
      x,
      y,
      zIndex,
      type,
      content: type === 'note' ? 'New Note' : ''
    });

    // Tạo DOM element
    let element;
    switch (type) {
      case 'note':
        element = this.createNoteElement(id);
        break;
      case 'image':
        element = this.createImageElement(id);
        break;
      case 'badge':
        element = this.createBadgeElement(id);
        break;
      case 'sticker':
        element = this.createStickerElement(id);
        break;
    }

    if (element) {
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.position = 'absolute';
      element.style.zIndex = zIndex;
      element.dataset.id = id;
      element.classList.add('scrap-item');

      this.canvas.appendChild(element);

      // Lưu state
      this.stateManager.saveState();
      this.stateManager.notifyListeners();
    }
  }

  createNoteElement(id) {
    const div = document.createElement('div');
    div.className = 'w-48 h-48 bg-secondary-fixed p-6 border-4 border-inverse-surface shadow-brutal-xl -rotate-6 hover:-rotate-2 hover:scale-105 cursor-grab';
    div.innerHTML = `
      <p class="font-headline-lg-mobile text-headline-lg-mobile text-on-secondary-fixed-variant leading-tight" contenteditable="true">
        New Note
      </p>
    `;
    return div;
  }

  createImageElement(id) {
    const div = document.createElement('div');
    div.className = 'w-64 bg-surface p-4 border-4 border-inverse-surface shadow-brutal-xl rotate-3 hover:rotate-1 hover:scale-105 cursor-grab';
    div.innerHTML = `
      <div class="w-full h-56 bg-surface-container-high border-2 border-inverse-surface mb-4 overflow-hidden flex items-center justify-center">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
      </div>
      <p class="font-technical-sm text-technical-sm text-center text-on-surface-variant uppercase tracking-widest">new_image</p>
    `;
    return div;
  }

  createBadgeElement(id) {
    const div = document.createElement('div');
    div.className = 'w-32 h-32 bg-primary-container rounded-full border-4 border-inverse-surface shadow-brutal-xl flex items-center justify-center rotate-12 hover:rotate-[24deg] hover:scale-110 cursor-grab';
    div.innerHTML = `
      <span class="material-symbols-outlined text-on-primary-container text-[48px]">stars</span>
    `;
    return div;
  }

  createStickerElement(id) {
    const button = document.createElement('button');
    button.className = 'sticker-vinyl bg-[#00ffcc] text-inverse-surface font-headline-lg text-headline-lg px-6 py-3 rounded-xl border-4 border-inverse-surface shadow-brutal rotate-[8deg] hover:rotate-[12deg] hover:scale-110 cursor-grab';
    button.textContent = 'NEW';
    return button;
  }

  selectScrap(element) {
    this.clearSelection();
    element.classList.add('selected');
    this.selectedScrap = element;
  }

  clearSelection() {
    document.querySelectorAll('.scrap-item').forEach(item => {
      item.classList.remove('selected');
    });
    this.selectedScrap = null;
  }

  deleteSelectedScrap() {
    if (!this.selectedScrap) return;

    const id = this.selectedScrap.dataset.id;

    // Xóa từ state
    this.stateManager.state.scraps = this.stateManager.state.scraps.filter(s => s.id !== id);

    // Xóa từ DOM
    this.selectedScrap.remove();

    // Lưu state
    this.stateManager.saveState();
    this.stateManager.notifyListeners();

    this.selectedScrap = null;
  }
}

// Khởi chạy App
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ScrapChaos();
});
