import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, NzIconModule],
  template: `
    <footer class="footer">
      <div class="footer-glow"></div>
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-brand">
            <a routerLink="/" class="logo">
              <span class="logo-icon">⚡</span>
              <span class="logo-text">Service<span class="highlight">Book</span></span>
            </a>
            <p class="tagline">Your trusted partner for home services. Book expert professionals for all your needs.</p>
            <div class="social-links">
              <a href="#" class="social-link"><span nz-icon nzType="twitter" nzTheme="outline"></span></a>
              <a href="#" class="social-link"><span nz-icon nzType="facebook" nzTheme="fill"></span></a>
              <a href="#" class="social-link"><span nz-icon nzType="instagram" nzTheme="outline"></span></a>
              <a href="#" class="social-link"><span nz-icon nzType="linkedin" nzTheme="fill"></span></a>
            </div>
          </div>
          
          <div class="footer-links">
            <div class="link-group">
              <h4>Services</h4>
              <a routerLink="/services">All Services</a>
              <a href="#">Home Cleaning</a>
              <a href="#">Plumbing</a>
              <a href="#">Electrical</a>
              <a href="#">Beauty & Spa</a>
            </div>
            
            <div class="link-group">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Press</a>
              <a href="#">Partners</a>
            </div>
            
            <div class="link-group">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Safety</a>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Contact Us</a>
            </div>
            
            <div class="link-group">
              <h4>For Professionals</h4>
              <a routerLink="/register">Become a Pro</a>
              <a href="#">Pro Resources</a>
              <a href="#">Pro FAQ</a>
              <a href="#">Pro Blog</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="copyright">
            © {{ currentYear }} ServiceBook. All rights reserved.
          </div>
          <div class="footer-badges">
            <span class="badge">🔒 Secure Payments</span>
            <span class="badge">✓ Verified Professionals</span>
            <span class="badge">💯 Satisfaction Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      background: linear-gradient(180deg, #0a1628 0%, #0d1f35 100%);
      color: white;
      padding: 80px 0 32px;
      margin-top: 80px;
      overflow: hidden;
    }
    
    .footer-glow {
      position: absolute;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 400px;
      background: radial-gradient(ellipse at center, rgba(0, 230, 160, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }
    
    .footer-main {
      display: grid;
      grid-template-columns: 1.5fr 2.5fr;
      gap: 80px;
      padding-bottom: 48px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .footer-brand {
      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: white;
        
        .logo-icon {
          font-size: 32px;
        }
        
        .highlight {
          color: var(--primary-400);
        }
      }
      
      .tagline {
        margin-top: 16px;
        color: rgba(255, 255, 255, 0.6);
        font-size: 15px;
        line-height: 1.7;
        max-width: 280px;
      }
      
      .social-links {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        
        .social-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          color: rgba(255, 255, 255, 0.7);
          font-size: 18px;
          transition: all 0.2s;
          
          &:hover {
            background: var(--primary-500);
            color: white;
            transform: translateY(-2px);
          }
        }
      }
    }
    
    .footer-links {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
      
      .link-group {
        h4 {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: white;
          margin-bottom: 20px;
        }
        
        a {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 14px;
          padding: 6px 0;
          transition: all 0.2s;
          
          &:hover {
            color: var(--primary-400);
            transform: translateX(4px);
          }
        }
      }
    }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 32px;
      
      .copyright {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
      }
      
      .footer-badges {
        display: flex;
        gap: 24px;
        
        .badge {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }
    }
    
    @media (max-width: 1024px) {
      .footer-main {
        grid-template-columns: 1fr;
        gap: 48px;
      }
      
      .footer-links {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 640px) {
      .footer-links {
        grid-template-columns: 1fr;
      }
      
      .footer-bottom {
        flex-direction: column;
        gap: 16px;
        text-align: center;
        
        .footer-badges {
          flex-wrap: wrap;
          justify-content: center;
        }
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}


