export const PORTFOLIO_READY_EVENT = "portfolio:ready";

export function signalPortfolioReady() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PORTFOLIO_READY_EVENT));
}

export function onPortfolioReady(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  // Loader already gone (e.g. hot reload)
  if (!document.querySelector("[data-portfolio-loader]")) {
    const id = window.setTimeout(callback, 0);
    return () => window.clearTimeout(id);
  }

  const handler = () => callback();
  window.addEventListener(PORTFOLIO_READY_EVENT, handler, { once: true });
  // Safety fallback if the event never fires
  const fallback = window.setTimeout(callback, 5000);
  return () => {
    window.removeEventListener(PORTFOLIO_READY_EVENT, handler);
    window.clearTimeout(fallback);
  };
}
