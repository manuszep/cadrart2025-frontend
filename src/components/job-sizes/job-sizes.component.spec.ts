import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSizesComponent } from './job-sizes.component';

describe('JobSizesComponent', () => {
  let component: JobSizesComponent;
  let fixture: ComponentFixture<JobSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSizesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
