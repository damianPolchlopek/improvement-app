import { useEffect, useRef } from 'react';

const EMBED_BASE = 'https://s3.tradingview.com/external-embedding/';

/**
 * Mounts a free TradingView embed widget (e.g. 'embed-widget-advanced-chart.js') into the
 * returned ref's element and re-creates it whenever the config changes.
 * Returns the ref to attach to a `.tradingview-widget-container` element.
 */
export default function useTradingViewEmbed(scriptName, config) {
  const containerRef = useRef(null);
  const configKey = JSON.stringify(config);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    container.innerHTML =
      '<div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>';
    const script = document.createElement('script');
    script.src = EMBED_BASE + scriptName;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = configKey;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [scriptName, configKey]);

  return containerRef;
}
