import { TestBed } from '@angular/core/testing';
import { PaginatorPage } from '../../models/enum/enum.model';

import { PaginatorService } from './paginator.service';

describe('PaginatorService', () => {
  let service: PaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('pageinator service', () => {
    const limit = localStorage.getItem('page-size.export-log');
    const result = service.getPageSize(PaginatorPage.EXPORT_LOG);
    if (limit){
      const expected = {
        offset: 0,
        limit: 1
      };
      expect(result).toEqual(expected);
    } else {
      const expected = {
        offset: 0,
        limit: 50
      };
      expect(result).toEqual(expected);
    }
  });

  it('storePageSize service', () => {
    service.storePageSize(PaginatorPage.EXPORT_LOG, 1);
    const result = localStorage.getItem(`page-size.${PaginatorPage.EXPORT_LOG}`);
    expect(result).toEqual('1');
  });
});
