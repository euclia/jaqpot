import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreatehttkmodelComponent } from './createhttkmodel.component';

describe('CreatehttkmodelComponent', () => {
  let component: CreatehttkmodelComponent;
  let fixture: ComponentFixture<CreatehttkmodelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatehttkmodelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatehttkmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
