import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneSettingsComponent } from './clone-settings.component';

describe('CloneSettingsComponent', () => {
  let component: CloneSettingsComponent;
  let fixture: ComponentFixture<CloneSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
