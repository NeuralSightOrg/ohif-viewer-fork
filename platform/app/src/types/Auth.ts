export type UserPermissions =
  | 'create_report'
  | 'read_report'
  | 'update_report'
  | 'delete_report'
  | 'view_report'
  | 'read_study'
  | 'update_study'
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
