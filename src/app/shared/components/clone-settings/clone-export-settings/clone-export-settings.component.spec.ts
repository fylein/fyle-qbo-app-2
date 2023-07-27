import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneExportSettingsComponent } from './clone-export-settings.component';

describe('CloneExportSettingsComponent', () => {
  let component: CloneExportSettingsComponent;
  let fixture: ComponentFixture<CloneExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
