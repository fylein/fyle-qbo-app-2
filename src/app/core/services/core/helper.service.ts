import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DefaultDestinationAttribute } from '../../models/db/general-mapping.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  clearSearchText(form: FormGroup): void {
    form.controls.searchOption.patchValue(null);
  }

  compareObjects(selectedOption: DefaultDestinationAttribute, listedOption: DefaultDestinationAttribute): boolean {
    if (selectedOption === listedOption) {
      return true;
    } else if (selectedOption.id.toString() === listedOption.id && selectedOption.name === listedOption.name) {
      return true;
    }

    return false;
  }
}
