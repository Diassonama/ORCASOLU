import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/login-page.component';
import { CategoriasPageComponent } from './features/categorias/categorias-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { ShellComponent } from './features/layout/shell.component';
import { OrdensPageComponent } from './features/ordens/ordens-page.component';
import { ProdutosPageComponent } from './features/produtos/produtos-page.component';
import { ChapasPageComponent } from './features/chapas/chapas-page.component';
import { ConsumiveisPageComponent } from './features/consumiveis/consumiveis-page.component';
import { CustoHoraHomemPageComponent } from './features/custohorahomem/custohorahomem-page.component';
import { CustoHoraMaquinaPageComponent } from './features/custohoramaquina/custohoramaquina-page.component';
import { ImpressaoDigitalPageComponent } from './features/impressaodigital/impressaodigital-page.component';
import { ImpressaoOffsetPageComponent } from './features/impressaooffset/impressaooffset-page.component';
import { MateriaPrimaPageComponent } from './features/materiaprima/materiaprima-page.component';
import { PreImpressaoPageComponent } from './features/preimpressao/preimpressao-page.component';
import { QuantidadeFolhasPageComponent } from './features/quantidadefolhas/quantidadefolhas-page.component';
import { SubProdutoPageComponent } from './features/subproduto/subproduto-page.component';
import { TemposAcertoAcabPageComponent } from './features/temposacertoacab/temposacertoacab-page.component';
import { TemposLimpezaAfinacaoPageComponent } from './features/temposlimpezaafinacao/temposlimpezaafinacao-page.component';


export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'ordens-producao', component: OrdensPageComponent },
      { path: 'produtos', component: ProdutosPageComponent },
      { path: 'categorias', component: CategoriasPageComponent },
      { path: 'chapas', component: ChapasPageComponent },
      { path: 'consumiveis', component: ConsumiveisPageComponent },
      { path: 'custo-hora-homem', component: CustoHoraHomemPageComponent },
      { path: 'custo-hora-maquina', component: CustoHoraMaquinaPageComponent },
      { path: 'impressao-digital', component: ImpressaoDigitalPageComponent },
      { path: 'impressao-offset', component: ImpressaoOffsetPageComponent },
      { path: 'materia-prima', component: MateriaPrimaPageComponent },
      { path: 'pre-impressao', component: PreImpressaoPageComponent },
      { path: 'quantidade-folhas', component: QuantidadeFolhasPageComponent },
      { path: 'sub-produto', component: SubProdutoPageComponent },
      { path: 'tempos-acerto-acab', component: TemposAcertoAcabPageComponent },
      { path: 'tempos-limpeza-afinacao', component: TemposLimpezaAfinacaoPageComponent },

    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
