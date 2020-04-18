export class BaseTheme {
  isLoaded = false;

  constructor() {}
  load = async () => {
    this.isLoaded = true;
  };

  set = prevTheme => {};

  cleanup = nextTheme => {};
}
