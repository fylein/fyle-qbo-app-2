import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SnakeCaseToSpaceCase } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { DefaultDestinationAttribute } from '../../models/db/general-mapping.model';
import { WindowService } from './window.service';
import { ConfirmationDialog } from '../../models/misc/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/shared/components/core/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private windowReference: Window;

  constructor(
    private windowService: WindowService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  clearSearchText(form: UntypedFormGroup): void {
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

  getSpaceCasedTitleCase(word: string): string {
    return new SnakeCaseToSpaceCase().transform((new TitleCasePipe().transform(word)));
  }

  openDialogAndSetupRedirection(data: ConfirmationDialog, url: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '551px',
      data: data
    });

    dialogRef.afterClosed().subscribe((ctaClicked: boolean) => {
      if (ctaClicked) {
        this.router.navigate([url]);
      }
    });
  }
}
