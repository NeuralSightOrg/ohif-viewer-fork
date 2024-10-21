import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@ohif/ui';

// Route Components
import DataSourceWrapper from './DataSourceWrapper';
import WorkList from './WorkList';
import Local from './Local';
import Debug from './Debug';
import NotFound from './NotFound';
import buildModeRoutes from './buildModeRoutes';
import PrivateRoute from './PrivateRoute';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Login from '../pages/auth/Login';
import View from '../pages/View';
import Entry from '../pages/Entry';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { Reports } from '../pages/reports/Reports';
import Logout from '../pages/auth/Logout';
import UserProfile from '../pages/user/Profile';
import UserManagement from '../pages/user/UserManagement';

const NotFoundServer = ({
  message = 'Unable to query for studies at this time. Check your data source configuration or network connection',
}) => {
  return (
    <div className="absolute flex h-full w-full items-center justify-center text-white">
      <div>
        <h4>{message}</h4>
      </div>
    </div>
  );
};

NotFoundServer.propTypes = {
  message: PropTypes.string,
};

const NotFoundStudy = () => {
  return (
    <div className="absolute flex h-full w-full items-center justify-center text-white">
      <div>
        <h4>
          One or more of the requested studies are not available at this time. Return to the{' '}
          <Link
            className="text-primary-light"
            to={'/'}
          >
            study list
          </Link>{' '}
          to select a different study to view.
        </h4>
      </div>
    </div>
  );
};

NotFoundStudy.propTypes = {
  message: PropTypes.string,
};

const newRoutes = [
  {
    path: '/dashboard',
    children: DashboardPage,
    private: true,
  },
  {
    path: '/login',
    children: Login,
    private: false,
  },
  {
    path: '/user-management',
    children: UserManagement,
    private: true,
  },
  {
    path: '/reports',
    children: Reports,
    private: true,
  },
  {
    path: '/view',
    children: View,
    private: false,
  },
  {
    path: '/entry',
    children: Entry,
    private: true,
  },
  {
    path: '/profile',
    children: UserProfile,
    private: true,
  },
  {
    path: '/logout',
    children: Logout,
    private: true,
  },
];

// TODO: Include "routes" debug route if dev build
const bakedInRoutes = [
  {
    path: '/notfoundserver',
    children: NotFoundServer,
  },
  {
    path: '/notfoundstudy',
    children: NotFoundStudy,
  },
  {
    path: '/debug',
    children: Debug,
  },
  {
    path: '/local',
    children: Local.bind(null, { modePath: '' }), // navigate to the worklist
  },
  {
    path: '/localbasic',
    children: Local.bind(null, { modePath: 'viewer/dicomlocal' }),
  },
];

// NOT FOUND (404)
const notFoundRoute = { component: NotFound };

const createRoutes = ({
  modes,
  dataSources,
  extensionManager,
  servicesManager,
  commandsManager,
  hotkeysManager,
  routerBasename,
  showStudyList,
}: withAppTypes) => {
  const routes =
    buildModeRoutes({
      modes,
      dataSources,
      extensionManager,
      servicesManager,
      commandsManager,
      hotkeysManager,
    }) || [];

  const { customizationService } = servicesManager.services;

  const WorkListRoute = {
    path: '/',
    children: DataSourceWrapper,
    private: true,
    props: { children: WorkList, servicesManager, extensionManager },
  };

  const customRoutes = customizationService.getGlobalCustomization('customRoutes');
  const allRoutes = [
    ...routes,
    ...newRoutes,
    ...(showStudyList ? [WorkListRoute] : []),
    ...(customRoutes?.routes || []),
    ...bakedInRoutes,
    customRoutes?.notFoundRoute || notFoundRoute,
  ];

  function RouteWithErrorBoundary({ route, ...rest }) {
    return (
      <ErrorBoundary
        context={`Route ${route.path}`}
        fallbackRoute="/"
        isPage={undefined}
      >
        <route.children
          {...rest}
          {...route.props}
          route={route}
          servicesManager={servicesManager}
          extensionManager={extensionManager}
          hotkeysManager={hotkeysManager}
        />
      </ErrorBoundary>
    );
  }

  return (
    <Routes>
      {allRoutes.map((route, i) => {
        if (route.path === '/viewer') {
          route.private = false;
        }
        return route.private === true ? (
          <Route
            key={i}
            path={route.path}
            element={
              <PrivateRoute>
                <RouteWithErrorBoundary route={route} />
              </PrivateRoute>
            }
          />
        ) : (
          <Route
            key={i}
            path={route.path}
            element={<RouteWithErrorBoundary route={route} />}
          />
        );
      })}
    </Routes>
  );
};

export default createRoutes;
