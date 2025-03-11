### Breaking Changes
- Changed default keybinding of `startProgrammaticDnd` to `Control + Shift + D` (from `Control + D`) since the old
  binding conflicted with the default browser behavior of bookmarking the current page. You can customize the
  value with the `keyboardBindings` prop.

### Bug Fixes and Improvements
- Improved keyboard-controlled drag and drop behavior to not show redundant drop target directly below opened folder item (#363)
- Fixed an issue where the `toggleSelectItem` (Ctrl + Space) hotkey could not be rebounded or disabled (#363)

### Other Changes
 - Added some documentation on the data structure required by a StaticDataProvider.
