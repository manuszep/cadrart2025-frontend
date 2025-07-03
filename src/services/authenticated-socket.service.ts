import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { getEndpointUrl } from '../utils/url';
import { environment } from '../environments/environment';

export interface IWebSocketMessage {
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedSocketService {
  private socket: any = null;
  private _isConnected = new BehaviorSubject<boolean>(false);
  private _createEvents = new BehaviorSubject<any>(null);
  private _updateEvents = new BehaviorSubject<any>(null);
  private _deleteEvents = new BehaviorSubject<any>(null);

  private http = inject(HttpClient);

  public readonly isConnected$ = this._isConnected.asObservable();
  public readonly createEvents$ = this._createEvents.asObservable();
  public readonly updateEvents$ = this._updateEvents.asObservable();
  public readonly deleteEvents$ = this._deleteEvents.asObservable();

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return; // Already connected
    }

    try {
      // Get the WebSocket token from the backend
      const response = await this.http.get<{ token: string }>(getEndpointUrl('websocket-token')).toPromise();

      if (!response?.token) {
        console.error('Failed to get WebSocket token');
        return;
      }

      const token = response.token;

      // Dynamic import to avoid build issues
      const socketIO = await import('socket.io-client');

      // Use environment configuration for WebSocket URL
      const protocol = environment.wsUrl.startsWith('https:') ? 'wss:' : 'ws:';
      const wsUrl = environment.wsUrl.replace(/^https?:/, protocol);

      this.socket = socketIO.default(wsUrl, {
        path: environment.wsPath,
        auth: {
          token: token
        }
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket');
        this._isConnected.next(true);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
        this._isConnected.next(false);
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error('WebSocket connection error:', error);
        this._isConnected.next(false);
      });

      // Handle CRUD events
      this.socket.on('create', (data: any) => {
        console.log('Received create event:', data);
        this._createEvents.next(data);
      });

      this.socket.on('update', (data: any) => {
        console.log('Received update event:', data);
        this._updateEvents.next(data);
      });

      this.socket.on('delete', (data: any) => {
        console.log('Received delete event:', data);
        this._deleteEvents.next(data);
      });

      // Handle ping/pong for testing
      this.socket.on('pong', (data: IWebSocketMessage) => {
        console.log('Received pong:', data);
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this._isConnected.next(false);
    }
  }

  ping(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('ping');
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Method to emit events (for testing or custom events)
  emit(event: string, data?: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket is not connected');
    }
  }
}
