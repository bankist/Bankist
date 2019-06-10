import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NomovsComponent } from './nomovs.component';

describe('NomovsComponent', () => {
  let component: NomovsComponent;
  let fixture: ComponentFixture<NomovsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NomovsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NomovsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
