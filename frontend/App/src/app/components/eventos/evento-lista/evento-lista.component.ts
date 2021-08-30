import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  subscription!: Subscription;
  modalRef!: BsModalRef;
  titulo = 'Eventos';
  eventoId!: number;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  exibirImagem = true;
  private _filtroLista: string = '';

  constructor(private eventoService: EventoService, private modalService: BsModalService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private router: Router) { }

  public get filtroLista() {
    return this._filtroLista
  }
  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    console.log(this.eventos)
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

  public carregarEventos() {
    this.subscription = this.eventoService.getEvento().subscribe(
      (eventos: Evento[]) => {
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

  Exibir() {
    this.exibirImagem = !this.exibirImagem;
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' })
  }

  detalheEvento(id: number) {
    this.router.navigate([`eventos/detalhe/${id}`])
  }

  confirm() {
    this.modalRef.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      () => {
        this.toastr.success('O Evento foi deletado com sucesso.', 'Deletado');
        this.carregarEventos();
      },
      (error: any) => {
        console.log(error)
        this.toastr.error(`Erro ao tentar deletar o evento: ${this.eventoId}`, 'Erro');
      }
    ).add(() => this.spinner.hide())
  }

  decline() {
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  mostraImagem(imagemURL: string){
    return (imagemURL !== null)
            ? `${environment.imagemURL}${imagemURL}`
            : 'assets/semImagem.jpg';
  }
}
