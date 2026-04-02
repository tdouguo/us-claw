import type { ReactNode } from "react";

export type SidecarState = {
  eyebrow?: string;
  title: string;
  description?: string;
  content?: ReactNode;
};

export type SetSidecarState = (state: SidecarState) => void;
