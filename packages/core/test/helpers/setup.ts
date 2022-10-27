globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// eslint-disable-next-line no-console
const originalConsoleError = console.error;
// eslint-disable-next-line no-console
console.error = (...args) => {
  const firstArg = args[0];
  if (
    typeof args[0] === 'string' &&
    (args[0].startsWith(
      // eslint-disable-next-line quotes
      "Warning: It looks like you're using the wrong act()"
    ) ||
      firstArg.startsWith(
        'Warning: The current testing environment is not configured to support act'
      ) ||
      firstArg.startsWith('Warning: You seem to have overlapping act() calls'))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};
