// @ts-check

/**
 * @interface
 */
export class BaseTheme {
  isLoaded = false;

  /**
   * @abstract
   */
  constructor() {}

  /**
   * @abstract
   */
  load = async () => {
    this.isLoaded = true;
  };

  /**
   * @abstract
   * @param {BaseTheme=} prevTheme
   */
  set = prevTheme => {};

  /**
   * @abstract
   * @param {BaseTheme=} nextTheme
   */
  cleanup = nextTheme => {};
}
