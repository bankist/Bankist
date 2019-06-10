import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementMiniComponent } from './movement-mini.component';

describe('MovementMiniComponent', () => {
  let component: MovementMiniComponent;
  let fixture: ComponentFixture<MovementMiniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementMiniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
