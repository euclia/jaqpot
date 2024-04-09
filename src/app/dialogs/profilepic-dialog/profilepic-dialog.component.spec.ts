import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfilepicDialogComponent } from './profilepic-dialog.component';

describe('ProfilepicDialogComponent', () => {
  let component: ProfilepicDialogComponent;
  let fixture: ComponentFixture<ProfilepicDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilepicDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilepicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
