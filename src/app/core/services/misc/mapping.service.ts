import { EventEmitter, Injectable, Output } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { DestinationAttribute, GroupedDestinationAttribute } from '../../models/db/destination-attribute.model';
import { EmployeeMapping, EmployeeMappingPost, ExtendedEmployeeAttributeResponse } from '../../models/db/employee-mapping.model';
import { ExtendedExpenseAttributeResponse } from '../../models/db/expense-attribute.model';
import { MappingSetting, MappingSettingPost, MappingSettingResponse } from '../../models/db/mapping-setting.model';
import { MappingPost, MappingStats } from '../../models/db/mapping.model';
import { EmployeeFieldMapping, MappingState } from '../../models/enum/enum.model';
import { ConditionField } from '../../models/misc/condition-field.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  @Output() getMappingPagesForSideNavBar: EventEmitter<MappingSettingResponse> = new EventEmitter();

  @Output() showWalkThroughTooltip: EventEmitter<void> = new EventEmitter();

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getQBODestinationAttributes(attributeTypes: string | string[], active: boolean = false): Observable<DestinationAttribute[]> {
    const params: { attribute_types: string | string[], active?: boolean } = {
      attribute_types: attributeTypes
    };

    if (active) {
      params.active = true;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/destination_attributes/`, params);
  }

  getSearchedQBODestinationAttributes(attributeType: string, searchTerm?: string | void, active: boolean = false): Observable<DestinationAttribute[]> {
    const params: { attribute_type: string | string[], active?: boolean, search_term?: string } = {
      attribute_type: attributeType
    };

    if (active) {
      params.active = true;
    }

    if (searchTerm) {
      params.search_term = searchTerm;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/mapping_options/`, params);
  }

  getDistinctQBODestinationAttributes(attributeTypes: string[]): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/qbo_attributes/`, {
      attribute_types: attributeTypes
    });
  }

  getGroupedQBODestinationAttributes(attributeTypes: string[]): Observable<GroupedDestinationAttribute> {
    return from(this.getQBODestinationAttributes(attributeTypes).toPromise().then((response: DestinationAttribute[]) => {
      return response.reduce((groupedAttributes: GroupedDestinationAttribute | any, attribute: DestinationAttribute) => {
        const group: DestinationAttribute[] = groupedAttributes[attribute.attribute_type] || [];
        group.push(attribute);
        groupedAttributes[attribute.attribute_type] = group;

        return groupedAttributes;
      }, {
        BANK_ACCOUNT: [],
        CREDIT_CARD_ACCOUNT: [],
        ACCOUNTS_PAYABLE: [],
        VENDOR: [],
        ACCOUNT: [],
        TAX_CODE: []
      });
    }));
  }

  getFyleExpenseFields(): Observable<ExpenseField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_fields/`, {});
  }

  getFyleCustomFields(): Observable<ConditionField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/custom_fields/`, {});
  }

  getMappings(mappingState: MappingState, limit: number, offset: number, alphabetsFilter: string[], sourceType: string, destinationType: string): Observable<ExtendedExpenseAttributeResponse> {
    const params: any = {
      limit,
      offset,
      mapped: mappingState === MappingState.ALL ? MappingState.ALL : false,
      source_type: sourceType,
      destination_type: destinationType
    };

    if (alphabetsFilter.length) {
      params.mapping_source_alphabets = alphabetsFilter;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/expense_attributes/`, params);
  }

  postMapping(mapping: MappingPost): Observable<EmployeeMapping> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/`, mapping);
  }

  getEmployeeMappings(mappingState: MappingState, limit: number, offset: number, alphabetsFilter: string[], destinationType: string): Observable<ExtendedEmployeeAttributeResponse> {
    const params: any = {
      limit,
      offset,
      mapped: mappingState === MappingState.ALL ? MappingState.ALL : false,
      destination_type: destinationType
    };

    if (alphabetsFilter.length) {
      params.mapping_source_alphabets = alphabetsFilter;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/employee_attributes/`, params);
  }

  postEmployeeMapping(employeeMapping: EmployeeMappingPost): Observable<EmployeeMapping> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/employee/`, employeeMapping);
  }

  triggerAutoMapEmployees(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/auto_map_employees/trigger/`, {});
  }

  @Cacheable()
  getQBOEmployees(searchTerm: string | void): Observable<DestinationAttribute[]> {
    const params: { search_term?: string } = {};
    if (searchTerm) {
      params.search_term = searchTerm;
    }
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/employees/`, params);
  }

  @Cacheable()
  getQBOVendors(searchTerm: string | void): Observable<DestinationAttribute[]> {
    const params: { search_term?: string } = {};
    if (searchTerm) {
      params.search_term = searchTerm;
    }
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/vendors/`, params);
  }

  getMappingStats(sourceType: string, destinationType: string): Observable<MappingStats> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/stats/`, { source_type: sourceType, destination_type: destinationType });
  }

  // TODO: cache this safely later
  getMappingSettings(): Observable<MappingSettingResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/settings/`, {});
  }

  refreshMappingPages(): void {
    this.apiService.get(`/workspaces/${this.workspaceId}/mappings/settings/`, {}).subscribe((mappingSettingResponse: MappingSettingResponse) => {
      this.getMappingPagesForSideNavBar.emit(mappingSettingResponse);
    });
  }

  emitWalkThroughTooltip(): void {
    this.showWalkThroughTooltip.emit();
  }

  postMappingSettings(mappingSettingPayload: MappingSettingPost[]): Observable<MappingSetting[]> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/settings/`, mappingSettingPayload);
  }

  deleteMappingSetting(mappingSettingId: number): Observable<{}> {
    return this.apiService.delete(`/workspaces/${this.workspaceId}/mappings/settings/${mappingSettingId}/`);
  }
}
