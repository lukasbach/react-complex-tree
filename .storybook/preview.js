import { sortStories } from './utils/story-helpers';
import { storyOrder } from './utils/storyOrder';
import '../packages/core/src/renderers/style.css';

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