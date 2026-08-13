import { useState, useEffect, useRef, type ReactNode, type CSSProperties, type JSX } from "react";
import type { TrackingParam } from "../types";

export const TRACKING: TrackingParam[] = [
  { key: "utm_source", explanation: "Identifies which site or platform sent the click" },
  { key: "utm_medium", explanation: "Identifies the marketing medium, e.g. email or social" },
  { key: "utm_campaign", explanation: "Identifies the specific marketing campaign" },
  { key: "utm_term", explanation: "Identifies paid search keywords" },
  { key: "utm_content", explanation: "Differentiates similar content or links" },
  { key: "fbclid", explanation: "Ties a click back to a Facebook ad or share" },
  { key: "gclid", explanation: "Ties a click back to a Google Ads campaign" },
  { key: "igshid", explanation: "Identifies the Instagram share that led here" },
  { key: "mc_eid", explanation: "Identifies the Mailchimp recipient who clicked" },
  { key: "mkt_tok", explanation: "Marketo marketing automation identifier" },
  { key: "msclkid", explanation: "Microsoft Advertising click identifier" },
  { key: "twclid", explanation: "Ties a click back to a Twitter ad" },
];

export const SAFE: Set<string> = new Set(["id", "q", "v", "page", "s", "search", "query", "lang", "locale", "p", "cat", "tag"]);

export const EDGE_URL = "https://microsoftedge.microsoft.com/addons/detail/link-wash/ofplnfannogodfifhomgpnpnobopdhhh";
export const GITHUB_URL = "https://github.com/Its-sultan/Link_Wash";
export const THABIT_URL = "https://thabitsultan.vercel.app";


interface RevealProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function Reveal({ className = "", style, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { 
        if (e.isIntersecting) { 
          setVisible(true); 
          obs.unobserve(e.target); 
        } 
      }),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref as any}
      className={`${className} transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={style}
    >
      {children}
    </div>
  );
}