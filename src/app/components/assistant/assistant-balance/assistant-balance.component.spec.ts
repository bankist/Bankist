import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantBalanceComponent } from './assistant-balance.component';

describe('AssistantBalanceComponent', () => {
  let component: AssistantBalanceComponent;
  let fixture: ComponentFixture<AssistantBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
