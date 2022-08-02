import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMappingComponent } from './custom-mapping.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { postMappingSettingResponse } from 'src/app/core/services/misc/mapping.service.fixture';
import { fyleExpenseFields, mappedRowsFormArray, mappingRow, mappingSettingResponse } from './custom-mapping.fixture';
import { FyleField, MappingDestinationField, MappingSourceField, QBOField } from 'src/app/core/models/enum/enum.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomMappingComponent', () => {
  let component: CustomMappingComponent;
  let fixture: ComponentFixture<CustomMappingComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let formbuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {
    const service1 = {
      postMappingSettings: () => of(postMappingSettingResponse),
      emitWalkThroughTooltip: () => undefined,
      refreshMappingPages: () => undefined,
      deleteMappingSetting: () => of({}),
      getMappingSettings: () => of(mappingSettingResponse),
      getFyleExpenseFields: () => of(fyleExpenseFields)
    };

    await TestBed.configureTestingModule({
      imports: [ MatDialogModule, NoopAnimationsModule, RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, SharedModule],
      declarations: [ CustomMappingComponent ],
      providers: [ FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: MappingService, useValue: service1 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMappingComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);

    component.mappingSettingForm = formbuilder.group({
      mappingSetting: formbuilder.array([])
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return mappingSetting as a Form Array', () => {
    const response = component.mappingSettingForm.get('mappingSetting') as FormArray;
    expect(component.mappingSetting).toEqual(response);
  });

  it('should set mappingRow.isDeleteButtonAllowed as false', () => {
    component.showDeleteButton(mappingRow, false);
    fixture.detectChanges();
    expect(mappingRow.isDeleteButtonAllowed).toBeFalse();
  });

  it('should set mappingRow.isDeleteButtonAllowed as true', () => {
    mappingRow.isDeleteButtonAllowed = false;
    component.showDeleteButton(mappingRow, true);
    fixture.detectChanges();
    expect(mappingRow.isDeleteButtonAllowed).toBeTrue();
  });

  it('should delete mapping setting', () => {
    component.mappingSettingForm.patchValue({
      mappingSetting: mappedRowsFormArray
    });
    fixture.detectChanges();
    expect(component.deleteMappingSetting(0)).toBeUndefined();
  });

  it('should clear mapping row', () => {
    component.mappingSettingForm.patchValue({
      mappingSetting: mappedRowsFormArray
    });
    const previousLength = component.mappingSettingForm.get('mappingSetting')?.value.length;
    expect(component.clearMappingRow(0)).toBeUndefined();
    expect(component.mappingSettingForm.get('mappingSetting')?.value.length).toEqual(previousLength - 1);
  });

  it('should save mapping setting', () => {
    component.mappingSettingForm.patchValue({
      mappingSetting: mappedRowsFormArray
    });
    fixture.detectChanges();
    expect(component.saveMappingSetting(0)).toBeUndefined();
  });

  it('should update mapping row', () => {
    component.mappingSettingForm.patchValue({
      mappingSetting: mappedRowsFormArray
    });
    fixture.detectChanges();

    expect(component.updateMappingRow(0, MappingDestinationField.DEPARTMENT)).toBeUndefined();
    expect(component.mappingRows[0].qboField).toBe(MappingDestinationField.DEPARTMENT);

    expect(component.updateMappingRow(0, '', FyleField.COST_CENTER)).toBeUndefined();
    expect(component.mappingRows[0].fyleField).toBe(FyleField.COST_CENTER);
  });

  it('should create mapping row', () => {
    component.showMappingList = false;
    fixture.detectChanges();
    expect(component.createMappingRow()).toBeUndefined();
    expect(component.showMappingList).toBeTrue();
  });
});
