import React, { useState, useEffect, useMemo } from 'react';
import {
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Users,
  UserCheck,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import DashboardLayout from '../dashboard/DashboardLayout';
import { Input, Select, Button, Modal, ModalProvider, useModal } from '@ohif/ui';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: 'client_admin' | 'radiologist';
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

interface ModalContentProps {
  user: User | null;
  mode: 'add' | 'edit' | 'delete';
  hide: () => void;
  onSubmit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <div className="flex flex-col rounded-lg bg-white p-4 shadow-md">
    <div className="flex items-center space-x-4">
      <div className="rounded-lg bg-blue-100 p-3 text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const DataTable: React.FC<{
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}> = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {

    if (!searchTerm && (!roleFilter || !roleFilter.value)) {
      return users;
    }
    return users.filter(user => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter?.value === null ||
        roleFilter?.value === '' ||
        user.role_name === roleFilter?.value;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Role'];
    const csvData = filteredUsers.map(user =>
      [user.first_name, user.last_name, user.email, user.role_name].join(',')
    );
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 space-x-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center justify-between space-x-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          <Select
            value={roleFilter}
            id="rolefilter"
            onChange={roleFilter => setRoleFilter(roleFilter)}
            className="w-20"
            isClearable={false}
            options={[
              { value: '', label: 'All Roles' },
              { value: 'client_admin', label: 'Client Admin' },
              { value: 'radiologist', label: 'Radiologist' },
            ]}
          />
        </div>
        <Button
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-blue-500 px-4 py-0 text-white hover:bg-blue-600"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.map(user => (
              <tr
                key={user.id}
                className="hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {`${user.first_name} ${user.last_name}`}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.role_name === 'client_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.role_name}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(user)}
                    className="mr-2 text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ModalContent: React.FC<ModalContentProps> = ({ user, mode, hide, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState<User>(
    user || {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      role_name: 'radiologist',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    hide();
  };

  const handleDelete = () => {
    if (user) {
      onDelete(user.id);
      hide();
    }
  };

  const handleRoleChange = selectedOption => {
    setFormData(prevData => ({
      ...prevData,
      role_name: selectedOption.value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="First Name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
      />
      <Input
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <Select
        label="Role"
        name="role_name"
        value={formData.role_name}
        onChange={handleRoleChange}
        isClearable={false}
        options={[
          { value: 'client_admin', label: 'Client Admin' },
          { value: 'radiologist', label: 'Radiologist' },
        ]}
      />
      <div className="flex justify-end space-x-2">
        <Button
          onClick={hide}
          className="bg-gray-100 px-4 py-2 text-white hover:bg-gray-200"
        >
          Cancel
        </Button>
        {mode === 'delete' ? (
          <Button
            onClick={handleDelete}
            className="bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Delete
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {mode === 'add' ? 'Add' : 'Update'}
          </Button>
        )}
      </div>
    </form>
  );
};

const UserManagementContent: React.FC<{ show: Function; hide: Function }> = ({ show, hide }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const base_url = process.env.REACT_APP_API_BASE;
  const { authState } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${base_url}/admin/list-users`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (newUser: User) => {
    try {
      await fetch(`${base_url}/admin/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          temporary_password: 'securepassword123',
          role_name: newUser.role_name,
        }),
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await fetch(`${base_url}/admin/delete-user?clientUserID=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const openModal = (mode: 'add' | 'edit' | 'delete', user: User | null = null) => {
    show({
      content: ModalContent,
      contentProps: {
        user,
        mode,
        hide,
        onSubmit: handleAddUser,
        onDelete: handleDeleteUser,
      },
      title: mode === 'add' ? 'Add User' : mode === 'edit' ? 'Edit User' : 'Delete User',
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <Button
            onClick={() => openModal('add')}
            className="flex items-center space-x-2 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">{error}</div>}

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Total Users"
              value={users.length}
              icon={<Users className="h-6 w-6" />}
            />
            <StatsCard
              title="Admins"
              value={users.filter(u => u.role_name === 'client_admin').length}
              icon={<UserCheck className="h-6 w-6" />}
            />
            <StatsCard
              title="Radiologists"
              value={users.filter(u => u.role_name === 'radiologist').length}
              icon={<UserPlus className="h-6 w-6" />}
            />
          </div>
          {users.length === 0 ? (
            <div className="mt-8 text-center text-gray-500">No users found</div>
          ) : (
            <DataTable
              users={users}
              onEdit={user => openModal('edit', user)}
              onDelete={user => openModal('delete', user)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const UserManagementPage: React.FC = () => {
  const { show, hide } = useModal();
  return (
    <ModalProvider>
      <UserManagementContent
        show={show}
        hide={hide}
      />
    </ModalProvider>
  );
};

export default UserManagementPage;
