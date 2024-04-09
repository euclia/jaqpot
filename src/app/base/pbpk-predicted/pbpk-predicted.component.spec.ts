import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PbpkPredictedComponent } from './pbpk-predicted.component';

describe('PredictedComponent', () => {
  let component: PbpkPredictedComponent;
  let fixture: ComponentFixture<PbpkPredictedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PbpkPredictedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbpkPredictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
