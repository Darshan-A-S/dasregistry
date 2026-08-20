import type { ComponentType } from "react";
import { Button } from "./Button";
import { CheckpointRail } from "./CheckpointRail";
import { DatePicker } from "./DatePicker";
import { Loader } from "./Loader";

export type ComponentName = keyof typeof registry;

export const registry = {
  Button,
  CheckpointRail,
  DatePicker,
  Loader,
} as const satisfies Record<string, ComponentType>;

export function getComponent(name: ComponentName) {
  return registry[name];
}
