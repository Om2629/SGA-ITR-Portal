// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const protocol = window.location.protocol;

export const environment = {
  production: false,
  API_ENDPOINT: window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/api/",
  UI_ENDPOINT: protocol + "//" + window.location.hostname + ":4200/",

  TOKEN_DECIMALS: 6,
  LOGIN_FAILED_MSG: "Username or password is invalid",
  LOGIN_FAILED_TITLE: "Login Failed",

  SESSION_ATTRIBUTES: {
    MY_TOKEN: "myToken",
    MY_REFRESH_TOKEN: "myRefreshToken",
    IS_LOGGEDIN: "isLoggedin",
    USERNAME: "username",
    PERMISSIONS: "permissions",
    LOGIN_ID: "loginId",
    USER_ROLE: "userRole",
    PAN_NO: "panNumber"
  },
  PAGINATION: {
    PERPAGE: 10
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import "zone.js/dist/zone-error";  // Included with Angular CLI.
