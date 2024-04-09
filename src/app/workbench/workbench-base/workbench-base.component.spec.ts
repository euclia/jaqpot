import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkbenchBaseComponent } from './workbench-base.component';

describe('WorkbenchBaseComponent', () => {
  let component: WorkbenchBaseComponent;
  let fixture: ComponentFixture<WorkbenchBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WorkbenchBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbenchBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
