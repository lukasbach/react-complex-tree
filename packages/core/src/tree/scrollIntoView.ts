export const scrollIntoView = (element: Element | undefined | null) => {
  if (!element) {
    return;
  }

  if ((element as any).scrollIntoViewIfNeeded) {
    (element as any).scrollIntoViewIfNeeded();
  } else {
    const boundingBox = element.getBoundingClientRect();
    const isElementInViewport =
      boundingBox.top >= 0 &&
      boundingBox.left >= 0 &&
      boundingBox.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      boundingBox.right <= (window.innerWidth || document.documentElement.clientWidth);
    if (!isElementInViewport) {
      element.scrollIntoView();
    }
  }
};
