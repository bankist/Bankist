import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementProductsComponent } from './movement-products.component';

describe('MovementProductsComponent', () => {
  let component: MovementProductsComponent;
  let fixture: ComponentFixture<MovementProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
