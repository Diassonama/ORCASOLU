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
    { label: 'Categorias', route: '/categorias', icon: 'categorias' }
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
