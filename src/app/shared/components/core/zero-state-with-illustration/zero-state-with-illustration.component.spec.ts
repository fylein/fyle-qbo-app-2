import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { ExpenseGroupList } from 'src/app/core/models/db/expense-group.model';
import { Expense, ExpenseList } from 'src/app/core/models/db/expense.model';
import { SelectedDateFilter } from 'src/app/core/models/misc/date-filter.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { EXPENSE_GROUP_LISTS } from '../../export-log/export-log-table/export-log-table.fixture';

import { ZeroStateWithIllustrationComponent } from './zero-state-with-illustration.component';

describe('ZeroStateWithIllustrationComponent', () => {
  let component: ZeroStateWithIllustrationComponent;
  let fixture: ComponentFixture<ZeroStateWithIllustrationComponent>;
  let el: DebugElement;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ ZeroStateWithIllustrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroStateWithIllustrationComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl('come'),
      end: new FormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = 'export_log';
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Zero state with page = export_log and with dateFilter data testing', () => {
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl('come'),
      end: new FormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = 'export_log';
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<any>([]);
    fixture.detectChanges();

    const exportLogRow = el.queryAll(By.css('h4'));
    const exportedText1 = exportLogRow[0].nativeElement.innerHTML;
    const exportLogRow1 = el.queryAll(By.css('h5'));
    const exportedText2 = exportLogRow1[0].nativeElement.innerHTML;

    expect(exportLogRow).toBeTruthy();
    expect(' Sorry, no results found! ' || ' No records to show yet! ').toEqual(exportedText1);
    expect(exportedText2).toEqual(' We could not find any exports done on timeline that you have selected ');
  });

  it('Zero state with page = export_log and with !dateFilter data testing', () => {
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl('come'),
      end: new FormControl(['12/2/2021'])
    });
    component.form = form;
    component.page = 'export_log';
    component.searchTerm = 'string';
    component.dateFilter = null;
    component.data = new MatTableDataSource<any>([]);
    fixture.detectChanges();

    const expectedExpenseGroupRow = EXPENSE_GROUP_LISTS[0];

    const exportLogRow = el.queryAll(By.css('h4'));
    const exportedText1 = exportLogRow[0].nativeElement.innerHTML;
    const exportLogRow1 = el.queryAll(By.css('h5'));
    const exportedText2 = exportLogRow1[0].nativeElement.innerHTML;

    expect(exportLogRow).toBeTruthy();
    expect(exportedText1).toEqual(' Sorry, no results found! ');
    expect(exportedText2).toEqual(' Looks like your search term does not match any ' +
    component.searchTerm + ' ');
  });

  it('Zero state with page = mapping and with dateFilter data testing', () => {
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl('come'),
      end: new FormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = 'mapping';
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<any>([]);
    fixture.detectChanges();

    const exportLogRow = el.queryAll(By.css('h4'));
    const exportedText1 = exportLogRow[0].nativeElement.innerHTML;
    const exportLogRow1 = el.queryAll(By.css('h5'));
    const exportedText2 = exportLogRow1[0].nativeElement.innerHTML;

    expect(exportLogRow).toBeTruthy();
    expect(exportedText1).toEqual(' Sorry, no results found! ');
    expect(exportedText2).toEqual(' Looks like your search term does not match any ' +
    component.searchTerm + ' ');
  });

  it('Zero state with page = dashboard and with dateFilter data testing', () => {
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl('come'),
      end: new FormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = 'dashboard';
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    const exportLogRow = el.query(By.css('div > div > h4'));
    const exportedText1 = exportLogRow.nativeElement.innerHTML;

    expect(exportLogRow).toBeTruthy();
    expect('Curious on how exports work in Fyle-QBO integrations?').toEqual(exportedText1);
  });

  it('Zero state with page = dashboard_error and with dateFilter data testing', () => {
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl('come'),
      end: new FormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = 'dashboard_error';
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    const exportLogRow = el.query(By.css('div > div > h4'));
    const exportedText1 = exportLogRow.nativeElement.innerHTML;
    const exportLogRow1 = el.query(By.css('h5'));
    const exportedText2 = exportLogRow1.nativeElement.innerHTML;

    expect(exportLogRow).toBeTruthy();
    expect('Congratulations, you are winning!').toEqual(exportedText1);
    expect(exportedText2).toEqual(' You exports did not face any error. If they do, you can resolve them right here and re-export successfully. ');
  });
});
