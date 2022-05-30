import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DefaultDestinationAttribute } from '../../models/db/general-mapping.model';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private windowReference: Window;

  constructor(private windowService: WindowService) {
    this.windowReference = this.windowService.nativeWindow;
  }

  clearSearchText(form: FormGroup): void {
    form.controls.searchOption.patchValue(null);
  }

  compareObjects(selectedOption: DefaultDestinationAttribute | string, listedOption: DefaultDestinationAttribute | string): boolean {
    if (selectedOption === listedOption) {
      return true;
    } else if (typeof selectedOption === 'object' && typeof listedOption === 'object' && selectedOption.id.toString() === listedOption.id && selectedOption.name === listedOption.name) {
      return true;
    }

    return false;
  }

  openExternalLink(url: string): void {
    this.windowReference.open(url, '_blank');
  }
}
