import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogHeaderSectionComponent } from './export-log-header-section.component';

describe('ExportLogHeaderSectionComponent', () => {
  let component: ExportLogHeaderSectionComponent;
  let fixture: ComponentFixture<ExportLogHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
