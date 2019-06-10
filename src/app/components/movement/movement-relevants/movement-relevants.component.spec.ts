import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementRelevantsComponent } from './movement-relevants.component';

describe('MovementRelevantsComponent', () => {
  let component: MovementRelevantsComponent;
  let fixture: ComponentFixture<MovementRelevantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementRelevantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementRelevantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
