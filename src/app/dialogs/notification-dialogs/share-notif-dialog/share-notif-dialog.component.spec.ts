import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareNotifDialogComponent } from './share-notif-dialog.component';

describe('ShareNotifDialogComponent', () => {
  let component: ShareNotifDialogComponent;
  let fixture: ComponentFixture<ShareNotifDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShareNotifDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareNotifDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
