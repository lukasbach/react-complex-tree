import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Unopinionated',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Accessible',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Powerful Drag and Drop',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Full Keyboard Controls',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Multi-Selection',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Renaming built in',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Search Functionality',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Multi-Tree Environments',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Controlled and Uncontrolled interfaces',
    description: (
      <>
        TODO
      </>
    ),
  },
  {
    title: 'Powered by React',
    description: (
      <>
        TODO
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
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
