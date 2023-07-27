import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneAdvancedSettingsComponent } from './clone-advanced-settings.component';

describe('CloneAdvancedSettingsComponent', () => {
  let component: CloneAdvancedSettingsComponent;
  let fixture: ComponentFixture<CloneAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
