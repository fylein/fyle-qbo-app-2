import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { QboConnectorService } from './qbo-connector.service';
import { QboConnectorPost } from '../../models/configuration/qbo-connector.model';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';

describe('QboConnectorService', () => {
  let service: QboConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
      },
      JwtHelperService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }]
    });
    service = TestBed.inject(QboConnectorService);
  });

  function checking(value:any){
    let keys:string[]=[]
    for(let key of Object.keys(value)){
      
        keys.push(key);
      
    }
    keys = keys.sort();
    return keys
  }
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPreferences Service check', () => {
    expect(service.getPreferences()).toBeTruthy();
  })

  it('disconnectQBOConnection service check', () => {
    expect(service.disconnectQBOConnection()).toBeTruthy();
  })

  it('getQBOCredentials service check', () => {
    expect(service.getQBOCredentials()).toBeTruthy();
  })

  it('getQBOCredentials service attribuite check', () => {
    const responseKeys=['id','refresh_token','is_expired','realm_id','country','company_name','created_at','updated_at','workspace','workspace_id'].sort();
    service.getQBOCredentials().subscribe((value) => {
      let keys = checking(value);
      expect(keys).toEqual(responseKeys);
    })
  })

  it('getPreferences Service attribute check', () => {
    const responseKeys = ['AccountingInfoPrefs','ProductAndServicesPrefs',
      'SalesFormsPrefs',
      'EmailMessagesPrefs',
      'VendorAndPurchasesPrefs',
      'TimeTrackingPrefs',
      'TaxPrefs',
      'CurrencyPrefs',
      'ReportPrefs',
      'OtherPrefs',
      'domain',
      'sparse',
      'Id',
      'SyncToken',
      'MetaData','workspace_id'].sort();
    service.getPreferences().subscribe((value) => {
      let keys = checking(value);
      expect(keys).toEqual(responseKeys);
    })
  })

  it('service check', () => {
    const qboConnector:QboConnectorPost = {
      code: 'Fyle',
      realm_id: 'Fyle',
      redirect_uri: 'https://app.fyle.tech'
    };
    expect(service.connectQBO(qboConnector)).toBeTruthy();
  })

});
