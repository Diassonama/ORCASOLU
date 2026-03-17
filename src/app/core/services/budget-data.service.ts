import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';

import {
  Categoria,
  CreateCategoriaPayload,
  CreateOrdemProducaoPayload,
  CreateProdutoPayload,
  OrdemProducao,
  ProdutoLookup,
  Produto,
  SubProduto,
  TipoImpressaoLookup
} from '../models/budget.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BudgetDataService {
  constructor(private readonly api: ApiService) {}

  getCategorias(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>('Categorias');
  }

  createCategoria(payload: CreateCategoriaPayload): Observable<Categoria> {
    return this.api.post<Categoria>('Categorias', payload);
  }

  updateCategoria(id: number, payload: CreateCategoriaPayload): Observable<void> {
    return this.api.put(`Categorias/${id}`, payload);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.api.delete(`Categorias/${id}`);
  }

  getProdutos(): Observable<Produto[]> {
    return this.api.get<Produto[]>('Produtos');
  }

  createProduto(payload: CreateProdutoPayload): Observable<Produto> {
    return this.api.post<Produto>('Produtos', payload);
  }

  updateProduto(id: number, payload: CreateProdutoPayload): Observable<void> {
    return this.api.put(`Produtos/${id}`, payload);
  }

  deleteProduto(id: number): Observable<void> {
    return this.api.delete(`Produtos/${id}`);
  }

  getOrdensProducao(): Observable<OrdemProducao[]> {
    return this.api.get<OrdemProducao[]>('OrdensProducao');
  }

  getSubProdutos(): Observable<SubProduto[]> {
    return this.api.get<SubProduto[]>('SubProdutos');
  }

  getProdutosLookup(): Observable<ProdutoLookup[]> {
    return this.getProdutos().pipe(
      map((produtos) =>
        produtos
          .map((produto) => ({ id: produto.id, nome: produto.nome }))
          .sort((left, right) => left.nome.localeCompare(right.nome))
      )
    );
  }

  getTiposImpressaoLookup(): Observable<TipoImpressaoLookup[]> {
    return this.api.get<TipoImpressaoLookup[]>('TiposImpressao').pipe(
      catchError(() =>
        this.getOrdensProducao().pipe(
          map((ordens) => {
            const byId = new Map<number, TipoImpressaoLookup>();

            ordens
              .filter((ordem) => ordem.tipoImpressaoId != null)
              .forEach((ordem) => {
                const id = ordem.tipoImpressaoId as number;
                if (!byId.has(id)) {
                  byId.set(id, {
                    id,
                    nome: ordem.tipoImpressaoNome || `Tipo ${id}`
                  });
                }
              });

            return Array.from(byId.values()).sort((a, b) => a.nome.localeCompare(b.nome));
          }),
          catchError(() => of([]))
        )
      )
    );
  }

  createOrdemProducao(payload: CreateOrdemProducaoPayload): Observable<OrdemProducao> {
    return this.api.post<OrdemProducao>('OrdensProducao', payload);
  }

  updateOrdemProducao(id: number, payload: CreateOrdemProducaoPayload): Observable<void> {
    return this.api.put(`OrdensProducao/${id}`, payload);
  }

  deleteOrdemProducao(id: number): Observable<void> {
    return this.api.delete(`OrdensProducao/${id}`);
  }
}
