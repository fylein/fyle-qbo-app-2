import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { ExpenseGroupList } from 'src/app/core/models/db/expense-group.model';
import { ZeroStatePage } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/misc/date-filter.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { EXPENSE_GROUP_LISTS } from '../../export-log/export-log-table/export-log-table.fixture';

import { ZeroStateWithIllustrationComponent } from './zero-state-with-illustration.component';

describe('ZeroStateWithIllustrationComponent', () => {
  let component: ZeroStateWithIllustrationComponent;
  let fixture: ComponentFixture<ZeroStateWithIllustrationComponent>;
  let el: DebugElement;
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
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl('come'),
      end: new UntypedFormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = ZeroStatePage.export_log;
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Zero state with page = export_log and with dateFilter data testing', () => {
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl('come'),
      end: new UntypedFormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = ZeroStatePage.export_log;
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<any>([]);
    fixture.detectChanges();

    const zeroState = el.queryAll(By.css('h4'));
    const zeroStateText1 = zeroState[0].nativeElement.innerHTML;
    const zeroState1 = el.queryAll(By.css('h5'));
    const zeroStateText2 = zeroState1[0].nativeElement.innerHTML;

    expect(zeroState).toBeTruthy();
    expect(zeroStateText1).toEqual(' Sorry, no results found! ');
    expect(zeroStateText2).toEqual(' We could not find any exports done on timeline that you have selected ');
  });

  it('Zero state with page = export_log and with !dateFilter data testing', () => {
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl('come'),
      end: new UntypedFormControl(['12/2/2021'])
    });
    component.form = form;
    component.page = ZeroStatePage.export_log;
    component.searchTerm = 'string';
    component.dateFilter = null;
    component.data = new MatTableDataSource<any>([]);
    fixture.detectChanges();

    const zeroState = el.queryAll(By.css('h4'));
    const zeroStateText1 = zeroState[0].nativeElement.innerHTML;
    const zeroState1 = el.queryAll(By.css('h5'));
    const zeroStateText2 = zeroState1[0].nativeElement.innerHTML;

    expect(zeroState).toBeTruthy();
    expect(zeroStateText1).toEqual(' Sorry, no results found! ');
    expect(zeroStateText2).toEqual(' Looks like your search term does not match any ' +
    component.searchTerm + ' ');
  });

  it('Zero state with page = mapping and with dateFilter data testing', () => {
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl('come'),
      end: new UntypedFormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = ZeroStatePage.mapping;
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<any>([]);
    fixture.detectChanges();

    const zeroState = el.queryAll(By.css('h4'));
    const zeroStateText1 = zeroState[0].nativeElement.innerHTML;
    const zeroState1 = el.queryAll(By.css('h5'));
    const zeroStateText2 = zeroState1[0].nativeElement.innerHTML;

    expect(zeroState).toBeTruthy();
    expect(zeroStateText1).toEqual(' Sorry, no results found! ');
    expect(zeroStateText2).toEqual(' Looks like your search term does not match any ' +
    component.searchTerm + ' ');
  });

  it('Zero state with page = dashboard and with dateFilter data testing', () => {
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl('come'),
      end: new UntypedFormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = ZeroStatePage.dashboard;
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    const zeroState = el.query(By.css('div > div > h4'));
    const zeroStateText1 = zeroState.nativeElement.innerHTML;

    expect(zeroState).toBeTruthy();
    expect(zeroStateText1).toEqual('Curious on how exports work in Fyle - QuickBooks Online Integration?');
  });

  it('Zero state with page = dashboard_error and with dateFilter data testing', () => {
    const form= new UntypedFormGroup({
      dateRange: new UntypedFormControl([3]),
      start: new UntypedFormControl(['12/1/2021']),
      searchOption: new UntypedFormControl('come'),
      end: new UntypedFormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = ZeroStatePage.dashboard_error;
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    const zeroState = el.query(By.css('div > div > h4'));
    const zeroStateText1 = zeroState.nativeElement.innerHTML;
    const zeroState1 = el.query(By.css('h5'));
    const zeroStateText2 = zeroState1.nativeElement.innerHTML;

    expect(zeroState).toBeTruthy();
    expect(zeroStateText1).toEqual('Congratulations, you are winning!');
    expect(zeroStateText2).toEqual(' You exports did not face any error. If they do, you can resolve them right here and re-export successfully. ');
  });
});
