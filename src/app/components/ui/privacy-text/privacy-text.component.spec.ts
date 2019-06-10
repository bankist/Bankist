import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyTextComponent } from './privacy.component';

describe('PrivacyTextComponent', () => {
  let component: PrivacyTextComponent;
  let fixture: ComponentFixture<PrivacyTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
