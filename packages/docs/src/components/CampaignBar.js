import styles from './CampaignBar.module.css';
import React, { useState, useEffect } from 'react';
import { Campaign } from '@lukasbach/campaigns-react';

const localStorageKey = 'hide-campaign-bar';
const days = 1000 * 60 * 60 * 24;

export default function CampaignBar() {
  const [hide, setHide] = useState(true);

  useEffect(() => {
    const hideDate = localStorage.getItem(localStorageKey);
    setHide(!!hideDate && parseInt(hideDate) > Date.now() - days * 3);
  }, []);

  if (hide) {
    return null;
  }

  return (
    <Campaign
      dontRenderIfLoading={true}
      ignore={['react-complex-tree']}
      changeInterval={30}
      weighted={true}
      render={campaign =>
        campaign && (
          <div className={styles.bar}>
            <a href={campaign.url} target="_blank" className={styles.content} title={campaign.long ?? campaign.short}>
              <div className={styles.alsocheckout}>Also checkout:</div>
              <div className={styles.title}>{campaign.product}</div>
              <div className={styles.description}>{campaign.short}</div>
            </a>
            <div
              aria-label="Hide banner"
              className={styles.close}
              onClick={() => {
                setHide(true);
                localStorage.setItem(localStorageKey, `${Date.now()}`);
              }}
            >
              ×
            </div>
          </div>
        )
      }
    />
  );
}
