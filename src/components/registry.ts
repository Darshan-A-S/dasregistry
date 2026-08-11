import type { ComponentType } from "react";
import { Button } from "./Button";
import { DatePicker } from "./DatePicker";

export type ComponentName = keyof typeof registry;

export const registry = {
  Button,
  DatePicker,
} as const satisfies Record<string, ComponentType>;

export function getComponent(name: ComponentName) {
  return registry[name];
}
