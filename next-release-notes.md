### Features

- Add `setDomFocus` argument to focus-item methods to provide an escape hatch to set the focus state of an item in RCT
  without updating the DOM focus. This defaults to true in all existing methods to maintain the current behavior if
  it is absent.