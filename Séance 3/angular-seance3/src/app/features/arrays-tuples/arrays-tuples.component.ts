import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-arrays-tuples',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Module 7 — Structures de Données</div>
        <h2>Tableaux Typés, Tuples & Méthodes Fonctionnelles</h2>
        <p class="module-desc">
          Manipulez des collections de données homogènes avec les tableaux typés, découvrez les Tuples pour représenter des paires ou triplets positionnels stricts,
          et exercez-vous visuellement sur les méthodes modernes <code>map</code>, <code>filter</code>, <code>find</code> et <code>reduce</code>.
        </p>
      </div>

      <!-- Onglets Mode : Théorie / Labo 5 -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'theory'"
          (click)="activeMode.set('theory')"
        >
          <span>📚 Cours & Démonstrateurs</span>
        </button>
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'lab'"
          (click)="activeMode.set('lab')"
        >
          <span>🧪 Atelier Pratique : Labo 5 (4 Défis Monaco)</span>
        </button>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Tableaux Typés & Tuples -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>1. Tableaux Typés vs Tuples : Deux rôles bien distincts</h3>
              <p class="section-sub">Les tableaux sont de longueur dynamique homogène ; les tuples ont une taille et des types ordonnés par position.</p>
            </div>
          </div>

          <div class="arrays-tuples-grid">
            <!-- Tableaux -->
            <div class="struct-card">
              <div class="struct-header">
                <span class="badge badge-ts">Tableau Typé Homogène</span>
                <code>number[]</code> ou <code>Array&lt;number&gt;</code>
              </div>
              <pre><code>let notes: number[] = [12, 15, 18];

// Longueur variable (on peut ajouter des éléments) :
notes.push(14); // ✔ Autorisé

// Type homogène garanti :
// notes.push("absent"); // ❌ ERREUR string !== number</code></pre>
              <div class="struct-chips">
                <span class="chip">Taille dynamique</span>
                <span class="chip">Tous les éléments du même type</span>
              </div>
            </div>

            <!-- Tuples -->
            <div class="struct-card">
              <div class="struct-header">
                <span class="badge badge-purple">Tuple (Taille & Ordre Fixes)</span>
                <code>[string, number, boolean]</code>
              </div>
              <pre><code>// Exemple : [Nom, Âge, EstInscrit]
let etudiant: [string, number, boolean] = ["Amina", 21, true];

// L'ordre des positions est strictement vérifié :
// etudiant = [21, "Amina", true]; // ❌ ERREUR d'inversion !

console.log(etudiant[0]); // "Amina" (typé string)
console.log(etudiant[1]); // 21 (typé number)</code></pre>
              <div class="struct-chips">
                <span class="chip">Positions indexées strictes</span>
                <span class="chip">Idéal pour coordonnées [lat, lng]</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Visualiseur des 4 Méthodes Usuelles -->
        <div class="card-panel methods-section">
          <div class="section-title-row">
            <div>
              <h3>2. Playground Visuel des Méthodes de Tableau</h3>
              <p class="section-sub">Sélectionnez une méthode pour observer son effet sur le tableau <code>[10, 15, 8, 20]</code>.</p>
            </div>
            <div class="methods-btn-group">
              <button class="btn-secondary" [class.active-method]="activeMethod() === 'map'" (click)="activeMethod.set('map')">.map()</button>
              <button class="btn-secondary" [class.active-method]="activeMethod() === 'filter'" (click)="activeMethod.set('filter')">.filter()</button>
              <button class="btn-secondary" [class.active-method]="activeMethod() === 'find'" (click)="activeMethod.set('find')">.find()</button>
              <button class="btn-secondary" [class.active-method]="activeMethod() === 'reduce'" (click)="activeMethod.set('reduce')">.reduce()</button>
            </div>
          </div>

          <div class="method-interactive-display">
            @switch (activeMethod()) {
              @case ('map') {
                <div class="method-box">
                  <div class="method-code-line">
                    <code>const resultat = [10, 15, 8, 20].map(n => n * 2);</code>
                  </div>
                  <div class="transformation-flow">
                    <div class="input-arr">
                      <span class="box-label">Entrée :</span>
                      <div class="pills-row">
                        <span class="num-pill">10</span>
                        <span class="num-pill">15</span>
                        <span class="num-pill">8</span>
                        <span class="num-pill">20</span>
                      </div>
                    </div>
                    <span class="transfo-arrow">➡️ (× 2) ➡️</span>
                    <div class="output-arr">
                      <span class="box-label">Nouveau tableau généré :</span>
                      <div class="pills-row">
                        <span class="num-pill res">20</span>
                        <span class="num-pill res">30</span>
                        <span class="num-pill res">16</span>
                        <span class="num-pill res">40</span>
                      </div>
                    </div>
                  </div>
                  <p class="method-rule"><strong>Rôle :</strong> Transforme chaque élément en un nouvel élément et retourne un tableau de même taille.</p>
                </div>
              }
              @case ('filter') {
                <div class="method-box">
                  <div class="method-code-line">
                    <code>const resultat = [10, 15, 8, 20].filter(n => n >= 10);</code>
                  </div>
                  <div class="transformation-flow">
                    <div class="input-arr">
                      <span class="box-label">Entrée :</span>
                      <div class="pills-row">
                        <span class="num-pill pass">10</span>
                        <span class="num-pill pass">15</span>
                        <span class="num-pill fail">8 (écarté)</span>
                        <span class="num-pill pass">20</span>
                      </div>
                    </div>
                    <span class="transfo-arrow">➡️ (>= 10) ➡️</span>
                    <div class="output-arr">
                      <span class="box-label">Éléments retenus :</span>
                      <div class="pills-row">
                        <span class="num-pill res">10</span>
                        <span class="num-pill res">15</span>
                        <span class="num-pill res">20</span>
                      </div>
                    </div>
                  </div>
                  <p class="method-rule"><strong>Rôle :</strong> Filtre les éléments selon un prédicat booléen (garde ceux pour lesquels le test est <code>true</code>).</p>
                </div>
              }
              @case ('find') {
                <div class="method-box">
                  <div class="method-code-line">
                    <code>const resultat = [10, 15, 8, 20].find(n => n < 10);</code>
                  </div>
                  <div class="transformation-flow">
                    <div class="input-arr">
                      <span class="box-label">Entrée :</span>
                      <div class="pills-row">
                        <span class="num-pill">10</span>
                        <span class="num-pill">15</span>
                        <span class="num-pill pass">8 (Trouvé !)</span>
                        <span class="num-pill">20</span>
                      </div>
                    </div>
                    <span class="transfo-arrow">➡️ (&lt; 10) ➡️</span>
                    <div class="output-arr">
                      <span class="box-label">Valeur unique retournée :</span>
                      <div class="pills-row">
                        <span class="num-pill res">8 (ou undefined si absent)</span>
                      </div>
                    </div>
                  </div>
                  <p class="method-rule"><strong>Rôle :</strong> Retourne le <strong>tout premier</strong> élément correspondant à la condition, ou <code>undefined</code>.</p>
                </div>
              }
              @case ('reduce') {
                <div class="method-box">
                  <div class="method-code-line">
                    <code>const total = [10, 15, 8, 20].reduce((acc, n) => acc + n, 0);</code>
                  </div>
                  <div class="transformation-flow">
                    <div class="input-arr">
                      <span class="box-label">Accumulation pas-à-pas :</span>
                      <div class="pills-row">
                        <span class="num-pill">0 + 10 = 10</span>
                        <span class="num-pill">10 + 15 = 25</span>
                        <span class="num-pill">25 + 8 = 33</span>
                        <span class="num-pill">33 + 20 = 53</span>
                      </div>
                    </div>
                    <span class="transfo-arrow">➡️ (= total) ➡️</span>
                    <div class="output-arr">
                      <span class="box-label">Résultat final condensé :</span>
                      <div class="pills-row">
                        <span class="num-pill res">53</span>
                      </div>
                    </div>
                  </div>
                  <p class="method-rule"><strong>Rôle :</strong> Réduit l'ensemble du tableau à une valeur scalaire unique (somme, moyenne, total).</p>
                </div>
              }
            }
          </div>
        </div>

        <!-- 3. Déstructuration & Spread (...) -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>3. Déstructuration & Opérateur de Décomposition (Spread ...)</h3>
              <p class="section-sub">Les syntaxes modernes pour copier et extraire des données sans mutation.</p>
            </div>
          </div>

          <div class="arrays-tuples-grid">
            <div class="struct-card">
              <span class="badge badge-ts">Déstructuration [premier, second]</span>
              <pre><code>const fruits = ["pomme", "poire", "banane"];

// Extraction directe sans indices manuels :
const [premier, second] = fruits;

console.log(premier); // "pomme"
console.log(second);  // "poire"</code></pre>
            </div>

            <div class="struct-card">
              <span class="badge badge-purple">Spread operator (...tab)</span>
              <pre><code>const base = [1, 2];

// Création d'un nouveau tableau sans modifier base :
const etendu = [...base, 3, 4];
console.log(etendu); // [1, 2, 3, 4]

// Clonage parfait :
const copie = [...base];</code></pre>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Labo 5 -->
        <app-lab-runner [targetLabNumber]="5"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .arrays-tuples-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .struct-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      pre {
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        padding: 12px;
        border-radius: 6px;
        font-size: 0.82rem;
        color: var(--text-code);
        overflow-x: auto;
      }
    }

    .struct-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      code {
        color: var(--ts-blue-light);
        font-weight: 700;
      }
    }

    .struct-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .chip {
        font-size: 0.72rem;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 2px 8px;
        border-radius: 4px;
        color: var(--text-dim);
      }
    }

    .methods-btn-group {
      display: flex;
      gap: 8px;

      .active-method {
        background: var(--ts-blue);
        color: #fff;
        border-color: var(--ts-blue);
      }
    }

    .method-interactive-display {
      margin-top: 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
    }

    .method-box {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .method-code-line {
      background: var(--bg-code);
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.9rem;
      border: 1px solid var(--border-color);

      code { color: #60a5fa; font-weight: 600; }
    }

    .transformation-flow {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .input-arr, .output-arr {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .box-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
    }

    .pills-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .num-pill {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 6px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 600;

      &.res {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border-color: rgba(16, 185, 129, 0.4);
      }

      &.pass {
        border-color: rgba(16, 185, 129, 0.4);
        color: #34d399;
      }

      &.fail {
        border-color: rgba(239, 68, 68, 0.3);
        color: #f87171;
        opacity: 0.6;
        text-decoration: line-through;
      }
    }

    .transfo-arrow {
      font-size: 1.1rem;
      color: var(--text-dim);
    }

    .method-rule {
      font-size: 0.84rem;
      color: var(--text-muted);
      border-top: 1px dashed var(--border-color);
      padding-top: 10px;

      strong { color: var(--text-main); }
    }
  `]
})
export class ArraysTuplesComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');
  readonly activeMethod = signal<'map' | 'filter' | 'find' | 'reduce'>('map');
}
