class Tooltip {
  static instance;

  element;

  onPointerOver = event =>{
    const element = event.target.closest(['[data-tooltip]']);

    if (element) {
      this.render(element.dataset.tooltip);
      document.addEventListener('pointermove', this.onPointerMove);
    }
  };

  onPointerMove = evet => {
    this.moveTooltip(evet);
  }

  onPointerOut = () => {
    this.remove();
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }
  
  initialize () {
    this.initEventListeners();
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);

  }

  moveTooltip(event) {
    // NOTE: задаем позицию отображения подсказки
     const shift = 10;
     const left = event.clientX + shift;
     const top = event.clientY + shift;

     this.element.style.left = left + 'px';
     this.element.style.top = top + 'px';
  }

  render(tooltipHtml) {
     // NOTE: создадим элемент для подсказки

     this.element = document.createElement('div');
     this.element.className = 'tooltip';
     this.element.innerHTML = tooltipHtml;

     document.body.append(this.element);
  }

  remove() {
    if (this.element){
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);

  }

}

export default Tooltip;
