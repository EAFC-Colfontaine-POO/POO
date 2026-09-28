import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-oop-vs-discriminated-unions',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 7 · Module 07</span>
          <span class="badge badge-purple">POO vs Fonctionnel</span>
          <span class="badge badge-warning">Sécurité never</span>
        </div>
        <h2>Alternative Moderne : POO vs Unions Discriminées</h2>
        <p class="module-desc">
          Comment obtenir les bénéfices du polymorphisme sans classes ni héritage, directement sur des données brutes en TypeScript grâce au typage structurel et au filtrage exhaustif.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            ⚖️ Comparateur & Bac à Sable never
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 5)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="unions-workbench">
          <!-- Comparateur Côte à Côte -->
          <div class="comparison-row">
            <!-- Colonne 1 : Classes POO -->
            <div class="card-panel method-col">
              <div class="col-head">
                <span class="badge badge-bootstrap">Approche POO</span>
                <h4>Classes & Prototypes</h4>
              </div>

              <div class="code-box">
                <pre><code><span class="token-comment">// Les données ET les comportements sont encapsulés ensemble</span>
<span class="token-keyword">class</span> <span class="token-class">Livre</span> <span class="token-keyword">extends</span> <span class="token-class">Media</span> {{ '{' }}
  <span class="token-keyword">constructor</span>(titre: <span class="token-type">string</span>, <span class="token-keyword">public</span> pages: <span class="token-type">number</span>) {{ '{' }}
    <span class="token-keyword">super</span>(titre);
  {{ '}' }}

  <span class="token-keyword">override</span> <span class="token-fn">getDescription</span>(): <span class="token-type">string</span> {{ '{' }}
    <span class="token-keyword">return</span> <span class="token-str">\`Livre: \${{ 'this.titre' }} (\${{ 'this.pages' }} p.)\`</span>;
  {{ '}' }}
{{ '}' }}

<span class="token-comment">// Appel uniforme :</span>
media.<span class="token-fn">getDescription</span>();</code></pre>
              </div>

              <ul class="pros-cons">
                <li><span class="pro">✔</span> Facile d'ajouter un nouveau type (nouvelle classe fille).</li>
                <li><span class="pro">✔</span> Protection forte des invariants et de l'état interne (<code>private</code>).</li>
                <li><span class="con">✖</span> Nécessite une instanciation avec <code>new</code> (lourd pour JSON brut).</li>
              </ul>
            </div>

            <!-- Colonne 2 : Unions Discriminées -->
            <div class="card-panel method-col">
              <div class="col-head">
                <span class="badge badge-purple">Approche TypeScript Moderne</span>
                <h4>Unions Discriminées (Tagged Unions)</h4>
              </div>

              <div class="code-box">
                <pre><code><span class="token-comment">// Données pures séparées des fonctions</span>
<span class="token-keyword">type</span> <span class="token-type">LivreData</span> = {{ '{' }}
  kind: <span class="token-str">'livre'</span>; <span class="token-comment">// Discriminant</span>
  titre: <span class="token-type">string</span>;
  pages: <span class="token-type">number</span>;
{{ '}' }};

<span class="token-keyword">type</span> <span class="token-type">MediaData</span> = <span class="token-type">LivreData</span> | <span class="token-type">FilmData</span>;

<span class="token-comment">// Fonction externe avec switch :</span>
<span class="token-keyword">function</span> <span class="token-fn">formater</span>(m: <span class="token-type">MediaData</span>): <span class="token-type">string</span> {{ '{' }}
  <span class="token-keyword">switch</span> (m.kind) {{ '{' }}
    <span class="token-keyword">case</span> <span class="token-str">'livre'</span>: <span class="token-keyword">return</span> <span class="token-str">\`Livre: \${{ 'm.titre' }}\`</span>;
  {{ '}' }}
{{ '}' }}</code></pre>
              </div>

              <ul class="pros-cons">
                <li><span class="pro">✔</span> Parfait pour typer les réponses JSON d'API (DTOs).</li>
                <li><span class="pro">✔</span> Facile d'ajouter une opération sans modifier les données.</li>
                <li><span class="con">✖</span> Ajouter un type oblige à mettre à jour tous les <code>switch</code>.</li>
              </ul>
            </div>
          </div>

          <!-- BAC À SABLE DE L'EXHAUSTIVITÉ AVEC NEVER -->
          <div class="card-panel never-sandbox">
            <div class="sandbox-header">
              <div class="badge-title">
                <span class="sandbox-badge">LE PIÈGE DU NEVER</span>
                <h3>Le Bac à Sable du Filtrage Exhaustif (Exhaustiveness Checking)</h3>
              </div>
              <p>Simulez l'ajout d'un nouveau type <code>JeuData</code> à l'union sans toucher au switch :</p>
            </div>

            <div class="sandbox-action-row">
              <button 
                class="btn-primary" 
                [class.btn-danger]="hasAddedJeuToUnion()"
                (click)="toggleJeuInUnion()"
              >
                @if (hasAddedJeuToUnion()) {
                  <span>↺ Retirer JeuData de l'union</span>
                } @else {
                  <span>➕ Ajouter type JeuData à l'union</span>
                }
              </button>
            </div>

            <div class="code-interactive-box mt-3">
              <pre><code><span class="token-comment">// Type Union en direct :</span>
<span class="token-keyword">type</span> <span class="token-type">MediaData</span> = <span class="token-type">LivreData</span> | <span class="token-type">FilmData</span>@if (hasAddedJeuToUnion()) { <span class="highlight-add">| JeuData</span> };

<span class="token-keyword">function</span> <span class="token-fn">traiterMedia</span>(item: <span class="token-type">MediaData</span>): <span class="token-type">string</span> {{ '{' }}
  <span class="token-keyword">switch</span> (item.kind) {{ '{' }}
    <span class="token-keyword">case</span> <span class="token-str">'livre'</span>:
      <span class="token-keyword">return</span> <span class="token-str">\`Livre: \${{ 'item.titre' }}\`</span>;
    <span class="token-keyword">case</span> <span class="token-str">'film'</span>:
      <span class="token-keyword">return</span> <span class="token-str">\`Film: \${{ 'item.titre' }}\`</span>;
    
    <span class="token-keyword">default</span>:
      <span class="token-comment">// 🛡️ LA SÉCURITÉ ABSOLUE :</span>
      @if (hasAddedJeuToUnion()) {
      <span class="token-error">const _exhaustif: never = item; // ❌ ERREUR DE COMPILATION !</span>
      <span class="token-error">// TS2322: Type 'JeuData' is not assignable to type 'never'.</span>
      } @else {
      <span class="token-comment">const _exhaustif: never = item; // ✅ Valide : tous les cas sont couverts !</span>
      }
      <span class="token-keyword">throw new</span> <span class="token-class">Error</span>(<span class="token-str">\`Cas non géré\`</span>);
  {{ '}' }}
{{ '}' }}</code></pre>
            </div>

            @if (hasAddedJeuToUnion()) {
              <div class="alert-box error mt-3">
                <div class="alert-icon">🛡️</div>
                <div class="alert-body">
                  <strong>TypeScript bloque immédiatement la compilation !</strong>
                  <p>
                    Comme <code>JeuData</code> n'est pas géré dans le <code>switch</code>, dans la branche <code>default</code>, <code>item</code> est de type <code>JeuData</code>. TypeScript refuse d'assigner <code>JeuData</code> à <code>never</code> ! Vous êtes instantanément averti qu'un cas a été oublié.
                  </p>
                </div>
              </div>
            } @else {
              <div class="alert-box success mt-3">
                <div class="alert-icon">✔</div>
                <div class="alert-body">
                  <strong>Couverture exhaustive 100% vérifiée</strong>
                  <p>Tous les types actuels (Livre, Film) sont gérés. Dans la branche <code>default</code>, aucun type restant n'existe, donc <code>item</code> est légitimement <code>never</code>.</p>
                </div>
              </div>
            }
          </div>

          <!-- Matrice Décisionnelle Interactive -->
          <div class="card-panel matrix-card">
            <h3 class="panel-title">🧭 Matrice Décisionnelle : Quand choisir quoi ?</h3>
            <div class="table-responsive">
              <table class="matrix-table">
                <thead>
                  <tr>
                    <th>Critère de choix</th>
                    <th>Classes & Héritage (POO)</th>
                    <th>Unions Discriminées (TS)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Nature du contenu</strong></td>
                    <td>Objets vivants avec logique métier riche</td>
                    <td>Données brutes, DTOs, JSON d'API HTTP</td>
                  </tr>
                  <tr>
                    <td><strong>Comportement</strong></td>
                    <td>Méthodes internes encapsulées (<code>item.getDescription()</code>)</td>
                    <td>Fonctions externes avec <code>switch (item.kind)</code></td>
                  </tr>
                  <tr>
                    <td><strong>Extensibilité dominante</strong></td>
                    <td><span class="badge badge-success">Facile d'ajouter un TYPE</span> (nouvelle classe dérivée)</td>
                    <td><span class="badge badge-purple">Facile d'ajouter une OPÉRATION</span> (nouvelle fonction)</td>
                  </tr>
                  <tr>
                    <td><strong>Contexte de prédilection</strong></td>
                    <td>Services Angular, entités métier, moteurs graphiques</td>
                    <td>Payloads HTTP, états Redux/NgRx, formulaires dynamiques</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="5"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .unions-workbench {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .comparison-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .method-col {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .col-head {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h4 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }
      }
    }

    .code-box, .code-interactive-box {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px 16px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.5;

      pre { margin: 0; }
    }

    .highlight-add {
      color: #38bdf8;
      font-weight: 800;
      background: rgba(14, 165, 233, 0.2);
      padding: 1px 4px;
      border-radius: 3px;
    }

    .token-comment { color: #64748b; font-style: italic; }
    .token-keyword { color: #c084fc; font-weight: 600; }
    .token-fn { color: #60a5fa; }
    .token-str { color: #86efac; }
    .token-type { color: #fde047; }
    .token-class { color: #38bdf8; font-weight: 600; }
    .token-error { color: #f87171; background: rgba(239, 68, 68, 0.15); display: block; padding: 2px 4px; border-radius: 4px; }

    .pros-cons {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-muted);

      .pro { color: #34d399; font-weight: 800; margin-right: 6px; }
      .con { color: #f87171; font-weight: 800; margin-right: 6px; }
    }

    /* Never Sandbox */
    .never-sandbox {
      padding: 20px;
      border: 1px solid rgba(121, 82, 179, 0.4);

      .sandbox-header {
        margin-bottom: 14px;

        .badge-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;

          .sandbox-badge {
            background: #7952b3;
            color: #fff;
            font-size: 0.68rem;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
          }

          h3 {
            font-size: 1.15rem;
            font-weight: 700;
            margin: 0;
            color: var(--text-main);
          }
        }

        p {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin: 0;
        }
      }
    }

    .alert-box {
      display: flex;
      gap: 12px;
      padding: 14px;
      border-radius: 8px;
      font-size: 0.82rem;

      &.error {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #fef2f2;
        strong { color: #f87171; }
        p { color: #fca5a5; margin: 4px 0 0 0; }
      }

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #ecfdf5;
        strong { color: #34d399; }
        p { color: #a7f3d0; margin: 4px 0 0 0; }
      }

      .alert-icon { font-size: 1.3rem; }
    }

    /* Matrix */
    .matrix-card {
      padding: 20px;

      .panel-title {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 16px;
      }
    }

    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84rem;

      th, td {
        padding: 10px 14px;
        border: 1px solid var(--border-color);
        text-align: left;
      }

      th {
        background: var(--bg-subtle);
        color: var(--text-main);
        font-weight: 700;
      }

      td {
        color: var(--text-muted);
      }
    }
  `]
})
export class OopVsDiscriminatedUnionsComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');
  readonly hasAddedJeuToUnion = signal<boolean>(false);

  toggleJeuInUnion(): void {
    this.hasAddedJeuToUnion.update(v => !v);
  }
}
