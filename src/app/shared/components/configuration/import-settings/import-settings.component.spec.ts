import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSettingsComponent } from './import-settings.component';

describe('ImportSettingsComponent', () => {
  let component: ImportSettingsComponent;
  let fixture: ComponentFixture<ImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
