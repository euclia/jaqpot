import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddImageDatasetDialogComponent } from './add-image-dataset-dialog.component';

describe('AddImageDatasetDialogComponent', () => {
  let component: AddImageDatasetDialogComponent;
  let fixture: ComponentFixture<AddImageDatasetDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddImageDatasetDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddImageDatasetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
