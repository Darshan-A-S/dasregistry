import type { ComponentType } from "react";
import { Button } from "./Button";

export type ComponentName = keyof typeof registry;

export const registry = {
  Button,
} as const satisfies Record<string, ComponentType>;

export function getComponent(name: ComponentName) {
  return registry[name];
}
