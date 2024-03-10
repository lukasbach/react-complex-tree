### Features

- Make drop target depth in last-of-subtree locations dependent on x-coordinates of the mouse, allowing the user to
  drop in higher depths than the currently hovering item. This behavior is automatically used if `renderDepthOffset`
  on the renderers is set to a non-zero value. (#148)
  - This also applies when dropping at the top of an item where the item prior is of deeper depth, meaning that
    in this case the decision of dropping into the container above or directly above the hovering item will depend
    on the x-coordinate of the mouse.
- Add `setDomFocus` argument to focus-item methods to provide an escape hatch to set the focus state of an item in RCT
  without updating the DOM focus. This defaults to true in all existing methods to maintain the current behavior if
  it is absent. (#336)
- Allow customizing when a subtree is rendered or not with the new `shouldRenderChildren` prop. This can be used to 
  create opening and closing animations on subtrees. See [Demo](https://rct.lukasbach.com/storybook/?path=/story/core-basic-examples--animated-expanding-and-collapsing)
  and [Demo Implementation](https://github.com/lukasbach/react-complex-tree/blob/main/packages/core/src/stories/BasicExamples.stories.tsx#L561) for details. (#333)

### Bug Fixes

- Fix a bug where the `parentId` property in the `renderItemsContainer` render method was incorrectly set to the tree id
  for the root container.