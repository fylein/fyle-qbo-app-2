export enum EmployeeFieldMapping {
  EMPLOYEE = 'EMPLOYEE',
  VENDOR = 'VENDOR'
}

export enum AutoMapEmployee {
  EMAIL = 'EMAIL',
  NAME = 'NAME',
  EMPLOYEE_CODE = 'EMPLOYEE_CODE'
}

export enum ExpenseState {
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  PAID = 'PAID'
}

export enum ExportDateType {
  LAST_SPENT_AT = 'last_spent_at',
  SPENT_AT = 'spent_at',
  CURRENT_DATE = 'current_date',
  APPROVED_AT = 'approved_at',
  VERIFIED_AT = 'verified_at'
}

export enum ReimbursableExpensesObject {
  BILL = 'BILL',
  CHECK = 'CHECK',
  JOURNAL_ENTRY = 'JOURNAL ENTRY',
  EXPENSE = 'EXPENSE'
}

export enum CorporateCreditCardExpensesObject {
  CREDIT_CARD_PURCHASE = 'CREDIT CARD PURCHASE',
  BILL = 'BILL',
  JOURNAL_ENTRY = 'JOURNAL ENTRY',
  EXPENSE = 'EXPENSE',
  DEBIT_CARD_EXPENSE = 'DEBIT CARD EXPENSE'
}

export enum MappingSourceField {
  PROJECT = 'PROJECT',
  COST_CENTER = 'COST_CENTER',
  TAX_GROUP = 'TAX_GROUP'
}

export enum MappingDestinationField {
  CUSTOMER = 'CUSTOMER',
  CLASS = 'CLASS',
  DEPARTMENT = 'DEPARTMENT',
  TAX_CODE = 'TAX_CODE'
}

export enum ExpenseGroupingFieldOption {
  CLAIM_NUMBER = 'claim_number',
  SETTLEMENT_ID = 'settlement_id',
  EXPENSE_ID = 'expense_id'
}

export enum PaymentSyncDirection {
  FYLE_TO_QBO = 'fyle_to_qbo',
  QBO_TO_FYLE = 'qbo_to_fyle'
}

export enum OnboardingState {
  CONNECTION = 'CONNECTION',
  MAP_EMPLOYEES = 'MAP_EMPLOYEES',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_SETTINGS = 'ADVANCED_SETTINGS',
  COMPLETE = 'COMPLETE'
}

export enum PaginatorPage {
  MAPPING = 'mapping',
  EXPORT_LOG = 'export-log'
}

export enum FyleReferenceType {
  REPORT_ID = 'report_id',
  EXPENSE_REPORT = 'claim_number',
  PAYMENT = 'settlement_id',
  EXPENSE = 'expense_id'
}

export enum MappingState {
  MAPPED = 'Mapped',
  UNMAPPED = 'Unmapped'
}
