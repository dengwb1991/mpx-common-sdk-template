declare namespace _default {
  class Axios {
    constructor(t: any);
    defaults: any;
    interceptors: any;
    addSignWhites(t: any): void;
    get(e: any, n: any): any;
    head(e: any, n: any): any;
    jsonp(t: any, e: any): any;
    options(e: any, n: any): any;
    patch(e: any, n: any, r: any): any;
    post(e: any, n: any, r: any): any;
    put(e: any, n: any, r: any): any;
    request(t: any): any;
  }
  class Cancel {
    constructor(t: any);
    message: any;
  }
  class CancelToken {
    static source(): any;
    constructor(t: any);
    promise: any;
    throwIfRequested(): void;
  }
  function addSignWhites(...args: any[]): any;
  function all(t: any): any;
  function create(t: any): any;
  namespace defaults {
    const adapter: any;
    const headers: {
      common: {
        Accept: any;
      };
      delete: {};
      get: {};
      head: {};
      patch: {
        "Content-Type": any;
      };
      post: {
        "Content-Type": any;
      };
      put: {
        "Content-Type": any;
      };
    };
    const maxContentLength: number;
    const timeout: number;
    const transformRequest: Function[];
    const transformResponse: Function[];
    function validateStatus(t: any): any;
    const xsrfCookieName: string;
    const xsrfHeaderName: string;
  }
  function get(...args: any[]): any;
  function head(...args: any[]): any;
  function install(t: any, e: any): void;
  const interceptors: {
    request: {
      eject: Function;
      forEach: Function;
      handlers: any[];
      use: Function;
    };
    response: {
      eject: Function;
      forEach: Function;
      handlers: any[];
      use: Function;
    };
  };
  function isCancel(t: any): any;
  function jsonp(...args: any[]): any;
  function options(...args: any[]): any;
  function patch(...args: any[]): any;
  function post(...args: any[]): any;
  function put(...args: any[]): any;
  function request(...args: any[]): any;
  function spread(t: any): any;
}
export default _default;
