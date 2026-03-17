export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

export interface CreateCategoriaPayload {
  nome: string;
  descricao?: string;
}

export interface Produto {
  id: number;
  categoriaId: number;
  nome: string;
  descricao?: string;
  categoriaNome?: string;
}

export interface CreateProdutoPayload {
  categoriaId: number;
  nome: string;
  descricao?: string;
}

export interface OrdemProducao {
  id: number;
  numProduto?: string;
  subProdutoId: number;
  tipoImpressaoId?: number;
  quantidade?: number;
  refInterna?: string;
  nrPaginas?: number;
  formato?: string;
  totalNrTecnicos?: number;
  notasObservacoes?: string;
  subProdutoNome?: string;
  tipoImpressaoNome?: string;
}

export interface SubProduto {
  id: number;
  produtoId: number;
  nome: string;
  descricao?: string;
}

export interface ProdutoLookup {
  id: number;
  nome: string;
}

export interface TipoImpressaoLookup {
  id: number;
  nome: string;
  descricao?: string;
}

export interface CreateOrdemProducaoPayload {
  numProduto?: string;
  subProdutoId: number;
  tipoImpressaoId?: number;
  quantidade?: number;
  refInterna?: string;
  nrPaginas?: number;
  formato?: string;
  totalNrTecnicos?: number;
  notasObservacoes?: string;
}

export interface DashboardStats {
  categorias: number;
  produtos: number;
  ordens: number;
}
