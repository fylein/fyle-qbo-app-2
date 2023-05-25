import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMappingComponent } from './custom-mapping.component';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UntypedFormArray, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { postMappingSettingResponse } from 'src/app/core/services/misc/mapping.service.fixture';
import { fyleExpenseFields, mappedRowsFormArray, mappedRowsFormArray1, mappedRowsFormArray2, mappingRow, mappingSettingResponse } from './custom-mapping.fixture';
import { FyleField, MappingDestinationField, MappingSourceField, QBOField } from 'src/app/core/models/enum/enum.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('CustomMappingComponent', () => {
  let component: CustomMappingComponent;
  let fixture: ComponentFixture<CustomMappingComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let formbuilder: UntypedFormBuilder;
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
      providers: [ UntypedFormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: MappingService, useValue: service1 },
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
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMappingComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(UntypedFormBuilder);
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
    const response = component.mappingSettingForm.get('mappingSetting') as UntypedFormArray;
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
      mappingSetting: mappedRowsFormArray2
    });
    fixture.detectChanges();
    expect(component.deleteMappingSetting(0)).toBeUndefined();
  });

  it('should clear mapping row', () => {
    component.mappingSettingForm.patchValue({
      mappingSetting: mappedRowsFormArray
    });
    component.mappingRows = [mappingRow];
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

    component.mappingSettingForm.patchValue({
      mappingSetting: mappedRowsFormArray1
    });
    fixture.detectChanges();
    expect(component.saveMappingSetting(0)).toBeUndefined();

    expect((component as any).constructPayloadAndSave(mappedRowsFormArray2[0])).toBeUndefined();
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
