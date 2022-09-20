import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  public connectionId: string = "";
  private hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5193/statistics')
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: retryContext => {
        if (retryContext.elapsedMilliseconds < 60000) {
          return Math.random() * 10000;
        } else {
          return null;
        }
      }
    })
    .build();

  public startConnection = () => {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.getConnectionId())
      .then(() => this.addWelcomeListener())
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  constructor() { }

  private getConnectionId = () => {
    this.hubConnection.invoke('getconnectionid')
      .then((data) => {
        this.connectionId = data;
        console.log("Connection Id : " + this.connectionId);
        this.getWelcome(this.connectionId);
      });
  }

  public getWelcome = (id:string) => {
    this.hubConnection.invoke('welcome', id);
  }

  public addWelcomeListener = () => {
    this.hubConnection.on('welcome', (data) => {
      console.log("Welcome Listener " + data);
    })
  }
}
