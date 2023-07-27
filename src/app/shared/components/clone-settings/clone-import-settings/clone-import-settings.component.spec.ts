import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneImportSettingsComponent } from './clone-import-settings.component';

describe('CloneImportSettingsComponent', () => {
  let component: CloneImportSettingsComponent;
  let fixture: ComponentFixture<CloneImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
