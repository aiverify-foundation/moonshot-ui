// Reserved z-indexes
// Try to follow these zindex layers as much as possible
// The values are currently typechecked to these fixed values. The type is in global.dts
export const Z_Index: ZIndex = {
  Base: 1, // first layer - for any elements that need to sit between the desktop background and icons (background logo image, etc)
  Level_1: 100, // second layer - specifically the desktop icons layer
  Level_2: 200, // third layer - all windows should be on this layer
  FocusedWindow: 998, // fourth layer - any focused window, should be set to this layer
  Top: 999, // fifth layer - for any elements that needs to be at the top most layer (modal popup, tooltip, etc)
};
