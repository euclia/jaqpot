import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvitationNotifDialogComponent } from './invitation-notif-dialog.component';

describe('InvitationNotifDialogComponent', () => {
  let component: InvitationNotifDialogComponent;
  let fixture: ComponentFixture<InvitationNotifDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationNotifDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationNotifDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
