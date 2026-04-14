import type { InputHTMLAttributes } from "react";
import type { TimelineFilter } from "../../features/filter/components/TimelineFilter";

export interface DrawerInputProps 
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  name: string;
  type: string;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export interface DrawerCheckboxProps {
  value: string;
  labelText: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface DrawerCollapseProps {
  title: string;
  children: React.ReactNode;
  count?: number;
}

export interface DrawerProps {
  filter: TimelineFilter;
  onChange: (newFilter: TimelineFilter) => void;
}