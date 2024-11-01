import React from 'react';
import { Icon, Button } from '@ohif/ui';
import { useModal } from '@ohif/ui';
import ReportModalContent from './ReportModalContent';
import { useAuth } from '../../../platform/app/src/contexts/AuthContext';
export function ReportPanel() {
  const { hasPermission } = useAuth();

  if (!hasPermission('read_report')) {
    return (
      <div className="p-4">
        <div className="rounded bg-gray-700 p-4 text-center">
          <Icon name="lock" className="mx-auto mb-2 h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-300">You don't have permission to Read Reports.</p>
        </div>
      </div>
    );
  }
  const { show } = useModal();

  const openModal = () => {
    show({
      content: ReportModalContent,
      customClassName: '',
      title: 'Reports',
      contentDimensions: { height: '80vh' },
      contentProps: {
        onClose: () => show({ content: null }),
      },
    });
  };

  return (
    <div>
      <div className="item-center mt-6 flex justify-center">
        <Button onClick={openModal} startIcon={<Icon name="clipboard" />}>
          Open Reports
        </Button>
      </div>
    </div>
  );
}
