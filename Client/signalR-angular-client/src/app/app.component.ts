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
  {
    console.log("called with " + this.connectionId);
    this.httpService.get('http://localhost:5193/api/projectdrawing?connectionId='+this.connectionId)
      .subscribe(res => {
        console.log(res);
      });
  }
}
