import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStepFooterSectionComponent } from './configuration-step-footer-section.component';

xdescribe('ConfigurationStepFooterSectionComponent', () => {
  let component: ConfigurationStepFooterSectionComponent;
  let fixture: ComponentFixture<ConfigurationStepFooterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationStepFooterSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationStepFooterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
