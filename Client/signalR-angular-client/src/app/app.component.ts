import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SignalrService } from 'src/services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  public connectionId:string = "";

  constructor(public signalRService: SignalrService, public httpService:HttpClient){}

  ngOnInit(): void {
    this.signalRService.startConnection();
  }

  public showConnectionId()
  {
    this.connectionId = this.signalRService.connectionId;
  }

  public update()
  {}
}
