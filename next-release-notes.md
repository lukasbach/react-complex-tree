### Bug Fixes and Improvements
- If a tree environment renders without an item defined as focused in its `viewState` parameter, it will invoke the `onFocusItem`
  prop with the first item in the tree during its render. In the past, this was implicitly and silently set in the `viewState` prop,
  now this assignment is triggered explicitly with the handler call (#363)