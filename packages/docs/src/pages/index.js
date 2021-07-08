import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import { StoryEmbed } from '../components/StoryEmbed';
import CampaignBar from '../components/CampaignBar';

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
    </Layout>
  );
}
