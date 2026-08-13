import type { ReactNode } from "react";

export interface TrackingParam {
  key: string;
  explanation: string;
}

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export interface TrackingParam {
  key: string;
  explanation: string;
}

export type CleanUrlResult = {
  status: 'ok';
  cleaned: string;
  removed: TrackingParam[];
  raw: string;
};

export type CleanUrlError = {
  status: 'empty' | 'invalid';
};

export type CleanUrlOutput = CleanUrlResult | CleanUrlError | null;

export interface DemoFeature {
  icon: ReactNode;
  title: string;
  body: string;
}

export interface PrivacyItem {
  icon: React.ReactNode;
  title: string;
  body: string;
}

export interface DemoFeature {
  icon: React.ReactNode;
  title: string;
  body: string;
}

export interface OrbitNode {
  cls: string;
  icon: React.ReactNode;
  title: string;
  grad: string;
}

export interface Step {
  title: string;
  body: string;
}