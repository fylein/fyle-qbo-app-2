import { getTestBed, TestBed } from '@angular/core/testing';
import { QboConnectorService } from './qbo-connector.service';
import { QBOCredentials } from '../../models/configuration/qbo-connector.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { QBOPreference } from '../../models/misc/qbo-preference.model';
import { environment } from 'src/environments/environment';

describe('QboConnectorService', () => {
  let service: QboConnectorService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QboConnectorService]
    });
    injector = getTestBed();
    service = injector.inject(QboConnectorService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getQBOCredentials service attribuite check', () => {
    const response: QBOCredentials = {
      company_name: "Sandbox Company_FAE",
      country: "GB",
      created_at: new Date("2021-10-05T11:56:13.883015Z"),
      id: 219,
      is_expired: false,
      realm_id: "123146326950399",
      refresh_token: "AB",
      updated_at: new Date("2022-05-06T13:13:25.893837Z"),
      workspace: 1
    };
    service.getQBOCredentials().subscribe((value) => {
      value.refresh_token="AB";
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/credentials/qbo/`
    });
    req.flush(response);
  });

  it('getPreferences Service attribute check', () => {
    const response:QBOPreference = {
      AccountingInfoPrefs: {
        BookCloseDate: "2018-01-31",
        ClassTrackingPerTxn: false,
        ClassTrackingPerTxnLine: true,
        CustomerTerminology: "Customers",
        DepartmentTerminology: "Location",
        FirstMonthOfFiscalYear: "January",
        TaxForm: "1",
        TaxYearMonth: "January",
        TrackDepartments: true,
        UseAccountNumbers: true
      },
      CurrencyPrefs: { MultiCurrencyEnabled: true, HomeCurrency: { value: "GBP" } },
      HomeCurrency: { value: "GBP" },
      MultiCurrencyEnabled: true,
      EmailMessagesPrefs: {
        EstimateMessage: {
          Message: "Please find your estimate details here. Feel free to contact us if you have any questions. We look forward to working with you.\r\n\r\nHave a great day!\r\nSandbox Company_FAE",
          Subject: "Estimate [Estimate No.] from Sandbox Company_FAE"
        },
        InvoiceMessage: {
          Message: "We appreciate your business. Please find your invoice details here. Feel free to contact us if you have any questions.\r\n\r\nHave a great day!\r\nSandbox Company_FAE",
          Subject: "Invoice [Invoice No.] from Sandbox Company_FAE"
        },
        SalesReceiptMessage: {
          Message: "Please review the sales receipt below.\r\nWe appreciate it very much.\r\n\r\nHave a great day!\r\nSandbox Company_FAE",
          Subject: "Sales Receipt [Sales Receipt No.] from Sandbox Company_FAE"
        },
        StatementMessage: {
          Message: "Your statement is attached.  Please remit payment at your earliest convenience.\r\nThank you for your business - we appreciate it very much.\r\n\r\nHave a great day!\r\nSandbox Company_FAE",
          Subject: "Statement from Sandbox Company_FAE"
        }
      },
        Id: "1",
        MetaData: { CreateTime: "2019-02-15T02:19:34-08:00", LastUpdatedTime: "2020-09-09T01:43:49-07:00" },
        OtherPrefs: {
          NameValue: [
            { Name: "SalesFormsPrefs.DefaultItem", Value: "1" },
            { Name: "DTXCopyMemo", Value: "false" },
            { Name: "UncategorizedAssetAccountId", Value: "77" },
            { Name: "UncategorizedIncomeAccountId", Value: "78" },
            { Name: "UncategorizedExpenseAccountId", Value: "79" },
            { Name: "SFCEnabled", Value: "true" },
            { Name: "Language", Value: "en" },
            { Name: "DateFormat", Value: "Date Month Year separated by a slash" },
            { Name: "DateFormatMnemonic", Value: "DDMMYYYY_SEP_SLASH" },
            { Name: "NumberFormat", Value: "US Number Format" },
            { Name: "NumberFormatMnemonic", Value: "US_NB" },
            { Name: "DataPartner", Value: "false" },
            { Name: "Vendor1099Enabled", Value: "false" },
            { Name: "TimeTrackingFeatureEnabled", Value: "true" },
            { Name: "FDPEnabled", Value: "true" },
            { Name: "isDTXOnStage", Value: "false" },
            { Name: "ProjectsEnabled", Value: "true" },
            { Name: "VendorAndPurchasesPrefs.UseCustomTxnNumbers", Value: "false" },
            { Name: "MTDEnabled", Value: "false" },
            { Name: "WarnDuplicateCheckNumber", Value: "true" },
            { Name: "WarnDuplicateBillNumber", Value: "false" },
            { Name: "WarnDuplicateJournalNumber", Value: "false" },
            { Name: "SignoutInactiveMinutes", Value: "180" },
            { Name: "AccountingInfoPrefs.DefaultTaxRateSelection", Value: "1" },
            { Name: "AccountingInfoPrefs.ShowAccountNumbers", Value: "true" },
            { Name: "VendorAndPurchasesPrefs.PurchaseOrderEnabled", Value: "true" },
            { Name: "VendorAndPurchasesPrefs.MarkupOnBillableExpenseEnabled", Value: "false" },
            { Name: "SalesFormsPrefs.AllowGratuity", Value: "false" }
          ]
        },
        ProductAndServicesPrefs: { ForSales: true, ForPurchase: true, QuantityWithPriceAndRate: true, QuantityOnHand: true },
        ReportPrefs: { ReportBasis: "Accrual", CalcAgingReportFromTxnDate: false },
        SalesFormsPrefs: {
          AllowDeposit: true,
          AllowDiscount: true,
          AllowEstimates: true,
          AllowServiceDate: false,
          AllowShipping: false,
          AutoApplyCredit: true,
          AutoApplyPayments: true,
          CustomField: [
            {
              CustomField: [
                { Name: "SalesFormsPrefs.UseSalesCustom3", Type: "BooleanType", BooleanValue: false },
                { Name: "SalesFormsPrefs.UseSalesCustom1", Type: "BooleanType", BooleanValue: true },
                { Name: "SalesFormsPrefs.UseSalesCustom2", Type: "BooleanType", BooleanValue: false }]
            },
            {
              CustomField: [
                { Name: "SalesFormsPrefs.SalesCustomName1", Type: "StringType", StringValue: "Your Reference" }
              ]
            }
          ],
          CustomTxnNumbers: true,
          DefaultCustomerMessage: "Please send payment to HSBC Account 29299999 Sort Code 00-00-00",
          DefaultDiscountAccount: "51",
          DefaultTerms: { value: "3" },
          ETransactionAttachPDF: false,
          ETransactionPaymentEnabled: false,
          EmailCopyToCompany: false,
          EstimateMessage: "This estimate is valid for 30 days only.",
          IPNSupportEnabled: false,
          UsingPriceLevels: false,
          UsingProgressInvoicing: false,
          SyncToken: "37"
        },
        TaxPrefs: { UsingSalesTax: true },
        TimeTrackingPrefs: { UseServices: false, BillCustomers: true, ShowBillRateToAll: false, MarkTimeEntriesBillable: true },
        VendorAndPurchasesPrefs: {
          BillableExpenseTracking: true,
          DefaultMarkup: 20,
          DefaultMarkupAccount: { value: "72" },
          POCustomField: [
            {
              CustomField: [
                { Name: "PurchasePrefs.UsePurchaseCustom1", Type: "BooleanType", BooleanValue: false },
                { Name: "PurchasePrefs.UsePurchaseCustom2", Type: "BooleanType", BooleanValue: false },
                { Name: "PurchasePrefs.UsePurchaseCustom3", Type: "BooleanType", BooleanValue: false }]
            }
          ],
          TrackingByCustomer: true
        },
        domain: "QBO",
        sparse: false
      };
    service.getPreferences().subscribe((value) => {
        expect(value).toEqual(response);
      });
      const req = httpMock.expectOne({
        method: 'GET',
        url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/preferences/`
      });
      req.flush(response);
    });
});
