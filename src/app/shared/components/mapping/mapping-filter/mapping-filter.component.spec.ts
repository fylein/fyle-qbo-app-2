import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, UntypedFormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MappingList } from 'src/app/core/models/db/mapping.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { mappingList } from '../mapping-table/mapping-table.fixture';

import { MappingFilterComponent } from './mapping-filter.component';

describe('MappingFilterComponent', () => {
  let component: MappingFilterComponent;
  let fixture: ComponentFixture<MappingFilterComponent>;
  let formBuilder: UntypedFormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      declarations: [ MappingFilterComponent ],
      providers: [UntypedFormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingFilterComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(UntypedFormBuilder);
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
      searchOption: [['Fyle', 'Apple']],
      filterOption: [[]],
      cardUpdated: [false]
    });
    component.form = form;
    component.page = 'Employee Mapping';
    component.searchTerm = 'Fyle';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addAllFilterHandler function check', () => {
    spyOn(component.mappingFilterUpdateHandler, 'emit');
    component.addAllFilterHandler();
    expect(component.mappingFilterUpdateHandler.emit).toHaveBeenCalled();
    expect(component.mappingFilterUpdateHandler.emit).toHaveBeenCalledWith({});
  });

  it('filterOptionUpdateHandler function check', () => {
    spyOn(component.mappingFilterUpdateHandler, 'emit');
    component.filterOptionUpdateHandler('F');
    fixture.detectChanges();
    expect(component.mappingFilterUpdateHandler.emit).toHaveBeenCalled();
    expect(component.mappingFilterUpdateHandler.emit).toHaveBeenCalledWith({});
    expect(component.form.value.filterOption).toEqual(['F']);
    component.filterOptionUpdateHandler('F');
    fixture.detectChanges();
    expect(component.form.value.filterOption).toEqual([]);
  });

  it('HTML check', () => {
    const mappingH5 = fixture.debugElement.query(By.css('h5'));
    expect(mappingH5.nativeElement.innerText).toBe('All');
    component.form.value.filterOption.push('A');
    fixture.detectChanges();
    const mappingAlpha = fixture.debugElement.queryAll(By.css('h5'));
    expect(mappingAlpha.length).toBeGreaterThanOrEqual(25);
  });
});
