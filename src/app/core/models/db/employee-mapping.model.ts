import { DestinationAttribute } from "./destination-attribute.model";
import { ExpenseAttribute } from "./expense-attribute.model";

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
