import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomyPlansComponent } from './economy-plans.component';

describe('EconomyPlansComponent', () => {
  let component: EconomyPlansComponent;
  let fixture: ComponentFixture<EconomyPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomyPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomyPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
