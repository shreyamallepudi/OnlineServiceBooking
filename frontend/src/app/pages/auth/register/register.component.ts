import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzRadioModule,
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
            <h1>Join ServiceBook</h1>
            <p>Create an account to start booking services or become a service provider</p>
          </div>
          <div class="features-list">
            <div class="feature">
              <span nz-icon nzType="check-circle" nzTheme="fill"></span>
              <span>Access to verified professionals</span>
            </div>
            <div class="feature">
              <span nz-icon nzType="check-circle" nzTheme="fill"></span>
              <span>Easy booking & scheduling</span>
            </div>
            <div class="feature">
              <span nz-icon nzType="check-circle" nzTheme="fill"></span>
              <span>Secure payments</span>
            </div>
            <div class="feature">
              <span nz-icon nzType="check-circle" nzTheme="fill"></span>
              <span>Satisfaction guaranteed</span>
            </div>
          </div>
        </div>
        
        <div class="auth-right">
          <div class="auth-form-container">
            <div class="auth-form-header">
              <h2>Create Account</h2>
              <p>Already have an account? <a routerLink="/login">Sign in</a></p>
            </div>
            
            <form (ngSubmit)="onSubmit()" class="auth-form">
              <div class="account-type">
                <label>I want to:</label>
                <nz-radio-group [(ngModel)]="registerData.role" name="role">
                  <label nz-radio-button nzValue="CUSTOMER">
                    <span nz-icon nzType="user" nzTheme="outline"></span>
                    Book Services
                  </label>
                  <label nz-radio-button nzValue="PROVIDER">
                    <span nz-icon nzType="tool" nzTheme="outline"></span>
                    Provide Services
                  </label>
                </nz-radio-group>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>First Name *</label>
                  <input nz-input [(ngModel)]="registerData.firstName" name="firstName" placeholder="John" />
                </div>
                <div class="form-group">
                  <label>Last Name *</label>
                  <input nz-input [(ngModel)]="registerData.lastName" name="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div class="form-group">
                <label>Email Address *</label>
                <input nz-input type="email" [(ngModel)]="registerData.email" name="email" placeholder="john&#64;example.com" />
              </div>
              
              <div class="form-group">
                <label>Phone Number</label>
                <input nz-input [(ngModel)]="registerData.phone" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
              
              <div class="form-group">
                <label>Password *</label>
                <nz-input-group [nzSuffix]="passwordSuffix">
                  <input nz-input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="registerData.password" name="password" placeholder="Create a strong password" />
                </nz-input-group>
                <ng-template #passwordSuffix>
                  <span nz-icon [nzType]="showPassword ? 'eye' : 'eye-invisible'" nzTheme="outline" (click)="showPassword = !showPassword" style="cursor: pointer;"></span>
                </ng-template>
                <div class="password-strength">
                  <div class="strength-bar" [class.weak]="passwordStrength === 1" [class.medium]="passwordStrength === 2" [class.strong]="passwordStrength === 3"></div>
                  <span>{{ passwordStrengthText }}</span>
                </div>
              </div>
              
              <label nz-checkbox [(ngModel)]="agreeTerms" name="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
              
              <button nz-button nzType="primary" nzBlock nzSize="large" [nzLoading]="loading" type="submit" [disabled]="!agreeTerms">
                Create Account
              </button>
            </form>
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
      
      .auth-branding {
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
          font-size: 2.5rem;
          color: white;
          margin-bottom: 16px;
        }
        
        p {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 48px;
        }
      }
      
      .features-list {
        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 15px;
          padding: 12px 0;
          
          span[nz-icon] {
            color: var(--primary-400);
            font-size: 20px;
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
      overflow-y: auto;
    }
    
    .auth-form-container {
      width: 100%;
      max-width: 480px;
      
      .auth-form-header {
        text-align: center;
        margin-bottom: 32px;
        
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
          }
        }
      }
    }
    
    .auth-form {
      .account-type {
        margin-bottom: 24px;
        
        label:first-child {
          display: block;
          font-weight: 500;
          margin-bottom: 12px;
          color: var(--neutral-700);
        }
        
        nz-radio-group {
          display: flex;
          gap: 12px;
          
          label[nz-radio-button] {
            flex: 1;
            height: auto;
            padding: 16px;
            text-align: center;
            border-radius: var(--radius-md);
            
            span[nz-icon] {
              display: block;
              font-size: 24px;
              margin-bottom: 8px;
            }
          }
        }
      }
      
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      
      .form-group {
        margin-bottom: 20px;
        
        label {
          display: block;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--neutral-700);
        }
      }
      
      .password-strength {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 8px;
        
        .strength-bar {
          flex: 1;
          height: 4px;
          background: var(--neutral-200);
          border-radius: 2px;
          overflow: hidden;
          
          &::after {
            content: '';
            display: block;
            height: 100%;
            width: 0;
            transition: width 0.3s, background 0.3s;
          }
          
          &.weak::after {
            width: 33%;
            background: #ef4444;
          }
          
          &.medium::after {
            width: 66%;
            background: #f59e0b;
          }
          
          &.strong::after {
            width: 100%;
            background: #22c55e;
          }
        }
        
        span {
          font-size: 12px;
          color: var(--neutral-500);
        }
      }
      
      label[nz-checkbox] {
        margin-bottom: 24px;
        
        a {
          color: var(--primary-600);
        }
      }
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
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  
  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER'
  };
  
  showPassword = false;
  agreeTerms = false;
  loading = false;
  
  get passwordStrength(): number {
    const password = this.registerData.password;
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  }
  
  get passwordStrengthText(): string {
    switch (this.passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      default: return '';
    }
  }
  
  onSubmit(): void {
    if (!this.registerData.firstName || !this.registerData.lastName || !this.registerData.email || !this.registerData.password) {
      this.message.error('Please fill in all required fields');
      return;
    }
    
    if (this.registerData.password.length < 6) {
      this.message.error('Password must be at least 6 characters');
      return;
    }
    
    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.message.success('Account created successfully!');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.message.error(error.error?.message || 'Registration failed');
      }
    });
  }
}


