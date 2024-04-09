import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SocialBaseComponent } from './social.base.component';

describe('Social.BaseComponent', () => {
  let component: SocialBaseComponent;
  let fixture: ComponentFixture<SocialBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SocialBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
