import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { ErrorBoundary, UserPreferences, AboutModal, Header, useModal } from '@ohif/ui';
import i18n from '@ohif/i18n';
import { hotkeys } from '@ohif/core';
import { Toolbar } from '../Toolbar/Toolbar';
import { useAuth } from '../../../../platform/app/src/contexts/AuthContext';

const { availableLanguages, defaultLanguage, currentLanguage } = i18n;

function ViewerHeader({
  hotkeysManager,
  extensionManager,
  servicesManager,
  appConfig,
}: withAppTypes) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { show, hide } = useModal();

  const onClickReturnButton = () => {
    const { pathname } = location;
    const dataSourceIdx = pathname.indexOf('/', 1);
    const query = new URLSearchParams(window.location.search);
    const configUrl = query.get('configUrl');

    const dataSourceName = pathname.substring(dataSourceIdx + 1);
    const existingDataSource = extensionManager.getDataSources(dataSourceName);

    const searchQuery = new URLSearchParams();
    if (dataSourceIdx !== -1 && existingDataSource) {
      searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
    }

    if (configUrl) {
      searchQuery.append('configUrl', configUrl);
    }

    navigate({
      pathname: '/',
      search: decodeURIComponent(searchQuery.toString()),
    });
  };

  const handleLogout = async () => {
    try {
      if (appConfig.oidc) {
        // Handle OIDC logout
        navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
      } else {
        // Use our auth context logout
        await logout();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show error message to user
    }
  };

  const { hotkeyDefinitions, hotkeyDefaults } = hotkeysManager;
  const versionNumber = process.env.VERSION_NUMBER;
  const commitHash = process.env.COMMIT_HASH;

  const menuOptions = [
    {
      title: t('Header:About'),
      icon: 'info',
      onClick: () =>
        show({
          content: AboutModal,
          title: t('AboutModal:About OHIF Viewer'),
          contentProps: { versionNumber, commitHash },
          containerDimensions: 'max-w-4xl max-h-4xl',
        }),
    },
    {
      title: t('Header:Preferences'),
      icon: 'settings',
      onClick: () =>
        show({
          title: t('UserPreferencesModal:User preferences'),
          content: UserPreferences,
          containerDimensions: 'w-[70%] max-w-[900px]',
          contentProps: {
            hotkeyDefaults: hotkeysManager.getValidHotkeyDefinitions(hotkeyDefaults),
            hotkeyDefinitions,
            currentLanguage: currentLanguage(),
            availableLanguages,
            defaultLanguage,
            onCancel: () => {
              hotkeys.stopRecord();
              hotkeys.unpause();
              hide();
            },
            onSubmit: ({ hotkeyDefinitions, language }) => {
              if (language.value !== currentLanguage().value) {
                i18n.changeLanguage(language.value);
              }
              hotkeysManager.setHotkeys(hotkeyDefinitions);
              hide();
            },
            onReset: () => hotkeysManager.restoreDefaultBindings(),
            hotkeysModule: hotkeys,
          },
        }),
    },
    // Always show logout option, handling both OIDC and regular auth
    {
      title: t('Header:Logout'),
      icon: 'power-off',
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      menuOptions={menuOptions}
      isReturnEnabled={!!appConfig.showStudyList}
      onClickReturnButton={onClickReturnButton}
      WhiteLabeling={appConfig.whiteLabeling}
      showPatientInfo={appConfig.showPatientInfo}
      servicesManager={servicesManager}
      Secondary={
        <Toolbar
          servicesManager={servicesManager}
          buttonSection="secondary"
        />
      }
      appConfig={appConfig}
    >
      <ErrorBoundary context="Primary Toolbar">
        <div className="relative flex justify-center gap-[4px]">
          <Toolbar servicesManager={servicesManager} />
        </div>
      </ErrorBoundary>
    </Header>
  );
}

export default ViewerHeader;
