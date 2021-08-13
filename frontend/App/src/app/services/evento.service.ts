import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";
import { Evento } from "@app/models/Evento";

@Injectable({
    providedIn: 'root'
})

export class EventoService {
    baseURL = `${environment.url}Eventos`;
    constructor(private http: HttpClient){}

    getEvento(): Observable<Evento[]>{
        return this.http.get<Evento[]>(this.baseURL);
    }
    
    getEventosByTema(tema: string): Observable<Evento[]>{
        return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`);
    }

    getEventoById(id: number): Observable<Evento>{
        return this.http.get<Evento>(`${this.baseURL}/${id}`);
    }
}