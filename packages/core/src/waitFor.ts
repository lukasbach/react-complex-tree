export const waitFor = (check: () => boolean, intervalMs = 50, timeoutMs = 10000) => {
  return new Promise<void>((resolve) => {
    if (check()) {
      resolve();
    }

    const complete = () => {
      clearInterval(interval);
      clearTimeout(timeout);
      resolve();
    };

    const interval = setInterval(() => {
      if (check()) {
        complete();
      }
    } , intervalMs);

    const timeout = setTimeout(() => {
      complete();
    }, timeoutMs);
  });
};