import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  public hubConnection: signalR.HubConnection;
  public connectionId: string| null = "" ;
  private updateLogs = new Subject<any>();
  
  private createConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5193/statistics')
      .configureLogging(signalR.LogLevel.Critical)
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
  }

  private startConnection(){
    try {
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        return;
      }
      this.hubConnection
        .start()
        .then(() => this.getConnectionId())
        .finally(() => this.connectionId = this.hubConnection.connectionId)
        .catch(err => console.log('Error while starting connection: ' + err));
    }
    catch (error) { }
  }

  constructor() {
    this.createConnection();
    this.registerOnEvents();
    this.startConnection();
  }

  private getConnectionId = () => {
    this.hubConnection.invoke('getconnectionid')
      .then((data) => {
        this.connectionId = data;
      });
  }

  private registerOnEvents() {
    this.addWelcomeListener();
    this.addUpdateListener();
    this.addWelcomeAllListener();
  }

  public getWelcome = (id: string) => {
    this.hubConnection.invoke('welcome', id);
  }

  private addWelcomeListener() {
    this.hubConnection.on('welcome', (data) => {
      console.log("Welcome Listener " + data);
    })
  }

  public getWelcomeAll(){
    this.hubConnection.invoke('welcomeall');
  }

  private addWelcomeAllListener() {
    this.hubConnection.on('welcomeall', (data) => {
      console.log(data);
    })
  }

  private addUpdateListener() {
    this.hubConnection.on('updateStatistic', (data) => {
      this.updateLogs.next(data);
    })
  }

  public updateLoadObservable(): Observable<any> {
    return this.updateLogs.asObservable();
}

  public getStream1() {
    return this.hubConnection.stream('getcountriesstream1');
  }
  public getStream2() {
    return this.hubConnection.stream('getcountriesstream2', 1000);
  }
}
