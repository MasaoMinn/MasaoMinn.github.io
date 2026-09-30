type BrowserMatch = {
  name: string;
  version: string;
  clientHintBrand?: string;
};

const BROWSER_PATTERNS: readonly [RegExp, string, string?][] = [
  [/Edg(?:A|iOS)?\/([\d.]+)/, "Microsoft Edge", "Microsoft Edge"],
  [/OPR\/([\d.]+)/, "Opera", "Opera"],
  [/SamsungBrowser\/([\d.]+)/, "Samsung Internet", "Samsung Internet"],
  [/YaBrowser\/([\d.]+)/, "Yandex Browser"],
  [/Vivaldi\/([\d.]+)/, "Vivaldi"],
  [/UCBrowser\/([\d.]+)/, "UC Browser"],
  [/QQBrowser\/([\d.]+)/, "QQ Browser"],
  [/(?:Firefox|FxiOS)\/([\d.]+)/, "Firefox"],
  [/(?:Chrome|CriOS)\/([\d.]+)/, "Chrome", "Google Chrome"],
  [/Version\/([\d.]+).*Safari\//, "Safari"],
];

function parseBrowser(userAgent: string): BrowserMatch | null {
  for (const [pattern, name, clientHintBrand] of BROWSER_PATTERNS) {
    const match = userAgent.match(pattern);
    if (match) {
      return { name, version: match[1], clientHintBrand };
    }
  }
  return null;
}

type UserAgentData = {
  getHighEntropyValues: (hints: string[]) => Promise<{
    fullVersionList?: { brand: string; version: string }[];
  }>;
};

export async function getBrowserLabel(): Promise<string | null> {
  const browser = parseBrowser(navigator.userAgent);
  if (!browser) return null;

  let version = browser.version;
  const userAgentData = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData;
  if (userAgentData && browser.clientHintBrand) {
    try {
      const hints = await userAgentData.getHighEntropyValues(["fullVersionList"]);
      const fullVersion = hints.fullVersionList?.find(
        ({ brand }) => brand === browser.clientHintBrand,
      )?.version;
      if (fullVersion && !fullVersion.startsWith("0.")) version = fullVersion;
    } catch {
      // Browser support and permission for full version hints vary.
    }
  }

  return `${browser.name} ${version}`;
}
