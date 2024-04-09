import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttkmodelsComponent } from './httkmodels.component';

describe('HttkmodelsComponent', () => {
  let component: HttkmodelsComponent;
  let fixture: ComponentFixture<HttkmodelsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HttkmodelsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttkmodelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
