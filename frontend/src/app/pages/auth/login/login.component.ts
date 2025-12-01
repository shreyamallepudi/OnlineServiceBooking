import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzCheckboxModule
  ],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-left">
          <div class="auth-branding">
            <a routerLink="/" class="logo">
              <span class="logo-icon">⚡</span>
              <span>Service<span class="highlight">Book</span></span>
            </a>
            <h1>Welcome Back</h1>
            <p>Sign in to continue booking amazing services</p>
          </div>
          <div class="auth-illustration">
            <div class="illustration-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>
          </div>
        </div>
        
        <div class="auth-right">
          <div class="auth-form-container">
            <div class="auth-form-header">
              <h2>Sign In</h2>
              <p>Don't have an account? <a routerLink="/register">Create one</a></p>
            </div>
            
            <form (ngSubmit)="onSubmit()" class="auth-form">
              <div class="form-group">
                <label>Email Address</label>
                <nz-input-group [nzPrefix]="emailPrefix">
                  <input nz-input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" />
                </nz-input-group>
                <ng-template #emailPrefix>
                  <span nz-icon nzType="mail" nzTheme="outline"></span>
                </ng-template>
              </div>
              
              <div class="form-group">
                <label>Password</label>
                <nz-input-group [nzPrefix]="passwordPrefix" [nzSuffix]="passwordSuffix">
                  <input nz-input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" placeholder="Enter your password" />
                </nz-input-group>
                <ng-template #passwordPrefix>
                  <span nz-icon nzType="lock" nzTheme="outline"></span>
                </ng-template>
                <ng-template #passwordSuffix>
                  <span nz-icon [nzType]="showPassword ? 'eye' : 'eye-invisible'" nzTheme="outline" (click)="showPassword = !showPassword" style="cursor: pointer;"></span>
                </ng-template>
              </div>
              
              <div class="form-options">
                <label nz-checkbox [(ngModel)]="rememberMe" name="remember">Remember me</label>
                <a href="#" class="forgot-link">Forgot password?</a>
              </div>
              
              <button nz-button nzType="primary" nzBlock nzSize="large" [nzLoading]="loading" type="submit">
                Sign In
              </button>
            </form>
            
            <div class="auth-divider">
              <span>or continue with</span>
            </div>
            
            <div class="social-login">
              <button nz-button nzBlock class="social-btn google">
                <span nz-icon nzType="google" nzTheme="outline"></span>
                Google
              </button>
              <button nz-button nzBlock class="social-btn facebook">
                <span nz-icon nzType="facebook" nzTheme="fill"></span>
                Facebook
              </button>
            </div>
            
            <p class="demo-accounts">
              <strong>Demo Accounts:</strong><br>
              Customer: customer&#64;example.com / customer123<br>
              Provider: provider1&#64;example.com / provider123<br>
              Admin: admin&#64;servicebook.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
    }
    
    .auth-container {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    
    .auth-left {
      background: linear-gradient(135deg, #0a1628 0%, #1a2f4a 50%, #0d3d4d 100%);
      padding: 48px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      
      .auth-branding {
        position: relative;
        z-index: 1;
        
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 80px;
          
          .logo-icon {
            font-size: 28px;
          }
          
          .highlight {
            color: var(--primary-400);
          }
        }
        
        h1 {
          font-size: 3rem;
          color: white;
          margin-bottom: 16px;
        }
        
        p {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
        }
      }
      
      .auth-illustration {
        flex: 1;
        position: relative;
        
        .illustration-shapes {
          .shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 230, 160, 0.1);
            
            &.shape-1 {
              width: 300px;
              height: 300px;
              bottom: 10%;
              right: 0;
            }
            
            &.shape-2 {
              width: 200px;
              height: 200px;
              bottom: 30%;
              left: 10%;
            }
            
            &.shape-3 {
              width: 150px;
              height: 150px;
              top: 20%;
              right: 20%;
            }
          }
        }
      }
    }
    
    .auth-right {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      background: white;
    }
    
    .auth-form-container {
      width: 100%;
      max-width: 420px;
      
      .auth-form-header {
        text-align: center;
        margin-bottom: 40px;
        
        h2 {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        
        p {
          color: var(--neutral-500);
          
          a {
            color: var(--primary-600);
            text-decoration: none;
            font-weight: 500;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    
    .auth-form {
      .form-group {
        margin-bottom: 24px;
        
        label {
          display: block;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--neutral-700);
        }
      }
      
      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        
        .forgot-link {
          color: var(--primary-600);
          text-decoration: none;
          font-size: 14px;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    
    .auth-divider {
      display: flex;
      align-items: center;
      margin: 32px 0;
      
      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--neutral-200);
      }
      
      span {
        padding: 0 16px;
        color: var(--neutral-400);
        font-size: 14px;
      }
    }
    
    .social-login {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      
      .social-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 48px;
        border-radius: var(--radius-md);
        font-weight: 500;
        
        &.google {
          border-color: var(--neutral-200);
          
          &:hover {
            border-color: #ea4335;
            color: #ea4335;
          }
        }
        
        &.facebook {
          border-color: var(--neutral-200);
          
          &:hover {
            border-color: #1877f2;
            color: #1877f2;
          }
        }
      }
    }
    
    .demo-accounts {
      margin-top: 32px;
      padding: 16px;
      background: var(--neutral-50);
      border-radius: var(--radius-md);
      font-size: 12px;
      color: var(--neutral-600);
      line-height: 1.8;
    }
    
    @media (max-width: 900px) {
      .auth-container {
        grid-template-columns: 1fr;
      }
      
      .auth-left {
        display: none;
      }
    }
  `],
  providers: [NzMessageService]
})
export class LoginComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  loading = false;
  
  onSubmit(): void {
    if (!this.email || !this.password) {
      this.message.error('Please enter email and password');
      return;
    }
    
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.message.success('Login successful!');
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        }
      },
      error: (error) => {
        this.loading = false;
        this.message.error(error.error?.message || 'Invalid email or password');
      }
    });
  }
}


