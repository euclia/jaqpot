import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdatePhotoComponent } from './update-photo.component';

describe('UpdatePhotoComponent', () => {
  let component: UpdatePhotoComponent;
  let fixture: ComponentFixture<UpdatePhotoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePhotoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
