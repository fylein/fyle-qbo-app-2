import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { DefaultDestinationAttribute } from '../../models/db/general-mapping.model';

import { HelperService } from './helper.service';
import { Router } from '@angular/router';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('HelperService', () => {
  let service: HelperService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ],
      imports: [MatDialogModule]
    });
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clearSearchText service check', () => {
    const form=new FormGroup({
      searchOption: new FormControl('fyle')
    });
    service.clearSearchText(form);
    expect(form.controls.searchOption.value).toBeNull();
  });

  it('compareObjects service check for true', () => {
    const source_field:DefaultDestinationAttribute={
      id: '1',
      name: 'fyle'
    };
    const destination_field:DefaultDestinationAttribute={
      id: '1',
      name: 'fyle'
    };
    expect(service.compareObjects(source_field, destination_field)).toBeTrue();
  });

  it('compareObjects service check for false', () => {
    const source_field:DefaultDestinationAttribute={
      id: '1',
      name: 'fyle'
    };
    const destination_field:DefaultDestinationAttribute={
      id: '2',
      name: 'fyler'
    };
    expect(service.compareObjects(source_field, destination_field)).toBeFalse();
  });

  it('compareObjects service check for true for type', () => {
    const source_field = 'Fyle';
    const destination_field= 'Fyle';
    expect(service.compareObjects(source_field, destination_field)).toBeTrue();
  });

  it('should convert snake cased upper case to title cased space case', () => {
    expect(service.getSpaceCasedTitleCase('COST_CENTER')).toBe('Cost center');
  });

});
