import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignalrService } from 'src/services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {

  public connectionId: string|null = "";
  updateDrawingSubscription : Subscription;
  public projectDrawingUpdateLogs : any;

  constructor(public signalRService: SignalrService, public httpService: HttpClient, private ref: ChangeDetectorRef) {
    this.updateDrawingSubscription = this.signalRService.updateLoadObservable().subscribe((res : any) => {
      if(res){
        this.projectDrawingUpdateLogs = res;
        console.log(this.projectDrawingUpdateLogs);
        this.ref.detectChanges();
      } else {
        this.projectDrawingUpdateLogs = null;
      }
      
    })

   }

  ngOnInit(): void {}

  public showConnectionId() {
    this.connectionId = this.signalRService.connectionId;
  }

  public update() {
    console.log("triggered with " + this.connectionId);
    this.httpService.get('http://localhost:5193/api/projectdrawing?connectionId=' + this.connectionId).subscribe();
  }

  public stream1() {

    this.signalRService.getStream1().subscribe({
      next: (item) => {
        console.log(item);
      },
      complete: () => {
        console.log("Stream1 completed");
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  public stream2() {

    this.signalRService.getStream2().subscribe({
      next: (item) => {
        console.log(item);
      },
      complete: () => {
        console.log("Stream2 completed");
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  ngOnDestroy() {
    
      this.updateDrawingSubscription.unsubscribe();
      
  }

}
