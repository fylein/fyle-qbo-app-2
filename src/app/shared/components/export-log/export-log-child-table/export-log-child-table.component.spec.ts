import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseList } from 'src/app/core/models/db/expense.model';
import { ExportLogChildTableComponent } from './export-log-child-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { DebugElement } from '@angular/core';
import { expenseList } from './export-log-child-table.fixture';
import { By } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';

describe('ExportLogChildTableComponent', () => {
  let component: ExportLogChildTableComponent;
  let fixture: ComponentFixture<ExportLogChildTableComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ ExportLogChildTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogChildTableComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    component.displayedColumns = ['expenseID', 'name', 'fundSource', 'merchant', 'category', 'amount'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display one row of export log', () => {
    component.displayedColumns = ['expenseID', 'name', 'fundSource', 'merchant', 'category', 'amount'];
    component.expenses = new MatTableDataSource<ExpenseList>(expenseList);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it ('it should bind right properties for the given data', () => {
    component.displayedColumns = ['expenseID', 'name', 'fundSource', 'merchant', 'category', 'amount'];
    component.expenses = new MatTableDataSource<ExpenseList>(expenseList);
    fixture.detectChanges();

    const expectedExpenseListRow = expenseList[0];

    const exportLogRow = el.queryAll(By.css('td'));
    const exportedId = exportLogRow[0].nativeElement.innerText;
    const employeeName = exportLogRow[1].children[0].nativeElement.innerText;
    const employeeEmail = exportLogRow[1].children[1].nativeElement.innerText;
    const fundSource = exportLogRow[2].nativeElement.innerText;
    const merchant = exportLogRow[3].nativeElement.innerText;
    const category = exportLogRow[4].nativeElement.innerText;
    const amount = exportLogRow[5].nativeElement.innerText;

    expect(exportLogRow).toBeTruthy();
    expect(exportedId).toBe(expectedExpenseListRow.expenseID);
    expect(employeeName).toBe(expectedExpenseListRow.name?.[0]);
    expect(employeeEmail).toBe(expectedExpenseListRow.name?.[1]);
    expect(fundSource).toBe(expectedExpenseListRow.fundSource);
    expect(merchant).toBe(expectedExpenseListRow.merchant);
    expect(category).toBe(expectedExpenseListRow.category);
    expect(amount).toBe(expectedExpenseListRow.amount?.[0] + ' ' + expectedExpenseListRow.amount?.[1]);
  });
});
