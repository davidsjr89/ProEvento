import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { environment } from '@environments/environment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  form!: FormGroup;
  estadoSalvar = 'post';
  evento = {} as Evento;
  eventoId: number;
  imagemURL = 'assets/upload.png'
  file: File;
  loteAtual = {id: 0, nome: '', indice: 0};

  constructor(private fb: FormBuilder, private localeService: BsLocaleService, private router: ActivatedRoute, private route: Router,
    private eventoService: EventoService, private spinner: NgxSpinnerService, private toastr: ToastrService, private loteService: LoteService,
    private modalService: BsModalService) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }
  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig() {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,

    };
  }

  get bsConfigLote() {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,

    };
  }
  validation() {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', [Validators.required]],
      dataEvento: ['', [Validators.required]],
      qtdPessoas: ['', [Validators.required, Validators.min(0), Validators.max(120000)]],
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([])
    })
  }

  adicionarLote() {
    this.lotes.push(
      this.criarLote({ id: 0 } as Lote)
    );
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, [Validators.required]],
      preco: [lote.preco, [Validators.required]],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
      quantidade: [lote.quantidade, [Validators.required]]
    });
  }
  carregarEvento() {
    this.eventoId = +this.router.snapshot.paramMap.get('id');
    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          if(this.evento.imagemURL !== null){
            this.imagemURL = environment.imagemURL + this.evento.imagemURL;
          }
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          });
        },
        (error: any) => {
          this.toastr.error("Ao tentar carregar Evento", "Erro!");
          console.error(error);
        },
        () => this.spinner.hide()
      )
    }
  }

  // carregarLotes(){
  //   this.loteService.getLotesByEventoId(this.eventoId).subscribe(
  //     (lotesRetorno: Lote[]) => {
  //       lotesRetorno.forEach(lote => {
  //         this.lotes.push(this.criarLote(lote));
  //       });
  //     },
  //     (error: any) => {
  //       this.toastr.error('Erro ao tentar carregar lotes', 'Erro');
  //       console.log(error);
  //     }
  //   ).add(() => this.spinner.hide())
  // }

  resetForm() {
    this.form.reset();
  }

  cssValidator(campoForm: FormGroup | AbstractControl) {
    return { 'is-invalid': campoForm.errors && campoForm.touched }
  }

  salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.evento =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com Sucesso!', 'Sucesso');
          this.route.navigate([`/eventos/detalhe/${eventoRetorno.id}`]);
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro');
        },
        () => this.spinner.hide()
      );
    }
  }

  salvarLotes(){
    if(this.form.controls.lotes.valid){
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
        () => {
          
          this.route.navigate([`/eventos/detalhe/}`]);
          this.toastr.success('Lotes salvos com sucesso!', 'Sucesso!');
          this.lotes.reset();
          console.log(this.router.snapshot.params['id'])
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar salvar lotes', 'Erro');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  removerLote(template: TemplateRef<any>, indice: number){
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }

  confirmDeleteLote(){
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toastr.success('Lote deletado com sucesso', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (erro) => {
        this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}`, 'Erro');
        console.error(erro);
      }
    ).add(() => this.spinner.hide());
  }

  declineDeleteLote(){
    this.modalRef.hide();
  }

  retornaTituloLote(nome: string): string {
    return nome === null || nome === '' ? 'Nome do lote' : nome;
  }

  onFileChange(ev: any){
    const reader = new FileReader();
    this.file = ev.target.files;
    reader.onload = (event:any) => this.imagemURL = event.target.result;
    reader.readAsDataURL(this.file[0]);
    this.uploadImagem();
  }

  uploadImagem(){
    this.spinner.show();
    debugger
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada com Sucesso!', 'Sucesso!');
      },
      (error) => {
        this.toastr.error('Erro ao tentar fazer upload da imagem!', 'Erro!');
        console.log(error);
      },
    ).add(() => this.spinner.hide())
  }
}