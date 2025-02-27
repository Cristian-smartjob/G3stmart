import { ForwardRefExoticComponent, PropsWithoutRef, SVGProps } from "react";

export interface SidebarItem {
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<PropsWithoutRef<SVGProps<SVGSVGElement>>> | null;
    current: boolean;
}

export interface SelectorItem {
    id: number;
    label: string;
    value?: string | number;
}

export interface ComboBoxItem {
    id: number;
    label: string;
}

export interface ConfigButton {
    showButton: boolean;
    label: string;
    onClick: () => void;
}


export enum CheckboxStatus {
    On = "On",
    Off = "Off",
    Mixed = "Mixed"
}
  