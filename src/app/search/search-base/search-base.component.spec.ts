import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchBaseComponent } from './search-base.component';

describe('SearchBaseComponent', () => {
  let component: SearchBaseComponent;
  let fixture: ComponentFixture<SearchBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
