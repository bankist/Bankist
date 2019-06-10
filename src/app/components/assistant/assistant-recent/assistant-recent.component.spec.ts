import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantRecentComponent } from './assistant-recent.component';

describe('AssistantRecentComponent', () => {
  let component: AssistantRecentComponent;
  let fixture: ComponentFixture<AssistantRecentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantRecentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
