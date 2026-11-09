import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-dto-to-entity',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">Module 07 · Le Cœur Battant de la POO</div>
        <h2>Le Pont POO : Du DTO Inerte à l'Entité Vivante</h2>
        <p class="module-desc">
          Une réponse HTTP REST ne transporte que des chaînes de caractères brutes.
          TypeScript ne fait pas de magie : le cast naïf <code>as Classe</code> n'attache aucun prototype au runtime.
          Découvrez pourquoi et comment ressusciter vos objets métier via la fabrique <code>fromDTO()</code> et <code>computed()</code>.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'trap'" (click)="activeSubTab.set('trap')">
              💥 Le Piège du Cast Naïf &amp; Crash Runtime
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'decoupling'" (click)="activeSubTab.set('decoupling')">
              ⚖️ DTO (interface) vs Entité (class)
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'factory'" (click)="activeSubTab.set('factory')">
              ✨ La Fabrique Récursive fromDTO()
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 6 ➔
          </button>
        </div>
      </div>

      <!-- SOUS-ONGLET 1 : LE PIÈGE DU CAST NAÏF -->
      @if (activeSubTab() === 'trap') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Simulation du Crash : httpResource&lt;Produit[]&gt;()</h3>
              <p class="zone-subtitle">TypeScript compile sans broncher, mais le navigateur s'effondre à l'exécution.</p>
            </div>

            <button class="btn-primary btn-sm" (click)="runNaiveCastSimulation()">
              ▶️ Déclencher la simulation du Cast Naïf
            </button>
          </div>

          <div class="grid-2-cols mt-3">
            <!-- Code source -->
            <div class="code-box">
              <div class="box-bar">
                <span>Code TypeScript naïf :</span>
                <span class="badge badge-warning">Illusion du Cast</span>
              </div>
              <pre class="code-pre"><code>class Produit &#123;
  constructor(public nom: string, public prix: number) &#123;&#125;

  calculerTTC(): number &#123;
    return this.prix * 1.21;
  &#125;
&#125;

// ❌ ATTENTION : Typage naïf et trompeur !
const res = httpResource&lt;Produit[]&gt;('/api/produits');

// Au runtime :
const p = res.value()?.[0];

console.log(p instanceof Produit); // ➔ false !
p.calculerTTC(); // 💥 CRASH TypeError : is not a function !</code></pre>
            </div>

            <!-- Terminal d'exécution -->
            <div class="term-box">
              <div class="box-bar">
                <span class="dot-red"></span>
                <span>Console V8 du Navigateur</span>
              </div>
              <div class="term-content">
                @if (hasCrashRun()) {
                  <div class="term-log">
                    <span class="text-dim">&gt; Vérification prototype :</span>
                    <div class="log-fail font-mono">p instanceof Produit ➔ <strong>false</strong> (Aucun prototype !)</div>
                    <div class="log-error font-mono mt-2">
                      💥 <strong>TypeError: p.calculerTTC is not a function</strong><br>
                      &nbsp;&nbsp;&nbsp;&nbsp;at executeNaiveCast (produit.service.ts:18:7)
                    </div>
                  </div>
                } @else {
                  <div class="empty-term">&gt; Cliquez sur le bouton ci-dessus pour observer le drame du runtime...</div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 2 : DÉCOUPLAGE DTO VS ENTITÉ -->
      @if (activeSubTab() === 'decoupling') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Le Découplage Fondamental : Contrat DTO vs Domaine Métier</h3>
              <p class="zone-subtitle">Deux rôles distincts répondant au principe de responsabilité unique (SRP).</p>
            </div>
          </div>

          <div class="comparison-grid mt-3">
            <div class="card-dto">
              <div class="card-badge">CONTRAT BRUT</div>
              <h4>Le DTO (Data Transfer Object)</h4>
              <span class="type-syntax">interface RecipeDTO &#123; ... &#125;</span>

              <ul class="prop-list mt-3">
                <li>📄 Modélise fidèlement le JSON renvoyé par le backend distant.</li>
                <li>🪨 <strong>Donnée inerte :</strong> aucune méthode, aucun constructeur, zéro invariant.</li>
                <li>💨 S'efface intégralement à la compilation TypeScript (Type Erasure).</li>
                <li>🎯 A une seule raison de changer : si l'API externe modifie son schéma JSON.</li>
              </ul>
            </div>

            <div class="card-entity">
              <div class="card-badge tag-entity">DOMAINE MÉTIER POO</div>
              <h4>L'Entité Métier Vivante</h4>
              <span class="type-syntax">class Recipe &#123; ... &#125;</span>

              <ul class="prop-list mt-3">
                <li>🏰 Protège son état avec des attributs privés (<code>#nom</code>, <code>#duree</code>).</li>
                <li>🛡️ <strong>Valide ses invariants</strong> dans son constructeur (lève une exception si invalide).</li>
                <li>🧠 <strong>Porte des méthodes métier</strong> (<code>isExpress()</code>, <code>tempsTotalMinutes</code>).</li>
                <li>🎯 A une seule raison de changer : si la règle de gestion interne évolue.</li>
              </ul>
            </div>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 3 : FABRIQUE RÉCURSIVE FROMDTO -->
      @if (activeSubTab() === 'factory') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">La Fabrique Statique Récursive Recipe.fromDTO()</h3>
              <p class="zone-subtitle">Démonstration concrète sur Recipe composée d'objets-valeurs Ingredient.</p>
            </div>

            <button class="btn-primary btn-sm" (click)="runHydrationSimulation()">
              ✨ Réhydrater les Recettes via computed()
            </button>
          </div>

          <div class="hydration-pipeline mt-3">
            <div class="pipe-step">
              <span class="step-tag">1. DTO BRUT SERVEUR</span>
              <pre class="code-micro"><code>&#123;
  "name": "Pizza Margherita",
  "prepTimeMinutes": 20,
  "cookTimeMinutes": 15,
  "ingredients": ["Farine", "Tomate"]
&#125;</code></pre>
            </div>

            <div class="pipe-arrow">➔</div>

            <div class="pipe-step">
              <span class="step-tag">2. PONT COMPUTED()</span>
              <pre class="code-micro"><code>computed(() => &#123;
  return res.value()
    ?.map(Recipe.fromDTO);
&#125;)</code></pre>
            </div>

            <div class="pipe-arrow">➔</div>

            <div class="pipe-step">
              <span class="step-tag">3. ENTITÉ MÉTIER VIVANTE</span>
              <div class="entity-badge-box">
                @if (isHydrated()) {
                  <span class="text-success font-bold">r instanceof Recipe === true ✅</span>
                  <span class="text-xs">r.tempsTotalMinutes = 35 min</span>
                  <span class="text-xs">r.isExpress() = false</span>
                  <span class="text-xs">r.ingredients[0] instanceof Ingredient === true ✅</span>
                } @else {
                  <span class="text-dim">Cliquez sur le bouton ci-dessus pour observer la réhydratation...</span>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .code-box, .term-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      min-height: 280px;

      .box-bar {
        padding: 10px 14px;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.78rem;
        font-weight: 700;
        border-radius: 8px 8px 0 0;
      }
    }

    .code-pre {
      padding: 14px;
      font-size: 0.78rem;
      line-height: 1.5;
      font-family: var(--font-mono);
      overflow-x: auto;
    }

    .term-content {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .empty-term {
      color: var(--text-dim);
      font-style: italic;
      text-align: center;
      font-size: 0.8rem;
    }

    .log-fail {
      color: #fca5a5;
      background: rgba(239, 68, 68, 0.1);
      padding: 6px 10px;
      border-radius: 4px;
      margin-top: 4px;
    }

    .log-error {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #ef4444;
      padding: 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      line-height: 1.4;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .card-dto, .card-entity {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .card-badge {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--text-dim);
      }

      .tag-entity {
        color: #c084fc;
      }

      h4 {
        font-size: 1.15rem;
        font-weight: 700;
      }

      .type-syntax {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: #60a5fa;
      }

      .prop-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .card-entity {
      border-color: rgba(147, 51, 234, 0.4);
    }

    .hydration-pipeline {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow-x: auto;
      padding: 10px 0;

      .pipe-step {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 14px;
        min-width: 240px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .step-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--ts-blue-light);
        }
      }

      .pipe-arrow {
        font-size: 1.5rem;
        color: var(--text-dim);
      }
    }

    .code-micro {
      font-size: 0.72rem;
      font-family: var(--font-mono);
      background: var(--bg-subtle);
      padding: 8px;
      border-radius: 4px;
    }

    .entity-badge-box {
      background: var(--bg-subtle);
      padding: 10px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.82rem;
    }
  `]
})
export class DtoToEntityComponent {
  readonly nav = inject(NavigationService);
  readonly exerciseService = inject(ExerciseService);

  readonly activeSubTab = signal<'trap' | 'decoupling' | 'factory'>('trap');
  readonly hasCrashRun = signal<boolean>(false);
  readonly isHydrated = signal<boolean>(false);

  runNaiveCastSimulation(): void {
    this.hasCrashRun.set(true);
  }

  runHydrationSimulation(): void {
    this.isHydrated.set(true);
  }

  jumpToLab(): void {
    this.exerciseService.setFilterLab(6);
    this.nav.setTab('workshops-lab');
  }
}
