import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { QboConnectorService } from './qbo-connector.service';

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
});
