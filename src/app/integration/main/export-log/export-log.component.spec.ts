import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportLogComponent } from './export-log.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { ExportLogModule } from './export-log.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExpenseGroupList } from 'src/app/core/models/db/expense-group.model';
import { expenseGroupresponse, expenseGroupresponse1, EXPENSE_GROUP_LISTS, exportTyperesponse, fyleURLresponse, mockSkipExportList, pageinatorResponse, getSkippedExpensesResponse } from './export-log.fixture';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { of } from 'rxjs';
import { FyleReferenceType } from 'src/app/core/models/enum/enum.model';


describe('ExportLogComponent', () => {
  let component: ExportLogComponent;
  let fixture: ComponentFixture<ExportLogComponent>;
  let formBuilder: UntypedFormBuilder;
  let exportService: ExportLogService;
  let pageinator: PaginatorService;
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({org_id: 'dummy'}));
    const service1 = {
      getExpenseGroups: () => of(expenseGroupresponse),
      generateExportTypeAndId: () => exportTyperesponse,
      getReferenceType: () => 'settlement_id',
      generateFyleUrl: () => fyleURLresponse,
      getSkippedExpenses: () => of(getSkippedExpensesResponse)
    };
    const service2 = {
      storePageSize: () => '2',
      getPageSize: () => of(pageinatorResponse)
    };
    await TestBed.configureTestingModule({
      declarations: [ ExportLogComponent ],
      imports: [FormsModule, ReactiveFormsModule, MatDialogModule, RouterTestingModule, HttpClientTestingModule, HttpClientModule, ExportLogModule, NoopAnimationsModule],
      providers: [ UntypedFormBuilder,
        { provide: ExportLogService, useValue: service1 },
        { provide: PaginatorService, useValue: service2 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(UntypedFormBuilder);
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
    component.exportLogForm.controls.searchOption.patchValue('dh');
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.skipExportLogForm.controls.searchOption.patchValue('dh');
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.exportLogForm.controls.dateRange.patchValue([{startDate: new Date(), endDate: new Date((new Date().getTime() + 24) * (60 * 60 * 1000))}]);
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.exportLogForm.controls.dateRange.patchValue('');
    expect((component as any).setupForm()).toBeUndefined();
    component.exportLogForm.controls.dateRange.patchValue('');
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.exportLogForm.controls.searchOption.patchValue(component.exportLogForm.controls.searchOption.reset());
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

  it('searchByText function check', () => {
    expect((component as any).searchByTextSkipExport(mockSkipExportList, 'John')).toBeTrue();
    expect((component as any).searchByTextSkipExport(mockSkipExportList, 'Doe')).toBeTrue();
    expect((component as any).searchByTextSkipExport(mockSkipExportList, '123456')).toBeTrue();
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

  it('clearDateFilterSkipExport function check', () => {
    expect(component.clearDateFilterSkipExport()).toBeUndefined();
  });

  it('changeState function check', () => {
    component.state = 'SKIPP';
    expect(component.changeState('SKIP')).toBeUndefined();
    expect(component.state).toBe('SKIP');
    expect(component.changeState('SKI')).toBeUndefined();
    expect(component.state).toBe('SKI');
  });

  it('dateFilterHandlerSkipExport function check', () => {
    component.limit = 1;
    expect(component.dateFilterHandlerSkipExport()).toBeUndefined();
    const getSkippedExpenses = getSkippedExpensesResponse;
    getSkippedExpenses.results[0].fund_source = 'CCC';
    spyOn(exportService, 'getSkippedExpenses').and.returnValue(of(getSkippedExpenses));
    expect(component.dateFilterHandlerSkipExport()).toBeUndefined();
  });

  it('setupSkipExportForm function check', () => {
    component.skipExportLogForm = formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });
    fixture.detectChanges();
    expect((component as any).setupSkipExportForm()).toBeUndefined();
    fixture.detectChanges();
    component.skipExportLogForm.controls.searchOption.patchValue('dh');
    expect((component as any).setupSkipExportForm()).toBeUndefined();
    fixture.detectChanges();
    component.skipExportLogForm.controls.searchOption.patchValue('dh');
    expect((component as any).setupSkipExportForm()).toBeUndefined();
    fixture.detectChanges();
    component.skipExportLogForm.controls.dateRange.patchValue([{startDate: new Date(), endDate: new Date((new Date().getTime() + 24) * (60 * 60 * 1000))}]);
    expect((component as any).setupSkipExportForm()).toBeUndefined();
    fixture.detectChanges();
    component.skipExportLogForm.controls.dateRange.patchValue('');
    expect((component as any).setupSkipExportForm()).toBeUndefined();
    component.skipExportLogForm.controls.dateRange.patchValue('');
    expect((component as any).setupSkipExportForm()).toBeUndefined();
    fixture.detectChanges();
    component.skipExportLogForm.controls.searchOption.patchValue(component.skipExportLogForm.controls.searchOption.reset());
    expect((component as any).setupSkipExportForm()).toBeUndefined();
  });
});
