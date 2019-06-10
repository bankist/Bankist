import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementCardComponent } from './movement-card.component';

describe('MovementCardComponent', () => {
  let component: MovementCardComponent;
  let fixture: ComponentFixture<MovementCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
