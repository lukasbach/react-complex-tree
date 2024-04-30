import * as React from 'react';
import {
  FormHTMLAttributes,
  HTMLProps,
  InputHTMLAttributes,
  useRef,
  useState,
} from 'react';
import { TreeItemIndex } from '../types';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useHotkey } from '../hotkeys/useHotkey';
import { useSideEffect } from '../useSideEffect';
import { useCallSoon } from '../useCallSoon';

export const TreeItemRenamingInput: React.FC<{
  itemIndex: TreeItemIndex;
}> = props => {
  const { renderers, treeInformation, setRenamingItem, treeId } = useTree();
  const environment = useTreeEnvironment();
  const inputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<any>(null);
  const item = environment.items[props.itemIndex];
  const [title, setTitle] = useState(environment.getItemTitle(item));
  const callSoon = useCallSoon(true);

  const abort = () => {
    environment.onAbortRenamingItem?.(item, treeInformation.treeId);
    setRenamingItem(null);
    callSoon(() => {
      environment.setActiveTree(treeId);
    });
  };

  const confirm = () => {
    environment.onRenameItem?.(item, title, treeInformation.treeId);
    setRenamingItem(null);
    callSoon(() => {
      environment.setActiveTree(treeId);
    });
  };

  useSideEffect(
    () => {
      environment.setActiveTree(treeId);

      if (environment.autoFocus ?? true) {
        inputRef.current?.select();
        inputRef.current?.focus?.();
      }
    },
    [environment, treeId],
    []
  );

  useHotkey(
    'abortRenameItem',
    () => {
      abort();
    },
    true,
    true
  );

  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    value: title,
    onChange: e => {
      setTitle(e.target.value);
    },
    onBlur: e => {
      if (!e.relatedTarget || e.relatedTarget !== submitButtonRef.current) {
        abort();
      }
    },
    'aria-label': 'New item name',
    tabIndex: 0,
  };

  const submitButtonProps: HTMLProps<HTMLButtonElement | HTMLInputElement> = {
    onClick: e => {
      e.stopPropagation();
      confirm();
    },
  };

  const formProps: FormHTMLAttributes<HTMLFormElement> = {
    onSubmit: e => {
      e.preventDefault();
      confirm();
    },
  };

  return renderers.renderRenameInput({
    item,
    inputRef,
    submitButtonProps,
    submitButtonRef,
    formProps,
    inputProps,
  }) as JSX.Element;
};
