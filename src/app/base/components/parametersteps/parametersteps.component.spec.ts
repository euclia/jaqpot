import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParameterstepsComponent } from './parametersteps.component';

describe('ParameterstepsComponent', () => {
  let component: ParameterstepsComponent;
  let fixture: ComponentFixture<ParameterstepsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterstepsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterstepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
