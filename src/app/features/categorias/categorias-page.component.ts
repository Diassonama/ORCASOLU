import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Categoria, CreateCategoriaPayload } from '../../core/models/budget.models';
import { BudgetDataService } from '../../core/services/budget-data.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-categorias-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias-page.component.html',
  styleUrl: './categorias-page.component.css'
})
export class CategoriasPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly categorias = signal<Categoria[]>([]);
  readonly editingId = signal<number | null>(null);

  readonly form = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    descricao: ['']
  });

  constructor(
    private readonly budgetDataService: BudgetDataService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  startEdit(categoria: Categoria): void {
    this.editingId.set(categoria.id);
    this.form.patchValue({
      nome: categoria.nome,
      descricao: categoria.descricao ?? ''
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ nome: '', descricao: '' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Informe pelo menos o nome da categoria.');
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue() as CreateCategoriaPayload;
    const editingId = this.editingId();

    if (editingId) {
      this.budgetDataService.updateCategoria(editingId, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.cancelEdit();
          this.loadCategorias();
          this.toastService.success('Categoria atualizada com sucesso.');
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Erro ao atualizar categoria.');
        }
      });
      return;
    }

    this.budgetDataService.createCategoria(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.loadCategorias();
        this.toastService.success('Categoria criada com sucesso.');
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Erro ao criar categoria.');
      }
    });
  }

  delete(categoria: Categoria): void {
    const confirmed = confirm(`Excluir categoria "${categoria.nome}"?`);
    if (!confirmed) {
      return;
    }

    this.budgetDataService.deleteCategoria(categoria.id).subscribe({
      next: () => {
        if (this.editingId() === categoria.id) {
          this.cancelEdit();
        }
        this.loadCategorias();
        this.toastService.success('Categoria excluída.');
      },
      error: () => {
        this.toastService.error('Erro ao excluir categoria.');
      }
    });
  }

  private loadCategorias(): void {
    this.loading.set(true);
    this.budgetDataService.getCategorias().subscribe({
      next: (response) => {
        this.categorias.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar categorias.');
      }
    });
  }
}
