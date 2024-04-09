import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PredictValidateComponent } from './predict-validate.component';

describe('PredictValidateComponent', () => {
  let component: PredictValidateComponent;
  let fixture: ComponentFixture<PredictValidateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PredictValidateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
