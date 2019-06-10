import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderlogoComponent } from './headerlogo.component';

describe('HeaderlogoComponent', () => {
  let component: HeaderlogoComponent;
  let fixture: ComponentFixture<HeaderlogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderlogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderlogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
