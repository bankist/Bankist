import { Pipe } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Pipe({name: 'calendarbadge'})
export class CalendarBadgePipe {
  constructor(public translate: TranslateService) {
  }
  transform(events?, type?) {
    let eventsCount = events.filter((f)=>f.movement.type==type).length
    return eventsCount ? eventsCount : null;
  }
}
