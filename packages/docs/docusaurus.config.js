const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const links = {
  storybook: 'https://rct.lukasbach.com/storybook',
  sandbox: 'https://codesandbox.io/s/react-complex-tree-playground-u5tjs',
  github: 'https://github.com/lukasbach/react-complex-tree',
};

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'React Complex Tree',
  tagline: 'Unopinionated Accessible Tree Component with Multi-Select and Drag-And-Drop',
  url: 'https://rct.lukasbach.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'lukasbach', // Usually your GitHub org/user name.
  projectName: 'react-complex-tree', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'React Complex Tree',
      logo: {
        alt: 'React Complex Tree Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'getstarted',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: links.storybook,
          label: 'Storybook',
          position: 'left',
        },
        {
          href: links.sandbox,
          label: 'Playground',
          position: 'left',
        },
        {
          href: links.github,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: '/docs/getstarted',
            },
            {
              label: 'Guides',
              to: '/docs/guides/uncontrolled-environment',
            },
            {
              label: 'API Specification',
              to: '/docs/api',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub',
              href: links.github,
            },
            {
              label: 'Storybook',
              href: links.storybook,
            },
            {
              label: 'Code Sandbox',
              href: links.sandbox,
            },
          ],
        },
        {
          title: 'More from me',
          items: [
            {
              label: 'My GitHub profile',
              href: 'https://github.com/lukasbach',
            },
            {
              label: 'My personal homepage',
              href: 'https://lukasbach.com',
            },
            {
              label: 'Yana',
              href: 'https://yana.js.org',
            },
            {
              label: 'DevSession',
              href: 'https://devsession.js.org',
            },
            {
              label: 'Orion',
              href: 'https://orion.lukasbach.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://lukasbach.com" target="_blank">Lukas Bach</a>. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/lukasbach/react-complex-tree/edit/main/packages/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/lukasbach/react-complex-tree/edit/main/packages/docs/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
          packageCss: require.resolve('react-complex-tree/lib/style.css'),
        },
      },
    ],
  ],
  plugins: [
    ['@docusaurus/theme-live-codeblock', {}],
    [
      'docusaurus-plugin-react-docgen-typescript',
      {
        // pass in a single string or an array of strings
        src: ['../core/src/**/*.tsx'], //'!../core/src/**/*test.*', '!../core/src/**/*stories.*'],
        tsconfig: '../core/tsconfig.json',
        // global: true,
        parserOptions: {
          // pass parserOptions to react-docgen-typescript
          // here is a good starting point which filters out all
          // types from react
          propFilter: prop => {
            if (prop.parent) {
              return !prop.parent.fileName.includes('@types/react');
            }

            return true;
          },
        },
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      // Plugin / TypeDoc options
      {
        entryPoints: ['../core/src/index.ts'],
        tsconfig: '../core/tsconfig.json',
        sidebar: {
          categoryLabel: 'API',
        },
      },
    ],
  ],
};
