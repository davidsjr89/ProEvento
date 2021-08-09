import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  modalRef!: BsModalRef;
  titulo= 'Eventos';
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  exibirImagem = true;
  private _filtroLista: string = '';

  constructor(private eventoService: EventoService, private modalService: BsModalService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }
  
  public get filtroLista(){
    return this._filtroLista
  }
  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    console.log(this.eventos)
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || 
                       evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public getEventos(){
   this.subscription = this.eventoService.getEvento().subscribe(
      (eventos: Evento[]) => 
      {
        this.eventos = eventos,
        this.eventosFiltrados = this.eventos
      },
      (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os Eventos', 'Erro!');
      },
      () => this.spinner.hide()
    );
  }

  Exibir(){
    this.exibirImagem = !this.exibirImagem;
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }

  confirm(){
    this.modalRef.hide();
    this.toastr.success('O Evento foi deletado com sucesso.', 'Deletado')
  }

  decline(){
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
