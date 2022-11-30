import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  loading = false;
  step = 20;
  start = 1;
  end = this.start + this.step;
  
  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false,
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;

    this.render();
  }

  async loadData (id, order, start, end){
    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);
    this.url.searchParams.sort

    return await fetchJson(this.url);
  }

  onSortClick = event =>{
    const column = event.target.closest('[data-sortable="true"]');

    if (column) {
      const {id, order} = column.dataset;
      let newOrder = order;
      if (order === 'asc') {newOrder = 'desc'};
      if (order === 'desc') {newOrder = 'asc'};

      const sortedDate = 
      this.isSortLocally?
      this.sortOnClient(id, newOrder):this.sortOnServer(id, newOrder);
      
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }
    }
  }

  onWindowScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      const data = await this.loadData(id, order, this.start, this.end);

      this.update(data);

      this.loading = false;
    }
  }

  sortOnClient (id, order) {
    const data = this.sortData(id, order);

    this.subElements.body.innerHTML = this.getTableRows(data);

    return data;
  }

  async sortOnServer (id, order) {
    const start = 1;
    const end = start + this.step;
    const data = await this.loadData(id, order, start, end);

    this.subElements.body.innerHTML = this.getTableRows(data);

    return data;
  }

  update(data = []) {
    const element = document.createElement("div");
    
    element.innerHTML = this.getTableRows(data);
    this.subElements.body.append(element);
  }

  getTableHeader() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>
  `
  }

  getHeaderRow({id, title, sortable}) {
    const arrow = (sortable) => {
      if (sortable){
        return `<span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`;
      }
      return '';
    };

    return `
    <div class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order="asc">
      <span>${title}</span>
      ${arrow(sortable)}
    </div>
  `;
  }

  getTableBody(data = []) {
    return `
    <div data-element="body" class="sortable-table__body">
      ${this.getTableRows(data)}
    </div>
    `;
  }

  getTableRows(data = []) {
    return data.map(item => {
      return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getTableRow(item)}
      </a>`;
    }).join('');
  }

  getTableRow(item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      }
    });

    return cells.map(({id, template}) => {
      if (template) {
        return template(item[id]);
      }
        return `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable(data = []) {
    return `
    <div class="sortable-table">
    ${this.getTableHeader()}
    ${this.getTableBody(data)}
    </div>`;
  }

  getSubElements(element) {
    // NOTE: Данный метод позволит кэшировать значения внутренних элементов,
    // чтобы повторно не осуществлять их поиск

    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;

    }

    return result;
   
  }

  sortData(id, order) {
    const sortArr = [...this.data];
    const column = this.headersConfig.find(item => item.id === id);
    const sortType = column.sortType;
    const customSorting = column.customSorting;
    let orderVal = 0;
    if (order === "asc") {orderVal = -1;}
    if (order === "desc") {orderVal = 1;}

    return sortArr.sort((a, b) => {
      switch(sortType) {
        case 'number' :
          return (b[id] - a[id])*orderVal;
        case 'string' :
          return ((String(b[id])).localeCompare(
            (String(a[id])), "ru", "en"))*orderVal;
        case 'custom' :
          return customSorting(a[id], b[id])*orderVal;
        default:
          throw new Error (`Неизвестная сортировка ${sortType}`);
      }
    });
  }

  async render() {
    const element = document.createElement("div");
    const {id, order} = this.sorted;
    let data = this.data;
    
    element.innerHTML = this.getTable();

    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    if (!this.isSortLocally)
    {
      data = await this.loadData(id, order, this.start, this.end);
    }

    this.subElements.body.innerHTML = this.getTableRows(data);

    this.initEventListeners();
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    document.addEventListener('scroll', this.onWindowScroll);
  }

  remove() {
    if (this.element){
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
    this.subElements.header.removeEventListener('pointerdown', this.onSortClick);
    document.removeEventListener('scroll', this.onWindowScroll);
    
  }

}