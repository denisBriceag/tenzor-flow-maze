import { FactoryProvider, InjectionToken } from '@angular/core';

export enum StorageEnum {
  LOCAL = 'LOCAL',
  SESSION = 'SESSION',
}

const storageMap: Record<keyof typeof StorageEnum, Storage> = {
  [StorageEnum.LOCAL]: localStorage,
  [StorageEnum.SESSION]: sessionStorage,
};

export const STORAGE: InjectionToken<Storage> = new InjectionToken<Storage>(
  'STORAGE',
);

export function provideStorage(type: StorageEnum): FactoryProvider {
  return {
    provide: STORAGE,
    useFactory: (): Storage => storageMap[type],
  };
}
