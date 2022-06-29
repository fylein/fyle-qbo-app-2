import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportLogComponent } from './export-log.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from "@angular/material/dialog";
import { ExportLogModule } from './export-log.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseGroupList } from 'src/app/core/models/db/expense-group.model';
import { EXPENSE_GROUP_LISTS } from './export-log.fixture';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ExportLogComponent', () => {
  let component: ExportLogComponent;
  let fixture: ComponentFixture<ExportLogComponent>;
  let formBuilder: FormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogComponent ],
      imports: [FormsModule, ReactiveFormsModule, MatDialogModule, RouterTestingModule, HttpClientTestingModule, HttpClientModule, ExportLogModule, NoopAnimationsModule],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setupform function check', () => {
    component.expenseGroups = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    component.exportLogForm = formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });
    fixture.detectChanges();
    component.exportLogForm.controls.searchOption.patchValue(['dh']);
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.exportLogForm.controls.searchOption.patchValue('');
    expect((component as any).setupForm()).toBeUndefined();
  });
});
