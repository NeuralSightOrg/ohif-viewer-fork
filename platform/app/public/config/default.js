window.config = {
  routerBasename: '/',
  extensions: [],
  modes: [],

  // This is an array, but we'll only use the first entry for now
  // oidc: [
  //   {
  //     // ~ REQUIRED
  //     // Authorization Server URL
  //     authority: 'http://localhost:3002',
  //     client_id: 'ohif-viewer',
  //     redirect_uri: '/callback',
  //     response_type: 'id_token token',
  //     scope: 'openid profile email',
  //     // ~ OPTIONAL
  //     post_logout_redirect_uri: '/logout-redirect.html',
  //     revoke_uri: 'http://localhost:3002/revoke',
  //     automaticSilentRenew: true,
  //     revokeAccessTokenOnSignout: true,
  //   },
  // ],

  customizationService: {},
  showStudyList: true,
  maxNumberOfWebWorkers: 3,
  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  experimentalStudyBrowserSort: false,
  strictZSpacingForVolumeViewport: true,
  groupEnabledModesFirst: true,
  maxNumRequests: {
    interaction: 100,
    thumbnail: 75,
    prefetch: 25,
  },
  defaultDataSourceName: 'local5000',
  dataSources: [
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
      sourceName: 'local5000',
      configuration: {
        friendlyName: 'Static WADO Local Data',
        name: 'DCM4CHEE',
        wadoUriRoot: 'https://orthancviewer.neuralsight.ai/dicom-web',
        qidoRoot: 'https://orthancviewer.neuralsight.ai/dicom-web',
        wadoRoot: 'https://orthancviewer.neuralsight.ai/dicom-web',
        qidoSupportsIncludeField: false,
        supportsReject: true,
        supportsStow: true,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: false,
        supportsWildcard: true,
        staticWado: true,
        singlepart: 'bulkdata,video',
        bulkDataURI: {
          enabled: true,
          relativeResolution: 'studies',
        },
      },
    },
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomlocal',
      sourceName: 'dicomlocal',
      configuration: {
        friendlyName: 'dicom local',
      },
    },
  ],
  httpErrorHandler: error => {
    const { status, message } = error;
    console.warn(`HTTP Error: ${status}`, message || 'No additional information available');
    switch (status) {
      case 400:
        console.warn('Bad Request: The server could not understand the request.');
        break;
      case 401:
        console.warn('Unauthorized: Access is denied due to invalid credentials.');
        break;
      case 403:
        console.warn('Forbidden: You do not have permission to access this resource.');

        break;
      case 404:
        console.warn('Not Found: The requested resource could not be found.');

        break;
      case 500:
        console.warn('Internal Server Error: Please try again later.');

        break;
      default:
        console.warn('An unexpected error occurred.');

        break;
    }
    console.warn('Redirecting to the homepage or error page...');
    // window.location.href = 'https://ohif.org/';
  },
  whiteLabeling: {
    createLogoComponentFn: function (React) {
      return React.createElement(
        'div',
        { className: 'flex items-center' },
        React.createElement(
          'a',
          {
            target: '_self',
            rel: 'noopener noreferrer',
            className: 'text-purple-600 line-through mr-4',
            href: '/',
          },
          React.createElement('img', {
            src: '/assets/logo.gif',
            className: 'w-8 h-8',
          })
        ),
        React.createElement(
          'a',
          {
            href: '/dashboard',
            className: 'text-blue-600 hover:underline hover:text-white',
          },
          'Dashboard'
        )
      );
    },
  },
  hotkeys: [
    {
      commandName: 'incrementActiveViewport',
      label: 'Next Viewport',
      keys: ['right'],
    },
    {
      commandName: 'decrementActiveViewport',
      label: 'Previous Viewport',
      keys: ['left'],
    },
    { commandName: 'rotateViewportCW', label: 'Rotate Right', keys: ['r'] },
    { commandName: 'rotateViewportCCW', label: 'Rotate Left', keys: ['l'] },
    { commandName: 'invertViewport', label: 'Invert', keys: ['i'] },
    {
      commandName: 'flipViewportHorizontal',
      label: 'Flip Horizontally',
      keys: ['h'],
    },
    {
      commandName: 'flipViewportVertical',
      label: 'Flip Vertically',
      keys: ['v'],
    },
    { commandName: 'scaleUpViewport', label: 'Zoom In', keys: ['+'] },
    { commandName: 'scaleDownViewport', label: 'Zoom Out', keys: ['-'] },
    { commandName: 'fitViewportToWindow', label: 'Zoom to Fit', keys: ['='] },
    { commandName: 'resetViewport', label: 'Reset', keys: ['space'] },
    { commandName: 'nextImage', label: 'Next Image', keys: ['down'] },
    { commandName: 'previousImage', label: 'Previous Image', keys: ['up'] },
    {
      commandName: 'previousViewportDisplaySet',
      label: 'Previous Series',
      keys: ['pagedown'],
    },
    {
      commandName: 'nextViewportDisplaySet',
      label: 'Next Series',
      keys: ['pageup'],
    },
    {
      commandName: 'setToolActive',
      commandOptions: { toolName: 'Zoom' },
      label: 'Zoom',
      keys: ['z'],
    },
    // Window level presets
    {
      commandName: 'windowLevelPreset1',
      label: 'W/L Preset 1',
      keys: ['1'],
    },
    {
      commandName: 'windowLevelPreset2',
      label: 'W/L Preset 2',
      keys: ['2'],
    },
    {
      commandName: 'windowLevelPreset3',
      label: 'W/L Preset 3',
      keys: ['3'],
    },
    {
      commandName: 'windowLevelPreset4',
      label: 'W/L Preset 4',
      keys: ['4'],
    },
    {
      commandName: 'windowLevelPreset5',
      label: 'W/L Preset 5',
      keys: ['5'],
    },
    {
      commandName: 'windowLevelPreset6',
      label: 'W/L Preset 6',
      keys: ['6'],
    },
    {
      commandName: 'windowLevelPreset7',
      label: 'W/L Preset 7',
      keys: ['7'],
    },
    {
      commandName: 'windowLevelPreset8',
      label: 'W/L Preset 8',
      keys: ['8'],
    },
    {
      commandName: 'windowLevelPreset9',
      label: 'W/L Preset 9',
      keys: ['9'],
    },
  ],
  // apiBaseURL: 'https://api.neuralsight.ai/api',
  apiBaseURL: 'http://192.168.100.66:8080/api',
  dashboardURL: 'http://localhost:3001',
};
