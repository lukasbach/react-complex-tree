# React Complex Tree

![](https://badgen.net/npm/v/react-complex-tree)
![](https://badgen.net/npm/types/react-complex-tree)
[![](https://badgen.net/bundlephobia/dependency-count/react-complex-tree)](https://bundlephobia.com/package/react-complex-tree)
[![](https://badgen.net/bundlephobia/minzip/react-complex-tree)](https://bundlephobia.com/package/react-complex-tree)
[![npm downloads](https://badgen.net/npm/dt/react-complex-tree)](https://www.npmjs.com/package/react-complex-tree)

[![Demo for React Complex Tree](https://raw.githubusercontent.com/lukasbach/react-complex-tree/main/demo.gif)](https://rct.lukasbach.com/docs/getstarted)

> An Unopinionated Accessible Tree Component with Multi-Select and Drag-And-Drop

<a href="https://www.producthunt.com/posts/react-complex-tree?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-react-complex-tree" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=303494&theme=light" alt="React Complex Tree - Unopinionated accessible tree component with drag and drop | Product Hunt" width="250" height="54" /></a>

Look into the [official documentation](https://rct.lukasbach.com/) to see more examples
and more comprehensive documentation. Many common issues or questions are covered in the [FAQ page](https://rct.lukasbach.com/docs/faq).

The Changelog is available at [https://rct.lukasbach.com/docs/changelog](https://rct.lukasbach.com/docs/changelog).
Check the [v2 release notes](https://rct.lukasbach.com/docs/changelog/#200---12052022) when migrating from v1.x to v2.x.

## Sponsors

The development of react-complex-tree is supported by the community. Special thanks to:

<br />
<div align="center">
  <a href="https://modyfi.com#gh-light-mode-only">
    <div>
      <img src="https://lukasbach.com/thanks/modyfi-brand-logo-black.svg#gh-light-mode-only" width="250" alt="Modyfi" />
    </div>
  </a>
  <a href="https://modyfi.com#gh-dark-mode-only">
    <div>
      <img src="https://lukasbach.com/thanks/modyfi-brand-logo.svg#gh-dark-mode-only" width="250" alt="Modyfi" />
    </div>
  </a>
</div>
<br />

Find out [how to support the development of react-complex-tree](https://github.com/sponsors/lukasbach).

## Installation

To start using React Complex Tree, install it to your project as a dependency via

```
npm install react-complex-tree
yarn add react-complex-tree
```

then import it and add your tree structure with

```typescript jsx
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';

<UncontrolledTreeEnvironment
  dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({ ...item, data }))}
  getItemTitle={item => item.data}
  viewState={{}}
>
  <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
</UncontrolledTreeEnvironment>;
```

More details at [the Get Started Guide](https://rct.lukasbach.com/docs/getstarted). The [guide on how to integrate
data with a static tree data provider](https://rct.lukasbach.com/docs/guides/static-data-provider) is also
a good starting point to understand how to integrate data with React Complex Tree.

## Features

- **Unopinionated**

  React Complex Tree does not make any assumptions about any aesthetics of your web design or any technologies that you are using. The rendering is entirely up to you, and every node written to DOM can be customized. Sensible defaults styled by easily customizable CSS classes are provided to ease integration.

- **Accessible**

  The tree structure conforms to W3C's specification for accessible trees. It supports screen readers and implements all common keyboard interactions so that every interaction, from moving the focus to dragging items, is possible without using the mouse.

- **Powerful Drag and Drop**

  The tree provides the expected capabilities that power users expect from advanced tooling. Select as many items as you want, and drag them at any location within the same or any other tree! React Complex Tree comes with many customization options for Drag and Drop, such as disallowing reordering or enabling dragging or dropping on certain items only.

- **Full Keyboard Controls**

  The tree is entirely controllable via keyboard. It implements all controls suggested by the W3C to make trees accessible, and provides further controls for Drag and Drop, searching or renaming items.

- **Zero Dependencies**

  We know how annoying it is to add a package and end up with hundreds of peer dependencies. Because React Complex Tree does not make any assumptions on your any dependencies, we also do not need to clutter your project with further packages. When adding React Complex Tree to your package, you add only that and no other dependencies.

- **Multi-Selection**

  Other than other more simple tree libraries, React Complex Tree allows you to select as many items as you want, and move them all at once by dragging to a different location. Why provide your users with less functionality, when you can offer powerful tree capabilities with no additional effort? Try it out on the demo above and select multiple items at once by holding control on your keyboard while clicking on items, then dragging all at once to a different location.

- **Renaming built-in**

  React Complex Tree provides renaming as native feature with its capabilities. Select any item and press F2, to start renaming the item. This provides a more intuitive way of renaming items for users without implementing custom dialog solutions that are more disruptive to your users' workflow.

- **Search Functionality**

  Have you ever tried to find that one file in an enormous chaotic file tree that you know is there, but have no idea where? Just start typing while focusing the tree, and the first item matching your search will show up. This also improves accessibility for the tree as keyboard-only users can more easily navigate the tree structure.

- **Multi-Tree Environments**

  You can use several trees on your web app that share a common state, and are able to interact with one another. The state and tree items are provided to a common react provider component, and as many trees as you want can easily be integrated by just adding tree components below the provider. The trees do not need to provide their own state, they just need an ID and their root item, all other logic is handled by the provider.

- **Controlled and Uncontrolled interfaces**

  The easiest way of using React Complex Tree is using an uncontrolled tree environment that maintains the tree state, i.e. which items are selected, expanded, etc., itself. You only need to supply a data provider that defines how items are asynchronously loaded, and the environment does the rest. However, if you want more control, you can instead use the controlled environment for full customizable.

- **Powered by React and TypeScript**

  React Complex Tree is powered by React (duh) and is easily integrated into existing React projects by just importing and using the provided components. Comprehensive type information is given as TypeScript interfaces, that ease the integration and provide additional type safety, no matter whether you use TypeScript in your project or not.


# Hints for Contributing

If you want to develop RCT locally, here are some hints:

- Use [volta](https://volta.sh) to make sure you have a compatible NodeJS and Yarn version installed
- Run `yarn` to install dependencies
- Run `yarn build` once locally before running any dev commands
- Run `yarn start` to start docusaurus and the package in watch mode, and/or `yarn storybook` to run storybook
- Make sure to run linter and tests before pushing changes
