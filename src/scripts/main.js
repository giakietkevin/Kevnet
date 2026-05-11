/* ============================================
   ScrapChaos - Interactive Scripts
   ============================================ */

class ScrapChaos {
  constructor() {
    this.canvas = document.querySelector('main');
    this.items = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupDragAndDrop();
  }

  setupEventListeners() {
    // Top app bar buttons
    const lockBtn = document.querySelector('header button:nth-child(1)');
    const settingsBtn = document.querySelector('header button:nth-child(2)');

    if (lockBtn) {
      lockBtn.addEventListener('click', () => this.toggleLock());
    }

    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.openSettings());
    }

    // FAB button
    const fabBtn = document.querySelector('button.fixed.bottom-8');
    if (fabBtn) {
      fabBtn.addEventListener('click', () => this.addNewScrap());
    }

    // Scrap items click handlers
    document.querySelectorAll('.scrap-item').forEach(item => {
      item.addEventListener('click', (e) => this.selectScrap(e.currentTarget));
    });
  }

  setupDragAndDrop() {
    let draggedElement = null;
    let offsetX = 0;
    let offsetY = 0;

    document.addEventListener('mousedown', (e) => {
      const scrapItem = e.target.closest('.scrap-item');
      if (scrapItem) {
        draggedElement = scrapItem;
        const rect = scrapItem.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (draggedElement) {
        const x = e.clientX - this.canvas.getBoundingClientRect().left - offsetX;
        const y = e.clientY - this.canvas.getBoundingClientRect().top - offsetY;
        draggedElement.style.left = `${x}px`;
        draggedElement.style.top = `${y}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      draggedElement = null;
    });
  }

  toggleLock() {
    console.log('Lock toggled');
    // Implement lock functionality
  }

  openSettings() {
    console.log('Settings opened');
    // Implement settings modal
  }

  addNewScrap() {
    console.log('Adding new scrap');
    // Implement add new scrap functionality
  }

  selectScrap(element) {
    document.querySelectorAll('.scrap-item').forEach(item => {
      item.classList.remove('ring-2', 'ring-primary');
    });
    element.classList.add('ring-2', 'ring-primary');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ScrapChaos();
});
