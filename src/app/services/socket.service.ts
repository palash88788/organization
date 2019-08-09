import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://192.168.1.12:4000';

@Injectable()
export class SocketService {
    private socket;
    public subscriptions: Array<any>
    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
        this.subscriptions = []
    }

    public send(message: any): void {
        this.socket.emit('message', message);
    }

    public onMessage(id): Observable<any> {
        return new Observable<any>(observer => {
            let k = -1
            for (let l = 0; l < this.subscriptions.length; l++) {
                for (let m = l+1; m < this.subscriptions.length; m++) {
                    if (this.subscriptions[l].id == this.subscriptions[m].id) {
                        k = l
                        break
                    }
                }
            }
            console.log(k,id)
            if (k== -1) {
                let o = this.socket.on(id, (data: any) => observer.next(data));
                this.subscriptions.push(o)
            }
        });
    }

    public onEvent(event: any): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}