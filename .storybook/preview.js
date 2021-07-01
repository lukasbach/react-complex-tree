import { sortStories } from './utils/story-helpers';
import { storyOrder } from './utils/storyOrder';
import React from 'react';

import '../packages/core/src/renderers/style.css';
import '../packages/autodemo/src/styles.css';

export const parameters = {
  options: {
    storySort: sortStories(storyOrder),
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOnDifferentValues: true,
    collapseGroups: true,

  });
}
