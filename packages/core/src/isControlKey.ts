import React from 'react';

export const isControlKey = (e: React.MouseEvent<any, any>) => {
  return e.ctrlKey || (navigator.platform.toUpperCase().indexOf('MAC') >= 0 && e.metaKey);
};
