### Features

- Add `setDomFocus` argument to focus-item methods to provide an escape hatch to set the focus state of an item in RCT
  without updating the DOM focus. This defaults to true in all existing methods to maintain the current behavior if
  it is absent.

### Bug Fixes

- Fix a bug where the `parentId` property in the `renderItemsContainer` render method was incorrectly set to the tree id
  for the root container.