import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-business-equality-equals',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 12 · Module 02</span>
          <span class="badge badge-purple">Égalité Métier</span>
          <span class="badge badge-blue">Méthode equals()</span>
          <span class="badge badge-success">Equatable&lt;T&gt;</span>
        </div>
        <h2>L'Égalité Métier & La Méthode equals() Robuste</h2>
        <p class="module-desc">
          En JavaScript / TypeScript, pas de surcharge d'opérateur. La solution universelle de la POO consiste à doter nos classes d'une méthode d'égalité contractuelle en trois étapes respectant les 4 lois mathématiques de l'équivalence.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Démonstrateur equals(), Entités vs Value Objects & 4 Lois
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 2)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="equals-workbench">

          <!-- 1. L'Anatomie Canonique en 3 Étapes -->
          <div class="card-panel steps-card">
            <div class="panel-head">
              <span class="badge badge-purple">Architecture Robuste</span>
              <h3>L'Anatomie Canonique d'une Méthode equals() en 3 Étapes</h3>
              <p class="sub-text">Le standard universel de génie logiciel (Java, C#, TypeScript) pour éviter les crashs et maximiser les performances.</p>
            </div>

            <div class="steps-grid">
              <div class="step-card step-1">
                <div class="step-num-badge">Étape 1</div>
                <h4>Court-circuit de référence</h4>
                <div class="code-box font-mono">if (this === other) return true;</div>
                <p>Si les deux variables partagent la même adresse mémoire (<code>0x10A === 0x10A</code>), l'égalité est instantanée en 1 cycle CPU. Inutile d'inspecter les champs.</p>
              </div>

              <div class="step-card step-2">
                <div class="step-num-badge">Étape 2</div>
                <h4>Garde de type strict</h4>
                <div class="code-box font-mono">if (!(other instanceof Point)) return false;</div>
                <p>En typant <code>other: unknown</code>, on élimine <code>null</code>, <code>undefined</code>, les primitives et les classes tierces sans risque de <code>TypeError</code> au runtime.</p>
              </div>

              <div class="step-card step-3">
                <div class="step-num-badge">Étape 3</div>
                <h4>Comparaison des attributs</h4>
                <div class="code-box font-mono">return this.x === other.x && this.y === other.y;</div>
                <p>La classe elle-même décide ce qui constitue son égalité métier (tous les champs pour un Value Object, ou l'ID pour une Entité).</p>
              </div>
            </div>
          </div>

          <!-- 2. Comparateur Interactif : Entité vs Objet-Valeur (Value Object) -->
          <div class="card-panel entity-vs-vo-card">
            <div class="panel-head">
              <span class="badge badge-blue">Domain-Driven Design</span>
              <h3>Démonstrateur Interactif : Entité Métier vs Objet-Valeur</h3>
              <p class="sub-text">Testez la différence fondamentale entre une identité pérenne (ID) et une égalité par valeur.</p>
            </div>

            <div class="comparison-grid">
              <!-- Colonne Entité -->
              <div class="model-box entity-box">
                <div class="model-header">
                  <div class="icon">🆔</div>
                  <div>
                    <h4>1. L'Entité Métier (Ex: Utilisateur)</h4>
                    <span class="sub">Égalité basée sur l'identifiant pérenne (this.id === other.id)</span>
                  </div>
                </div>

                <div class="interactive-form">
                  <div class="form-row">
                    <label>ID Pérenne (fixe) :</label>
                    <span class="val-badge font-mono">#42</span>
                  </div>
                  <div class="form-row">
                    <label>Nom :</label>
                    <input type="text" [value]="entityNom()" (input)="entityNom.set($any($event.target).value)" class="app-input" />
                  </div>
                  <div class="form-row">
                    <label>Email :</label>
                    <input type="text" [value]="entityEmail()" (input)="entityEmail.set($any($event.target).value)" class="app-input" />
                  </div>
                </div>

                <div class="result-box font-mono">
                  <div>const u1 = new Utilisateur(42, 'Alice', 'alice@test.be');</div>
                  <div>const u2 = new Utilisateur(42, '{{ entityNom() }}', '{{ entityEmail() }}');</div>
                  <div class="cmp-res">
                    u1.equals(u2) ➔ <strong class="text-success">TRUE</strong> (Même ID #42)
                  </div>
                  <div class="cmp-sub">Même si le nom ou l'email change, c'est toujours le même être humain !</div>
                </div>
              </div>

              <!-- Colonne Value Object -->
              <div class="model-box vo-box">
                <div class="model-header">
                  <div class="icon">💎</div>
                  <div>
                    <h4>2. L'Objet-Valeur (Ex: Monnaie)</h4>
                    <span class="sub">Égalité basée sur la TOTALITÉ des propriétés</span>
                  </div>
                </div>

                <div class="interactive-form">
                  <div class="form-row">
                    <label>Montant (EUR) :</label>
                    <input type="number" [value]="voMontant()" (input)="voMontant.set(+$any($event.target).value)" class="app-input" />
                  </div>
                  <div class="form-row">
                    <label>Devise :</label>
                    <select [value]="voDevise()" (change)="voDevise.set($any($event.target).value)" class="app-input">
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div class="result-box font-mono">
                  <div>const m1 = new Monnaie(50, 'EUR');</div>
                  <div>const m2 = new Monnaie({{ voMontant() }}, '{{ voDevise() }}');</div>
                  <div class="cmp-res">
                    m1.equals(m2) ➔ 
                    <strong [class.text-success]="isVoEquals()" [class.text-danger]="!isVoEquals()">
                      {{ isVoEquals() ? 'TRUE' : 'FALSE' }}
                    </strong>
                  </div>
                  <div class="cmp-sub">
                    @if (isVoEquals()) {
                      Mêmes données : Même valeur d'échange !
                    } @else {
                      Un champ diffère : Ce n'est plus la même valeur !
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Laboratoire des 4 Lois de l'Équivalence -->
          <div class="card-panel laws-card">
            <div class="panel-head">
              <span class="badge badge-warning">Rigueur Mathématique</span>
              <h3>Laboratoire des 4 Lois d'une Équivalence Saine</h3>
              <p class="sub-text">Une méthode equals() en génie logiciel doit obligatoirement valider ces 4 axiomes mathématiques.</p>
            </div>

            <div class="laws-grid">
              <div class="law-card">
                <div class="law-header">
                  <span class="law-num">01</span>
                  <h4>Réflexivité</h4>
                </div>
                <div class="law-formula font-mono">a.equals(a) === true</div>
                <p>Un objet doit toujours être égal à lui-même.</p>
                <div class="test-pill pass font-mono">Vérifié ✔</div>
              </div>

              <div class="law-card">
                <div class="law-header">
                  <span class="law-num">02</span>
                  <h4>Symétrie</h4>
                </div>
                <div class="law-formula font-mono">a.equals(b) ⟺ b.equals(a)</div>
                <p>Si a est égal à b, alors b est obligatoirement égal à a.</p>
                <div class="test-pill pass font-mono">Vérifié ✔</div>
              </div>

              <div class="law-card">
                <div class="law-header">
                  <span class="law-num">03</span>
                  <h4>Transitivité</h4>
                </div>
                <div class="law-formula font-mono">a=b et b=c ⟹ a=c</div>
                <p>L'égalité se propage de proche en proche sans incohérence.</p>
                <div class="test-pill pass font-mono">Vérifié ✔</div>
              </div>

              <div class="law-card">
                <div class="law-header">
                  <span class="law-num">04</span>
                  <h4>Cohérence</h4>
                </div>
                <div class="law-formula font-mono">a.equals(b) répétable</div>
                <p>Deux appels consécutifs renvoient la même réponse sans effet de bord.</p>
                <div class="test-pill pass font-mono">Vérifié ✔</div>
              </div>
            </div>
          </div>

          <!-- 4. L'Anti-pattern JSON.stringify() Démasqué -->
          <div class="card-panel stringify-card">
            <div class="panel-head">
              <span class="badge badge-danger">Anti-Pattern Fréquent</span>
              <h3>Pourquoi JSON.stringify() est une fausse bonne idée catastrophique</h3>
              <p class="sub-text">Beaucoup de développeurs débutants tentent de comparer avec JSON.stringify(a) === JSON.stringify(b). Voici pourquoi cela échoue :</p>
            </div>

            <div class="stringify-reasons-grid">
              <div class="reason-item">
                <div class="reason-title">1. Ordre des propriétés non garanti</div>
                <div class="code-compare font-mono">
                  <div>const a = &#123; nom: 'Dupont', prenom: 'Jean' &#125;;</div>
                  <div>const b = &#123; prenom: 'Jean', nom: 'Dupont' &#125;;</div>
                  <div class="mt-1 text-danger">JSON.stringify(a) !== JSON.stringify(b) 💥</div>
                </div>
                <p>L'ordre d'insertion dicte la chaîne de caractères. Deux objets identiques aux clés permutées échouent !</p>
              </div>

              <div class="reason-item">
                <div class="reason-title">2. Perte irréversible des types riches</div>
                <div class="code-compare font-mono">
                  <div>const d1 = new Date();</div>
                  <div>JSON.stringify(d1) ➔ "2026-09-30..." (string)</div>
                  <div class="text-danger">Les méthodes (.getTime(), etc.) et le prototype sont détruits !</div>
                </div>
                <p>Les Dates deviennent de simples chaînes, Map/Set deviennent &#123;&#125;, undefined est supprimé.</p>
              </div>

              <div class="reason-item">
                <div class="reason-title">3. Gouffre de performances CPU & RAM</div>
                <div class="code-compare font-mono">
                  <div>Sérialisation complète en mémoire</div>
                  <div>Alloue des milliers d'octets temporaires</div>
                  <div class="text-danger">Surcharge massive du Garbage Collector</div>
                </div>
                <p>Une méthode equals() compare quelques champs en 2 cycles CPU au lieu de parcourir tout l'arbre en texte.</p>
              </div>
            </div>
          </div>

        </div>
      } @else {
        <!-- Onglet Exercices Labo 2 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="2"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .equals-workbench {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .panel-head {
      margin-bottom: 16px;
      h3 {
        font-size: 1.25rem;
        font-weight: 800;
        margin-top: 4px;
      }
      .sub-text {
        font-size: 0.84rem;
        color: var(--text-muted);
      }
    }

    /* 3 Étapes */
    .steps-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .step-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .step-num-badge {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--bs-purple-light);
        letter-spacing: 0.05em;
      }

      h4 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .code-box {
        background: var(--bg-code);
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 0.78rem;
        color: #38bdf8;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    /* Entity vs VO */
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .model-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .model-header {
        display: flex;
        gap: 12px;
        align-items: center;

        .icon {
          font-size: 1.8rem;
        }

        h4 {
          font-size: 1.05rem;
          font-weight: 800;
        }

        .sub {
          font-size: 0.76rem;
          color: var(--text-dim);
        }
      }
    }

    .interactive-form {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .form-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;

        label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .val-badge {
          background: rgba(121, 82, 179, 0.2);
          color: var(--bs-purple-light);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .app-input {
          padding: 6px 10px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-main);
          font-size: 0.82rem;
          width: 180px;

          &:focus {
            outline: none;
            border-color: var(--bs-purple);
          }
        }
      }
    }

    .result-box {
      background: var(--bg-code);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 12px;
      font-size: 0.78rem;
      line-height: 1.5;

      .cmp-res {
        margin-top: 6px;
        font-size: 0.86rem;
        font-weight: 700;
      }

      .cmp-sub {
        font-size: 0.72rem;
        color: var(--text-dim);
        margin-top: 4px;
        font-family: var(--font-sans);
      }
    }

    /* 4 Lois */
    .laws-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;

      @media (max-width: 1000px) {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .law-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .law-header {
        display: flex;
        align-items: center;
        gap: 8px;

        .law-num {
          font-size: 0.7rem;
          font-weight: 800;
          color: #f59e0b;
          font-family: var(--font-mono);
        }

        h4 {
          font-size: 0.92rem;
          font-weight: 700;
        }
      }

      .law-formula {
        font-size: 0.74rem;
        color: #38bdf8;
        background: var(--bg-code);
        padding: 4px 6px;
        border-radius: 4px;
      }

      p {
        font-size: 0.76rem;
        color: var(--text-muted);
        flex: 1;
      }

      .test-pill {
        font-size: 0.7rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        width: fit-content;

        &.pass {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
      }
    }

    /* JSON stringify */
    .stringify-reasons-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .reason-item {
      background: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .reason-title {
        font-size: 0.88rem;
        font-weight: 800;
        color: #f87171;
      }

      .code-compare {
        background: var(--bg-code);
        padding: 8px;
        border-radius: 6px;
        font-size: 0.72rem;
        line-height: 1.4;
      }

      p {
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }
  `]
})
export class BusinessEqualityEqualsComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  // Démo Entité
  readonly entityNom = signal<string>('Dupont-Renard');
  readonly entityEmail = signal<string>('nouvel.email@test.be');

  // Démo Value Object
  readonly voMontant = signal<number>(50);
  readonly voDevise = signal<string>('EUR');

  isVoEquals(): boolean {
    return this.voMontant() === 50 && this.voDevise() === 'EUR';
  }
}
