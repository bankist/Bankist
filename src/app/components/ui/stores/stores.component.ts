import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'stores',
  templateUrl: 'stores.component.html',
  styleUrls: ['stores.component.scss']
})
export class StoresComponent implements OnInit {

  @Output('closedMovement') closedMovement = new EventEmitter();
  constructor(public translate: TranslateService) {
  }

  ngOnInit() {
  }
  closeStores(event?){
    if(!event || event.target.nodeName=='ION-CARD-CONTENT') {
      this.closedMovement.next();
    }
  }
}
