import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

interface RamVariable {
  name: string;
  type: 'primitive' | 'reference';
  stackValue: string;
  targetAddress?: string;
}

interface HeapObject {
  address: string;
  label: string;
  data: Record<string, any>;
  highlighted?: boolean;
}

@Component({
  selector: 'app-memory-model-identity',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 12 · Module 01</span>
          <span class="badge badge-purple">Pile vs Tas</span>
          <span class="badge badge-blue">Identité Mémoire</span>
          <span class="badge badge-warning">L'Énigme du ===</span>
        </div>
        <h2>Le Modèle Mémoire : Pile (Stack) vs Tas (Heap) & L'Énigme du ===</h2>
        <p class="module-desc">
          Pourquoi deux objets strictement identiques en contenu ne sont-ils jamais égaux avec <code>===</code> ? Explorez visuellement comment le moteur JavaScript organise la mémoire vive et comprenez le piège redoutable des effets de bord par affectation de référence.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Simulateur Visuel de RAM (Stack vs Heap)
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 1)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="memory-workbench">

          <!-- 1. L'Énigme Interactive -->
          <div class="card-panel enigma-card">
            <div class="enigma-header">
              <span class="enigma-badge">Énigme Fondamentale</span>
              <h3>L'Énigme : Valeur Brute vs Référence Physique</h3>
            </div>

            <div class="enigma-grid">
              <!-- Colonne Primitifs -->
              <div class="enigma-box primitives-box">
                <div class="box-title">Cas 1 : Types Primitifs (Numbers)</div>
                <div class="code-snippet">
                  <pre><code>const a: number = 100;
const b: number = 100;

console.log(a === b); // ➔ <strong class="text-success">true</strong></code></pre>
                </div>
                <div class="explanation-tag success">
                  ✔ <strong>Comparaison de valeur brute :</strong> Les deux variables stockent directement 100 dans la Pile. <code>100 === 100</code> est toujours vrai.
                </div>
              </div>

              <!-- Colonne Objets -->
              <div class="enigma-box objects-box">
                <div class="box-title">Cas 2 : Objets Identiques (Instances)</div>
                <div class="code-snippet">
                  <pre><code>class Point &#123; constructor(public x: number, public y: number) &#125;

const p1 = new Point(10, 20);
const p2 = new Point(10, 20);

console.log(p1 === p2); // ➔ <strong class="text-danger">false</strong></code></pre>
                </div>
                <div class="explanation-tag danger">
                  ✖ <strong>Comparaison d'adresses mémoires :</strong> <code>===</code> ne lit JAMAIS les champs x et y. Il compare <code>0x10A === 0x20B</code>, ce qui est irrémédiablement faux !
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Simulateur Dynamique de RAM (Stack vs Heap) -->
          <div class="card-panel ram-simulator-card">
            <div class="simulator-header">
              <div>
                <span class="badge badge-purple">Laboratoire Visuel</span>
                <h3>Simulateur Dynamique de Mémoire Vive (Stack vs Heap)</h3>
                <p class="sub-text">Interagissez avec les boutons ci-dessous pour allouer des variables et observer les liaisons de pointeurs en temps réel.</p>
              </div>

              <div class="action-buttons-group">
                <button class="btn-primary btn-sm" (click)="addPoint1()" [disabled]="hasPoint1()">
                  1. let p1 = new Point(10, 20)
                </button>
                <button class="btn-primary btn-sm" (click)="addPoint2()" [disabled]="!hasPoint1() || hasPoint2()">
                  2. let p2 = new Point(10, 20)
                </button>
                <button class="btn-secondary btn-sm" (click)="addPoint3Alias()" [disabled]="!hasPoint1() || hasPoint3()">
                  3. let p3 = p1 (Alias)
                </button>
                <button class="btn-secondary btn-sm btn-mutate" (click)="mutateP3()" [disabled]="!hasPoint3() || isMutated()">
                  4. p3.x = 99 (Mutation !)
                </button>
                <button class="btn-ghost btn-sm" (click)="resetRam()">
                  ↺ Réinitialiser la RAM
                </button>
              </div>
            </div>

            <!-- Visualisation Colonnes Stack vs Heap -->
            <div class="ram-view-columns">
              <!-- Colonne Pile (Stack) -->
              <div class="column-box stack-column">
                <div class="col-head">
                  <div class="col-title">📚 LA PILE (Stack)</div>
                  <span class="col-badge">Taille fixe · Pointeur d'adresses</span>
                </div>

                <div class="variables-list">
                  <div class="ram-cell static-cell">
                    <div class="cell-var-name">const age</div>
                    <div class="cell-content primitive">
                      <span class="cell-val">25</span>
                      <span class="cell-type">number (brut)</span>
                    </div>
                  </div>

                  @for (v of stackVariables(); track v.name) {
                    <div class="ram-cell active-cell" [class.highlight]="v.name === 'p3' || (isMutated() && (v.name === 'p1' || v.name === 'p3'))">
                      <div class="cell-var-name">let {{ v.name }}</div>
                      <div class="cell-content reference">
                        <span class="cell-addr font-mono">{{ v.stackValue }}</span>
                        <span class="cell-type">Pointeur ➔ {{ v.targetAddress }}</span>
                      </div>
                    </div>
                  }

                  @if (stackVariables().length === 0) {
                    <div class="empty-col-hint">
                      Cliquez sur les boutons ci-dessus pour déclarer p1, p2 et p3.
                    </div>
                  }
                </div>
              </div>

              <!-- Colonne Liaisons (Flèches) -->
              <div class="column-middle-connectors">
                <div class="connectors-header">LIAISONS</div>
                <div class="wires-box">
                  @for (v of stackVariables(); track v.name) {
                    <div class="wire-item" [class.mutated]="isMutated() && (v.name === 'p1' || v.name === 'p3')">
                      <span class="wire-label font-mono">{{ v.name }} ➔ {{ v.targetAddress }}</span>
                      <div class="arrow-line"></div>
                    </div>
                  }
                </div>
              </div>

              <!-- Colonne Tas (Heap) -->
              <div class="column-box heap-column">
                <div class="col-head">
                  <div class="col-title">🏔️ LE TAS (Heap)</div>
                  <span class="col-badge">Objets dynamiques en RAM</span>
                </div>

                <div class="heap-objects-list">
                  @for (obj of heapObjects(); track obj.address) {
                    <div class="heap-card" [class.mutated]="obj.highlighted">
                      <div class="heap-addr-tag font-mono">@Adresse : {{ obj.address }}</div>
                      <div class="heap-class-name">Point</div>
                      <div class="heap-fields">
                        <div class="field-row">
                          <span class="field-k">x:</span>
                          <span class="field-v" [class.danger]="obj.data['x'] === 99">{{ obj.data['x'] }}</span>
                        </div>
                        <div class="field-row">
                          <span class="field-k">y:</span>
                          <span class="field-v">{{ obj.data['y'] }}</span>
                        </div>
                      </div>
                      @if (obj.highlighted) {
                        <div class="heap-alert-tag">⚠️ Objet muté via l'alias p3 !</div>
                      }
                    </div>
                  }

                  @if (heapObjects().length === 0) {
                    <div class="empty-col-hint">
                      Aucun objet alloué dans le Tas pour le moment.
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Télémétrie d'évaluation d'égalités en direct -->
            @if (stackVariables().length > 0) {
              <div class="ram-telemetry-banner">
                <div class="telemetry-title">📡 Bilan des comparaisons === en mémoire :</div>
                <div class="telemetry-grid">
                  <div class="telemetry-pill" [class.false-pill]="true">
                    <code>p1 === p2</code> ➔ 
                    <span class="font-mono">
                      {{ hasPoint1() && hasPoint2() ? '0x10A === 0x20B' : '...' }}
                    </span> ➔ 
                    <strong class="text-danger">{{ hasPoint1() && hasPoint2() ? 'FALSE' : 'N/A' }}</strong>
                  </div>

                  <div class="telemetry-pill" [class.true-pill]="hasPoint3()">
                    <code>p1 === p3</code> ➔ 
                    <span class="font-mono">
                      {{ hasPoint3() ? '0x10A === 0x10A' : '...' }}
                    </span> ➔ 
                    <strong class="text-success">{{ hasPoint3() ? 'TRUE (Alias)' : 'N/A' }}</strong>
                  </div>

                  <div class="telemetry-pill" [class.warning-pill]="isMutated()">
                    <code>p1.x après mutation</code> ➔ 
                    <strong class="text-warning">{{ isMutated() ? 'p1.x vaut 99 !' : '10' }}</strong>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- 3. Les Deux Grandes Analogies Illustrées -->
          <div class="analogies-grid">
            <!-- Analogie 1 : Les Vrais Jumeaux -->
            <div class="card-panel analogy-card">
              <div class="analogy-icon">👥</div>
              <div class="analogy-title">1. L'Analogie des Vrais Jumeaux</div>
              <div class="analogy-subtitle">Même valeur (ADN, visage), Identités physiques distinctes</div>
              <p class="analogy-text">
                Deux vrais jumeaux monozygotes partagent le même patrimoine génétique, la même morphologie et les mêmes vêtements. Leur apparence (<strong>valeur</strong>) est rigoureusement identique. Pourtant, ils possèdent deux cartes d'identité distinctes. Si l'un se coupe le doigt, l'autre ne saigne pas !
              </p>
              <div class="analogy-code-badge font-mono">
                jumeauA === jumeauB ➔ <strong>false</strong>
              </div>
            </div>

            <!-- Analogie 2 : L'Adresse Postale -->
            <div class="card-panel analogy-card">
              <div class="analogy-icon">🏠</div>
              <div class="analogy-title">2. L'Analogie de l'Adresse Postale</div>
              <div class="analogy-subtitle">La variable n'est qu'un papier, pas la maison</div>
              <p class="analogy-text">
                Une variable ne contient pas la maison physique en briques. Elle contient un papier avec l'adresse postale (*« 12 rue de la Gare »*). L'opérateur <code>===</code> compare simplement ce qui est écrit sur les deux papiers : si l'un indique le 12 et l'autre le 45, ce sont deux maisons distinctes, même si elles ont été bâties selon le même plan !
              </p>
              <div class="analogy-code-badge font-mono">
                maison12 === maison45 ➔ <strong>false</strong>
              </div>
            </div>
          </div>

          <!-- 4. Démonstrateur Interactif : Les Deux Télécommandes pour la même TV -->
          <div class="card-panel side-effect-demo">
            <div class="tv-demo-header">
              <span class="badge badge-danger">Effet de Bord Destructeur</span>
              <h3>L'Analogie des Deux Télécommandes pour la Même Télévision</h3>
              <p>Alice et Bob partagent la même référence de compte bancaire en mémoire vive (<code>const compteBob = compteAlice</code>).</p>
            </div>

            <div class="tv-demo-body">
              <!-- Télécommande Alice -->
              <div class="remote-device alice-remote">
                <div class="remote-header">
                  <span class="remote-label">Télécommande 1</span>
                  <div class="remote-var font-mono">const compteAlice</div>
                </div>
                <div class="balance-display font-mono">
                  {{ soldePartage() }} €
                </div>
                <div class="remote-desc">Alice consulte son solde sans rien toucher.</div>
              </div>

              <!-- L'Objet Unique en RAM (La Télévision) -->
              <div class="tv-central-object">
                <div class="tv-screen">
                  <div class="screen-title">📺 COMPTE BANCAIRE UNIQUE EN RAM</div>
                  <div class="screen-address font-mono">@Adresse : 0x10A-BANK</div>
                  <div class="screen-balance">{{ soldePartage() }} €</div>
                  <div class="screen-info">Titulaire initial : Alice</div>
                </div>
                <div class="tv-wires">
                  <span class="wire-left">◄ Synchronisé</span>
                  <span class="wire-right">Synchronisé ►</span>
                </div>
              </div>

              <!-- Télécommande Bob -->
              <div class="remote-device bob-remote">
                <div class="remote-header">
                  <span class="remote-label">Télécommande 2</span>
                  <div class="remote-var font-mono">const compteBob = compteAlice</div>
                </div>
                <div class="balance-display font-mono">
                  {{ soldePartage() }} €
                </div>
                <div class="remote-actions">
                  <button class="btn-primary btn-sm" (click)="retirerBob(100)" [disabled]="soldePartage() < 100">
                    💳 Bob retire 100 €
                  </button>
                  <button class="btn-secondary btn-sm" (click)="retirerBob(400)" [disabled]="soldePartage() < 400">
                    💳 Bob retire 400 €
                  </button>
                  <button class="btn-ghost btn-xs" (click)="resetSolde()">
                    ↺ Remettre 1000 €
                  </button>
                </div>
              </div>
            </div>

            <div class="tv-demo-alert">
              🚨 <strong>Constat :</strong> Lorsque Bob appuie sur sa télécommande pour retirer de l'argent, le solde d'Alice chute en direct ! Il n'y a qu'<strong>un seul compte physique</strong> dans le Tas à l'adresse <code>0x10A-BANK</code>.
            </div>
          </div>

        </div>
      } @else {
        <!-- Onglet Exercices Labo 1 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="1"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .memory-workbench {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Énigme Card */
    .enigma-card {
      padding: 20px 24px;
      background: linear-gradient(135deg, rgba(22, 31, 50, 0.95), rgba(15, 20, 34, 0.95));
      border: 1px solid var(--border-color);
    }

    .enigma-header {
      margin-bottom: 16px;
      .enigma-badge {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--bs-purple-light);
        letter-spacing: 0.06em;
      }
      h3 {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--text-main);
      }
    }

    .enigma-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .enigma-box {
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 14px 16px;
      border: 1px solid var(--border-subtle);

      .box-title {
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 8px;
        color: var(--text-muted);
      }

      .code-snippet {
        background: var(--bg-code);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        padding: 10px 14px;
        margin-bottom: 10px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        line-height: 1.45;
      }

      .explanation-tag {
        font-size: 0.78rem;
        padding: 8px 12px;
        border-radius: 6px;
        line-height: 1.4;

        &.success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #a7f3d0;
        }

        &.danger {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
      }
    }

    /* Simulateur de RAM */
    .ram-simulator-card {
      padding: 20px 24px;
    }

    .simulator-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;

      h3 {
        font-size: 1.25rem;
        font-weight: 800;
        margin-top: 4px;
      }

      .sub-text {
        font-size: 0.82rem;
        color: var(--text-muted);
      }

      .action-buttons-group {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }

    .btn-mutate {
      border-color: rgba(245, 158, 11, 0.5);
      color: #fbbf24;
      &:hover:not(:disabled) {
        background: rgba(245, 158, 11, 0.15);
        border-color: #fbbf24;
      }
    }

    .ram-view-columns {
      display: grid;
      grid-template-columns: 1fr 200px 1.2fr;
      gap: 16px;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      min-height: 280px;

      @media (max-width: 1050px) {
        grid-template-columns: 1fr;
      }
    }

    .column-box {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .col-head {
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;

        .col-title {
          font-weight: 800;
          font-size: 0.88rem;
          color: var(--bs-purple-light);
        }

        .col-badge {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
      }
    }

    .variables-list, .heap-objects-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ram-cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-subtle);
      font-size: 0.8rem;
      transition: all 0.2s;

      &.highlight {
        border-color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
      }

      .cell-var-name {
        font-weight: 700;
        font-family: var(--font-mono);
        color: var(--text-main);
      }

      .cell-content {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .cell-val {
          font-weight: 800;
          color: #fbbf24;
          font-family: var(--font-mono);
        }

        .cell-addr {
          font-weight: 800;
          color: #38bdf8;
        }

        .cell-type {
          font-size: 0.68rem;
          color: var(--text-dim);
        }
      }
    }

    .column-middle-connectors {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;

      .connectors-header {
        font-size: 0.68rem;
        font-weight: 800;
        color: var(--text-dim);
        letter-spacing: 0.1em;
        margin-bottom: 12px;
      }

      .wires-box {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }

      .wire-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        font-size: 0.72rem;
        color: #38bdf8;

        &.mutated {
          color: #f59e0b;
          .arrow-line {
            background: linear-gradient(90deg, #38bdf8, #f59e0b);
            animation: pulse-glow 1s infinite alternate;
          }
        }

        .arrow-line {
          width: 100%;
          height: 3px;
          background: #38bdf8;
          border-radius: 2px;
          position: relative;

          &::after {
            content: '▶';
            position: absolute;
            right: -2px;
            top: -6px;
            font-size: 10px;
          }
        }
      }
    }

    .heap-card {
      background: rgba(147, 51, 234, 0.08);
      border: 1px solid rgba(147, 51, 234, 0.3);
      border-radius: 8px;
      padding: 10px 14px;
      position: relative;
      transition: all 0.2s;

      &.mutated {
        border-color: #f59e0b;
        background: rgba(245, 158, 11, 0.15);
      }

      .heap-addr-tag {
        font-size: 0.7rem;
        font-weight: 800;
        color: #c084fc;
        margin-bottom: 4px;
      }

      .heap-class-name {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .heap-fields {
        display: flex;
        gap: 14px;
        margin-top: 4px;

        .field-row {
          font-family: var(--font-mono);
          font-size: 0.82rem;

          .field-k {
            color: var(--text-muted);
            margin-right: 4px;
          }
          .field-v {
            font-weight: 800;
            color: #34d399;

            &.danger {
              color: #f87171;
            }
          }
        }
      }

      .heap-alert-tag {
        font-size: 0.68rem;
        color: #fbbf24;
        font-weight: 700;
        margin-top: 6px;
      }
    }

    .empty-col-hint {
      font-size: 0.78rem;
      color: var(--text-dim);
      font-style: italic;
      padding: 14px 8px;
      text-align: center;
    }

    .ram-telemetry-banner {
      margin-top: 16px;
      padding: 12px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;

      .telemetry-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .telemetry-grid {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .telemetry-pill {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.78rem;
        background: var(--bg-subtle);
        border: 1px solid var(--border-subtle);

        &.false-pill {
          border-color: rgba(239, 68, 68, 0.4);
        }
        &.true-pill {
          border-color: rgba(16, 185, 129, 0.4);
        }
        &.warning-pill {
          border-color: rgba(245, 158, 11, 0.4);
        }
      }
    }

    /* Analogies */
    .analogies-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .analogy-card {
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .analogy-icon {
        font-size: 2rem;
      }

      .analogy-title {
        font-size: 1.05rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .analogy-subtitle {
        font-size: 0.78rem;
        color: var(--bs-purple-light);
        font-weight: 600;
      }

      .analogy-text {
        font-size: 0.84rem;
        color: var(--text-muted);
        line-height: 1.5;
        flex: 1;
      }

      .analogy-code-badge {
        background: var(--bg-subtle);
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        border: 1px solid var(--border-subtle);
        width: fit-content;
      }
    }

    /* Side Effect Demo (Télécommandes) */
    .side-effect-demo {
      padding: 20px 24px;
    }

    .tv-demo-header {
      margin-bottom: 16px;
      h3 {
        font-size: 1.25rem;
        font-weight: 800;
        margin-top: 4px;
      }
      p {
        font-size: 0.85rem;
        color: var(--text-muted);
      }
    }

    .tv-demo-body {
      display: grid;
      grid-template-columns: 1fr 1.2fr 1fr;
      gap: 16px;
      align-items: center;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .remote-device {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .remote-header {
        display: flex;
        flex-direction: column;
        .remote-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .remote-var {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--bs-purple-light);
        }
      }

      .balance-display {
        font-size: 1.8rem;
        font-weight: 900;
        color: #34d399;
      }

      .remote-desc {
        font-size: 0.74rem;
        color: var(--text-dim);
      }

      .remote-actions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 6px;
      }
    }

    .tv-central-object {
      display: flex;
      flex-direction: column;
      align-items: center;

      .tv-screen {
        width: 100%;
        background: #0f172a;
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);

        .screen-title {
          font-size: 0.75rem;
          font-weight: 800;
          color: #60a5fa;
          letter-spacing: 0.05em;
        }

        .screen-address {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .screen-balance {
          font-size: 2.2rem;
          font-weight: 900;
          color: #10b981;
          font-family: var(--font-mono);
        }

        .screen-info {
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 4px;
        }
      }

      .tv-wires {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 6px;
        font-size: 0.7rem;
        color: #64748b;
        font-family: var(--font-mono);
      }
    }

    .tv-demo-alert {
      margin-top: 14px;
      padding: 10px 14px;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      font-size: 0.82rem;
      line-height: 1.45;
    }
  `]
})
export class MemoryModelIdentityComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  // État du simulateur RAM
  readonly hasPoint1 = signal<boolean>(false);
  readonly hasPoint2 = signal<boolean>(false);
  readonly hasPoint3 = signal<boolean>(false);
  readonly isMutated = signal<boolean>(false);

  readonly stackVariables = signal<RamVariable[]>([]);
  readonly heapObjects = signal<HeapObject[]>([]);

  // Télécommandes TV
  readonly soldePartage = signal<number>(1000);

  addPoint1(): void {
    this.hasPoint1.set(true);
    this.stackVariables.update(list => [
      ...list,
      { name: 'p1', type: 'reference', stackValue: '0x10A', targetAddress: '0x10A' }
    ]);
    this.heapObjects.update(list => [
      ...list,
      { address: '0x10A', label: 'Point', data: { x: 10, y: 20 } }
    ]);
  }

  addPoint2(): void {
    this.hasPoint2.set(true);
    this.stackVariables.update(list => [
      ...list,
      { name: 'p2', type: 'reference', stackValue: '0x20B', targetAddress: '0x20B' }
    ]);
    this.heapObjects.update(list => [
      ...list,
      { address: '0x20B', label: 'Point', data: { x: 10, y: 20 } }
    ]);
  }

  addPoint3Alias(): void {
    this.hasPoint3.set(true);
    this.stackVariables.update(list => [
      ...list,
      { name: 'p3', type: 'reference', stackValue: '0x10A', targetAddress: '0x10A' }
    ]);
  }

  mutateP3(): void {
    this.isMutated.set(true);
    this.heapObjects.update(list => 
      list.map(obj => obj.address === '0x10A' ? {
        ...obj,
        data: { ...obj.data, x: 99 },
        highlighted: true
      } : obj)
    );
  }

  resetRam(): void {
    this.hasPoint1.set(false);
    this.hasPoint2.set(false);
    this.hasPoint3.set(false);
    this.isMutated.set(false);
    this.stackVariables.set([]);
    this.heapObjects.set([]);
  }

  retirerBob(montant: number): void {
    this.soldePartage.update(s => Math.max(0, s - montant));
  }

  resetSolde(): void {
    this.soldePartage.set(1000);
  }
}
