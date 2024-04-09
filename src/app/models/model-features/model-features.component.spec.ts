import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelFeaturesComponent } from './model-features.component';

describe('ModelFeaturesComponent', () => {
  let component: ModelFeaturesComponent;
  let fixture: ComponentFixture<ModelFeaturesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModelFeaturesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
