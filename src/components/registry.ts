import type { ComponentType } from "react";
import { Button } from "./Button";
import { DatePicker } from "./DatePicker";
import { Loader } from "./Loader";

export type ComponentName = keyof typeof registry;

export const registry = {
  Button,
  DatePicker,
  Loader,
} as const satisfies Record<string, ComponentType>;

export function getComponent(name: ComponentName) {
  return registry[name];
}
