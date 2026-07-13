export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type Permission =
  | 'view_dashboard'
  | 'edit_content'
  | 'manage_products'
  | 'manage_quotes'
  | 'manage_users'
  | 'publish_content'
  | 'view_audit_log';

export const RolePermissions: Record<UserRole, Permission[]> = {
  owner: [
    'view_dashboard',
    'edit_content',
    'manage_products',
    'manage_quotes',
    'manage_users',
    'publish_content',
    'view_audit_log',
  ],
  admin: [
    'view_dashboard',
    'edit_content',
    'manage_products',
    'manage_quotes',
    'publish_content',
  ],
  editor: [
    'view_dashboard',
    'edit_content',
    'manage_products',
  ],
  viewer: [
    'view_dashboard',
  ],
};
