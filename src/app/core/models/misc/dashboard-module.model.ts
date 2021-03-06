export type DashboardModuleChild = {
  name: string,
  route: string,
  isActive: boolean,
  isExpanded?: boolean,
  iconPath?: string
};

export type DashboardModule = {
  name: string,
  route: string,
  iconPath: string,
  isExpanded: boolean,
  isActive: boolean,
  childPages: DashboardModuleChild[]
};
