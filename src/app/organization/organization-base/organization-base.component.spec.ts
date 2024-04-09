import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationBaseComponent } from './organization-base.component';

describe('OrganizationBaseComponent', () => {
  let component: OrganizationBaseComponent;
  let fixture: ComponentFixture<OrganizationBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
