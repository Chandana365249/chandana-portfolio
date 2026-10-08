/** Static, decorative page backdrop: faint grid, soft accent glow and grain. */
export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-background-secondary to-background" />
      <div className="bg-glow absolute inset-0" />
      <div className="bg-grid absolute inset-0" />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
