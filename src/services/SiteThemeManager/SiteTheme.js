// @ts-check

import { BaseTheme } from "../ThemeAPI/BaseTheme";
import { LongtermKeyValue } from "../LongtermManager/LongtermKeyValue";

/**
 * @template {string} TTheme
 */
export class SiteTheme extends BaseTheme {
  /**
   * @type {TTheme}
   */
  theme;

  /**
   * @type {LongtermKeyValue<TTheme>}
   */
  longterm;

  /**
   * @param {TTheme} theme
   * @param {LongtermKeyValue<TTheme>} longterm
   */
  constructor(theme, longterm) {
    super();

    this.theme = theme;
    this.longterm = longterm;
  }

  set = () => {
    document.documentElement.dataset.theme = this.theme;

    /**
     * @type {Array<HTMLElement>}
     */
    // @ts-ignore
    const parts = [...document.querySelectorAll(".player__canvassvg .body")];

    parts.forEach(element => {
      element.dataset.theme = this.theme;
    });

    this.longterm.set(this.theme);
  };
}
