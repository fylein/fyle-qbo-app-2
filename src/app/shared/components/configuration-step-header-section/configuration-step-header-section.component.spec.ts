import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStepHeaderSectionComponent } from './configuration-step-header-section.component';

describe('ConfigurationStepHeaderSectionComponent', () => {
  let component: ConfigurationStepHeaderSectionComponent;
  let fixture: ComponentFixture<ConfigurationStepHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationStepHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationStepHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
