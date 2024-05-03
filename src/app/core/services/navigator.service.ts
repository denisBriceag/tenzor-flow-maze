import {FactoryProvider, Injectable, InjectionToken, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

export const NAVIGATOR = new InjectionToken('NavigatorToken');

export const NAVIGATOR_PROVIDER: FactoryProvider = {
  provide: NAVIGATOR,
  useFactory: (platformId: object) => {
    return isPlatformBrowser(platformId) ? navigator : {}
  }, deps: [PLATFORM_ID]
}
