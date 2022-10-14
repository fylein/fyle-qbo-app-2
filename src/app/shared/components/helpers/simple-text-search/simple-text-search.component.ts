import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeFieldMapping, QBOField, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-simple-text-search',
  templateUrl: './simple-text-search.component.html',
  styleUrls: ['./simple-text-search.component.scss']
})
export class SimpleTextSearchComponent implements OnInit, OnChanges {

  @Input() form: FormGroup;

  @Input() showBackgroundColor: boolean = true;

  @Input() placeholder: string = 'Search';

  @Input() page: SimpleSearchPage;

  @Input() destinationType: string | undefined;

  @Input() searchType: SimpleSearchType;

  @Output() searchResult: EventEmitter<string> =   new EventEmitter();

  private simpleSearchEventRecorded: boolean = false;

  @Input() isSearchInProgress: boolean = false;

  constructor(
    private trackingService: TrackingService,
    private mappingService: MappingService
  ) { }

  clearText(): void {
    this.form.controls.searchOption.patchValue(null);
    if (this.searchType === SimpleSearchType.SELECT_FIELD && this.page === SimpleSearchPage.MAPPING){
      this.searchResult.emit(this.form.controls.searchOption.value);
    }
  }

  private trackSimpleSearch(isAdvancedSearch: boolean): void {
    if (isAdvancedSearch){
      this.form?.controls.searchOption?.valueChanges.subscribe((searchString: string) => {
        if (!this.simpleSearchEventRecorded && searchString) {
            this.trackingService.onAdvancedSearch({page: this.page, searchType: this.searchType});
            this.simpleSearchEventRecorded = true;
          }
      });
    } else {
      this.form?.controls.searchOption?.valueChanges.subscribe((searchString: string) => {
        if (!this.simpleSearchEventRecorded && searchString) {
            this.trackingService.onSimpleSearch({page: this.page, searchType: this.searchType});
            this.simpleSearchEventRecorded = true;
          }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.form) {
      if (this.searchType === SimpleSearchType.SELECT_FIELD && this.page === SimpleSearchPage.MAPPING) {
        this.form?.controls.searchOption?.valueChanges.pipe(
        debounceTime(1500)
        ).subscribe((search_term: string) => {
            this.searchResult.emit(search_term);
            this.trackSimpleSearch(true);
        });
      } else {
        this.trackSimpleSearch(false);
      }
    }

    if (changes.placeholder) {
      this.simpleSearchEventRecorded = false;
    }
  }

  // This function is for triggering the loader while searching
  keypress() {
    if (this.searchType === SimpleSearchType.SELECT_FIELD && this.page === SimpleSearchPage.MAPPING){
      this.isSearchInProgress = true;
      this.searchResult.emit('loading...');
    } else {
      this.isSearchInProgress = false;
    }
  }

  ngOnInit(): void {
    if (this.searchType === SimpleSearchType.SELECT_FIELD && this.page === SimpleSearchPage.MAPPING){
      this.trackSimpleSearch(true);
    } else {
      this.trackSimpleSearch(false);
    }
  }

}
