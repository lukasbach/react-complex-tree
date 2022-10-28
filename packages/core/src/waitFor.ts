export const waitFor = (
  check: () => boolean,
  intervalMs = 50,
  timeoutMs = 10000
) =>
  new Promise<void>(resolve => {
    if (check()) {
      resolve();
    }

    let complete: () => void;

    const interval = setInterval(() => {
      if (check()) {
        complete();
      }
    }, intervalMs);

    const timeout = setTimeout(() => {
      complete();
    }, timeoutMs);

    complete = () => {
      clearInterval(interval);
      clearTimeout(timeout);
      resolve();
    };
  });
