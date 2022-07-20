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
import { expenseGroupresponse, expenseGroupresponse1, EXPENSE_GROUP_LISTS, exportTyperesponse, fyleURLresponse, pageinatorResponse } from './export-log.fixture';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { of } from 'rxjs';
import { FyleReferenceType } from 'src/app/core/models/enum/enum.model';


describe('ExportLogComponent', () => {
  let component: ExportLogComponent;
  let fixture: ComponentFixture<ExportLogComponent>;
  let formBuilder: FormBuilder;
  let exportService: ExportLogService;
  let pageinator: PaginatorService;
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({org_id: 'dummy'}));
    const service1 = {
      getExpenseGroups: () => of(expenseGroupresponse),
      generateExportTypeAndId: () => exportTyperesponse,
      getReferenceType: () => 'settlement_id',
      generateFyleUrl: () => fyleURLresponse
    };
    const service2 = {
      storePageSize: () => '2',
      getPageSize: () => of(pageinatorResponse)
    };
    await TestBed.configureTestingModule({
      declarations: [ ExportLogComponent ],
      imports: [FormsModule, ReactiveFormsModule, MatDialogModule, RouterTestingModule, HttpClientTestingModule, HttpClientModule, ExportLogModule, NoopAnimationsModule],
      providers: [ FormBuilder,
        { provide: ExportLogService, useValue: service1 },
        { provide: PaginatorService, useValue: service2 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    exportService = TestBed.inject(ExportLogService);
    pageinator = TestBed.inject(PaginatorService);
    component.expenseGroups = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    component.exportLogForm = formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setupform function check', () => {
    component.exportLogForm = formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });
    fixture.detectChanges();
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.exportLogForm.controls.searchOption.patchValue(['dh']);
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.exportLogForm.controls.dateRange.patchValue([{startDate: new Date(), endDate: new Date((new Date().getTime() + 24) * (60 * 60 * 1000))}]);
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.exportLogForm.controls.dateRange.patchValue('');
    expect((component as any).setupForm()).toBeUndefined();
  });

  it('clearDateFilter function check', () => {
    expect(component.clearDateFilter()).toBeUndefined();
  });

  it('dateFilterHandler function check', () => {
    component.exportLogForm.controls.start.patchValue(new Date());
    component.exportLogForm.controls.end.patchValue(new Date((new Date().getTime() + 24) * (60 * 60 * 1000)));
    fixture.detectChanges();
    expect(component.dateFilterHandler()).toBeUndefined();
  });

  it('searchByText function check', () => {
    expect((component as any).searchByText(EXPENSE_GROUP_LISTS[0], 'aswin')).toBeFalsy();
  });

  it('getExpenseGroups function check', () => {
    const perameter = {
      limit: 0,
      offset: 50
  };
    spyOn(exportService, 'getExpenseGroups').and.callThrough();
    spyOn(exportService, 'generateExportTypeAndId').and.callThrough();
    spyOn(exportService, 'getReferenceType').and.callThrough();
    spyOn(exportService, 'generateFyleUrl').and.callThrough();
    expect(component.getExpenseGroups(perameter)).toBeUndefined();
    fixture.detectChanges();
    expect(exportService.getExpenseGroups).toHaveBeenCalled();
    expect(exportService.generateExportTypeAndId).toHaveBeenCalled();
  });

  it('getExpenseGroups function check', () => {
    const perameter = {
      limit: 0,
      offset: 50
  };
    spyOn(exportService, 'getExpenseGroups').and.returnValue(of(expenseGroupresponse1));
    spyOn(exportService, 'generateExportTypeAndId').and.callThrough();
    spyOn(exportService, 'getReferenceType').and.returnValue(FyleReferenceType.EXPENSE);
    spyOn(exportService, 'generateFyleUrl').and.callThrough();
    expect(component.getExpenseGroups(perameter)).toBeUndefined();
    fixture.detectChanges();
    expect(exportService.getExpenseGroups).toHaveBeenCalled();
    expect(exportService.generateExportTypeAndId).toHaveBeenCalled();
  });
});
