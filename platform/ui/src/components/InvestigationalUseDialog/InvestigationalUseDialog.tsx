import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Button, { ButtonEnums } from '../Button';

export enum showDialogOption {
  NeverShowDialog = 'never',
  AlwaysShowDialog = 'always',
  ShowOnceAndConfigure = 'configure',
}

const STORAGE_KEY = 'neuralsight_terms_accepted';

const InvestigationalUseDialog = ({
  dialogConfiguration = {
    option: showDialogOption.AlwaysShowDialog,
  },
}) => {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    // Check if terms were previously accepted
    const hasAcceptedTerms = localStorage.getItem(STORAGE_KEY);

    if (hasAcceptedTerms) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  }, []);

  const handleConfirmAndHide = () => {
    // Store acceptance with timestamp
    const acceptance = {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0', // Increment this when terms are updated
    };

    // Store in localStorage for permanent record
    localStorage.setItem(STORAGE_KEY, JSON.stringify(acceptance));

    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className="fixed bottom-2 z-50 flex w-full justify-center">
      <div className="bg-secondary-dark border-primary-dark flex w-[90%] flex-col rounded-lg border-2 p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="h-24 w-24">
            <img
              src="/assets/logo.gif"
              alt="Neural Sight Logo"
              className="h-full w-full rounded-full object-contain"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="text-xl font-semibold text-white">Terms and Conditions</div>
            <div className="text-sm text-white/90">
              By using NeuralSight's services, you agree to our Terms and Conditions, which include:
            </div>
            <ul className="ml-4 list-disc space-y-1 text-sm text-white/80">
              <li>This software is intended for professional medical use only</li>
              <li>Users must be licensed healthcare professionals</li>
              <li>AI analysis is meant to assist, not replace, clinical judgment</li>
              <li>Patient data privacy and security must be maintained</li>
              <li>Users are responsible for verifying AI findings</li>
            </ul>
            <div className="text-sm text-white/90">
              For complete terms, please visit{' '}
              <span
                className="text-primary-active cursor-pointer hover:underline"
                onClick={() => window.open('https://neuralsight.ai/terms', '_blank')}
              >
                NeuralSight Terms of Service
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type={ButtonEnums.type.primary}
            onClick={handleConfirmAndHide}
            className="bg-primary-main"
            dataCY="accept-terms-button"
          >
            Accept and Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

InvestigationalUseDialog.propTypes = {
  dialogConfiguration: PropTypes.shape({
    option: PropTypes.oneOf(Object.values(showDialogOption)).isRequired,
    days: PropTypes.number,
  }),
};

export default InvestigationalUseDialog;
