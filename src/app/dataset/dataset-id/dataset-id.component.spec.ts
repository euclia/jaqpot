import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetIdComponent } from './dataset-id.component';

describe('DatasetIdComponent', () => {
  let component: DatasetIdComponent;
  let fixture: ComponentFixture<DatasetIdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetIdComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
