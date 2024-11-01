import React from 'react';
import classNames from 'classnames';

import Icon from '../Icon';
import ProgressLoadingBar from '../ProgressLoadingBar';

/**
 *  A React component that renders a loading indicator.
 * if progress is not provided, it will render an infinite loading indicator
 * if progress is provided, it will render a progress bar
 * Optionally a textBlock can be provided to display a message
 */
function LoadingIndicatorProgress({ className, textBlock, progress }) {
  return (
    <div
      className={classNames(
        'absolute top-0 left-0 z-50 flex flex-col items-center justify-center space-y-5',
        className
      )}
    >
      {/* <Icon
        name="loading-ohif-mark"
        className="h-12 w-12 text-white"

      /> */}
      <div className="relative h-24 w-24">
        {/* Subtle overlay */}
        <div className="absolute inset-0 rounded-full bg-black/10" />
        <img
          src="/assets/logo.gif"
          alt="Neural Sight Logo"
          className="h-full w-full rounded-full object-contain"
        />
      </div>

      <div className="w-48">
        <ProgressLoadingBar progress={progress} />
      </div>
      {textBlock}
    </div>
  );
}

export default LoadingIndicatorProgress;
