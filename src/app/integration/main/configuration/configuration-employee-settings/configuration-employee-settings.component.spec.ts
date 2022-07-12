import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationEmployeeSettingsComponent } from './configuration-employee-settings.component';

describe('ConfigurationEmployeeSettingsComponent', () => {
  let component: ConfigurationEmployeeSettingsComponent;
  let fixture: ComponentFixture<ConfigurationEmployeeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationEmployeeSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationEmployeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
