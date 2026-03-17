import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesSignal = signal<ToastMessage[]>([]);
  private seed = 0;

  readonly messages = this.messagesSignal.asReadonly();

  success(message: string): void {
    this.push(message, 'success');
  }

  error(message: string): void {
    this.push(message, 'error');
  }

  info(message: string): void {
    this.push(message, 'info');
  }

  remove(id: number): void {
    this.messagesSignal.update((messages) => messages.filter((item) => item.id !== id));
  }

  private push(message: string, type: ToastType): void {
    const id = ++this.seed;
    this.messagesSignal.update((messages) => [...messages, { id, message, type }]);

    setTimeout(() => {
      this.remove(id);
    }, 3200);
  }
}
