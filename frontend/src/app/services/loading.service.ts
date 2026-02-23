import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingCount: WritableSignal<number> = signal<number>(0);

  public readonly isLoading: Signal<boolean> = computed<boolean>(() => this.loadingCount() > 0);

  public show(): void {
    this.loadingCount.update((count: number) => count + 1);
  }

  public hide(): void {
    this.loadingCount.update((count: number) => Math.max(0, count - 1));
  }

  public reset(): void {
    this.loadingCount.set(0);
  }
}

