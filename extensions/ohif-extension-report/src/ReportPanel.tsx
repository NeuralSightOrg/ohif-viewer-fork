import React from 'react';
import { Icon, Button } from '@ohif/ui';
import { useModal } from '@ohif/ui';
import ReportModalContent from './ReportModalContent';

export function ReportPanel() {
  const { show } = useModal();

  const openModal = () => {
    show({
      content: ReportModalContent,
      customClassName: '',
      title: 'Reports',
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
