import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface BankAccountHouse {
  id: string;
  address: string;
  numero: string;
  solde: number;
  color: string;
}

@Component({
  selector: 'app-construction-site',
  standalone: true,
  imports: [FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 03 · FONDATIONS POO</div>
        <h2>Classe vs Instance : Le Plan d'Architecte vs La Maison</h2>
        <p class="module-desc">
          Une <strong>classe</strong> est un plan d'architecte : elle définit les spécifications et les règles, mais <em>on ne peut pas habiter dedans</em>. Une <strong>instance</strong> est la maison coulée en béton : chaque appel à <code>new</code> alloue un bloc de mémoire distinct dans le tas.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>🏗️ Le Chantier Virtuel</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 2 · Invariants &amp; Instances)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="site-layout">
          <!-- Colonne Gauche : Le Plan d'Architecte Immuable -->
          <div class="card-panel blueprint-panel">
            <div class="blueprint-header">
              <div class="bp-icon">📐</div>
              <div>
                <h3>Plan de Classe : CompteBancaire</h3>
                <span class="bp-tag">Exemplaire Unique · Aucune Donnée Réelle</span>
              </div>
            </div>

            <div class="blueprint-code">
              <pre><code><span class="kw">class</span> <span class="cls">CompteBancaire</span> &#123;
  <span class="kw">constructor</span>(
    <span class="kw">public readonly</span> numero: <span class="typ">string</span>,
    <span class="kw">private</span> _solde: <span class="typ">number</span>
  ) &#123;&#125;

  <span class="kw">public</span> deposer(montant: <span class="typ">number</span>): <span class="typ">void</span> &#123;
    <span class="kw">this</span>._solde += montant;
  &#125;

  <span class="kw">public</span> retirer(montant: <span class="typ">number</span>): <span class="typ">void</span> &#123;
    <span class="kw">this</span>._solde -= montant;
  &#125;
&#125;</code></pre>
            </div>

            <div class="construction-form">
              <div class="form-title">Couler une nouvelle maison en béton (new) :</div>
              <div class="form-inputs">
                <input type="text" [(ngModel)]="newNumero" placeholder="Numéro (ex: BE-789)" class="form-control" />
                <input type="number" [(ngModel)]="newSolde" placeholder="Solde initial (€)" class="form-control" />
              </div>
              <button class="btn-primary build-btn" (click)="buildHouse()">
                🏗️ Exécuter new CompteBancaire()
              </button>
            </div>

            <div class="blueprint-note">
              💡 <strong>Règle physique</strong> : Le plan ne change jamais. Chaque clic sur <code>new</code> commande au processeur d'allouer de nouveaux octets indépendants dans le tas.
            </div>
          </div>

          <!-- Colonne Droite : Le Lotissement Résidentiel (Le Tas) -->
          <div class="card-panel estate-panel">
            <div class="estate-header">
              <h3>Lotissement en Mémoire (Le Tas / Heap)</h3>
              <span class="badge badge-success">{{ houses().length }} Maison(s) allouée(s)</span>
            </div>

            <div class="houses-grid">
              @for (house of houses(); track house.id) {
                <div class="house-card" [style.border-top-color]="house.color">
                  <div class="house-roof" [style.border-bottom-color]="house.color"></div>
                  
                  <div class="house-body">
                    <div class="house-badge-row">
                      <span class="house-addr">{{ house.address }}</span>
                      <span class="house-num">{{ house.numero }}</span>
                    </div>

                    <div class="house-illustration">
                      <div class="door"></div>
                      <div class="window"></div>
                      <div class="window"></div>
                    </div>

                    <div class="house-balance-box">
                      <span class="bal-label">Solde propre :</span>
                      <span class="bal-amount">{{ house.solde }} €</span>
                    </div>

                    <div class="house-actions">
                      <button class="btn-secondary op-btn" (click)="deposit(house.id, 50)">+50 €</button>
                      <button class="btn-secondary op-btn" (click)="withdraw(house.id, 50)">-50 €</button>
                      <button class="btn-ghost del-btn" (click)="destroyHouse(house.id)" title="Détruire la maison">🗑️</button>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="estate-footer-notice">
              👉 <strong>Preuve d'isolation</strong> : Modifiez le solde d'une maison ci-dessus. Observez que les maisons voisines ne subissent aucune variation, car elles résident à des adresses mémoires physiques indépendantes.
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="2"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .site-layout {
      display: grid;
      grid-template-columns: 460px 1fr;
      gap: 20px;
      flex: 1;
    }

    .blueprint-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-color: rgba(59, 130, 246, 0.4);
      background: rgba(59, 130, 246, 0.03);
    }

    .blueprint-header {
      display: flex;
      align-items: center;
      gap: 12px;

      .bp-icon { font-size: 1.8rem; }
      h3 { font-size: 1.1rem; color: #60a5fa; font-weight: 700; }
      .bp-tag { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); }
    }

    .blueprint-code {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.8rem;

      .kw { color: #f472b6; font-weight: 600; }
      .cls { color: #38bdf8; font-weight: 700; }
      .typ { color: #34d399; }
    }

    .construction-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: var(--bg-card);
      padding: 14px;
      border-radius: 8px;
      border: 1px solid var(--border-color);

      .form-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .form-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .form-control {
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        color: var(--text-main);
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 0.82rem;
        font-family: inherit;

        &:focus {
          border-color: var(--border-focus);
          outline: none;
        }
      }

      .build-btn {
        width: 100%;
        margin-top: 4px;
      }
    }

    .blueprint-note {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.4;
      background: rgba(49, 120, 198, 0.08);
      padding: 10px;
      border-radius: 6px;
      border: 1px solid rgba(49, 120, 198, 0.2);
    }

    .estate-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .estate-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 { font-size: 1.1rem; color: var(--text-main); font-weight: 700; }
    }

    .houses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      flex: 1;
      align-content: start;
    }

    .house-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-top: 4px solid #3b82f6;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      .house-badge-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.72rem;
        font-family: var(--font-mono);

        .house-addr { color: #c084fc; font-weight: 700; }
        .house-num { color: var(--text-main); font-weight: 600; }
      }

      .house-illustration {
        height: 60px;
        background: var(--bg-subtle);
        border-radius: 6px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 12px;
        padding-bottom: 6px;

        .door {
          width: 16px;
          height: 28px;
          background: #64748b;
          border-radius: 2px 2px 0 0;
        }

        .window {
          width: 14px;
          height: 14px;
          background: #38bdf8;
          border: 2px solid #0f172a;
          border-radius: 2px;
        }
      }

      .house-balance-box {
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.25);
        padding: 6px 10px;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .bal-label { font-size: 0.76rem; color: var(--text-muted); }
        .bal-amount { font-size: 1rem; font-weight: 800; color: #34d399; font-family: var(--font-mono); }
      }

      .house-actions {
        display: flex;
        gap: 6px;

        .op-btn {
          flex: 1;
          padding: 5px 0;
          font-size: 0.76rem;
        }

        .del-btn {
          padding: 5px 8px;
        }
      }
    }

    .estate-footer-notice {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
  `]
})
export class ConstructionSiteComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  newNumero: string = 'BE-001';
  newSolde: number = 500;

  private colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  readonly houses = signal<BankAccountHouse[]>([
    { id: '1', address: '0x3F1A', numero: 'BE-101', solde: 1000, color: '#3b82f6' },
    { id: '2', address: '0x4B2C', numero: 'BE-202', solde: 250, color: '#10b981' }
  ]);

  buildHouse(): void {
    if (!this.newNumero.trim()) return;

    const randomHex = '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    const color = this.colors[this.houses().length % this.colors.length];

    this.houses.update(list => [
      ...list,
      {
        id: Date.now().toString(),
        address: randomHex,
        numero: this.newNumero,
        solde: Number(this.newSolde) || 0,
        color
      }
    ]);

    this.newNumero = 'BE-' + Math.floor(Math.random() * 900 + 100);
    this.newSolde = 500;
  }

  deposit(id: string, amount: number): void {
    this.houses.update(list => list.map(h => h.id === id ? { ...h, solde: h.solde + amount } : h));
  }

  withdraw(id: string, amount: number): void {
    this.houses.update(list => list.map(h => h.id === id ? { ...h, solde: Math.max(0, h.solde - amount) } : h));
  }

  destroyHouse(id: string): void {
    this.houses.update(list => list.filter(h => h.id !== id));
  }
}
