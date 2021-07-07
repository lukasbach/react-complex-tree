import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Unopinionated',
    description: (
      <>
        React Complex Tree does not make any assumptions about any aesthetics of your web design or
        any technologies that you are using. The rendering is entirely up to you, and every
        node written to DOM can be customized. Sensible defaults styled by easily customizable CSS
        classes are provided to ease integration.
      </>
    ),
  },
  {
    title: 'Accessible',
    description: (
      <>
        The tree structure conforms to{' '}
        <a href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/treeview/treeview-2/treeview-2a.html" target="_blank">
          W3C's specification for accessible trees
        </a>. It supports screen readers and implements all common keyboard interactions so that every interaction,
        from moving the focus to dragging items, is possible without using the mouse.
      </>
    ),
  },
  {
    title: 'Powerful Drag and Drop',
    description: (
      <>
        The tree provides the expected capabilities that power users expect from advanced tooling.
        Select as many items as you want, and drag them at any location within the same or any other tree!
        React Complex Tree comes with many customization options for Drag and Drop, such as disallowing reordering or
        enabling dragging or dropping on certain items only.
      </>
    ),
  },
  {
    title: 'Full Keyboard Controls',
    description: (
      <>
        The tree is entirely controllable via keyboard. It implements all controls{' '}
        <a href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/treeview/treeview-2/treeview-2a.html" target="_blank">
          suggested by the W3C to make trees accessible
        </a>, and provides further controls for Drag and Drop, searching or renaming items.
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    description: (
      <>
        We know how annoying it is to add a package and end up with hundreds of peer dependencies. Because
        React Complex Tree does not make any assumptions on your any dependencies, we also do not need to
        clutter your project with further packages. When adding React Complex Tree to your package, you
        add only that and no other dependencies.
      </>
    ),
  },
  {
    title: 'Multi-Selection',
    description: (
      <>
        Other than other more simple tree libraries, React Complex Tree allows you to select as many items as
        you want, and move them all at once by dragging to a different location. Why provide your users with less
        functionality, when you can settle with powerful tree capabilities with no additional effort? Try it out on
        the demo above and select multiple items at once by holding control on your keyboard while clicking on items,
        then dragging all at once to a different location.
      </>
    ),
  },
  {
    title: 'Renaming built in',
    description: (
      <>
        React Complex Tree provides renaming as native feature with its capabilities. Select any item and press
        F2, to start renaming the item. This provides a more intuitive way of renaming items for users without
        implementing custom dialog solutions that are more disruptive to your users workflow.
      </>
    ),
  },
  {
    title: 'Search Functionality',
    description: (
      <>
        Have you ever tried to find that one file in an enormous chaotic file tree that you know is there, but
        have no idea where? Just start typing while focusing the tree, and the first item matching your search
        will show up. This also improves accessibility for the tree as keyboard-only users can more easily navigate
        the tree structure.
      </>
    ),
  },
  {
    title: 'Multi-Tree Environments',
    description: (
      <>
        You can use several trees on your web app that share a common state, and are able to interact with
        one another. The state and tree items are provided to a common react provider component, and as many
        trees as you want can easily be integrated by just adding tree components below the provider. The trees
        do not need to provide their own state, they just need an ID and their root item, all other logic
        is handled by the provider.
      </>
    ),
  },
  {
    title: 'Controlled and Uncontrolled interfaces',
    description: (
      <>
        The most easiest way of using React Complex Tree is using an uncontrolled tree environment that
        maintains the tree state, i.e. which items are selected, expanded, etc. itself. You only need to supply a
        data provider that defines how items are asynchronously loaded, and the environment does the rest. However,
        if you want more control, you can instead use the controlled environment for full customizable.
      </>
    ),
  },
  {
    title: 'Powered by React and TypeScript',
    description: (
      <>
        React Complex Tree is powered by React (duh) and is easily integrated in existing React projects by
        just importing and using the provided components. Comprehensive type information is given as TypeScript
        interfaces, that ease the integration and provide additional type safety, no matter whether you use
        TypeScript in your project or not.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="padding-horiz--md padding-vert--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
