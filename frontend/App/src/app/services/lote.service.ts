import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})

export class LoteService {
  baseURL = `${environment.url}Lotes`;
  
  constructor(private http: HttpClient){}

  getLotesByEventoId(eventoId: number): Observable<Lote[]>{
      return this.http.get<Lote[]>(`${this.baseURL}/${eventoId}`).pipe(take(1));
  }

  saveLote(eventoId: number, lotes: Lote[]): Observable<Lote[]>{
      return this.http.put<Lote[]>(`${this.baseURL}/${eventoId}`, lotes).pipe(take(1));
  }

  deleteLote(eventoId: number, loteId: number): Observable<any>{
      return this.http.delete<any>(`${this.baseURL}/${eventoId}/${loteId}`).pipe(take(1));
  }
}