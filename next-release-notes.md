### Breaking Changes
- Changed the behavior for dropping an item at the bottom of an open folder has changed, and will now drop
  into the open folder at its top, instead of the parent folder below the open folder. See discussion at #148 for details.
  You can opt out of this behavior by setting the `canDropBelowOpenFolders` prop on the tree environment (#148).

### Bug Fixes
- Fixed a bug where the `canRename` property in a tree item payload was not respected.