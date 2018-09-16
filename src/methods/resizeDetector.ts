import elementResizeDetectorMaker from 'element-resize-detector';

let detector: elementResizeDetectorMaker.Erd | null = null;

export function resizeDetector() {
  if (!detector) {
    detector = elementResizeDetectorMaker();
  }
  return detector;
}