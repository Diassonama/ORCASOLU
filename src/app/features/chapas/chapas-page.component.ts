import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

export interface Chapas {
  id: number;
  subProdutoId: number | null;
  tipoImpressaoId: number | null;
  quantidade: number | null;
  nrPaginas: number | null;
  planos: number | null;
  nrCadernos: number | null;
  coresCapa: string;
  coresMiolo: string;
  coresFrente: string;
  coresVerso: string;
  chapasCapa: number | null;
  chapasMiolo: number | null;
  chapasFrente: number | null;
  chapasVerso: number | null;
}

@Component({
  selector: 'app-chapas-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chapas-page.component.html',
})
export class ChapasPageComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private apiUrl = `${environment.apiBaseUrl}/Chapas`;

  items = signal<Chapas[]>([]);
  loading = signal(false);
  form!: FormGroup;
  editingId = signal<number | null>(null);

  constructor() {
    this.form = this.fb.group({
      subProdutoId: [null],
      tipoImpressaoId: [null],
      quantidade: [null],
      nrPaginas: [null],
      planos: [null],
      nrCadernos: [null],
      coresCapa: [null],
      coresMiolo: [null],
      coresFrente: [null],
      coresVerso: [null],
      chapasCapa: [null],
      chapasMiolo: [null],
      chapasFrente: [null],
      chapasVerso: [null],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.http.get<Chapas[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Erro ao carregar Chapas');
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const val = this.form.value;
    const id = this.editingId();
    this.loading.set(true);

    if (id) {
      this.http.put(`${this.apiUrl}/${id}`, val).subscribe({
        next: () => {
          this.toast.success('Editado com sucesso');
          this.resetForm();
          this.loadData();
        },
        error: () => {
          this.toast.error('Erro ao salvar');
          this.loading.set(false);
        }
      });
    } else {
      this.http.post(this.apiUrl, val).subscribe({
        next: () => {
          this.toast.success('Criado com sucesso');
          this.resetForm();
          this.loadData();
        },
        error: () => {
          this.toast.error('Erro ao criar');
          this.loading.set(false);
        }
      });
    }
  }

  startEdit(item: Chapas): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(item: Chapas): void {
    if (!confirm('Excluir este item?')) return;
    this.loading.set(true);
    this.http.delete(`${this.apiUrl}/${item.id}`).subscribe({
      next: () => {
        this.toast.success('Excluído');
        this.loadData();
      },
      error: () => {
        this.toast.error('Erro ao excluir');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.reset();
  }
}
