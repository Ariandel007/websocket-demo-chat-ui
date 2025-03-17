import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client: Client;
  private connectionStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    const token = localStorage.getItem('authToken') || ''; // Obtén el token JWT

    // Configurar el cliente STOMP
    this.client = new Client({
      brokerURL: 'ws://localhost:8345/chat', // Cambia esta URL si es necesario
      connectHeaders: {
        Authorization: `Bearer ${token}`, // Agrega el token aquí
      },
      reconnectDelay: 5000, // Intentar reconexión después de 5 segundos
      debug: (str) => {
        console.log(str); // Log para depuración
      },
    });

    this.client.onConnect = (frame) => {
      console.log('Conexión STOMP exitosa:', frame);
      this.connectionStatus.next(true); // Emite "true" cuando la conexión es exitosa
    };

    this.client.onStompError = (frame) => {
      console.error('Error STOMP:', frame.headers['message'], frame.body);
    };

    this.client.onWebSocketClose = () => {
      console.warn('Conexión WebSocket cerrada');
      this.connectionStatus.next(false); // Emite "false" cuando la conexión se cierra
    };
  }

  // Conectar al WebSocket
  connect() {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  // Desconectar del WebSocket
  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  // Suscribirse a un topic
  subscribe(topic: string, callback: (message: Message) => void) {
    return this.client.subscribe(topic, callback);
  }

  // Enviar un mensaje
  send(destination: string, body: any) {
    if (this.client.connected) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.error('No conectado al WebSocket');
    }
  }

  getConnectionStatus() {
    return this.connectionStatus.asObservable(); // Devuelve el observable del estado de conexión
  }

}
