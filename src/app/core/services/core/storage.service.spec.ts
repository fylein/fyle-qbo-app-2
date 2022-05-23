import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Set in localstorage', () => {
    const data = {
      id: '1',
      name: 'Fyle'
    };
    service.set('test-data',data);
    const result = service.get('test-data');
    expect(result).toBeDefined();
  });

  it('Get in localstorage', () => {
    const data = {
      id: '1',
      name: 'Fyle'
    };
    service.set('test-data',data);
    const result = service.get('test-data');
    expect(result).toEqual(data);
  });

  it('remove in localstroage', () => {
    service.remove('test-data');
    const result = service.get('test-data');
    expect(result).toBeNull(); 
  });  
});
