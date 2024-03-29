import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExtendedExpenseAttribute, ExtendedExpenseAttributeResponse } from 'src/app/core/models/db/expense-attribute.model';
import { MappingSettingResponse, MinimalMappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { MappingList, MappingModel, MappingStats } from 'src/app/core/models/db/mapping.model';
import { WorkspaceGeneralSetting } from 'src/app/core/models/db/workspace-general-setting.model';
import { ClickEvent, FyleField, MappingState, PaginatorPage, QBOField, ZeroStatePage } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { SnakeCaseToSpaceCase } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-generic-mapping',
  templateUrl: './generic-mapping.component.html',
  styleUrls: ['./generic-mapping.component.scss']
})
export class GenericMappingComponent implements OnInit {

  sourceType: string;

  isMappingStatsUpdated: boolean;

  totalCardActive: boolean = true;

  isLoading: boolean = true;

  limit: number;

  offset: number;

  totalCount: number;

  mappingSetting: MinimalMappingSetting;

  mappingStats: MappingStats;

  qboData: DestinationAttribute[];

  workspaceGeneralSettings: WorkspaceGeneralSetting;

  mappings: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);

  emptyMapping: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);

  fyleQboMappingFormArray: UntypedFormGroup[];

  filterOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  form: UntypedFormGroup;

  mappingForm: UntypedFormGroup[];

  page: string;

  PaginatorPage = PaginatorPage;

  ZeroStatePage = ZeroStatePage;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private mappingService: MappingService,
    private paginatorService: PaginatorService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  mappingCardUpdateHandler(totalCardActive: boolean): void {
    let eventName = ClickEvent.MAPPED_MAPPINGS_FILTER;
    if (!totalCardActive) {
      eventName = ClickEvent.UNMAPPED_MAPPINGS_FILTER;
    }
    this.trackingService.onClickEvent(eventName, {page: this.page});

    this.totalCardActive = totalCardActive;
    this.form.controls.sourceUpdated.patchValue(true);

    this.getMappings();
  }

  private getPaginator(): Paginator {
    return this.paginatorService.getPageSize(PaginatorPage.MAPPING);
  }

  private setupForm(filterOption: string[] = []): void {
    this.form = this.formBuilder.group({
      map: [''],
      fyleQboMapping: this.formBuilder.array(this.fyleQboMappingFormArray),
      searchOption: [''],
      filterOption: [filterOption],
      sourceUpdated: [false]
    });

    this.form.controls.searchOption.valueChanges.subscribe((searchTerm: string) => {
      if (searchTerm) {
        this.mappings.filter = searchTerm.trim().toLowerCase();
      } else {
        this.mappings.filter = '';
      }
    });

    const mappingForm = this.form.controls.fyleQboMapping as UntypedFormArray;
    this.mappingForm = mappingForm.controls as UntypedFormGroup[];
  }

  private setupFyleQboMappingFormArray(mappings: MappingList[]): void {
    this.fyleQboMappingFormArray = mappings.map((mapping: MappingList) => {
      return this.formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
  }

  getMappings(data: Paginator | void): void {
    this.isLoading = true;
    if (this.form) {
      this.form.controls.sourceUpdated.patchValue(true);
    }
    const paginator: Paginator = data ? data : this.getPaginator();

    const mappings: MappingList[] = [];

    // Store page size when user changes it
    if (this.limit !== data?.limit) {
      this.paginatorService.storePageSize(PaginatorPage.MAPPING, paginator.limit);
    }

    this.limit = paginator.limit;
    this.offset = paginator.offset;
    const mappingState = this.totalCardActive ? MappingState.ALL : MappingState.UNMAPPED;

    let alphabetsFilter: string[] = [];
    let allAlphabets: boolean = true;

    if (this.form) {
      allAlphabets = this.form.value.filterOption.length === 0;

      if (!allAlphabets) {
        alphabetsFilter = this.form.value.filterOption;
      }
    }

    this.mappingService.getMappings(mappingState, paginator.limit, paginator.offset, alphabetsFilter, this.mappingSetting.source_field, this.mappingSetting.destination_field).subscribe((extendedExpenseAttributeResponse: ExtendedExpenseAttributeResponse) => {
      this.totalCount = extendedExpenseAttributeResponse.count;

      if (this.mappingSetting.source_field === 'CATEGORY') {
        extendedExpenseAttributeResponse.results = extendedExpenseAttributeResponse.results.filter(expenseAttribute => {
          if (expenseAttribute.value === 'Activity' && !this.isMappingStatsUpdated) {
            this.mappingStats.all_attributes_count -= 1;
            this.mappingStats.unmapped_attributes_count -= 1;
            this.isMappingStatsUpdated = true;
          }
          return expenseAttribute.value !== 'Activity';
        });
      }

      extendedExpenseAttributeResponse.results.forEach((extendedExpenseAttribute: ExtendedExpenseAttribute, index: number) => {
        mappings.push({
          fyle: {
            id: extendedExpenseAttribute.id,
            value: extendedExpenseAttribute.value
          },
          qbo: {
            id: extendedExpenseAttribute.mapping.length ? extendedExpenseAttribute.mapping[0].destination.id : '',
            value: extendedExpenseAttribute.mapping.length ? extendedExpenseAttribute.mapping[0].destination.value : ''
          },
          state: extendedExpenseAttribute.mapping.length ? MappingState.MAPPED : MappingState.UNMAPPED,
          autoMapped: extendedExpenseAttribute.auto_mapped,
          index: index
        });
        if ((extendedExpenseAttribute.mapping.length) && (this.qboData.findIndex((data) => data.value === extendedExpenseAttribute.mapping[0].destination.value) < 0)) {
          this.qboData.push(extendedExpenseAttribute.mapping[0].destination);
        }
      });
      this.qboData = this.qboData.sort((a, b) => (a.value > b.value ? 1 : -1));
      this.mappings = new MatTableDataSource(mappings);
      this.mappings.filterPredicate = this.searchByText;
      this.setupFyleQboMappingFormArray(mappings);

      // Reinitialize form when source type changes or when the component is loaded for first time
      if ((this.form && this.form.value.sourceUpdated) || !this.form) {
        this.setupForm(alphabetsFilter);
      }

      this.isLoading = false;
    });
  }

  private searchByText(mapping: MappingList, filterText: string): boolean {
    return mapping.fyle.value.toLowerCase().includes(filterText.toLowerCase());
  }

  private getMappingsAndSetupPage(): void {
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.mappingService.getMappingSettings()
    ]).subscribe((response) => {
      this.workspaceGeneralSettings = response[0];
      const mappingSetting = response[1].results.filter((mappingSetting) => mappingSetting.source_field === this.sourceType.toUpperCase());
      this.mappingSetting = mappingSetting.length ? mappingSetting[0] : {source_field: FyleField.CATEGORY, destination_field: QBOField.ACCOUNT};
      this.page = `${new TitleCasePipe().transform(new SnakeCaseToSpaceCase().transform(this.mappingSetting.source_field))} Mapping`;
      this.mappingService.getMappingStats(this.sourceType.toUpperCase(), this.mappingSetting.destination_field).subscribe((mappingStats: MappingStats) => {
        this.mappingStats = mappingStats;
        let active = false;
        if ((this.mappingSetting.source_field === 'PROJECT' && this.mappingSetting.destination_field === 'CUSTOMER') ||
            (this.mappingSetting.source_field === 'CATEGORY')){
            active = true;
        }

        const displayName = this.mappingService.constructDisplayNameFilter(this.mappingSetting.destination_field, this.workspaceGeneralSettings.import_items);
        this.mappingService.getSearchedQBODestinationAttributes(this.mappingSetting.destination_field, undefined, displayName, active).subscribe((qboData: PaginatedDestinationAttribute) => {
          this.qboData = qboData.results;
          this.getMappings();
        });
      });
    });
  }

  save(selectedRow: MappingList): void {
    const mappingPayload = MappingModel.constructPayload(this.mappingSetting, selectedRow);
    this.mappingService.postMapping(mappingPayload).subscribe(() => {

      if (selectedRow.state === MappingState.UNMAPPED) {
        this.mappingStats.unmapped_attributes_count -= 1;
        selectedRow.state = MappingState.MAPPED;
      }

      this.snackBar.open('Changes saved', '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'mapping-snackbar'
      });
    });

  }

  ngOnInit(): void {
    // Watch for changes in route, since this component is used for all mapping types
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.totalCardActive = true;

      // If source type is changed, reinitialize the form by maintaining sourceUpdated flag
      if (this.form) {
        this.form.controls.filterOption.patchValue([]);
        this.form.controls.sourceUpdated.patchValue(true);
      }
      this.getMappingsAndSetupPage();
    });
  }

}
