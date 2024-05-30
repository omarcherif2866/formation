import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {
  private groupMessages: { [groupId: string]: string[] } = {}; // Dictionnaire des messages par groupe


  constructor() { }
  sendMessage(groupId: string, message: string): void {
    if (!this.groupMessages[groupId]) {
      this.groupMessages[groupId] = [];
    }
    this.groupMessages[groupId].push(message);
  }

  getMessages(groupId: string): string[] {
    return this.groupMessages[groupId] || [];
  }

  clearMessages(groupId: string): void {
    this.groupMessages[groupId] = [];
  }
}
