import React, { useState, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, UserPlus, Users, UserCheck } from 'lucide-react';
import DashboardLayout from '../dashboard/DashboardLayout';
import { ModalProvider, useModal, Modal, Input, Select } from '@ohif/ui'; // Import Input and Select

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
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
  <div className="overflow-hidden rounded-lg bg-white shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const UserTable: React.FC<{
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}> = ({ users, onEdit, onDelete }) => (
  <div className="mt-8 flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
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
              {users.map(user => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => onEdit(user)}
                        className="mr-2 text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

const ModalContent: React.FC<ModalContentProps> = ({ user, mode, hide, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState(user || { id: 0, name: '', email: '', role: 'User' });

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

  if (mode === 'delete') {
    return (
      <div>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="mt-4">
          <button
            onClick={handleDelete}
            className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <Input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <Select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </Select>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          {mode === 'add' ? 'Add' : 'Update'}
        </button>
      </div>
    </form>
  );
};

const UserManagementContent: React.FC<{ show: Function; hide: Function }> = ({ show, hide }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Mock API call
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    ];
    setUsers(mockUsers);
  };

  const openModal = (mode: 'add' | 'edit' | 'delete', user: User | null = null) => {
    show({
      content: ModalContent,
      contentProps: {
        user,
        mode,
        hide,
        onSubmit: handleSubmit,
        onDelete: handleDelete,
      },
      title: mode === 'add' ? 'Add User' : mode === 'edit' ? 'Edit User' : 'Delete User',
    });
  };

  const handleSubmit = (userData: User) => {
    if (userData.id === 0) {
      // Add new user
      setUsers([...users, { ...userData, id: users.length + 1 }]);
    } else {
      // Update existing user
      setUsers(users.map(user => (user.id === userData.id ? userData : user)));
    }
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, email, and role.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
              onClick={() => openModal('add')}
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatsCard
            title="Total Users"
            value={users.length}
            icon={
              <Users
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            }
          />
          <StatsCard
            title="Admin Users"
            value={users.filter(u => u.role === 'Admin').length}
            icon={
              <UserCheck
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            }
          />
          <StatsCard
            title="Regular Users"
            value={users.filter(u => u.role === 'User').length}
            icon={
              <UserPlus
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            }
          />
        </div>
        <UserTable
          users={users}
          onEdit={user => openModal('edit', user)}
          onDelete={user => openModal('delete', user)}
        />
      </div>
    </DashboardLayout>
  );
};

const UserManagementChild: React.FC = () => {
  const { show, hide } = useModal();
  return (
    <UserManagementContent
      show={show}
      hide={hide}
    />
  );
};

const UserManagement: React.FC = () => (
  <ModalProvider modal={Modal}>
    <UserManagementChild />
  </ModalProvider>
);

export default UserManagement;
