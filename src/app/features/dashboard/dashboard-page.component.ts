import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DashboardStats, OrdemProducao } from '../../core/models/budget.models';
import { BudgetDataService } from '../../core/services/budget-data.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  readonly loading = signal(true);
  readonly stats = signal<DashboardStats>({ categorias: 0, produtos: 0, ordens: 0 });
  readonly recentOrders = signal<OrdemProducao[]>([]);

  constructor(private readonly budgetDataService: BudgetDataService) {}

  ngOnInit(): void {
    forkJoin({
      categorias: this.budgetDataService.getCategorias().pipe(catchError(() => of([]))),
      produtos: this.budgetDataService.getProdutos().pipe(catchError(() => of([]))),
      ordens: this.budgetDataService.getOrdensProducao().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ categorias, produtos, ordens }) => {
        this.stats.set({
          categorias: categorias.length,
          produtos: produtos.length,
          ordens: ordens.length
        });

        const sorted = [...ordens].sort((left, right) => right.id - left.id).slice(0, 5);
        this.recentOrders.set(sorted);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
