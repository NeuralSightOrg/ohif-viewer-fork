export type UserPermissions =
  | 'manage_users'
  | 'manage_reports'
  | 'create_report'
  | 'read_report'
  | 'update_report'
  | 'delete_report'
  | 'view_report'
  | 'create_study'
  | 'read_study'
  | 'update_study'
  | 'delete_study'
  | 'share_study'
  | 'view_study';


export interface User {
  email: string;
  hospital_name: string;
  label: string;
  first_name: string;
  role: string;
  permissions: UserPermissions[];
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
