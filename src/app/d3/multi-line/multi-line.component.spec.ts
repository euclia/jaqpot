import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiLineComponent } from './multi-line.component';

describe('MultiLineComponent', () => {
  let component: MultiLineComponent;
  let fixture: ComponentFixture<MultiLineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MultiLineComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
