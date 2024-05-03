import { inject, signal, WritableSignal } from '@angular/core';
import { STORAGE } from '../tokens/storage.token';

export function storageSignal<T>(
  initialValue: T,
  key: string,
): WritableSignal<T> {
  const storage: Storage = inject(STORAGE);
  const storedValue = storage.getItem(key);

  if (storedValue) {
    try {
      initialValue = JSON.parse(storedValue);
    } catch (e) {
      throw new Error(`Failed to parse stores value for key: ${key}`);
    }
  } else storage.setItem(key, JSON.stringify(initialValue));

  const writableSignal: WritableSignal<T> = signal<T>(initialValue);
  const setter: (value: T) => void = writableSignal.set;

  writableSignal.set = (value: T) => (
    storage.setItem(key, JSON.stringify(value)), setter(value)
  );

  return writableSignal;
}
