import type { InputHTMLAttributes } from "react";

export interface TimelineFilter {
  type: string[];
  subject: string[];
  continent: string[];
  yearStart?: number | undefined;
  yearEnd?: number | undefined;
  search?: string;
  sortBy?: boolean;
  group: number
}

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
}

export interface DrawerProps {
  filter: TimelineFilter;
  onChange: (newFilter: TimelineFilter) => void;
}
