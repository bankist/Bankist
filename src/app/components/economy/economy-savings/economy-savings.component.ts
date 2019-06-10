import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import * as Highcharts from 'highcharts/highstock';

import * as Shared from './../../../shared';

@Component({
  selector: 'economy-savings',
  templateUrl: './economy-savings.component.html',
  styleUrls: ['./economy-savings.component.scss']
})
export class EconomySavingsComponent implements OnInit {

  options: Highcharts.Options = {
    title: { text: ''},
    credits: { enabled: false},
    legend: { enabled: false},
    chart: {
      type: 'column',
      panning: false,
      backgroundColor: 'rgba(255, 255, 255, 0.0)',
      height: '155px'
    },
    plotOptions: {
      bar: {
        borderWidth: 2
      },
      series: {
        turboThreshold: 100000,
      }
    },
    xAxis: {
      title: {text: ''},
      type: 'category',
      labels: {
          style: {
              color: 'white',
              fontSize: '12'
          }
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      labels: {
          style: {
              color: 'white',
              fontSize: '10'
          }
      },
      gridLineColor : '#474747'
    },
    series: []
  };
  chart: Highcharts.ChartObject;
  date;
  savingRate;
  savingRates;
  @Input('movements') movements: any;
  @Input('wallet') wallet: any;
  @ViewChild('chartSavings') chartSavings: ElementRef;
  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }
  ngOnChanges(map) {
    if(map&&map.movements && !map.movements.firstChange) this.setSavings();
  }
  setSavings(){
    let savingRate = 0;
    if(!this.date) this.date = new Date();
    if(this.movements){
      let balance = 0, incomes = 0, savings = 0, expenses = 0;
      for(let mov of this.movements){
        let movDate = new Date(mov.date);
        if(!balance || movDate < this.date || movDate.toDateString() === this.date.toDateString()){
          if(mov.type == 'balance') balance = mov.amount;
          else if(mov.type == 'income') balance += mov.amount;
          else balance -= mov.amount;
        }
        if(mov.type=='income') incomes += mov.amount;
        if(mov.type=='outcome') expenses += mov.amount;
        savings = incomes - expenses;
      }
      savingRate = parseFloat((savings / incomes * 100).toFixed(2));
    }
    this.chartifySavings(savingRate);
  }
  chartifySavings(savingRate) {
    this.savingRate = savingRate;
    let series = [];
    let savingRates = [];
    for(let rate of Shared.SAVING_RATES) {
      savingRates.push(rate);
    }
    savingRates.push({id:this.translate.instant('YOU'), rate: savingRate, color: '#fabe20'});
    savingRates = savingRates.map((r)=>{ 
      return {name: r.id, y: r.rate, drilldown: r.id, color: r.color?r.color:'#FFFFFF'}
    }).sort(function(a,b){return b.name - a.name})
    series.push({
      name: this.translate.instant('RATE'),
      data: savingRates
    });
    this.options.series = series;
    let chartOptions = this.options;

    this.chart = this.chartSavings ? Highcharts.chart(this.chartSavings.nativeElement, chartOptions) : null;
  }
}