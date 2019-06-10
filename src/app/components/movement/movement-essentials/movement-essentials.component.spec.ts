import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementEssentialsComponent } from './movement-essentials.component';

describe('MovementEssentialsComponent', () => {
  let component: MovementEssentialsComponent;
  let fixture: ComponentFixture<MovementEssentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementEssentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementEssentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
