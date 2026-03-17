import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Categoria, CreateProdutoPayload, Produto } from '../../core/models/budget.models';
import { BudgetDataService } from '../../core/services/budget-data.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-produtos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produtos-page.component.html',
  styleUrl: './produtos-page.component.css'
})
export class ProdutosPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly produtos = signal<Produto[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly editingId = signal<number | null>(null);

  readonly form = this.formBuilder.group({
    categoriaId: [null as number | null, [Validators.required]],
    nome: ['', [Validators.required, Validators.minLength(2)]],
    descricao: ['']
  });

  constructor(
    private readonly budgetDataService: BudgetDataService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadProdutos();
  }

  startEdit(produto: Produto): void {
    this.editingId.set(produto.id);
    this.form.patchValue({
      categoriaId: produto.categoriaId,
      nome: produto.nome,
      descricao: produto.descricao ?? ''
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ categoriaId: null, nome: '', descricao: '' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Preencha categoria e nome do produto.');
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue() as CreateProdutoPayload;
    const editingId = this.editingId();
    if (editingId) {
      this.budgetDataService.updateProduto(editingId, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.cancelEdit();
          this.loadProdutos();
          this.toastService.success('Produto atualizado com sucesso.');
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Erro ao atualizar produto.');
        }
      });
      return;
    }

    this.budgetDataService.createProduto(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.loadProdutos();
        this.toastService.success('Produto criado com sucesso.');
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Erro ao criar produto.');
      }
    });
  }

  delete(produto: Produto): void {
    const confirmed = confirm(`Excluir produto "${produto.nome}"?`);
    if (!confirmed) {
      return;
    }

    this.budgetDataService.deleteProduto(produto.id).subscribe({
      next: () => {
        if (this.editingId() === produto.id) {
          this.cancelEdit();
        }
        this.loadProdutos();
        this.toastService.success('Produto excluído.');
      },
      error: () => {
        this.toastService.error('Erro ao excluir produto.');
      }
    });
  }

  private loadCategorias(): void {
    this.budgetDataService.getCategorias().subscribe({
      next: (response) => this.categorias.set(response),
      error: () => this.toastService.error('Erro ao carregar categorias.')
    });
  }

  private loadProdutos(): void {
    this.loading.set(true);
    this.budgetDataService.getProdutos().subscribe({
      next: (response) => {
        this.produtos.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar produtos.');
      }
    });
  }
}
