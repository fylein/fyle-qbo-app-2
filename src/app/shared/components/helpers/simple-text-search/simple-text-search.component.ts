import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SearchType, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
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

  @Input() advancedSearchType: SearchType;

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
    if (this.searchType === SimpleSearchType.SELECT_FIELD){
      this.searchResult.emit(this.form.controls.searchOption.value);
    }
  }

  private trackTextSearch(isAdvancedSearch: boolean): void {
    this.form?.controls.searchOption?.valueChanges.subscribe((searchString: string) => {
      if (!this.simpleSearchEventRecorded && searchString) {
        if (isAdvancedSearch) {
          this.trackingService.onAdvancedSearch({page: this.page, searchType: this.advancedSearchType});
        } else {
          this.trackingService.onSimpleSearch({page: this.page, searchType: this.searchType});
        }
        this.simpleSearchEventRecorded = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.form) {
      if (this.advancedSearchType === SearchType.SELECT_FIELD && this.page === SimpleSearchPage.MAPPING) {
          this.form?.controls.searchOption?.valueChanges.pipe(
          debounceTime(1000)
          ).subscribe((searchTerm: string) => {
              this.searchResult.emit(searchTerm);
              this.trackTextSearch(true);
          });
      } else {
        this.trackTextSearch(false);
      }
    }

    if (changes.placeholder) {
      this.simpleSearchEventRecorded = false;
    }
  }

  // This function is for triggering the loader while searching
  keypress() {
    if (this.advancedSearchType === SearchType.SELECT_FIELD && this.page === SimpleSearchPage.MAPPING){
      this.isSearchInProgress = true;
      this.searchResult.emit('loading...');
    } else {
      this.isSearchInProgress = false;
    }
  }

  ngOnInit(): void {
    if (this.advancedSearchType === SearchType.SELECT_FIELD && this.page === SimpleSearchPage.MAPPING){
      this.trackTextSearch(true);
    } else {
      this.trackTextSearch(false);
    }
  }

}
