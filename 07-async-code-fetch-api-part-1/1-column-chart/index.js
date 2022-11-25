import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element;
    subElements;
    chartHeight = 50;

    constructor({
        url = '',
        label = '',
        link = '',
        value = 0,
        range =  {
            from : new Date(),
            to: new Date()
          },
        formatHeading = data => data
     } = {}) {
        this.url = new URL(url, BACKEND_URL);

        this.range = range; 
        this.label = label;
        this.link = link;
        this.value = formatHeading(value);
        
        this.render();
        this.update(this.range.from, this.range.to);
        this.initEventListeners();
    }

    getTemplate() {
        let link = '';

        if(!(this.link === '')) {
            link = `<a class="column-chart__link" href=${this.link}>View all</a>`;
        }

        return `
          <div class="column-chart" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
                ${this.label}
                ${link}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header"></div>
                <div data-element="body" class="column-chart__chart"></div>
            </div>
          </div>        `
        ;
      }

      getColumnProps(data) {
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;

        return data.map(item => {
          return {
            percent: (item / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(item * scale)),
          };
        });
      }

      getChartValue(data) {
        let chart = '';
        const colProp = this.getColumnProps(Object.values(data));
        if (!(data.length === 0)) {
            for(let item of colProp){
                chart+=`<div style="--value: ${item.value}" data-tooltip=${item.percent}></div>`;
            };
        }
        return chart;
      }

      getHeaderValue(data){
        let sum = 0;
        for(let value in Object.values(data)){
            sum+=value*1;
        }
        return sum;
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

      setNewRange(from, to){
        this.range.from = from;
        this.range.to = to;

      }

      async loadDate (from, to){
        this.url.searchParams.set('from', from.toISOString());
        this.url.searchParams.set('to', to.toISOString());

        return await fetchJson(this.url);
      }

      async update(from, to) {
        this.element.classList.add('column-chart_loading');
        const data = await this.loadDate(from, to);
        this.setNewRange(from, to);

        if(data && Object.values(data).length){
             this.subElements.header.textContent = this.getHeaderValue(data);
             this.subElements.body.innerHTML = this.getChartValue(data);
             this.element.classList.remove('column-chart_loading');
        }

        return data;
      }
    
      render() {
        const element = document.createElement("div"); // (*)
        element.innerHTML = this.getTemplate();

        // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
        // который мы создали на строке (*)
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(element);
      }
    
      initEventListeners() {
        // NOTE: в данном методе добавляем обработчики событий, если они есть
      }
    
      remove() {
        this.element.remove();
      }
    
      destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
      }

}
