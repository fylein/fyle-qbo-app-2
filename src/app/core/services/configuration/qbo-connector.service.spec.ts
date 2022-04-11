import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { QboConnectorService } from './qbo-connector.service';
import { QboConnectorPost } from '../../models/configuration/qbo-connector.model';

describe('QboConnectorService', () => {
  let service: QboConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(QboConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPreferences Service check', () => {
    expect(service.getPreferences()).toBeTruthy()
  })

  it('disconnectQBOConnection service check', () => {
    expect(service.disconnectQBOConnection()).toBeTruthy()
  })

  it('getQBOCredentials service check', () => {
    expect(service.getQBOCredentials()).toBeTruthy()
  })

  it('service check', () => {
    const qboConnector:QboConnectorPost = {
      code: 'Fyle',
      realm_id: 'Fyle',
      redirect_uri: 'https://app.fyle.tech'
    }
    expect(service.connectQBO(qboConnector)).toBeTruthy()
  })
});
