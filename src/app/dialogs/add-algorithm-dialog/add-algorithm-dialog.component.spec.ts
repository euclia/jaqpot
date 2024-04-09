import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAlgorithmDialogComponent } from './add-algorithm-dialog.component';

describe('AddAlgorithmDialogComponent', () => {
  let component: AddAlgorithmDialogComponent;
  let fixture: ComponentFixture<AddAlgorithmDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddAlgorithmDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlgorithmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
