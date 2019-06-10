import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomyProductsComponent } from './economy-products.component';

describe('EconomyProductsComponent', () => {
  let component: EconomyProductsComponent;
  let fixture: ComponentFixture<EconomyProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomyProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomyProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
