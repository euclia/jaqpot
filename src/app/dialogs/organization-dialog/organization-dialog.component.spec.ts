import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationDialogComponent } from './organization-dialog.component';

describe('OrganizationDialogComponent', () => {
  let component: OrganizationDialogComponent;
  let fixture: ComponentFixture<OrganizationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
