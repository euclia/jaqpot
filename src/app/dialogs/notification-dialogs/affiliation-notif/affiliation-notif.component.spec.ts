import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AffiliationNotifComponent } from './affiliation-notif.component';

describe('AffiliationNotifComponent', () => {
  let component: AffiliationNotifComponent;
  let fixture: ComponentFixture<AffiliationNotifComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliationNotifComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
