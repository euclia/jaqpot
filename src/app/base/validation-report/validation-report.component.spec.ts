import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValidationReportComponent } from './validation-report.component';

describe('ValidationReportComponent', () => {
  let component: ValidationReportComponent;
  let fixture: ComponentFixture<ValidationReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
