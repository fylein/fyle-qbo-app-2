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

  @Output() searchResult: EventEmitter<DestinationAttribute[]> =   new EventEmitter();

  private simpleSearchEventRecorded: boolean = false;

  loading: boolean = false;

  constructor(
    private trackingService: TrackingService,
    private mappingService: MappingService
  ) { }

  clearText(): void {
    this.form.controls.searchOption.patchValue(null);
  }

  private trackSimpleSearch(): void {
    if (this.page !== SimpleSearchPage.MAPPING){
    this.form?.controls.searchOption?.valueChanges.subscribe((searchString: string) => {
      if (!this.simpleSearchEventRecorded && searchString) {
          this.trackingService.onSimpleSearch({page: this.page, searchType: this.searchType});
          this.simpleSearchEventRecorded = true;
        }
    });
  } else {
    this.form?.controls.searchOption?.valueChanges.pipe(
      debounceTime(900),
      switchMap(id => {
        const search_term = this.form?.controls.searchOption?.value;
        if (search_term.length > 2){
          if (this.destinationType === EmployeeFieldMapping.EMPLOYEE){
            return this.mappingService.getQBOEmployees(search_term);
          } else if (this.destinationType === EmployeeFieldMapping.VENDOR){
            return this.mappingService.getQBOVendors(search_term);
          }
            const attribute = this.destinationType ? this.destinationType : QBOField.ACCOUNT;
            return this.mappingService.getSearchedQBODestinationAttributes(attribute, search_term);

        }
          if (this.destinationType === EmployeeFieldMapping.EMPLOYEE){
            return this.mappingService.getQBOEmployees();
          } else if (this.destinationType === EmployeeFieldMapping.VENDOR){
            return this.mappingService.getQBOVendors();
          }
          const attribute = this.destinationType ? this.destinationType : QBOField.ACCOUNT;
          return this.mappingService.getSearchedQBODestinationAttributes(attribute);


      })
    ).subscribe((employeeMappingResponse: DestinationAttribute[]) => {
         this.searchResult.emit(employeeMappingResponse);
         this.loading = false;
    });
    }
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
