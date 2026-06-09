import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

export type RealtimeEvent = 'notices:changed' | 'news:changed' | 'events:changed';

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private socket: Socket;
  private subjects = new Map<RealtimeEvent, Subject<void>>();

  constructor() {
    this.socket = io(environment.apiUrl, { transports: ['websocket', 'polling'] });

    const events: RealtimeEvent[] = ['notices:changed', 'news:changed', 'events:changed'];
    for (const event of events) {
      const subject = new Subject<void>();
      this.subjects.set(event, subject);
      this.socket.on(event, () => subject.next());
    }
  }

  on(event: RealtimeEvent): Observable<void> {
    return this.subjects.get(event)!.asObservable();
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
    this.subjects.forEach(s => s.complete());
  }
}
