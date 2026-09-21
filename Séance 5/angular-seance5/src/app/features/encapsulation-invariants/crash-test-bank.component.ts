import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-crash-test-bank',
  standalone: true,
  imports: [FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 05 · PROTECTION DE L'ÉTAT</div>
        <h2>Pourquoi l'Encapsulation &amp; Les Invariants de Classe</h2>
        <p class="module-desc">
          Un <strong>invariant de classe</strong> est une règle métier absolue qui <em>doit être vraie à chaque instant</em> (à la création et après chaque méthode). L'encapsulation enferme les données sensibles sous un cordon sanitaire protecteur (le capot fermé de la voiture).
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Le Crash-Test d'un Objet</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 2 · Défense des Invariants)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="crash-test-workbench">
          <!-- Métaphore de la voiture (Toggle interactif) -->
          <div class="card-panel car-metaphor-box">
            <div class="meta-header">
              <div class="meta-icon">🚗</div>
              <div>
                <h4>L'analogie du capot fermé</h4>
                <p>Pour accélérer, vous appuyez sur la <strong>pédale</strong> (méthode publique). Vous ne versez pas l'essence dans les cylindres avec une pipette !</p>
              </div>
            </div>
          </div>

          <!-- Panneau d'attaque / Injection d'anomalies -->
          <div class="card-panel injection-panel">
            <div class="inj-title">Injecter une valeur aberrante ou une opération non autorisée :</div>
            <div class="attack-buttons-grid">
              <button class="btn-secondary attack-btn" (click)="injectOverdraft()">
                💸 Retrait excessif (-2 000 €)
              </button>
              <button class="btn-secondary attack-btn" (click)="injectDirectNegative()">
                💥 Forcer solde = -999 999 €
              </button>
              <button class="btn-secondary attack-btn" (click)="injectNaN()">
                🧪 Forcer solde = NaN (Corrompu)
              </button>
              <button class="btn-secondary attack-btn" (click)="injectEmptyNumero()">
                🗑️ Forcer numero = "" (Effacement)
              </button>
              <button class="btn-primary reset-btn" (click)="resetObjects()">
                ↺ Restaurer l'état initial sain
              </button>
            </div>
          </div>

          <!-- Comparaison Côte à Côte : Passif vs Encapsulé -->
          <div class="comparison-grid">
            <!-- Objet 1 : Passif (Sans Encapsulation) -->
            <div class="card-panel object-card unprotected" [class.corrupted]="unprotectedCorrupted()">
              <div class="obj-header">
                <div class="obj-badge red">❌ OBJET PASSIF (CHAMPS PUBLICS)</div>
                <h3>CompteSansDefense</h3>
                <span class="obj-desc">Attributs publics : <code>public solde; public numero;</code></span>
              </div>

              <!-- Jauge de Santé -->
              <div class="health-box">
                <div class="health-label">
                  <span>Intégrité de l'état interne :</span>
                  <span class="health-score" [class.danger]="unprotectedCorrupted()">
                    {{ unprotectedCorrupted() ? '0% (CORROMPU)' : '100% (Sain)' }}
                  </span>
                </div>
                <div class="health-bar-track">
                  <div class="health-bar-fill red" [style.width.%]="unprotectedCorrupted() ? 0 : 100"></div>
                </div>
              </div>

              <!-- État Mémoire Réel -->
              <div class="memory-dump-box">
                <div class="dump-title">Bloc Mémoire dans le Tas (0x10AA) :</div>
                <div class="dump-line">
                  <span class="k">numero :</span>
                  <span class="v" [class.invalid]="unprotectedNumero() === ''">"{{ unprotectedNumero() }}"</span>
                </div>
                <div class="dump-line">
                  <span class="k">solde :</span>
                  <span class="v" [class.invalid]="unprotectedSolde() < 0 || isNaNVal(unprotectedSolde())">
                    {{ unprotectedSolde() }} €
                  </span>
                </div>
              </div>

              <!-- Log de conséquence -->
              <div class="consequence-box danger">
                <div class="c-title">Diagnostic :</div>
                <p>{{ unprotectedDiagnosis() }}</p>
              </div>
            </div>

            <!-- Objet 2 : Encapsulé (Avec Invariants) -->
            <div class="card-panel object-card protected">
              <div class="obj-header">
                <div class="obj-badge green">🛡️ OBJET ENCAPSULÉ (AVEC INVARIANTS)</div>
                <h3>CompteProtege</h3>
                <span class="obj-desc">Attributs privés + constructeur gardien + validation</span>
              </div>

              <!-- Jauge de Santé -->
              <div class="health-box">
                <div class="health-label">
                  <span>Intégrité de l'état interne :</span>
                  <span class="health-score success">100% (INVIOLABLE)</span>
                </div>
                <div class="health-bar-track">
                  <div class="health-bar-fill green" style="width: 100%;"></div>
                </div>
              </div>

              <!-- État Mémoire Réel -->
              <div class="memory-dump-box">
                <div class="dump-title">Bloc Mémoire dans le Tas (0x20BB) :</div>
                <div class="dump-line">
                  <span class="k">_numero (private) :</span>
                  <span class="v">"{{ protectedNumero() }}"</span>
                </div>
                <div class="dump-line">
                  <span class="k">_solde (private) :</span>
                  <span class="v text-success">{{ protectedSolde() }} €</span>
                </div>
              </div>

              <!-- Log de défense -->
              <div class="consequence-box success">
                <div class="c-title">Bouclier actif (Cordon sanitaire) :</div>
                <p>{{ protectedMessage() }}</p>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="2"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .crash-test-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .car-metaphor-box {
      background: rgba(49, 120, 198, 0.05);
      border-color: rgba(49, 120, 198, 0.25);
      padding: 12px 16px;

      .meta-header {
        display: flex;
        align-items: center;
        gap: 14px;

        .meta-icon { font-size: 1.8rem; }
        h4 { font-size: 0.95rem; font-weight: 700; color: var(--ts-blue-light); }
        p { font-size: 0.84rem; color: var(--text-muted); margin-top: 2px; }
      }
    }

    .injection-panel {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .inj-title {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .attack-buttons-grid {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        .attack-btn {
          border-color: rgba(239, 68, 68, 0.35);
          color: #f87171;
          &:hover {
            background: rgba(239, 68, 68, 0.15);
            border-color: #ef4444;
          }
        }

        .reset-btn {
          margin-left: auto;
        }
      }
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .object-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
      border-radius: 10px;
      position: relative;
      transition: all 0.3s;

      &.unprotected {
        border-color: rgba(239, 68, 68, 0.3);
        background: rgba(239, 68, 68, 0.02);

        &.corrupted {
          border-color: #ef4444;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
        }
      }

      &.protected {
        border-color: rgba(16, 185, 129, 0.35);
        background: rgba(16, 185, 129, 0.02);
      }

      .obj-header {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .obj-badge {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;

          &.red { color: #f87171; }
          &.green { color: #34d399; }
        }

        h3 { font-size: 1.15rem; font-weight: 700; color: var(--text-main); }
        .obj-desc { font-size: 0.78rem; color: var(--text-muted); code { font-family: var(--font-mono); } }
      }
    }

    .health-box {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .health-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-muted);

        .health-score {
          font-family: var(--font-mono);
          &.danger { color: #ef4444; font-weight: 700; }
          &.success { color: #10b981; font-weight: 700; }
        }
      }

      .health-bar-track {
        height: 6px;
        background: var(--bg-subtle);
        border-radius: 3px;
        overflow: hidden;

        .health-bar-fill {
          height: 100%;
          transition: width 0.3s;

          &.red { background: #ef4444; }
          &.green { background: #10b981; }
        }
      }
    }

    .memory-dump-box {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: var(--font-mono);

      .dump-title {
        font-size: 0.7rem;
        color: var(--text-dim);
        border-bottom: 1px solid var(--border-subtle);
        padding-bottom: 4px;
        margin-bottom: 2px;
      }

      .dump-line {
        display: flex;
        justify-content: space-between;
        font-size: 0.82rem;

        .k { color: var(--text-muted); }
        .v {
          color: #e2e8f0;
          font-weight: 600;

          &.invalid {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.2);
            padding: 0 4px;
            border-radius: 3px;
          }

          &.text-success {
            color: #34d399;
          }
        }
      }
    }

    .consequence-box {
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 0.82rem;
      line-height: 1.4;

      .c-title {
        font-weight: 700;
        margin-bottom: 3px;
      }

      &.danger {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }

      &.success {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #86efac;
      }
    }
  `]
})
export class CrashTestBankComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly unprotectedNumero = signal<string>('BE-999');
  readonly unprotectedSolde = signal<any>(500);
  readonly unprotectedCorrupted = signal<boolean>(false);
  readonly unprotectedDiagnosis = signal<string>('Objet sain. En attente d\'injection.');

  readonly protectedNumero = signal<string>('BE-999');
  readonly protectedSolde = signal<number>(500);
  readonly protectedMessage = signal<string>('Invariant solde >= 0 garanti. Prêt.');

  injectOverdraft(): void {
    // Unprotected : accepte sans broncher
    this.unprotectedSolde.set(-1500);
    this.unprotectedCorrupted.set(true);
    this.unprotectedDiagnosis.set('💥 Invariant violé ! Le solde est négatif (-1500 €). La banque est en perte sans qu\'aucune alerte ne se déclenche.');

    // Protected : rejette
    this.protectedMessage.set('🛡️ throw new Error("Fonds insuffisants") levée ! L\'opération a été annulée. L\'état interne reste intact à 500 €.');
  }

  injectDirectNegative(): void {
    this.unprotectedSolde.set(-999999);
    this.unprotectedCorrupted.set(true);
    this.unprotectedDiagnosis.set('💥 Corruption directe : c.solde = -999999 a écrasé la donnée. L\'objet est passif et sans défense.');

    this.protectedMessage.set('🔒 Erreur de compilation TypeScript : la propriété \'_solde\' est privée et uniquement accessible dans la classe CompteProtege.');
  }

  injectNaN(): void {
    this.unprotectedSolde.set(NaN);
    this.unprotectedCorrupted.set(true);
    this.unprotectedDiagnosis.set('💥 Donnée corrompue NaN : tous les futurs calculs comptables (intérêts, virements) renverront silencieusement NaN.');

    this.protectedMessage.set('🛡️ Validation de type et de valeur : le setter/constructeur refuse NaN avec throw new Error("Montant invalide").');
  }

  injectEmptyNumero(): void {
    this.unprotectedNumero.set('');
    this.unprotectedCorrupted.set(true);
    this.unprotectedDiagnosis.set('💥 L\'identifiant a été effacé (c.numero = ""). L\'objet ne correspond plus à aucun compte réel en base.');

    this.protectedMessage.set('🔒 Impossible : le numéro est en "readonly", toute réaffectation est bloquée par le compilateur.');
  }

  resetObjects(): void {
    this.unprotectedNumero.set('BE-999');
    this.unprotectedSolde.set(500);
    this.unprotectedCorrupted.set(false);
    this.unprotectedDiagnosis.set('Objet sain réinitialisé.');

    this.protectedNumero.set('BE-999');
    this.protectedSolde.set(500);
    this.protectedMessage.set('Objet sain. Invariants vérifiés.');
  }

  isNaNVal(v: any): boolean {
    return Number.isNaN(v);
  }
}
