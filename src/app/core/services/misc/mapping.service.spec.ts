import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MappingService } from './mapping.service';

describe('MappingService', () => {
  let service: MappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule]
    });
    service = TestBed.inject(MappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
