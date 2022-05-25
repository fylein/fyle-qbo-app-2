import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogDateFilterComponent } from './export-log-date-filter.component';

xdescribe('ExportLogDateFilterComponent', () => {
  let component: ExportLogDateFilterComponent;
  let fixture: ComponentFixture<ExportLogDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogDateFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
