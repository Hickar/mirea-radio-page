// @ts-check

import { SiteTheme } from "./SiteTheme";
import { ThemesManager } from "../ThemeAPI/ThemesManager";
import { LongtermKeyValue } from "../LongtermKeyValue";

/**
 * @type {LongtermKeyValue<'white' | 'dark'>}
 */
// @ts-ignore
const longterm = new LongtermKeyValue("__THEME__", "white");

export const SiteThemeManager = new ThemesManager(
  {
    white: new SiteTheme("white", longterm),
    dark: new SiteTheme("dark", longterm),
  },
  longterm.get(),
  currentTheme => {
    switch (currentTheme) {
      case "white":
        return "dark";

      case "dark":
        return "white";
    }
  }
);
