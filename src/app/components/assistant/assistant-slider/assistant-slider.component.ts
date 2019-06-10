import { Component, OnInit } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'assistant-slider',
  templateUrl: './assistant-slider.component.html',
  styleUrls: ['./assistant-slider.component.scss']
})
export class AssistantSliderComponent implements OnInit {

  isCordovaBankist: boolean = true;
  balance: any;
  sliderOptions = {
    allowTouchMove: true,
    zoom: false,
    autoplay: false
  };
  wallet: any;
  constructor(public modalController: ModalController,
    public platform: Platform,
    public navParams: NavParams) {
    this.isCordovaBankist = this.platform.is('cordova') || location.hostname == 'localhost';
    if(this.navParams && this.navParams.get('wallet')) this.wallet = this.navParams.get('wallet');
    if(this.navParams && this.navParams.get('balance')) this.balance = this.navParams.get('balance');
  }

  ngOnInit() {
  }
  closeAssistant(event?){
    this.modalController.dismiss();
  }

}
