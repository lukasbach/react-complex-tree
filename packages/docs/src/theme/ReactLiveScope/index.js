/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  ControlledTreeEnvironment,
  StaticTreeDataProvider,
  Tree,
  UncontrolledTreeEnvironment
} from "react-complex-tree";
import { longTree, shortTree } from "demodata";

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ControlledTreeEnvironment,
  UncontrolledTreeEnvironment,
  Tree,
  longTree,
  shortTree,
  StaticTreeDataProvider
};

export default ReactLiveScope;
