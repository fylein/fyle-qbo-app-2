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
  ADVANCED_CONFIGURATION = 'ADVANCED_CONFIGURATION',
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
  MAPPED = 'MAPPED',
  UNMAPPED = 'UNMAPPED',
  ALL = 'ALL'
}

export enum ErrorType {
  EMPLOYEE_MAPPING = 'EMPLOYEE_MAPPING',
  CATEGORY_MAPPING = 'CATEGORY_MAPPING',
  TAX_MAPPING = 'TAX_MAPPING',
  QBO_ERROR = 'QBO_ERROR'
}

export enum FyleField {
  EMPLOYEE = 'EMPLOYEE',
  CATEGORY = 'CATEGORY',
  PROJECT = 'PROJECT',
  COST_CENTER = 'COST_CENTER',
  TAX_GROUP = 'TAX_GROUP',
  CORPORATE_CARD = 'CORPORATE_CARD'
}

export enum QBOField {
  ACCOUNT = 'ACCOUNT',
  CUSTOMER = 'CUSTOMER',
  DEPARTMENT = 'DEPARTMENT',
  CLASS = 'CLASS',
  TAX_CODE = 'TAX_CODE'
}

export enum ExportState {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum TaskLogType {
  CREATING_BILL = 'CREATING_BILL',
  CREATING_EXPENSE = 'CREATING_EXPENSE',
  CREATING_CHECK = 'CREATING_CHECK',
  CREATING_JOURNAL_ENTRY = 'CREATING_JOURNAL_ENTRY',
  CREATING_CREDIT_CARD_PURCHASE = 'CREATING_CREDIT_CARD_PURCHASE',
  CREATING_CREDIT_CARD_CREDIT = 'CREATING_CREDIT_CARD_CREDIT',
  CREATING_DEBIT_CARD_EXPENSE = 'CREATING_DEBIT_CARD_EXPENSE',
  CREATING_BILL_PAYMENT = 'CREATING_BILL_PAYMENT',
  FETCHING_EXPENSE = 'FETCHING_EXPENSE'
}

export enum TaskLogState {
  ENQUEUED = 'ENQUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
  FATAL = 'FATAL',
  COMPLETED = 'COMPLETED',
}

export enum ExportMode {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO'
}

export enum ConfigurationCtaText {
  SAVE = 'Save',
  SAVE_AND_CONTINUE = 'Save and Continue',
  CONTINUE = 'Continue',
  SAVING = 'Saving'
}

export enum RedirectLink {
  FYLE_WEBSITE = 'https://fylehq.com/',
  FYLE_HELP = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle#quickbooks'
}

export enum ClickEvent {
  CONNECT_QBO = 'Connect QBO',
  ONBOARDING_DONE = 'Onboarding Done',
  PREVIEW_QBO_EXPORT = 'Preview QBO Export',
  PREVIEW_FYLE_EXPENSE_FORM = 'Preview Fyle Expense Form',
  HELP_SECTION = 'Help Section',
  EXPORT = 'Export',
  FAILED_EXPORTS = 'Failed Exports',
  SUCCESSFUL_EXPORTS = 'Successful Exports',
  EXPORT_LOG_PAGE_NAVIGATION = 'Export Log Page Navigation',
  MAPPING_PAGE_NAVIGATION = 'Mapping Page Navigation',
  UNMAPPED_MAPPINGS_FILTER = 'Unmapped Mappings Filter',
  MAPPED_MAPPINGS_FILTER = 'Mapped Mappings Filter',
  DISCONNECT_QBO = 'Disconnect QBO',
  SYNC_DIMENSION = 'Sync Dimension'
}

export enum ProgressPhase {
  ONBOARDING = 'Onboarding',
  POST_ONBOARDING = 'Post Onboarding'
}

export enum OnboardingStep {
  CONNECT_QBO = 'Connect QBO',
  MAP_EMPLOYEES = 'Map Employees',
  EXPORT_SETTINGS = 'Export Settings',
  IMPORT_SETTINGS = 'Import Settings',
  ADVANCED_SETTINGS = 'Advanced Settings'
}

export enum UpdateEvent {
  CONNECT_QBO = 'Connect QBO',
  MAP_EMPLOYEES = 'Map Employees',
  EXPORT_SETTINGS = 'Export Settings',
  IMPORT_SETTINGS = 'Import Settings',
  ADVANCED_SETTINGS = 'Advanced Settings',
  PAGE_SIZE = 'Page Size'
}
