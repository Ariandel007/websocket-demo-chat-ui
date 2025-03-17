import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../services/websocket.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: { sender: string; content: string, timestamp: string }[] = [];
  newMessage: string = '';

  constructor(private websocketService: WebSocketService) {}

  ngOnInit() {
    // Conectar al WebSocket
    this.websocketService.connect();

    // Esperar a que la conexión sea exitosa antes de suscribirse
    this.websocketService.getConnectionStatus()
      .pipe(take(3)) // Nos aseguramos de suscribirnos solo una vez
      .subscribe((connected) => {
        console.log("que pasho", connected)
        if (connected) {
          console.log("CONECTADOOOO!")
          this.websocketService.subscribe('/topic/messages', (message) => {
            console.log("/topic/messages", message.body)
            const body = JSON.parse(message.body);
            this.messages.push(body);
          });
        }
      });


  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message = { content: this.newMessage };
      this.websocketService.send('/app/message', message); // Enviar mensaje al servidor
      // this.messages.push(message); // Agregar mensaje al arreglo local
      this.newMessage = '';
    }
  }
}

