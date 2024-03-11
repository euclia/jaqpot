import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFeaturesComponent } from './model-features.component';

describe('ModelFeaturesComponent', () => {
  let component: ModelFeaturesComponent;
  let fixture: ComponentFixture<ModelFeaturesComponent>;

  beforeEach(async(() => {
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
