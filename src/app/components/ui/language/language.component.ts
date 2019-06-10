import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as Shared from './../../../shared';

@Component({
  selector: 'language',
  templateUrl: 'language.component.html',
  styleUrls: ['language.component.scss']
})
export class LanguageComponent implements OnInit {
  languages;
  currentLang;
  @Output('changedLanguage') changedLanguage = new EventEmitter();
  constructor(public translate: TranslateService) {
    this.languages = Shared.LANGUAGES;
  }
  ngOnInit() {
    this.currentLang = this.translate.currentLang;
  }
  changeLang(lang) {
    this.currentLang = lang;
    this.changedLanguage.next(lang);
  }

}
