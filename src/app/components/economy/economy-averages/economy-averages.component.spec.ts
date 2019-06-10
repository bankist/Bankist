import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomyAveragesComponent } from './economy-averages.component';

describe('EconomyAveragesComponent', () => {
  let component: EconomyAveragesComponent;
  let fixture: ComponentFixture<EconomyAveragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomyAveragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomyAveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
