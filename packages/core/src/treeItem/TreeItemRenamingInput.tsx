import * as React from 'react';
import { TreeItemIndex } from '../types';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { Ref, RefObject, useEffect, useRef, useState } from 'react';

export const TreeItemRenamingInput: React.FC<{
  itemIndex: TreeItemIndex;
}> = props => {
  const { renderers, treeInformation } = useTree();
  const environment = useTreeEnvironment();
  const inputRef = useRef<HTMLInputElement>(null);
  const item = environment.items[props.itemIndex];
  const [title, setTitle] = useState(environment.getItemTitle(item));

  const abort = () => {
    // environment.onStartRenamingItem()
    // TODO store renaming details in tree, not externally
  };

  const confirm = () => {

  };

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [inputRef.current]);

  return (
    renderers.renderRenameInput(
      item,
      {
        value: title,
        onChange: e => {
          console.log(e)
          setTitle(e.target.value)
        },
        onBlur: () => {

        },
        'aria-label': `New item name`, // TODO
        tabIndex: 0
      },
      inputRef,
      {
        onClick: e => {

        }
      },
      {
        onSubmit: e => {
          e.preventDefault();
        }
      }
    )
  ) as JSX.Element;
};
