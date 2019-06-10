import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import * as Shared from './../../../shared';

import { DateChartPipe } from './../../../pipes/date.chart.pipe';

import { stockChart } from 'highcharts/highstock';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'movement-chart',
  templateUrl: 'movement-chart.component.html',
  styleUrls: ['movement-chart.component.scss']
})
export class MovementChartComponent implements OnInit {
  afterSetExtremes = (event: any) => {
    this.zoomed = true;
    let extremes = event.target.chart.xAxis[0].getExtremes();
    let min = extremes.min;
    let max = extremes.max;
    this.changeIntervalExtremes.next({max: parseInt(max), min: parseInt(min)})
  }
  options: Highcharts.Options = {
    title: { text: ''},
    credits: { enabled: false},
    legend: { enabled: false},
    chart: {
      type: 'scatter',
      zoomType: 'x',
      animation: true,
      panning: (window.innerWidth >= 992 ? true : false),
      backgroundColor: 'rgba(255, 255, 255, 0.0)',
      resetZoomButton: { 
          relativeTo: 'plot',
          position: {
            x: 100,
            y: 100
          }
      }
    },
    navigator: {
      enabled: (window.innerWidth >= 992 ? true : false)
    },
    scrollbar: {
      barBackgroundColor: 'gray',
      barBorderRadius: 7,
      barBorderWidth: 0,
      buttonBackgroundColor: 'gray',
      buttonBorderWidth: 0,
      buttonBorderRadius: 7,
      trackBackgroundColor: 'none',
      trackBorderWidth: 1,
      trackBorderRadius: 8,
      trackBorderColor: '#CCC',
      enabled: (window.innerWidth >= 992 ? true : false)
    },
    rangeSelector: {
        enabled: false
    },
    plotOptions: {
      bar: {
        borderWidth: 2
      },
      series: {
        turboThreshold: 100000,
        stacking: 'normal'
      }
    },
    xAxis: {
      title: {text: ''},
      type: 'datetime',
      // min: Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      ordinal: false,
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },
      labels: {
          style: {
              color: 'white',
              fontSize: '7'
          }
      },
      events: {
        afterSetExtremes: this.afterSetExtremes.bind(this)
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      labels: {
          style: {
              color: 'white',
              fontSize: '7'
          }
      },
      gridLineColor : '#474747'
    },
    series: []
  };
  chart: Highcharts.ChartObject;
  currencies: any;
  locale: any;
  showWalletBalance: boolean = true;
  totalAmount: any;
  zoomed: boolean = false;
  @ViewChild('chartMovements') chartMovements: ElementRef;
  @Input('wallet') wallet: any;
  @Input('interval') interval: any;
  @Input('type') type: any;
  @Input('showingPlans') showingPlans: any;
  @Input('currency') currency: any;
  @Input('language') language: any;
  @Output('changeIntervalExtremes') changeIntervalExtremes = new EventEmitter();
  @Output('walletDateChanged') walletDateChanged = new EventEmitter();
  constructor(public translate: TranslateService) {
    this.locale = this.translate.store.currentLang;
  }
  ngOnInit (){}
  ngOnChanges(map) {
    setTimeout(()=>this.chartifyWallet(), 500);
  }
  chartifyWallet(){
    let series = [];
    let movs = this.wallet ? this.wallet.zeitMovements : null;
    if(movs && movs.length){
      series = this.getMovementSeries(series, movs);
    }
    let plans = this.wallet ? this.wallet.plans : null;
    if(this.showingPlans && plans && plans.length){
      series = this.getPlansSeries(series, plans);
    }
    let months = this.translate.instant('DATE_MONTH_NAMES').split(','); 
    let shortMonths = this.translate.instant('DATE_MONTH_SHORT_NAMES').split(',');
    let weekdays = this.translate.instant('DATE_DAY_NAMES').split(',');
    Highcharts.setOptions({lang: {months,shortMonths,weekdays}});
    this.options.series = series;
    this.chart = this.chartMovements ? stockChart(this.chartMovements.nativeElement, this.options) : null;
    if(this.chart) {
      var movementChart = this;
      this.chart.options.tooltip.formatter = function() {
          let date = this.x;
          let value = 0;
          let label= new DateChartPipe().transform(this.x);
          for(let point of this.points) {
            value = point.y.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            if(point.point.label) label += point.point.label;
            else if(point.series.name) {
              label += ' <br> <b>' + point.series.name + ':</b> ' + value;
            }
            if(point.series.name=='Wallet') {
              movementChart.walletDateChanged.next({date,value});
            }
          }
          return label;
      }
    }
  }
  getChartSerie(type) {
    let serie;
    switch (type) {
      case 'expenses':
        serie = {name: 'Expenses',type: 'column',color: '#FF005D',borderColor: '#FF005D',borderWidth: 2,data: []};
        break;
      case 'incomes':
        serie = {name: 'Incomes',type: 'column',color: '#00D49D',borderColor: '#00D49D',borderWidth: 2, data: []};
        break;
      case 'balance':
        serie = {name: 'Balance',type: 'column',color: 'rgb(255, 255, 255)',borderColor: 'rgb(255, 255, 255)',borderWidth: 2,data: []};
        break;
      case 'wallet':
        serie = {name: 'Wallet',type: 'line',step: true,color: 'rgb(255, 255, 255)',borderColor: 'rgb(255, 255, 255)',borderWidth: 2,data: []};
        break;
      case 'plan':
        serie = {name: 'Plan',type: 'line',step: false,stacking: undefined,color: '#fabe20',borderColor: '#fabe20',borderWidth: 2,data: []};
        break;
      default:
        break;
    }
    return serie;
  }
  getMovementSeries(series, movs) {
    this.totalAmount = 0;
    let outcomesSerie = this.getChartSerie('expenses');
    let incomesSerie = this.getChartSerie('incomes');
    let balancesSerie = this.getChartSerie('balance');
    let walletSerie = this.getChartSerie('wallet');
    let wallet, outcome, income, balance, prevDate;
    for(let mov of movs) {

      let date: any = new Date(mov.date);

      walletSerie = this.setChartData('wallet', walletSerie, mov);
      if(!this.showingPlans) {
        switch (mov.type) {
          case "outcome":
            outcomesSerie = this.setChartData('outcome', outcomesSerie, mov);
            break;
          case "income":
            incomesSerie = this.setChartData('income', incomesSerie, mov);
            break;
          case "balance":
            balancesSerie = this.setChartData('balance', balancesSerie, mov);
            break;
        }
      }
      prevDate = new Date(date.getTime());
      prevDate.setDate(prevDate.getDate() + 1);
    }
    switch (this.type) {
      case "income":
        series.push(incomesSerie);
        break;
      case "outcome":
        series.push(outcomesSerie);
        break;
      case "saving":
        series.push(walletSerie);
        break;
      default:
        series.push(walletSerie);
        series.push(balancesSerie);
        series.push(incomesSerie);
        series.push(outcomesSerie);
        break;
    }
    return series;
  }
  getPlansSeries(series, plans) {
    this.totalAmount = 0;
    for(let plan of plans) {
      let planSerie = this.getChartSerie('plan');
      this.setChartData('plan', planSerie, {
        date: plan.from,
        amount: plan.initial,
        balance: plan.initial,
      });
      this.setChartData('plan', planSerie, {
        date: plan.to,
        amount: plan.amount,
        balance: plan.amount,
        concept: plan.name,
      });
      series.push(planSerie);
    }
    return series;
  }
  setChartData(type, serie, movement) {

    let walletLabel = this.getMovementLabel({concept: this.wallet.name, amount: movement.balance, type: 'wallet'});
    let movementLabel = this.getMovementLabel(movement);
    let label = type == 'wallet' ? walletLabel : movementLabel;

    let date: any = new Date(movement.date);
    let dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

    let amount;
    switch (type) {
      case 'wallet':
        amount = movement.balance;
        break;
      case 'outcome':
        amount = -movement.amount;
        break;
      default:
        amount = movement.amount;
        break;
    }

    let data = {
      x: dateUTC, 
      y: amount, 
      date: movement.date,
      label: label
    };

    let serieLast = serie.data[serie.data.length-1];
    if(serieLast && new Date(serieLast.date).toDateString() == new Date(movement.date).toDateString()){
      if(type=='wallet' || type=='plan') {
        serie.data[serie.data.length-1].y = amount;
        serie.data[serie.data.length-1].label = label;
      }else {
        serie.data[serie.data.length-1].y += amount;
        serie.data[serie.data.length-1].label += label;
      }
    }else{
      serie.data.push(data);
    }
    return serie;

  }
  getMovementLabel(movement) {
    let amount = movement.type == 'outcome' ? -movement.amount : movement.amount;
    return ' <br> <b>' + movement.concept + ':</b> ' + Shared.formatCurrency(amount, this.currency);
  }
  toggleBalance() {
    this.showWalletBalance = this.showWalletBalance ? false : true;
    this.chartifyWallet();
  }
  resetZoom() {
    this.zoomed = null;
    this.chart.xAxis[0].setExtremes(null,null);
  }
}
