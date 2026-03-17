import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent {
  readonly menuOpen = signal(false);
  readonly sidebarExpanded = signal(true);

  readonly menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Ordens de Produção', route: '/ordens-producao', icon: 'ordens' },
    { label: 'Produtos', route: '/produtos', icon: 'produtos' },
    { label: 'Categorias', route: '/categorias', icon: 'categorias' },
    { label: 'Chapas', route: '/chapas', icon: 'chapas' },
    { label: 'Consumíveis', route: '/consumiveis', icon: 'consumiveis' },
    { label: 'Custo Hora Homem', route: '/custo-hora-homem', icon: 'custo-hora-homem' },
    { label: 'Custo Hora Máquina', route: '/custo-hora-maquina', icon: 'custo-hora-maquina' },
    { label: 'Imp. Digital', route: '/impressao-digital', icon: 'impressao-digital' },
    { label: 'Imp. Offset', route: '/impressao-offset', icon: 'impressao-offset' },
    { label: 'Matéria Prima', route: '/materia-prima', icon: 'materia-prima' },
    { label: 'Pré Impressão', route: '/pre-impressao', icon: 'pre-impressao' },
    { label: 'Quant. Folhas', route: '/quantidade-folhas', icon: 'quantidade-folhas' },
    { label: 'Sub-Produto', route: '/sub-produto', icon: 'sub-produto' },
    { label: 'T. Acerto/Acab.', route: '/tempos-acerto-acab', icon: 'tempos-acerto-acab' },
    { label: 'T. Limp./Afin.', route: '/tempos-limpeza-afinacao', icon: 'tempos-limpeza-afinacao' }
  ];

  constructor(public readonly authService: AuthService) {}

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  toggleSidebar(): void {
    this.sidebarExpanded.update((expanded) => !expanded);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
