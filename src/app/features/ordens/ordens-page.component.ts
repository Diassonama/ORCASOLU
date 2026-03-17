import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import {
  CreateOrdemProducaoPayload,
  OrdemProducao,
  ProdutoLookup,
  SubProduto,
  TipoImpressaoLookup
} from '../../core/models/budget.models';
import { BudgetDataService } from '../../core/services/budget-data.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-ordens-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ordens-page.component.html',
  styleUrl: './ordens-page.component.css'
})
export class OrdensPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly ordens = signal<OrdemProducao[]>([]);
  readonly produtos = signal<ProdutoLookup[]>([]);
  readonly subProdutos = signal<SubProduto[]>([]);
  readonly filteredSubProdutos = signal<SubProduto[]>([]);
  readonly tiposImpressao = signal<TipoImpressaoLookup[]>([]);
  readonly editingId = signal<number | null>(null);

  readonly form = this.formBuilder.group({
    numProduto: [''],
    produtoId: [null as number | null, [Validators.required, Validators.min(1)]],
    subProdutoId: [{ value: null as number | null, disabled: true }, [Validators.required, Validators.min(1)]],
    tipoImpressaoId: [null as number | null],
    quantidade: [null as number | null, [Validators.min(0)]],
    refInterna: [''],
    nrPaginas: [null as number | null, [Validators.min(0)]],
    formato: [''],
    totalNrTecnicos: [null as number | null, [Validators.min(0)]],
    notasObservacoes: ['']
  });

  constructor(
    private readonly budgetDataService: BudgetDataService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form.controls.produtoId.valueChanges.subscribe((produtoId) => {
      this.applySubProdutoFilter(produtoId ?? null);
    });

    this.loadLookupsAndOrdens();
  }

  startEdit(ordem: OrdemProducao): void {
    const subProduto = this.subProdutos().find((item) => item.id === ordem.subProdutoId);
    const produtoId = subProduto?.produtoId ?? null;

    this.editingId.set(ordem.id);
    this.applySubProdutoFilter(produtoId);

    this.form.patchValue({
      numProduto: ordem.numProduto ?? '',
      produtoId,
      subProdutoId: ordem.subProdutoId,
      tipoImpressaoId: ordem.tipoImpressaoId ?? null,
      quantidade: ordem.quantidade ?? null,
      refInterna: ordem.refInterna ?? '',
      nrPaginas: ordem.nrPaginas ?? null,
      formato: ordem.formato ?? '',
      totalNrTecnicos: ordem.totalNrTecnicos ?? null,
      notasObservacoes: ordem.notasObservacoes ?? ''
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({
      numProduto: '',
      produtoId: null,
      subProdutoId: null,
      tipoImpressaoId: null,
      quantidade: null,
      refInterna: '',
      nrPaginas: null,
      formato: '',
      totalNrTecnicos: null,
      notasObservacoes: ''
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Preencha os campos obrigatórios da ordem.');
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue() as CreateOrdemProducaoPayload;
    const editingId = this.editingId();
    if (editingId) {
      this.budgetDataService.updateOrdemProducao(editingId, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.cancelEdit();
          this.loadLookupsAndOrdens();
          this.toastService.success('Ordem atualizada com sucesso.');
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Erro ao atualizar ordem.');
        }
      });
      return;
    }

    this.budgetDataService.createOrdemProducao(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.loadLookupsAndOrdens();
        this.toastService.success('Ordem criada com sucesso.');
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Erro ao criar ordem.');
      }
    });
  }

  delete(ordem: OrdemProducao): void {
    const confirmed = confirm(`Excluir ordem #${ordem.id}?`);
    if (!confirmed) {
      return;
    }

    this.budgetDataService.deleteOrdemProducao(ordem.id).subscribe({
      next: () => {
        if (this.editingId() === ordem.id) {
          this.cancelEdit();
        }
        this.loadLookupsAndOrdens();
        this.toastService.success('Ordem excluída.');
      },
      error: () => {
        this.toastService.error('Erro ao excluir ordem.');
      }
    });
  }

  subProdutoLabel(id: number): string {
    const match = this.subProdutos().find((item) => item.id === id);
    return match ? `${match.nome} (#${match.id})` : `#${id}`;
  }

  private applySubProdutoFilter(produtoId: number | null): void {
    const filtered = produtoId
      ? this.subProdutos().filter((item) => item.produtoId === produtoId)
      : [];

    this.filteredSubProdutos.set(filtered);

    if (produtoId) {
      this.form.controls.subProdutoId.enable({ emitEvent: false });
    } else {
      this.form.controls.subProdutoId.disable({ emitEvent: false });
    }

    const currentSubProdutoId = this.form.controls.subProdutoId.value;
    if (currentSubProdutoId && !filtered.some((item) => item.id === currentSubProdutoId)) {
      this.form.controls.subProdutoId.setValue(null);
    }
  }

  private loadLookupsAndOrdens(): void {
    this.loading.set(true);
    forkJoin({
      ordens: this.budgetDataService.getOrdensProducao(),
      produtos: this.budgetDataService.getProdutosLookup(),
      subProdutos: this.budgetDataService.getSubProdutos(),
      tiposImpressao: this.budgetDataService.getTiposImpressaoLookup()
    }).subscribe({
      next: ({ ordens, produtos, subProdutos, tiposImpressao }) => {
        this.ordens.set(ordens);
        this.produtos.set(produtos);
        this.subProdutos.set(subProdutos);
        this.tiposImpressao.set(tiposImpressao);
        this.applySubProdutoFilter(this.form.controls.produtoId.value ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar ordens e referências.');
      }
    });
  }
}
