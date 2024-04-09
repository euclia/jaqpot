import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChooseXYComponent } from './choose-x-y.component';

describe('ChooseXYComponent', () => {
  let component: ChooseXYComponent;
  let fixture: ComponentFixture<ChooseXYComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseXYComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseXYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
