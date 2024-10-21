import { id } from './id';
import { ReportPanel } from './ReportPanel';

/**
 * You can remove any of the following modules if you don't need them.
 */
export default {
  /**
   * Only required property. Should be a unique value across all extensions.
   * You ID can be anything you want, but it should be unique.
   */
  id,
  getPanelModule: ({ servicesManager, commandsManager, extensionManager }) => {
    return [
      {
        name: 'report',
        iconName: 'clipboard',
        iconLabel: 'Reports',
        label: 'Reports',
        component: ReportPanel,
      },
    ];
  },
  getToolbarModule: ({ servicesManager, commandsManager, extensionManager }) => {
    // return {
    //   definitions: [
    //     {
    //       id: 'custom-report',
    //       label: 'Custom Report',
    //       icon: 'clipboard',
    //       type: 'tool',
    //       commandName: 'myCustomCommand',
    //       tooltip: 'Activate My Custom Tool',
    //     },
    //   ],
    //   defaultButtonSize: 'small',
    // };
  },
  getCommandsModule: ({ servicesManager, commandsManager, extensionManager }) => {
    // return {
    //   definitions: {
    //     myCustomCommand: {
    //       commandFn: () => {
    //         console.log('My custom command executed');
    //       },
    //       storeContexts: [],
    //       options: {},
    //     },
    //   },
    // };
  },
};
