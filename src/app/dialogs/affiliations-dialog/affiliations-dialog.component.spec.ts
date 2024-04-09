import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AffiliationsDialogComponent } from './affiliations-dialog.component';

describe('AffiliationsDialogComponent', () => {
  let component: AffiliationsDialogComponent;
  let fixture: ComponentFixture<AffiliationsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliationsDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
