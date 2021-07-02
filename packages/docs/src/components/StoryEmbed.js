import * as React from 'react';
import IframeResizer from 'iframe-resizer-react';

export const StoryEmbed = ({ storyName, iframeProps }) => {

  return (
    <IframeResizer
      src={`http://localhost:6006/iframe.html?id=${storyName}&args=&viewMode=story`}
      frameBorder={0}
      allowtransparency="true"
      style={(!iframeProps.width && !iframeProps.minWidth && !iframeProps.maxWidth) ? { width: '1px', minWidth: '100%' } : {}}
      {...iframeProps ?? {}}
    />
  );
};
