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

  @Output() searchResult: EventEmitter<{result:DestinationAttribute[], loading:boolean}> =   new EventEmitter();

  private simpleSearchEventRecorded: boolean = false;

  loading: boolean = false;

  constructor(
    private trackingService: TrackingService,
    private mappingService: MappingService
  ) { }

  clearText(): void {
    this.loading = true;
    this.form.controls.searchOption.patchValue(null);
    if (this.destinationType === EmployeeFieldMapping.EMPLOYEE) {
      this.mappingService.getQBOEmployees().subscribe((employeeMappingResponse: DestinationAttribute[]) => {
        this.searchResult.emit({result: employeeMappingResponse, loading: false});
        this.loading = false;
      });
    } else if (this.destinationType === EmployeeFieldMapping.VENDOR) {
      this.mappingService.getQBOVendors().subscribe((employeeMappingResponse: DestinationAttribute[]) => {
        this.searchResult.emit({result: employeeMappingResponse, loading: false});
        this.loading = false;
      });
    } else {
      const attribute = this.destinationType ? this.destinationType : QBOField.ACCOUNT;
      this.mappingService.getSearchedQBODestinationAttributes(attribute).subscribe((employeeMappingResponse: DestinationAttribute[]) => {
        this.searchResult.emit({result: employeeMappingResponse, loading: false});
        this.loading = false;
    });
    }
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
      if (this.page === SimpleSearchPage.MAPPING) {
      this.form?.controls.searchOption?.valueChanges.pipe(
        debounceTime(2000),
        switchMap((search_term) => {
          if (search_term && search_term.length > 1) {
            if (this.destinationType === EmployeeFieldMapping.EMPLOYEE) {
              return this.mappingService.getQBOEmployees(search_term);
            } else if (this.destinationType === EmployeeFieldMapping.VENDOR) {
              return this.mappingService.getQBOVendors(search_term);
            }
              const attribute = this.destinationType ? this.destinationType : QBOField.ACCOUNT;
              return this.mappingService.getSearchedQBODestinationAttributes(attribute, search_term);
          } else if (search_term === '') {
            if (this.destinationType === EmployeeFieldMapping.EMPLOYEE) {
              return this.mappingService.getQBOEmployees();
            } else if (this.destinationType === EmployeeFieldMapping.VENDOR) {
              return this.mappingService.getQBOVendors();
            }
            const attribute = this.destinationType ? this.destinationType : QBOField.ACCOUNT;
            return this.mappingService.getSearchedQBODestinationAttributes(attribute);
          }
            this.loading = false;
            return [];
        })
      ).subscribe((employeeMappingResponse: DestinationAttribute[]) => {
           this.searchResult.emit({result: employeeMappingResponse, loading: false});
           this.loading = false;
      });
    }
  }

    if (changes.placeholder) {
      this.simpleSearchEventRecorded = false;
    }
  }

  keypress() {
    this.loading = true;
    this.searchResult.emit({result: [], loading: true});
  }

  ngOnInit(): void {
    this.trackSimpleSearch();
  }

}
