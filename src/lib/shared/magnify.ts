// Drawing the same scene at different magnifications. A scene drawn inside a
// magnifier is scaled up, and lines and text scaled by the full amount look
// crude; this factor grows them more gently. Multiply a size meant for the
// unmagnified figure by it to get the size to draw at `zoom`.
export const sizeAt = (zoom: number) => zoom ** 0.4 / zoom
