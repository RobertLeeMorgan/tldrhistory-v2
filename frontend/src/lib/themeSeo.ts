import { themes } from "../utils/drawerValues";

export function getAllThemeOptions() {
  return themes.options.flatMap((group: any) => group.options ?? []);
}