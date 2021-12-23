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

export enum ReimbursableExportDateType {
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
  EXPENSE = 'EXPENSE'
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
