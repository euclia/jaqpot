import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JaqpotNotificationsComponent } from './jaqpot-notifications.component';

describe('JaqpotNotificationsComponent', () => {
  let component: JaqpotNotificationsComponent;
  let fixture: ComponentFixture<JaqpotNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JaqpotNotificationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JaqpotNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
