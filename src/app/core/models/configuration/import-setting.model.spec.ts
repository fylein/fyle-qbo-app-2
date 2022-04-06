import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ImportSettingModel } from "./import-setting.model";

describe('ImportSettingModel', () => {
  let component: ImportSettingModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ ImportSettingModel ]
    })
    .compileComponents();
  });

  it('Should return ImportSettingModel[]', () => {
    let importSettingsForm= new FormGroup({
      chartOfAccount: new FormControl(['sample']),
      chartOfAccountTypes: new FormControl(['expence']),
      expenseFields: new FormControl(['expence']),
      taxCode: new FormControl(['00']),
      defaultTaxCode:new FormControl(['00']),
      searchOption: new FormControl([])
    })
    expect(ImportSettingModel.constructPayload(importSettingsForm)).toBeTruthy;
  });
  });