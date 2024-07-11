import { Inject, Injectable, PLATFORM_ID, makeStateKey, StateKey, TransferState } from "@angular/core";

import {Observable, of, tap} from "rxjs";
import {isPlatformServer} from "@angular/common";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  /**
   * The state keys.
   */
  private keys = new Map<string, StateKey<any>>();

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId:any,
    private readonly transferState: TransferState
  ) {}

  fetch<T>(
    key: string,
    observableInput: Observable<T>,
    defaultValue?: T
  ): Observable<T> {
    if (this.has(key)) {
      return of(this.get(key, defaultValue)).pipe(
        tap((value:any) => this.remove(key))
      );
    }
    return observableInput.pipe(
      tap((value:T) => this.set(key, value))
    );
  }

  get<T>(
    key: string,
    defaultValue?: T | null
  ): T | null {
    if (!this.has(key)) {
      return defaultValue || null;
    }
    const value = this.transferState.get<T>(
      this.getStateKey(key),
      defaultValue!
    );
    return value;
  }

  has(key: string): boolean {
    return this.transferState.hasKey(this.getStateKey(key));
  }

  remove(key: string): void {
    if (!this.has(key)) {
      return;
    }
    this.transferState.remove(this.getStateKey(key));
  }

  set<T extends any>(key: string, value: T): void {
    if (isPlatformServer(this.platformId)) {
      if (this.keys.has(key)) {
        this.transferState.set<T>(
          this.getStateKey(key),
          value
        );
      }
    }
  }

  private getStateKey<T>(key: string): StateKey<T>{
    if (this.keys.has(key)) {
      return this.keys.get(key)!;
    }
    this.keys.set(key, makeStateKey(key));
    return this.keys.get(key)!;
  }
}
