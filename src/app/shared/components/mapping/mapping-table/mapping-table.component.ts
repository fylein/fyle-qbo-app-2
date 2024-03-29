import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingList } from 'src/app/core/models/db/mapping.model';
import { EmployeeFieldMapping, FyleField, QBOField, SearchType, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-mapping-table',
  templateUrl: './mapping-table.component.html',
  styleUrls: ['./mapping-table.component.scss']
})
export class MappingTableComponent implements OnInit {

  @Input() mappings: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);

  toolTipContent: string;

  @Input() sourceType: string | undefined;

  @Input() destinationType: string | undefined;

  @Input() importItems: boolean;

  @Input() mappingForm: UntypedFormGroup[];

  @Input() qboData: DestinationAttribute[];

  @Output() mappingSaveHandler = new EventEmitter<MappingList>();

  displayedColumns: string[] = ['fyle', 'qbo', 'state'];

  SimpleSearchPage = SimpleSearchPage;

  SearchType = SearchType;

  isSearchInProgress: boolean = false;

  existingQboOptions: DestinationAttribute[];

  destinationHeader: string | undefined;

  constructor(
    public helperService: HelperService,
    private mappingService: MappingService
  ) { }

  saveMapping(selectedRow: MappingList, selectedOption: DestinationAttribute, searchForm: UntypedFormGroup): void {
    searchForm.patchValue({
      destination: selectedOption.value,
      searchOption: '',
      source: searchForm.value.source
    });

    if (this.sourceType?.toUpperCase() === EmployeeFieldMapping.EMPLOYEE) {
      selectedRow.qbo.id = selectedOption.id;
    } else {
      selectedRow.qbo.id = selectedOption.destination_id;
    }

    selectedRow.qbo.value = selectedOption.value;

    this.mappingSaveHandler.emit(selectedRow);
  }

  removeDuplicateAndSortOptions(qboOptions: DestinationAttribute[]): DestinationAttribute[] {
    // Creating an ID map for options, optionsIDMap will look something like [312, 531, 234, 312]
    const optionsIDMap: number[] = qboOptions.map(option => option.id);

    // Filtering qboOptions by checking if they exist in optionsIDMap array to remove duplicate options and sorting them alphabetically based on their name
    return qboOptions.filter((option: DestinationAttribute, index: number) => !optionsIDMap.includes(option.id, index + 1)).sort(
      (firstOption: DestinationAttribute, secondOption: DestinationAttribute) => (firstOption.value > secondOption.value ? 1 : -1)
    );
  }

  prepareQBOOptions(existingOptions: DestinationAttribute[], newOptions: DestinationAttribute[] | void){
    // Value for newOptions will be sent after searchTerm results are returned from backend
    // Value for newOptions will be undefined when user tries to clear search term
    if (newOptions) {
      // Append newOptions to existing options (Warning: There can be duplicates)
      this.qboData = this.qboData.concat(newOptions);
      // Remove duplicates if any are found and sort the options alphabetically
      this.qboData = this.removeDuplicateAndSortOptions(this.qboData);
    } else {
      // Assign existing values to qboData since search term would have been cleared
      // And also after mapping display mapped options
      this.qboData = existingOptions;
    }
    this.isSearchInProgress = false;
  }

  advancedSearchHandler(searchTerm: string){
    if (searchTerm && searchTerm!=='initiateSearch...' && searchTerm.length>1){
      let qboData$;
      if (this.destinationType === EmployeeFieldMapping.EMPLOYEE) {
        qboData$ = this.mappingService.getQBOEmployees(searchTerm);
      } else if (this.destinationType === EmployeeFieldMapping.VENDOR) {
        qboData$ = this.mappingService.getQBOVendors(searchTerm);
      } else {
        const attribute = this.destinationType ? this.destinationType : QBOField.ACCOUNT;
        const displayName = this.mappingService.constructDisplayNameFilter(this.destinationType, this.importItems);
        qboData$ = this.mappingService.getSearchedQBODestinationAttributes(attribute, searchTerm, displayName);
      }
      qboData$.subscribe((response: PaginatedDestinationAttribute) => {
        this.prepareQBOOptions(this.existingQboOptions, response.results);
      });
    } else if (searchTerm && searchTerm==='initiateSearch...'){
      this.isSearchInProgress = true;
    } else {
      this.prepareQBOOptions(this.qboData);
    }
  }

  titleCase(str: string | undefined): string | undefined {
    return str?.toLowerCase().replace(/(?:^|\s|-)\w/g, (match) => {
      return match.toUpperCase();
    });
  }

  ngOnInit(): void {
    this.existingQboOptions = this.qboData.concat();
    this.destinationHeader = this.mappingService.displayDestinationTypeHeader(this.destinationType, this.importItems);
    this.toolTipContent =
      this.sourceType === FyleField.CATEGORY
        ?
        'If you are unable to find an Account in the dropdown, please use the search bar to find from your chart of Accounts'
        :
        `If you are enable to find a ${this.titleCase(this.destinationType)} in the dropdown please use the search bar to find from your ${this.titleCase(this.destinationType)}s`;
  }

}
