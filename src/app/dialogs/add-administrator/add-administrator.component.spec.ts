import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAdministratorComponent } from './add-administrator.component';

describe('AddAdministratorComponent', () => {
  let component: AddAdministratorComponent;
  let fixture: ComponentFixture<AddAdministratorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddAdministratorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
