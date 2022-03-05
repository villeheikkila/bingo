export function preventDefault<T extends HTMLElement>(
  handler: React.ReactEventHandler<T>
): React.ReactEventHandler<T> {
  return (e) => {
    e.preventDefault();
    return handler(e);
  };
}
