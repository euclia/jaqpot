import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FyiNotifComponent } from './fyi-notif.component';

describe('FyiNotifComponent', () => {
  let component: FyiNotifComponent;
  let fixture: ComponentFixture<FyiNotifComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FyiNotifComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FyiNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
