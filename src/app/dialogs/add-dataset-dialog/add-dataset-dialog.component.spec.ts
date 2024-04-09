import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDatasetDialogComponent } from './add-dataset-dialog.component';

describe('AddDatasetDialogComponent', () => {
  let component: AddDatasetDialogComponent;
  let fixture: ComponentFixture<AddDatasetDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddDatasetDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDatasetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
