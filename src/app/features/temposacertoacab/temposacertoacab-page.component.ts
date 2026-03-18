import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

export interface TemposAcertoAcab {
  id: number;
  equipamento: string;
  minutos: number | null;
}

@Component({
  selector: 'app-temposacertoacab-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './temposacertoacab-page.component.html',
})
export class TemposAcertoAcabPageComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private apiUrl = `${environment.apiBaseUrl}/TemposAcertoAcab`;

  items = signal<TemposAcertoAcab[]>([]);
  loading = signal(false);
  form!: FormGroup;
  editingId = signal<number | null>(null);

    Math = Math;
  showModal = signal(false);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = 10;

  filteredItems = computed(() => {
    let result = this.items() || [];
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(term)));
    }
    return result;
  });

  paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredItems().slice(start, start + this.pageSize);
  });

  openModal() {
    this.resetForm();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.resetForm();
  }

  nextPage() {
    if (this.currentPage() * this.pageSize < this.filteredItems().length) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  constructor() {
    this.form = this.fb.group({
      equipamento: [null],
      minutos: [null],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.http.get<TemposAcertoAcab[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Erro ao carregar TemposAcertoAcab');
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
          this.closeModal();
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
          this.closeModal();
          this.loadData();
        },
        error: () => {
          this.toast.error('Erro ao criar');
          this.loading.set(false);
        }
      });
    }
  }

  startEdit(item: TemposAcertoAcab): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    this.showModal.set(true);
  }

  delete(item: TemposAcertoAcab): void {
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
