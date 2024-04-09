import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrokenAffilNotifComponent } from './broken-affil-notif.component';

describe('BrokenAffilNotifComponent', () => {
  let component: BrokenAffilNotifComponent;
  let fixture: ComponentFixture<BrokenAffilNotifComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BrokenAffilNotifComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokenAffilNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
