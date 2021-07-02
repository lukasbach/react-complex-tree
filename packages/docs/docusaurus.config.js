const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'React Complex Tree',
  tagline: 'Unopinionated Accessible Tree Component with Mutli-Select and Drag-And-Drop',
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
          href: 'https://rct.lukasbach.com/storybook',
          label: 'Storybook',
          position: 'left',
        },
        {
          href: 'https://rct.lukasbach.com/todo',
          label: 'Playground',
          position: 'left',
        },
        {
          href: 'https://github.com/lukasbach/react-complex-tree',
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
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Lukas Bach. Built with Docusaurus.`,
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
          editUrl:
            'https://github.com/lukasbach/react-complex-tree/edit/main/packages/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/lukasbach/react-complex-tree/edit/main/packages/docs/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
          packageCss: require.resolve('react-complex-tree/lib/style.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-react-docgen-typescript',
      {
        // pass in a single string or an array of strings
        src: ['../core/src/**/*.tsx', ], //'!../core/src/**/*test.*', '!../core/src/**/*stories.*'],
        tsconfig: '../core/tsconfig.json',
        // global: true,
        parserOptions: {
          // pass parserOptions to react-docgen-typescript
          // here is a good starting point which filters out all
          // types from react
          propFilter: (prop, component) => {
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
          categoryLabel: 'API'
        }
      },
    ],
  ],
};
