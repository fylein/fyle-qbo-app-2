import { EmployeeFieldMapping } from "../enum/enum.model";
import { DestinationAttribute } from "./destination-attribute.model";
import { ExpenseAttribute, MinimalExpenseAttribute } from "./expense-attribute.model";
import { MinimalDestinationAttribute } from "./general-mapping.model";
import { MappingList } from "./mapping.model";

export type EmployeeMapping = {
  id: number;
  source_employee: ExpenseAttribute;
  destination_employee: DestinationAttribute;
  destination_vendor: DestinationAttribute;
  destination_card_account: DestinationAttribute;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};

export type EmployeeMappingsResponse = {
  count: number;
  next: string;
  previous: string;
  results: EmployeeMapping[];
};

export type EmployeeMappingPost = {
  source_employee: MinimalExpenseAttribute;
  destination_employee: MinimalDestinationAttribute;
  destination_vendor: MinimalDestinationAttribute;
  destination_card_account: MinimalDestinationAttribute;
  workspace: number;
};

export interface ExtendedEmployeeAttribute extends ExpenseAttribute {
  employeemapping: EmployeeMapping[];
}

export type ExtendedEmployeeAttributeResponse = {
  count: number;
  next: string;
  previous: string;
  results: ExtendedEmployeeAttribute[];
};

export class EmployeeMappingModel {
  static constructPayload(employeeFieldMapping: EmployeeFieldMapping, mappingRow: MappingList, workspaceId: string): EmployeeMappingPost {
    return {
      source_employee: {
        id: mappingRow.fyle.id
      },
      destination_employee: {
        id: employeeFieldMapping === EmployeeFieldMapping.EMPLOYEE ? mappingRow.qbo.id : (mappingRow.preserveDestination?.id || null)
      },
      destination_vendor: {
        id: employeeFieldMapping === EmployeeFieldMapping.VENDOR ? mappingRow.qbo.id : (mappingRow.preserveDestination?.id || null)
      },
      destination_card_account: {
        id: null
      },
      workspace: parseInt(workspaceId)
    };
  }
}
