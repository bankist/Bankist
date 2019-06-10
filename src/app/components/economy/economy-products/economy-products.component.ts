import { Component, OnInit, Input } from '@angular/core';

import * as Shared from './../../../shared';

@Component({
  selector: 'economy-products',
  templateUrl: './economy-products.component.html',
  styleUrls: ['./economy-products.component.scss']
})
export class EconomyProductsComponent implements OnInit {

  products: any;
  productList: any;
  @Input('movements') movements: any;
  @Input('currency') currency: any;
  constructor() {
    this.productList = Shared.PRODUCTS;
  }

  ngOnInit() {
  }
  ngOnChanges() {
    this.setProducts();
  }
  setProducts() {
    let products = Shared.getMovsProducts(this.movements, this.productList, 4);
    if(products) this.products = products.slice(0, 4);
  }
}
