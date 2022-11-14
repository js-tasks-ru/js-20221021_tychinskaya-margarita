export default class NotificationMessage {

    constructor(message, {
        duration = 1000,
        type = 'success'
     } = {}) {
        this.duration = duration;
        this.type = type;
        this.message = message;
        this.durationSeconds = (duration / 1000) + "s";

        this.render();
        this.initEventListeners();
    }

    getTemplate() {
        return `
        <div class="notification ${this.type} style="--value:${this.durationSeconds}">
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">Notification</div>
            <div class="notification-body">
            ${this.message}
            </div>
          </div>
        </div>`
      }

      show(parent = document.body) {
        if (NotificationMessage.activeNotification)
        {
          NotificationMessage.activeNotification.remove();
        }

        parent.append(this.element);

        this.timerId = setTimeout (() => {
          this.remove();
        }, this.duration);

        NotificationMessage.activeNotification = this;

      }
    
      render() {
        const element = document.createElement("div"); // (*)
        element.innerHTML = this.getTemplate();

    
        // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
        // который мы создали на строке (*)
        this.element = element.firstElementChild;
      }
    
      initEventListeners() {
        // NOTE: в данном методе добавляем обработчики событий, если они есть
      }
    
      remove() {
        clearTimeout(this.timerId)

        if (this.element){
          this.element.remove();
        }
      }
    
      destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
      }
}
