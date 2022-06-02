import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStepFooterSectionComponent } from './configuration-step-footer-section.component';

describe('ConfigurationStepFooterSectionComponent', () => {
  let component: ConfigurationStepFooterSectionComponent;
  let fixture: ComponentFixture<ConfigurationStepFooterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurationStepFooterSectionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationStepFooterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.showBackButton = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('save eventemit @output check', () => {
    spyOn(component.save, 'emit'); // 1
    const button = fixture.nativeElement.querySelector('.configuration--submit-btn');
    button.click();
    fixture.detectChanges();
    expect(component.save.emit).toHaveBeenCalled();
  });

  it('navigate eventemit @output check', () => {
    component.showBackButton = true;
    spyOn(component.navigateToPreviousStep, 'emit');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.navigate');
    button.click();
    expect(component.navigateToPreviousStep.emit).toHaveBeenCalled();
  });
});
