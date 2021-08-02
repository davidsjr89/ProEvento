import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  public eventos: any = [];
  public eventosFiltrados: any = [];
  exibirImagem = true;
  private _filtroLista: string = '';

  public get filtroLista(){
    return this._filtroLista
  }
  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string){
    filtrarPor = filtrarPor.toLocaleLowerCase();
    console.log(this.eventos)
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || 
                       evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:5000/Eventos').subscribe(
      response => 
      {
        this.eventos = response,
        this.eventosFiltrados = response
      },
      error => console.log(error)
    );
  }

  Exibir(){
    this.exibirImagem = !this.exibirImagem;
  }
}
