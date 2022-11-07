export default class ColumnChart {
    chartHeight = 50;

    constructor({
        data = [],
        label = '',
        link = '',
        value = 0,
        formatHeading = data => data
     } = {}) {
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = formatHeading(value);
        this.render();
        this.initEventListeners();
    }

    getTemplate() {
        let chart = this.getChartValue();
        let link = '';
        let loading = '';
        if (this.data.length === 0){loading = " column-chart_loading";};

        if(!(this.link === '')) {
            link = `<a class="column-chart__link" href=${this.link}>View all</a>`;
        }

        return `
          <div class="column-chart${loading}" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
                ${this.label}
                ${link}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.value}</div>
                <div data-element="body" class="column-chart__chart">${chart}</div>
            </div>
          </div>        `
        ;
      }

      getColumnProps() {
        const maxValue = Math.max(...this.data);
        const scale = this.chartHeight / maxValue;
      
        return this.data.map(item => {
          return {
            percent: (item / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(item * scale))
          };
        });
      }

      getChartValue() {
        let chart = '';
        const colProp = this.getColumnProps();
        if (!(this.data.length === 0)) {
            for(let item of colProp){
                chart+=`<div style="--value: ${item.value}" data-tooltip=${item.percent}></div>`;
            };
        }
        return chart;
      }

      update() {
        this.element.querySelector('.column-chart__chart').innerHTML = '';
        let chart = this.getChartValue();
        this.element.querySelector('.column-chart__chart').innerHTML = chart;
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
        this.element.remove();
      }
    
      destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
      }
}
