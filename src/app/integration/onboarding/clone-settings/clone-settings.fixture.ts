import { CloneSetting, CloneSettingExist, CloneSettingPost } from "src/app/core/models/configuration/clone-setting.model";
import { GroupedDestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import {AutoMapEmployee, CCCExpenseState, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseState, ExportDateType, MappingDestinationField, MappingSourceField, ReimbursableExpensesObject } from "src/app/core/models/enum/enum.model";

export const mockCloneSettingExist: CloneSettingExist = {
    is_available: true,
    workspace_name: 'Fyle for Ashwin'
};

export const mockCloneSettingsGet: CloneSetting = {
    workspace_id: 1,
    export_settings: {
        expense_group_settings: {
          reimbursable_expense_group_fields: null,
          corporate_credit_card_expense_group_fields: null,
          expense_state: ExpenseState.PAID,
          reimbursable_export_date_type: null,
          ccc_expense_state: CCCExpenseState.PAID,
          ccc_export_date_type: null
        },
        workspace_general_settings: {
            reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
            corporate_credit_card_expenses_object: null,
            is_simplify_report_closure_enabled: false
        },
        general_mappings: {
          accounts_payable: { name: 'fyle', id: "1" },
          bank_account: { name: 'fyle', id: "1" },
          qbo_expense_account: { name: 'fyle', id: "1" },
          default_ccc_account: { name: 'fyle', id: "1" },
          default_ccc_vendor: { name: 'fyle', id: "1" },
          default_debit_card_account: { name: 'fyle', id: "1" }
        },
        workspace_id: 1
    },
    import_settings: {
        general_mappings: {
            id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1,
            accounts_payable: { name: 'fyle', id: "1" },
            bank_account: { name: 'fyle', id: "1" },
            qbo_expense_account: { name: 'fyle', id: "1" },
            default_ccc_account: { name: 'fyle', id: "1" },
            default_ccc_vendor: { name: 'fyle', id: "1" },
            default_debit_card_account: { name: 'fyle', id: "1" },
            default_tax_code: { name: 'fyle', id: "1" },
            bill_payment_account: { name: 'fyle', id: "1" }
        },
        mapping_settings: [{
            id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1,
            source_field: MappingSourceField.TAX_GROUP,
            destination_field: MappingSourceField.PROJECT,
            import_to_fyle: true,
            is_custom: true,
            source_placeholder: null
          },
          {
            id: 2,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1,
            source_field: 'CUSTOM_FIELD',
            destination_field: MappingDestinationField.CLASS,
            import_to_fyle: false,
            is_custom: true,
            source_placeholder: null
        }],
        workspace_general_settings: {
            auto_create_destination_entity: true,
            auto_create_merchants_as_vendors: true,
            memo_structure: [],
            change_accounting_period: true,
            charts_of_accounts: ['Expense'],
            created_at: new Date("2022-04-27T11:07:17.694377Z"),
            id: 1,
            employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
            import_vendors_as_merchants: true,
            import_items: true,
            je_single_credit_line: false,
            import_categories: false,
            import_projects: false,
            import_tax_codes: false,
            skip_cards_mapping: false,
            sync_fyle_to_qbo_payments: false,
            sync_qbo_to_fyle_payments: false,
            updated_at: new Date("2022-04-28T12:48:39.150177Z"),
            workspace: 1,
            reimbursable_expenses_object: null,
            corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE,
            auto_map_employees: AutoMapEmployee.EMAIL,
            is_simplify_report_closure_enabled: true
        },
        workspace_id: 1
    },
    advanced_configurations: {
        workspace_general_settings: {
          sync_fyle_to_qbo_payments: true,
          sync_qbo_to_fyle_payments: false,
          auto_create_destination_entity: true,
          change_accounting_period: true,
          je_single_credit_line: true,
          auto_create_merchants_as_vendors: true,
          memo_structure: []
        },
        general_mappings: {
          bill_payment_account: {id: '1', name: 'Fyle'}
        },
        workspace_schedules: {
          enabled: true,
          interval_hours: 10,
          emails_selected: [],
          additional_email_options: []
        },
        workspace_id: 1
    },
    employee_mappings: {
      workspace_id: 1,
      workspace_general_settings: {
        auto_map_employees: AutoMapEmployee.NAME,
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE
      }
    }
  };

export const mockGroupedDestinationAttribtues: GroupedDestinationAttribute = {
    BANK_ACCOUNT: [{
        id: 3,
        attribute_type: 'BANK_ACCOUNT',
        display_name: "string",
        value: "Fyle",
        destination_id: "1",
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 2,
        detail: {
        email: 'String',
        fully_qualified_name: 'string'
        }
    }],
    TAX_CODE: [],
    CREDIT_CARD_ACCOUNT: [],
    ACCOUNTS_PAYABLE: [],
    VENDOR: [],
    ACCOUNT: []
};
