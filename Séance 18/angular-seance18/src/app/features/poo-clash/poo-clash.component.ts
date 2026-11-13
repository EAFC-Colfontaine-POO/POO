import { Component, signal, computed } from '@angular/core';

// Définitions POO pour la démonstration
export interface CompteDTO {
  readonly iban: string;
  readonly titulaire: string;
  readonly solde: number;
}

export class CompteBancaire {
  readonly #iban: string;
  readonly #titulaire: string;
  #solde: number;

  constructor(iban: string, titulaire: string, soldeInitial: number) {
    if (!iban || iban.trim().length < 5) {
      throw new Error("Invariant violé : L'IBAN doit comporter au moins 5 caractères.");
    }
    if (!titulaire || titulaire.trim().length < 2) {
      throw new Error("Invariant violé : Le nom du titulaire est trop court.");
    }
    if (soldeInitial < 0) {
      throw new Error("Invariant violé : Un compte bancaire ne peut être ouvert avec un solde négatif !");
    }

    this.#iban = iban.trim();
    this.#titulaire = titulaire.trim();
    this.#solde = soldeInitial;
  }

  get iban(): string { return this.#iban; }
  get titulaire(): string { return this.#titulaire; }
  get solde(): number { return this.#solde; }

  // Méthode métier
  estSolvable(montant: number): boolean {
    return this.#solde >= montant;
  }

  retirer(montant: number): void {
    if (montant <= 0) throw new Error("Montant invalide");
    if (!this.estSolvable(montant)) throw new Error("Solde insuffisant");
    this.#solde -= montant;
  }

  toDTO(): CompteDTO {
    return {
      iban: this.#iban,
      titulaire: this.#titulaire,
      solde: this.#solde
    };
  }

  static fromDTO(dto: CompteDTO): CompteBancaire {
    return new CompteBancaire(dto.iban, dto.titulaire, dto.solde);
  }
}

@Component({
  selector: 'app-poo-clash',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 04 · LE CŒUR DE L'ARCHITECTURE POO</div>
        <h2>Le Choc POO : Autopsie du [object Object] &amp; Prototype Perdu</h2>
        <p class="module-desc">
          Pourquoi <code>localStorage</code> ne peut pas stocker d'objets vivants, pourquoi <code>JSON.parse()</code>
          détruit vos prototypes et méthodes, et comment la triade <code>DTO / toDTO() / fromDTO()</code> résout élégamment le problème.
        </p>
      </div>

      <!-- Écran Scindé : RAM vivante vs Disque Brut -->
      <div class="card-panel split-panel">
        <div class="section-title-row">
          <div class="s-title">⚡ Écran Scindé : Instance Vivante en RAM vs Stockage Disque Naïf</div>
          <span class="badge badge-red">Le Piège [object Object]</span>
        </div>

        <div class="split-grid">
          <!-- Côté Gauche : Instance Vivante en RAM -->
          <div class="side-card ram-card">
            <div class="side-header">
              <span class="dot-live"></span>
              <span>🧠 En Mémoire Vive (RAM) · Instance de CompteBancaire</span>
            </div>
            <div class="side-body">
              <div class="code-snippet">
                <pre><code>const compte = new CompteBancaire("BE45-0012", "Alice", 150);</code></pre>
              </div>

              <div class="object-inspector">
                <div class="prop-row">
                  <span class="p-name">#iban :</span>
                  <span class="p-val">"BE45-0012" (Privé encapsulé)</span>
                </div>
                <div class="prop-row">
                  <span class="p-name">#solde :</span>
                  <span class="p-val">150 €</span>
                </div>
                <div class="prop-row">
                  <span class="p-name">Prototype :</span>
                  <span class="p-val text-success">CompteBancaire.prototype ✅</span>
                </div>
                <div class="prop-row">
                  <span class="p-name">Méthodes :</span>
                  <span class="p-val text-success">retirer(), estSolvable(), toDTO() ✅</span>
                </div>
                <div class="prop-row">
                  <span class="p-name">instanceof :</span>
                  <span class="p-val text-success">compte instanceof CompteBancaire ➔ true</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Côté Droit : Ce que LocalStorage stocke si passé directement -->
          <div class="side-card disk-card">
            <div class="side-header">
              <span class="dot-dead"></span>
              <span>💾 Sur Disque (LocalStorage) · Sauvegarde Naïve</span>
            </div>
            <div class="side-body">
              <div class="code-snippet">
                <pre><code>localStorage.setItem('mon_compte', compte as any);</code></pre>
              </div>

              <div class="object-inspector dead">
                <div class="dead-title">Chaîne réellement enregistrée sur le disque dur :</div>
                <div class="dead-string">"[object Object]"</div>
                <div class="dead-explanation">
                  💥 <strong>Autopsie :</strong> <code>localStorage</code> exige une chaîne. JavaScript invoque automatiquement <code>compte.toString()</code>.
                  Le solde (150 €), l'IBAN et le titulaire sont <strong>perdus à jamais</strong> !
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2 : Le Drame de JSON.parse() -->
      <div class="card-panel drama-panel">
        <div class="section-title-row">
          <div class="s-title">🎭 Le Drame de JSON.parse() : L'Illusion du Cast TypeScript</div>
          <span class="badge badge-warning">Type Erasure au Runtime</span>
        </div>

        <div class="drama-grid">
          <div class="drama-code">
            <p class="drama-intro">
              Le développeur utilise <code>JSON.stringify()</code> puis croit avoir résolu le problème avec un cast TypeScript :
            </p>
            <pre><code>// 1. Sauvegarde propre en JSON textuel :
localStorage.setItem('compte', JSON.stringify(compte));

// 2. Rechargement avec cast mensonger 'as CompteBancaire' :
const recup = JSON.parse(localStorage.getItem('compte')!) as CompteBancaire;</code></pre>

            <div class="test-trigger-row">
              <button class="btn-danger" (click)="triggerMethodCallCrash()">
                💥 Tenter d'appeler recup.retirer(50)
              </button>
            </div>

            @if (methodCallError()) {
              <div class="error-box-drama animate-fade">
                <div class="err-tag">🚨 Runtime Exception :</div>
                <pre class="err-text">{{ methodCallError() }}</pre>
                <div class="err-why">
                  <strong>Pourquoi cette erreur ?</strong> Le cast <code>as CompteBancaire</code> n'existe QUE dans l'IDE.
                  Au runtime dans le navigateur, <code>JSON.parse()</code> ne produit qu'un vulgaire objet littéral rattaché à <code>Object.prototype</code>.
                  Toutes vos méthodes métier sont mortes !
                </div>
              </div>
            }
          </div>

          <div class="audit-summary-box">
            <div class="audit-header">Bilan de Santé de l'Objet Restauré par JSON.parse() seul :</div>
            <div class="audit-row fail">
              <span>recup instanceof CompteBancaire :</span>
              <strong>false ❌</strong>
            </div>
            <div class="audit-row fail">
              <span>typeof recup.retirer :</span>
              <strong>"undefined" ❌</strong>
            </div>
            <div class="audit-row fail">
              <span>Invariants de domaine revalidés :</span>
              <strong>AUCUN ❌ (Un JSON corrompu est accepté tel quel !)</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3 : Le Banc de Réhydratation (La Triade POO) -->
      <div class="card-panel triad-panel">
        <div class="section-title-row">
          <div class="s-title">💎 Le Banc de Réhydratation : La Triade DTO / toDTO() / fromDTO()</div>
          <span class="badge badge-success">Architecture POO Robuste</span>
        </div>

        <!-- Schéma animé de la triade -->
        <div class="pipeline-flow">
          <div class="pipe-step">
            <div class="step-num">1</div>
            <div class="step-name">Entité Vivante</div>
            <div class="step-desc">RAM · Méthodes actives</div>
          </div>
          <div class="pipe-arrow">➔ <code>toDTO()</code> ➔</div>

          <div class="pipe-step">
            <div class="step-num">2</div>
            <div class="step-name">Contrat DTO</div>
            <div class="step-desc">Interface de données pures</div>
          </div>
          <div class="pipe-arrow">➔ <code>JSON.stringify()</code> ➔</div>

          <div class="pipe-step">
            <div class="step-num">3</div>
            <div class="step-name">Disque Dur</div>
            <div class="step-desc">LocalStorage (Texte)</div>
          </div>
          <div class="pipe-arrow">➔ <code>JSON.parse()</code> ➔</div>

          <div class="pipe-step">
            <div class="step-num">4</div>
            <div class="step-name">DTO Inerte</div>
            <div class="step-desc">Objet littéral brut</div>
          </div>
          <div class="pipe-arrow">➔ <code>Compte.fromDTO()</code> ➔</div>

          <div class="pipe-step success-step">
            <div class="step-num">5</div>
            <div class="step-name">Entité Ressuscitée</div>
            <div class="step-desc">instanceof === true ✅</div>
          </div>
        </div>

        <!-- Testeur interactif d'Invariants -->
        <div class="invariants-tester-box">
          <div class="tester-title">🧪 Testeur d'Invariants : Que se passe-t-il si un pirate altère le LocalStorage ?</div>
          <p class="tester-sub">
            Modifiez ci-dessous le JSON brut enregistré sur le disque (par exemple en saisissant un solde négatif comme <code>-80</code>).
            Observez comment <code>CompteBancaire.fromDTO()</code> réinvoque le constructeur et bloque net la donnée corrompue !
          </p>

          <div class="tester-form grid-2">
            <div class="form-col">
              <label>JSON brut stocké dans LocalStorage :</label>
              <textarea rows="5" [value]="rawJsonDto()" (input)="rawJsonDto.set($any($event.target).value)"></textarea>
              <button class="btn-primary" (click)="testRehydration()">
                🔄 Exécuter CompteBancaire.fromDTO(JSON.parse(...))
              </button>
            </div>

            <div class="result-col">
              <label>Résultat de la Réhydratation POO :</label>
              @if (rehydrationError()) {
                <div class="rehydration-card err animate-fade">
                  <div class="card-status">🛑 Rejet par la Fabrique fromDTO() :</div>
                  <div class="card-message">{{ rehydrationError() }}</div>
                  <div class="card-footer">Les invariants ont protégé la mémoire de l'application ! ✅</div>
                </div>
              } @else if (rehydratedCompte()) {
                <div class="rehydration-card ok animate-fade">
                  <div class="card-status">🟢 Entité Vivante Restaurée avec Succès !</div>
                  <div class="card-message">
                    • Titulaire : <strong>{{ rehydratedCompte()?.titulaire }}</strong><br/>
                    • Solde : <strong>{{ rehydratedCompte()?.solde }} €</strong><br/>
                    • <code>instanceof CompteBancaire</code> : <strong>true ✅</strong><br/>
                    • Appel méthode métier <code>compte.estSolvable(50)</code> : 
                    <strong>{{ rehydratedCompte()?.estSolvable(50) ? 'Solvable ✅' : 'Non solvable ❌' }}</strong>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .split-panel, .drama-panel, .triad-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .s-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      .side-card {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .side-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-main);

          .dot-live {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            box-shadow: 0 0 6px #10b981;
          }

          .dot-dead {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ef4444;
            box-shadow: 0 0 6px #ef4444;
          }
        }

        .side-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      }
    }

    .code-snippet {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 0.78rem;
    }

    .object-inspector {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.78rem;

      .prop-row {
        display: flex;
        justify-content: space-between;

        .p-name {
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        .p-val {
          color: var(--text-main);
          font-weight: 500;
        }

        .text-success {
          color: #34d399;
          font-weight: 600;
        }
      }

      &.dead {
        border-color: rgba(221, 0, 49, 0.3);
        background: rgba(221, 0, 49, 0.05);

        .dead-title {
          font-size: 0.72rem;
          color: var(--text-dim);
          text-transform: uppercase;
          font-weight: 700;
        }

        .dead-string {
          font-family: var(--font-mono);
          font-size: 1.3rem;
          font-weight: 800;
          color: #f87171;
          margin: 6px 0;
        }

        .dead-explanation {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      }
    }

    .drama-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 16px;

      .drama-code {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .drama-intro {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        pre {
          background: var(--bg-code);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 12px;
          font-size: 0.78rem;
          line-height: 1.4;
        }
      }

      .audit-summary-box {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .audit-header {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .audit-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 0.78rem;

          &.fail {
            background: rgba(221, 0, 49, 0.1);
            border: 1px solid rgba(221, 0, 49, 0.25);
            color: var(--text-main);

            strong {
              color: #f87171;
            }
          }
        }
      }
    }

    .error-box-drama {
      background: rgba(221, 0, 49, 0.12);
      border: 1px solid rgba(221, 0, 49, 0.35);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .err-tag {
        font-size: 0.75rem;
        font-weight: 700;
        color: #f87171;
      }

      .err-text {
        font-family: var(--font-mono);
        font-size: 0.82rem;
        color: #fca5a5;
        white-space: pre-wrap;
      }

      .err-why {
        font-size: 0.78rem;
        color: var(--text-muted);
        margin-top: 4px;
        line-height: 1.4;
      }
    }

    .pipeline-flow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      overflow-x: auto;
      padding: 10px 0;

      .pipe-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 10px 14px;
        min-width: 140px;
        text-align: center;
        gap: 2px;

        .step-num {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--ts-blue-light);
        }

        .step-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .step-desc {
          font-size: 0.7rem;
          color: var(--text-dim);
        }

        &.success-step {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.1);

          .step-name {
            color: #34d399;
          }
        }
      }

      .pipe-arrow {
        font-size: 0.72rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
        white-space: nowrap;
      }
    }

    .invariants-tester-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .tester-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .tester-sub {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
      }

      .tester-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        .form-col, .result-col {
          display: flex;
          flex-direction: column;
          gap: 6px;

          label {
            font-size: 0.76rem;
            color: var(--text-muted);
            font-weight: 600;
          }

          textarea {
            width: 100%;
            font-family: var(--font-mono);
            font-size: 0.82rem;
            resize: vertical;
          }
        }

        .rehydration-card {
          border-radius: 6px;
          padding: 12px;
          font-size: 0.82rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          line-height: 1.45;

          &.err {
            background: rgba(221, 0, 49, 0.1);
            border: 1px solid rgba(221, 0, 49, 0.3);

            .card-status {
              font-weight: 700;
              color: #f87171;
            }

            .card-message {
              font-family: var(--font-mono);
              color: #fca5a5;
            }

            .card-footer {
              font-size: 0.76rem;
              color: #34d399;
              font-weight: 600;
            }
          }

          &.ok {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);

            .card-status {
              font-weight: 700;
              color: #34d399;
            }

            .card-message {
              color: var(--text-main);
            }
          }
        }
      }
    }
  `]
})
export class PooClashComponent {
  readonly methodCallError = signal<string | null>(null);

  // Invariant tester state
  readonly rawJsonDto = signal<string>(JSON.stringify({
    iban: "BE45-9988-7766",
    titulaire: "Bob Dylan",
    solde: 250
  }, null, 2));

  readonly rehydrationError = signal<string | null>(null);
  readonly rehydratedCompte = signal<CompteBancaire | null>(null);

  constructor() {
    this.testRehydration();
  }

  triggerMethodCallCrash(): void {
    try {
      // Simuler l'appel sur un objet nu issu de JSON.parse
      const recup: any = JSON.parse('{"iban":"BE45-0012","titulaire":"Alice","solde":150}');
      recup.retirer(50);
    } catch (e: any) {
      this.methodCallError.set(`TypeError: recup.retirer is not a function\n    at PooClashComponent.triggerMethodCallCrash()`);
    }
  }

  testRehydration(): void {
    this.rehydrationError.set(null);
    this.rehydratedCompte.set(null);

    try {
      const parsed = JSON.parse(this.rawJsonDto());
      const compte = CompteBancaire.fromDTO(parsed);
      this.rehydratedCompte.set(compte);
    } catch (err: any) {
      this.rehydrationError.set(err.message || String(err));
    }
  }
}
