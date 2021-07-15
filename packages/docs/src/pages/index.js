import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import { StoryEmbed } from '../components/StoryEmbed';
import CampaignBar from '../components/CampaignBar';
import Head from '@docusaurus/Head';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--5', styles.heroBannerText)}>
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link className="button button--primary button--lg" to="/docs/getstarted">
                Get Started
              </Link>
              <a className="button button--secondary button--lg" href="/storybook">
                More Demos
              </a>
              <Link className="button button--secondary button--lg" to="/docs/api">
                API
              </Link>
            </div>
          </div>
          <div className="col col--7">
            <StoryEmbed
              storyName="auto-demo-autodemo-component--multi-tree-demo"
              iframeProps={{ minHeight: 380, width: 600 }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <CampaignBar />
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <Head>
        <title>React Complex Tree</title>
        <meta name="title" content="React Complex Tree" />
        <meta
          name="keywords"
          content="react, search, dnd, keyboard, tree, typescript, javascript, js, component, types, drag-and-drop, rename, hotkeys, accessible, unopinionated, draggable, drag"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rct.lukasbach.com" />
        <meta property="og:title" content="React Complex Tree" />
        <meta
          property="og:description"
          content="Unopinionated Accessible Tree Component with Multi-Select and Drag-And-Drop"
        />
        <meta property="og:image" content="https://rct.lukasbach.com/static/img/example/06.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://rct.lukasbach.com" />
        <meta property="twitter:title" content="React Complex Tree" />
        <meta
          property="twitter:description"
          content="Unopinionated Accessible Tree Component with Multi-Select and Drag-And-Drop"
        />
        <meta property="twitter:image" content="https://rct.lukasbach.com/static/img/example/06.png" />
        <meta name="robots" content="index, follow, max-snippet:[120], max-image-preview:[large]" />
      </Head>
    </Layout>
  );
}
