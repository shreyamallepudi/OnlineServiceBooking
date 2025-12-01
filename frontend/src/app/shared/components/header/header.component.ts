import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
    NzBadgeModule
  ],
  template: `
    <header class="header" [class.scrolled]="isScrolled">
      <div class="header-container">
        <a routerLink="/" class="logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">Service<span class="highlight">Book</span></span>
        </a>
        
        <nav class="nav-menu">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          @if (authService.isLoggedIn()) {
            <a routerLink="/my-bookings" routerLinkActive="active">My Bookings</a>
          }
        </nav>
        
        <div class="header-actions">
          @if (!authService.isLoggedIn()) {
            <button nz-button routerLink="/login" class="btn-signin">Sign In</button>
            <button nz-button nzType="primary" routerLink="/register">Get Started</button>
          } @else {
            <nz-badge [nzCount]="3" class="notification-badge">
              <button nz-button nzShape="circle" class="icon-btn">
                <span nz-icon nzType="bell" nzTheme="outline"></span>
              </button>
            </nz-badge>
            
            <div nz-dropdown [nzDropdownMenu]="userMenu" nzTrigger="click" class="user-menu-trigger">
              <nz-avatar 
                [nzText]="authService.currentUser()?.firstName?.charAt(0)"
                [nzSrc]="authService.currentUser()?.profileImage"
                nzSize="default"
                style="background-color: var(--primary-500); cursor: pointer;">
              </nz-avatar>
              <span class="user-name">{{ authService.currentUser()?.firstName }}</span>
              <span nz-icon nzType="down" nzTheme="outline"></span>
            </div>
            
            <nz-dropdown-menu #userMenu="nzDropdownMenu">
              <ul nz-menu class="user-dropdown">
                <li nz-menu-item class="user-info-item">
                  <strong>{{ authService.currentUser()?.fullName }}</strong>
                  <span class="user-email">{{ authService.currentUser()?.email }}</span>
                </li>
                <li nz-menu-divider></li>
                <li nz-menu-item routerLink="/my-bookings">
                  <span nz-icon nzType="calendar" nzTheme="outline"></span>
                  My Bookings
                </li>
                @if (authService.isProvider()) {
                  <li nz-menu-item routerLink="/provider">
                    <span nz-icon nzType="dashboard" nzTheme="outline"></span>
                    Provider Dashboard
                  </li>
                }
                @if (authService.isAdmin()) {
                  <li nz-menu-item routerLink="/admin">
                    <span nz-icon nzType="setting" nzTheme="outline"></span>
                    Admin Panel
                  </li>
                }
                <li nz-menu-item>
                  <span nz-icon nzType="user" nzTheme="outline"></span>
                  Profile Settings
                </li>
                <li nz-menu-divider></li>
                <li nz-menu-item (click)="logout()" class="logout-item">
                  <span nz-icon nzType="logout" nzTheme="outline"></span>
                  Sign Out
                </li>
              </ul>
            </nz-dropdown-menu>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      
      &.scrolled {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }
    }
    
    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 48px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--neutral-900);
      
      .logo-icon {
        font-size: 28px;
      }
      
      .highlight {
        color: var(--primary-600);
      }
    }
    
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      
      a {
        padding: 10px 20px;
        text-decoration: none;
        color: var(--neutral-600);
        font-weight: 500;
        font-size: 15px;
        border-radius: var(--radius-md);
        transition: all 0.2s ease;
        
        &:hover {
          color: var(--primary-600);
          background: var(--primary-50);
        }
        
        &.active {
          color: var(--primary-600);
          background: var(--primary-50);
        }
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .btn-signin {
        border: none;
        background: transparent;
        font-weight: 500;
        color: var(--neutral-700);
        
        &:hover {
          color: var(--primary-600);
        }
      }
    }
    
    .icon-btn {
      border: none;
      background: var(--neutral-100);
      
      &:hover {
        background: var(--neutral-200);
      }
    }
    
    .notification-badge {
      :host ::ng-deep .ant-badge-count {
        background: var(--accent-500);
      }
    }
    
    .user-menu-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: var(--radius-full);
      transition: background 0.2s;
      
      &:hover {
        background: var(--neutral-100);
      }
      
      .user-name {
        font-weight: 500;
        color: var(--neutral-700);
      }
    }
    
    .user-dropdown {
      min-width: 220px;
      padding: 8px;
      
      .user-info-item {
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
        
        .user-email {
          font-size: 13px;
          color: var(--neutral-500);
          margin-top: 2px;
        }
      }
      
      li {
        border-radius: var(--radius-sm);
        
        span[nz-icon] {
          margin-right: 10px;
        }
      }
      
      .logout-item {
        color: var(--accent-500);
      }
    }
  `],
  host: {
    '(window:scroll)': 'onScroll()'
  }
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  isScrolled = false;
  
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}


