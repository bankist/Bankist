import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantSliderComponent } from './assistant-slider.component';

describe('AssistantSliderComponent', () => {
  let component: AssistantSliderComponent;
  let fixture: ComponentFixture<AssistantSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
