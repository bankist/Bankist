import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementAvoidablesComponent } from './movement-avoidables.component';

describe('MovementAvoidablesComponent', () => {
  let component: MovementAvoidablesComponent;
  let fixture: ComponentFixture<MovementAvoidablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementAvoidablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementAvoidablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
