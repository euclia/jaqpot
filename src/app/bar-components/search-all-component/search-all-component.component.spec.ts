import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchAllComponentComponent } from './search-all-component.component';

describe('SearchAllComponentComponent', () => {
  let component: SearchAllComponentComponent;
  let fixture: ComponentFixture<SearchAllComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAllComponentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAllComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
