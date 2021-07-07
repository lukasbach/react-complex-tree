import * as React from 'react';
import IframeResizer from 'iframe-resizer-react';

export const StoryEmbed = ({ storyName, iframeProps }) => {
  const baseUrl = process.env.NODE_ENV === 'development' ? `http://localhost:6006` : `/storybook`;

  return (
    <IframeResizer
      src={`${baseUrl}/iframe.html?id=${storyName}&args=&viewMode=story`}
      frameBorder={0}
      allowtransparency="true"
      style={
        !iframeProps.width && !iframeProps.minWidth && !iframeProps.maxWidth ? { width: '1px', minWidth: '100%' } : {}
      }
      {...(iframeProps ?? {})}
    />
  );
};
