import { TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { AutoMapEmployee, CCCExpenseState, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseState, MappingDestinationField, MappingSourceField, ReimbursableExpensesObject } from '../enum/enum.model';
import { CloneSettingModel, CloneSettingPost } from './clone-setting.model';
import { ImportSettingModel } from './import-setting.model';
import { MappingSetting } from '../db/mapping-setting.model';
describe('CloneSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UntypedFormGroup],
      declarations: [ CloneSettingModel ]
    })
    .compileComponents();
  });

  it('Should return CloneSettingModel[]', () => {
    const expence_Field = [{
      source_field: 'PROJECT',
      destination_field: 'CLASS',
      import_to_fyle: true,
      is_custom: true,
      source_placeholder: 'Fyle'
    }];

    const cloneSettingForm= new UntypedFormGroup({
      employeeMapping: new UntypedFormControl('EMPLOYEE'),
      autoMapEmployee: new UntypedFormControl('EMPLOYEE_CODE'),
      expenseState: new UntypedFormControl('PAID'),
      cccExpenseState: new UntypedFormControl('PAID'),
      reimbursableExpense: new UntypedFormControl(true),
      reimbursableExportType: new UntypedFormControl('BILL'),
      reimbursableExportGroup: new UntypedFormControl('sample'),
      reimbursableExportDate: new UntypedFormControl(null),
      creditCardExpense: new UntypedFormControl(true),
      creditCardExportType: new UntypedFormControl('BILL'),
      creditCardExportGroup: new UntypedFormControl('sipper'),
      creditCardExportDate: new UntypedFormControl(null),
      bankAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      defaultCCCAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      accountsPayable: new UntypedFormControl({id: '1', name: 'Fyle'}),
      defaultCreditCardVendor: new UntypedFormControl({id: '1', name: 'Fyle'}),
      qboExpenseAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      defaultDebitCardAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      searchOption: new UntypedFormControl([]),
      chartOfAccount: new UntypedFormControl(true),
      chartOfAccountTypes: new UntypedFormControl([{enabled: true, name: 'expence'}]),
      expenseFields: new UntypedFormControl(expence_Field),
      importItems: new UntypedFormControl(true),
      taxCode: new UntypedFormControl(true),
      defaultTaxCode: new UntypedFormControl({id: '1', name: 'Fyle'}),
      importVendorsAsMerchants: new UntypedFormControl(true),
      paymentSync: new UntypedFormControl(true),
      billPaymentAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      changeAccountingPeriod: new UntypedFormControl(true),
      singleCreditLineJE: new UntypedFormControl(true),
      autoCreateVendors: new UntypedFormControl(true),
      autoCreateMerchantsAsVendors: new UntypedFormControl(true),
      exportSchedule: new UntypedFormControl(true),
      exportScheduleFrequency: new UntypedFormControl(10),
      memoStructure: new UntypedFormControl(['Fyle']),
      emails: new UntypedFormControl([]),
      addedEmail: new UntypedFormControl([]),
      skipExport: new UntypedFormControl(true)
    });

    const cloneSettingPayload: CloneSettingPost= {
      employee_mappings: {
        workspace_general_settings: {
          employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
          auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE
        }
      },
      import_settings: {
          workspace_general_settings: {
            import_categories: true,
            import_items: true,
            charts_of_accounts: ImportSettingModel.formatChartOfAccounts([{enabled: true, name: 'expence'}]),
            import_tax_codes: true,
            import_vendors_as_merchants: true
          },
          general_mappings: {
            default_tax_code: {id: '1', name: 'Fyle'}
          },
          mapping_settings: [{
            source_field: MappingSourceField.PROJECT,
            destination_field: MappingDestinationField.CLASS,
            import_to_fyle: true,
            is_custom: false,
            source_placeholder: 'Fyle'
          },
          {
            source_field: MappingSourceField.COST_CENTER,
            destination_field: MappingDestinationField.CUSTOMER,
            import_to_fyle: false,
            is_custom: false,
            source_placeholder: null
          }]
      },
      export_settings: {
        expense_group_settings: {
          expense_state: ExpenseState.PAID,
          ccc_expense_state: CCCExpenseState.PAID,
          reimbursable_expense_group_fields: ['sample'],
          reimbursable_export_date_type: null,
          corporate_credit_card_expense_group_fields: ['sipper'],
          ccc_export_date_type: null
        },
        workspace_general_settings: {
          reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
          corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL
        },
        general_mappings: {
          bank_account: {id: '1', name: 'Fyle'},
          default_ccc_account: {id: '1', name: 'Fyle'},
          accounts_payable: {id: '1', name: 'Fyle'},
          default_ccc_vendor: {id: '1', name: 'Fyle'},
          qbo_expense_account: {id: '1', name: 'Fyle'},
          default_debit_card_account: {id: '1', name: 'Fyle'}
        }
      },
      advanced_configurations: {
        workspace_general_settings: {
          sync_fyle_to_qbo_payments: false,
          sync_qbo_to_fyle_payments: false,
          auto_create_destination_entity: true,
          auto_create_merchants_as_vendors: true,
          je_single_credit_line: true,
          change_accounting_period: true,
          memo_structure: ['Fyle']
        },
        general_mappings: {
          bill_payment_account: {id: '1', name: 'Fyle'}
        },
        workspace_schedules: {
          enabled: true,
          interval_hours: 10,
          emails_selected: [],
          additional_email_options: []
        }
      }
    };

    const existingMappingSettings: MappingSetting[] = [{
      id: 21,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1,
      source_field: MappingSourceField.COST_CENTER,
      destination_field: MappingDestinationField.CUSTOMER,
      import_to_fyle: false,
      is_custom: false,
      source_placeholder: null
    }];

    expect(CloneSettingModel.constructPayload(cloneSettingForm, existingMappingSettings)).toEqual(cloneSettingPayload);
  });
});
