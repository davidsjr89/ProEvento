import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  subscription!: Subscription;
  modalRef!: BsModalRef;
  titulo= 'Eventos';
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  exibirImagem = true;
  private _filtroLista: string = '';

  constructor(private eventoService: EventoService, private modalService: BsModalService, private toastr: ToastrService, private spinner: NgxSpinnerService,
              private router: Router) { }
  
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

  detalheEvento(id: number){
    this.router.navigate([`eventos/detalhe/${id}`])
  }

  decline(){
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
