import styles from './CampaignBar.module.css';
import React, { useState, useEffect } from 'react';

const localStorageKey = 'hide-campaign-bar';
const days = 1000 * 60 * 60 * 24;

export default function CampaignBar() {
  const [hide, setHide] = useState(true);

  useEffect(() => {
    const hideDate = localStorage.getItem(localStorageKey);
    setHide(!!hideDate && parseInt(hideDate) > Date.now() - days * 3);
  }, []);

  // if (hide) {
  //   return null;
  // }

  return (
    <div className={styles.bar}>
      <a href="https://headless-tree.lukasbach.com" target="_blank" className={styles.content} >
        <div className={styles.alsocheckout}>Headless Tree</div>
        <div className={styles.title}>A successor for react-complex-tree, Headless Tree, is now available!</div>
      </a>
      {/*<div
        aria-label="Hide banner"
        className={styles.close}
        onClick={() => {
          setHide(true);
          localStorage.setItem(localStorageKey, `${Date.now()}`);
        }}
      >
        ×
      </div>*/}
    </div>
  );
}
