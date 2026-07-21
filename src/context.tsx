"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AgentSiteContextValue,
  DeclaredAction,
  DeclaredSkill,
  GateState,
  SitemapRoute,
} from "./types";

const AgentSiteContext = createContext<AgentSiteContextValue | null>(null);

export function useAgentSite(): AgentSiteContextValue {
  const ctx = useContext(AgentSiteContext);
  if (!ctx) {
    throw new Error("Agentsite components must be used within <AgentSite>.");
  }
  return ctx;
}

export function useAgentSiteOptional(): AgentSiteContextValue | null {
  return useContext(AgentSiteContext);
}

type ProviderProps = {
  name: string;
  contentVisible: boolean;
  humanMessage: string;
  humanHint?: string;
  baseUrl?: string;
  initialRoutes?: SitemapRoute[];
  initialSkills?: DeclaredSkill[];
  children?: ReactNode;
};

export function AgentSiteProvider({
  name,
  contentVisible,
  humanMessage,
  humanHint,
  baseUrl,
  initialRoutes = [],
  initialSkills = [],
  children,
}: ProviderProps) {
  const [routes, setRoutes] = useState<SitemapRoute[]>(initialRoutes);
  const [actions, setActions] = useState<DeclaredAction[]>([]);
  const [gates, setGates] = useState<GateState[]>([]);
  const [skills, setSkills] = useState<DeclaredSkill[]>(initialSkills);
  const [twinData, setTwinData] = useState<unknown | null>(null);

  const registerRoute = useCallback((route: SitemapRoute) => {
    setRoutes((prev) => {
      const existing = prev.find((r) => r.path === route.path);
      if (
        existing &&
        existing.title === route.title &&
        existing.description === route.description &&
        existing.auth === route.auth
      ) {
        return prev;
      }
      if (existing) {
        return prev.map((r) => (r.path === route.path ? route : r));
      }
      return [...prev, route];
    });
  }, []);

  const registerAction = useCallback((action: DeclaredAction) => {
    setActions((prev) => {
      const existing = prev.find(
        (a) => a.name === action.name && a.href === action.href,
      );
      if (
        existing &&
        existing.method === action.method &&
        existing.description === action.description &&
        existing.inputSchema === action.inputSchema &&
        existing.blocked === action.blocked &&
        existing.blockedReason === action.blockedReason
      ) {
        return prev;
      }
      if (existing) {
        return prev.map((a) =>
          a.name === action.name && a.href === action.href ? action : a,
        );
      }
      return [...prev, action];
    });
  }, []);

  const registerGate = useCallback((gate: GateState) => {
    setGates((prev) => {
      const existing = prev.find((g) => g.id === gate.id);
      if (
        existing &&
        existing.open === gate.open &&
        existing.reason === gate.reason
      ) {
        return prev;
      }
      if (existing) {
        return prev.map((g) => (g.id === gate.id ? gate : g));
      }
      return [...prev, gate];
    });
  }, []);

  const registerSkill = useCallback((skill: DeclaredSkill) => {
    setSkills((prev) => {
      const existing = prev.find((s) => s.path === skill.path);
      if (
        existing &&
        existing.title === skill.title &&
        existing.description === skill.description &&
        existing.primary === skill.primary
      ) {
        return prev;
      }
      if (existing) {
        return prev.map((s) => (s.path === skill.path ? skill : s));
      }
      return [...prev, skill];
    });
  }, []);

  const value = useMemo<AgentSiteContextValue>(
    () => ({
      name,
      contentVisible,
      humanMessage,
      humanHint,
      baseUrl,
      routes,
      registerRoute,
      actions,
      registerAction,
      gates,
      registerGate,
      skills,
      registerSkill,
      twinData,
      setTwinData,
    }),
    [
      name,
      contentVisible,
      humanMessage,
      humanHint,
      baseUrl,
      routes,
      registerRoute,
      actions,
      registerAction,
      gates,
      registerGate,
      skills,
      registerSkill,
      twinData,
    ],
  );

  return (
    <AgentSiteContext.Provider value={value}>
      {children}
    </AgentSiteContext.Provider>
  );
}
