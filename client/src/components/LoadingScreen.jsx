const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#fffaf8]">
    <div className="text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-roseleaf border-t-ink" />
      <p className="text-sm font-medium text-muted">Opening your workspace…</p>
    </div>
  </div>
);
export default LoadingScreen;
