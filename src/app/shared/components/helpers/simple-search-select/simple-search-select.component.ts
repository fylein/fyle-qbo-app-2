import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-simple-search-select',
  templateUrl: './simple-search-select.component.html',
  styleUrls: ['./simple-search-select.component.scss']
})
export class SimpleSearchSelectComponent implements OnInit, OnChanges {

  @Input() form: FormGroup;

  @Input() showBackgroundColor: boolean = true;

  @Input() placeholder: string = 'Search';

  @Input() page: SimpleSearchPage;

  @Input() searchType: SimpleSearchType;

  private simpleSearchEventRecorded: boolean = false;

  constructor(
    private trackingService: TrackingService
  ) { }

  clearText(): void {
    this.form.controls.searchOption.patchValue(null);
  }

  private trackSimpleSearch(): void {
    this.form?.controls.searchOption?.valueChanges.subscribe((searchString: string) => {
      if (!this.simpleSearchEventRecorded && searchString) {
        this.trackingService.onSimpleSearch({page: this.page, searchType: this.searchType});
        this.simpleSearchEventRecorded = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.form) {
      this.trackSimpleSearch();
    }

    if (changes.placeholder) {
      this.simpleSearchEventRecorded = false;
    }
  }

  ngOnInit(): void {
    this.trackSimpleSearch();
  }

}
