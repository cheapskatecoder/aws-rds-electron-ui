import * as React from "react";
import { HashRouter } from "react-router-dom";

interface ElectronRouterProps {
  children: React.ReactNode;
}

/**
 * A custom router component for Electron apps
 *
 * Uses HashRouter which works better in Electron with the file:// protocol
 * since it uses URLs like file:///index.html#/path instead of file:///path
 */
const ElectronRouter: React.FC<ElectronRouterProps> = ({ children }) => {
  return <HashRouter>{children}</HashRouter>;
};

export default ElectronRouter;
