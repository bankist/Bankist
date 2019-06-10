import { Component, OnInit} from '@angular/core';
import { ModalController, NavParams} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import * as Shared from './../../../shared';

@Component({
  selector: 'movement-products',
  templateUrl: 'movement-products.component.html',
  styleUrls: ['movement-products.component.scss']
})
export class MovementProductsComponent implements OnInit {
  product;
  products;
  constructor(public modalController: ModalController,
  public navParams: NavParams,
    public translate: TranslateService) {
    this.products = Shared.PRODUCTS;
    if(this.navParams && this.navParams.get('product')) this.product = this.navParams.get('product');
  }
  ngOnInit() {
  }
  selectProduct(product) {
    this.modalController.dismiss({product});
  }
  removeProduct(event) {
    event.stopPropagation();
    this.modalController.dismiss({product: null});
  }
  closeMovementProducts(event) {
    event.stopPropagation();
    this.modalController.dismiss();
  }

}
