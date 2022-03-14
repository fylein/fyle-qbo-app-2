import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  clearSearchText(form: FormGroup): void {
    form.controls.searchOption.patchValue(null);
  }
}
