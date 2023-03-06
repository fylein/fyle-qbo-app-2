import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ExpenseGroupList } from 'src/app/core/models/db/expense-group.model';
import { FyleReferenceType } from 'src/app/core/models/enum/enum.model';
import { ExportLogChildDialogComponent } from 'src/app/integration/main/export-log/export-log-child-dialog/export-log-child-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExportLogTableComponent } from './export-log-table.component';
import { EXPENSE_GROUP_LISTS } from './export-log-table.fixture';

describe('ExportLogTableComponent', () => {
  let component: ExportLogTableComponent;
  let fixture: ComponentFixture<ExportLogTableComponent>;
  let el: DebugElement;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule],
      declarations: [ ExportLogTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogTableComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display one row of export log', () => {
    component.displayedColumns = ['exportedAt', 'name', 'fundSource', 'referenceID', 'exportType', 'link'];
    component.expenseGroups = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it ('it should bind right properties for the given data', () => {
    component.displayedColumns = ['exportedAt', 'name', 'fundSource', 'referenceID', 'exportType', 'link'];
    component.expenseGroups = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    const expectedExpenseGroupRow = EXPENSE_GROUP_LISTS[0];

    const exportLogRow = el.queryAll(By.css('td'));
    const exportedAtDate = exportLogRow[0].children[0].nativeElement.innerText;
    const exportedAtTime = exportLogRow[0].children[1].nativeElement.innerText;
    const employeeName = exportLogRow[1].children[0].nativeElement.innerText;
    const employeeEmail = exportLogRow[1].children[1].nativeElement.innerText;
    const fundSource = exportLogRow[2].nativeElement.innerText;
    const referenceID = exportLogRow[3].nativeElement.innerText;
    const exportType = exportLogRow[4].nativeElement.innerText;
    const qboUrl = exportLogRow[5].nativeElement;

    expect(exportLogRow).toBeTruthy();
    expect(exportedAtDate).toBeTruthy();
    expect(exportedAtTime).toBeTruthy();
    expect(employeeName).toBe(expectedExpenseGroupRow.employee[0]);
    expect(employeeEmail).toBe(expectedExpenseGroupRow.employee[1]);
    expect(fundSource).toBe(expectedExpenseGroupRow.expenseType);
    expect(referenceID).toBe(expectedExpenseGroupRow.referenceNumber);
    expect(exportType).toBe(expectedExpenseGroupRow.exportedAs);
    expect(qboUrl).toBeTruthy();
  });

  it('openChildExpenses function with FyleReferenceType.EXPENSE_REPORT check', () => {
    fixture.detectChanges();
    const properties = {
      width: '784px',
      height: '974px',
      data: EXPENSE_GROUP_LISTS[0].expenses,
      position: {
        top: '0px',
        right: '0px'
      }
    };
    EXPENSE_GROUP_LISTS[0].fyleReferenceType = FyleReferenceType.EXPENSE_REPORT;
    expect(component.openChildExpenses(EXPENSE_GROUP_LISTS[0])).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(ExportLogChildDialogComponent, properties);
  });
});
