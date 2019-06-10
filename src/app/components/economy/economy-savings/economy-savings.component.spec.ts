import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomySavingsComponent } from './economy-savings.component';

describe('EconomySavingsComponent', () => {
  let component: EconomySavingsComponent;
  let fixture: ComponentFixture<EconomySavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomySavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomySavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
