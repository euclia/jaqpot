import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PredictedComponent } from './predicted.component';

describe('PredictedComponent', () => {
  let component: PredictedComponent;
  let fixture: ComponentFixture<PredictedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PredictedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
