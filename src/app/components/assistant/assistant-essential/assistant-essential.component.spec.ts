import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantEssentialComponent } from './assistant-essential.component';

describe('AssistantEssentialComponent', () => {
  let component: AssistantEssentialComponent;
  let fixture: ComponentFixture<AssistantEssentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantEssentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantEssentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
