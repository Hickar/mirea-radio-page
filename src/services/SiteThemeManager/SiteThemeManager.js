// @ts-check

import { SiteTheme } from "./SiteTheme";
import { ThemesManager } from "../ThemeAPI/ThemesManager";
import { Longterm } from "../LongtermManager/LongtermManager";

const longterm = Longterm.extract("theme");

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
