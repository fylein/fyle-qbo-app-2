import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MappingList } from 'src/app/core/models/db/mapping.model';
import { EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { MatTableDataSource } from '@angular/material/table';
import { MappingTableComponent } from './mapping-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { destinationAttribute, mappingList } from './mapping-table.fixture';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MappingTableComponent', () => {
  let component: MappingTableComponent;
  let fixture: ComponentFixture<MappingTableComponent>;
  let formBuilder: FormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [MappingTableComponent],
      providers: [FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingTableComponent);
    component = fixture.componentInstance;
    component.mappings = new MatTableDataSource<MappingList>(mappingList);
    formBuilder = TestBed.inject(FormBuilder);
    const fyleQboMappingFormArray = mappingList.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: ['string'],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(fyleQboMappingFormArray),
      searchOption: [''],
      filterOption: [[]],
      cardUpdated: [false]
    });
    const mappingForm = form.controls.fyleQboMapping as FormArray;
    component.mappingForm = mappingForm.controls as FormGroup[];
    component.sourceType = 'EMPLOYEE';
    component.destinationType = EmployeeFieldMapping.EMPLOYEE;
    component.qboData = destinationAttribute;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('save function check', () => {
    expect(component.saveMapping(mappingList[0], destinationAttribute[0], component.mappingForm[0])).toBeUndefined();
    component.sourceType = 'Vendor';
    fixture.detectChanges();
    expect(component.saveMapping(mappingList[0], destinationAttribute[0], component.mappingForm[0])).toBeUndefined();
    component.sourceType = undefined;
    fixture.detectChanges();
    expect(component.saveMapping(mappingList[0], destinationAttribute[0], component.mappingForm[0])).toBeUndefined();
  });

  it('Table data testing', () => {
    const mappingRow = fixture.debugElement.queryAll(By.css('h4'));
    const mappingRowP = fixture.debugElement.queryAll(By.css('td'));
    expect(mappingRow[0].nativeElement.innerText).toBe('Employee in Fyle');
    expect(mappingRow[1].nativeElement.innerText).toBe('Employee in QuickBooks Online');
    expect(mappingRowP[1].children[0].children[0].children[1].children[0].nativeElement.innerText).toBe('');
  });

  it('searchResultHandler function check', () => {
    const data = {
      result: destinationAttribute,
      loading: false
    };
    expect(component.searchResultHandler(data)).toBeUndefined();
  });
});
