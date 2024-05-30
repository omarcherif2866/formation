import { Component } from '@angular/core';
import { GroupChatService } from './group-chat.service';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent {
  groupId: string = '1'; // ID du groupe (pour l'exemple)
  message: string = '';
  messages: string[] = [];

  constructor(private groupChatService: GroupChatService) { }

  sendMessage(): void {
    if (this.message.trim()) {
      this.groupChatService.sendMessage(this.groupId, this.message);
      this.message = '';
      this.loadMessages();
    }
  }

  loadMessages(): void {
    this.messages = this.groupChatService.getMessages(this.groupId);
  }

  clearMessages(): void {
    this.groupChatService.clearMessages(this.groupId);
    this.messages = [];
  }
}



