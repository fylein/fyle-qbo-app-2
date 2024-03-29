import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportLogChildDialogComponent } from './export-log-child-dialog.component';
import {MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { expense, expenseList, user } from './export-log-child-dialog.fixture';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/services/misc/user.service';
import { ExportLogModule } from '../export-log.module';
import { ExpenseList } from 'src/app/core/models/db/expense.model';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

describe('ExportLogChildDialogComponent', () => {
  let component: ExportLogChildDialogComponent;
  let fixture: ComponentFixture<ExportLogChildDialogComponent>;
  let formBuilder: UntypedFormBuilder;
  beforeEach(async () => {
    const service1 = {
      getUserProfile: () => of(user)
    };
    await TestBed.configureTestingModule({
      declarations: [ ExportLogChildDialogComponent ],
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule, MatDialogModule, HttpClientTestingModule, ExportLogModule],
      providers: [
        UntypedFormBuilder,
        { provide: UserService, useValue: service1},
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          width: '784px',
          height: '974px',
          data: 1,
          position: {
            top: '0px',
            right: '0px'
          }
        }
      },
      {
        provide: MatDialogRef,
        useValue: {}
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogChildDialogComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(UntypedFormBuilder);
    component.data = expense;
    component.expenses = new MatTableDataSource<ExpenseList>(expenseList);
    component.form = formBuilder.group({
      searchOption: ['']
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searchByText function check', () => {
   expect((component as any).searchByText(expenseList[0], '1')).toBeTrue();
  });

  it('setupForm() function check', () => {
    component.form.controls.searchOption.patchValue('food');
    expect((component as any).setupForm()).toBeUndefined();
    fixture.detectChanges();
    component.form.controls.searchOption.patchValue('');
    expect((component as any).setupForm()).toBeUndefined();
  });
});
