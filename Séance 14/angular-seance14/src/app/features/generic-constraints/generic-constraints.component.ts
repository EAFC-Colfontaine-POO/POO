import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-generic-constraints',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 05 · Contraintes de Type</div>
        <h2>Le Mur de la Contrainte : Pourquoi &lt;T extends Identifiable&gt; ?</h2>
        <p class="module-desc">
          Pourquoi le compilateur refuse-t-il <code>item.id</code> sur une classe générique ordinaire ?
          Découvrez pourquoi TypeScript n'est pas capricieux mais rigoureux, et comment la contrainte
          <code>&lt;T extends Identifiable&gt;</code> débloque l'accès aux propriétés tout en introduisant le Lookup Type <code>T['id']</code>.
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Le Mur &amp; Le Contrat Structurel</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 4 · 4 Ex)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Le Crash de Compilation TS2339 -->
        <section class="card-panel">
          <div class="panel-header">
            <h3>💥 Pourquoi TypeScript refuse-t-il la méthode supprimer ?</h3>
            <span class="badge badge-red">Erreur TS2339</span>
          </div>

          <div class="grid-2-cols my-3">
            <div class="code-box">
              <div class="code-header">
                <span>repository-invalide.ts</span>
                <span class="badge badge-warning">Sans Contrainte</span>
              </div>
              <pre><code>// ❌ SANS CONTRAINTE : T peut être n'importe quel type
export class Repository&lt;T&gt; {{ '{' }}
  private items: T[] = [];

  supprimer(id: number): void {{ '{' }}
    // 💥 ERREUR TS2339 :
    // Property 'id' does not exist on type 'T'.
    this.items = this.items.filter(item =&gt; item.id !== id);
  {{ '}' }}
{{ '}' }}</code></pre>
            </div>

            <div class="compiler-mindset-box">
              <div class="mindset-title">🧠 Que pense le compilateur TypeScript ?</div>
              <p>
                Vous pensez à des <code>Produits</code> ou des <code>Clients</code> qui ont tous un identifiant.
                Mais pour TypeScript, <code>T</code> est <strong>inconnu</strong> : un développeur pourrait instancier :
              </p>
              <div class="bad-instantiation-tag">
                <code>const repo = new Repository&lt;boolean&gt;();</code>
              </div>
              <p class="mt-2">
                Or, un booléen (<code>true</code> / <code>false</code>) ne possède pas de propriété <code>.id</code> !
                TypeScript refuse de compiler pour vous empêcher de créer un bug runtime garanti.
              </p>

              <button class="btn-primary mt-3" (click)="showConstraintSolution.set(true)">
                🔓 Appliquer la Contrainte : &lt;T extends Identifiable&gt;
              </button>
            </div>
          </div>
        </section>

        <!-- 2. La Solution : Le Contrat Structurel -->
        <section class="card-panel mt-4">
          <div class="panel-header">
            <h3>🤝 La Solution : Contrat d'Interface &amp; Lookup Type</h3>
            <span class="badge badge-success">Typage Structurel</span>
          </div>

          <div class="grid-2-cols mt-3">
            <div class="code-box">
              <div class="code-header">
                <span>repository-conforme.ts</span>
                <span class="badge badge-success">✅ Valide &amp; Sécurisé</span>
              </div>
              <pre><code>// 1. Le contrat pur (S08)
export interface Identifiable {{ '{' }}
  readonly id: number | string;
{{ '}' }}

// 2. La contrainte : T DOIT respecter le contrat
export class Repository&lt;T extends Identifiable&gt; {{ '{' }}
  private items: T[] = [];

  // 3. Lookup Type : le type exact du id de T !
  supprimer(id: T['id']): void {{ '{' }}
    // ✅ TypeScript SAIT avec certitude que chaque item a un .id !
    this.items = this.items.filter(item =&gt; item.id !== id);
  {{ '}' }}
{{ '}' }}</code></pre>
            </div>

            <!-- Inspecteur Interactif de Types (Lookup Type T['id']) -->
            <div class="lookup-inspector-box">
              <div class="lookup-title">🔍 Inspecteur de Lookup Type : T['id']</div>
              <p class="lookup-desc">
                Cliquez sur une entité pour observer la résolution dynamique du type de l'identifiant :
              </p>

              <div class="entity-tabs">
                <button class="entity-tab" [class.active]="selectedEntity() === 'Produit'" (click)="selectedEntity.set('Produit')">
                  📦 Produit (id: number)
                </button>
                <button class="entity-tab" [class.active]="selectedEntity() === 'Client'" (click)="selectedEntity.set('Client')">
                  👤 Client (id: string)
                </button>
                <button class="entity-tab rejected" [class.active]="selectedEntity() === 'Coordonnees'" (click)="selectedEntity.set('Coordonnees')">
                  📍 Coordonnees (pas d'id)
                </button>
              </div>

              <div class="resolution-card mt-3" [class.rejected]="selectedEntity() === 'Coordonnees'">
                @if (selectedEntity() === 'Produit') {
                  <div class="res-row">
                    <span class="res-label">Entité :</span>
                    <code>class Produit implements Identifiable</code>
                  </div>
                  <div class="res-row">
                    <span class="res-label">Type de T['id'] :</span>
                    <span class="badge badge-ts">number</span>
                  </div>
                  <div class="res-row">
                    <span class="res-label">Signature résolue :</span>
                    <code>supprimer(id: number): void</code>
                  </div>
                  <div class="res-verdict good">✓ Conforme au contrat : accepté !</div>
                } @else if (selectedEntity() === 'Client') {
                  <div class="res-row">
                    <span class="res-label">Entité :</span>
                    <code>class Client implements Identifiable</code>
                  </div>
                  <div class="res-row">
                    <span class="res-label">Type de T['id'] :</span>
                    <span class="badge badge-purple">string</span>
                  </div>
                  <div class="res-row">
                    <span class="res-label">Signature résolue :</span>
                    <code>supprimer(id: string): void</code>
                  </div>
                  <div class="res-verdict good">✓ Conforme au contrat : accepté !</div>
                } @else {
                  <div class="res-row">
                    <span class="res-label">Entité :</span>
                    <code>class Coordonnees {{ '{' }} lat: number; lng: number {{ '}' }}</code>
                  </div>
                  <div class="res-row">
                    <span class="res-label">Présence de .id :</span>
                    <span class="badge badge-red">ABSENT</span>
                  </div>
                  <div class="res-verdict bad">
                    ❌ <strong>TS2344 :</strong> Type 'Coordonnees' does not satisfy constraint 'Identifiable'.
                    Rejeté immédiatement à la compilation !
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Règle d'or extends en généricité -->
        <section class="card-panel mt-4">
          <div class="key-rule-box">
            <div class="rule-icon">⚠️</div>
            <div class="rule-text">
              <h4>Attention : <code>extends</code> en générique ≠ Héritage de classe mère (S06)</h4>
              <p>
                Quand on écrit <code>T extends Identifiable</code>, cela ne signifie <strong>pas</strong> que <code>T</code> doit hériter d'une classe parente.<br>
                Cela signifie simplement : <em>« T doit posséder au minimum la structure requise par le contrat (typage structurel ou duck typing) »</em>.
              </p>
            </div>
          </div>
        </section>
      } @else {
        <app-lab-runner [defaultLabNumber]="4"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.05rem;
        font-weight: 700;
      }
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 920px) {
      .grid-2-cols {
        grid-template-columns: 1fr;
      }
    }

    .compiler-mindset-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .mindset-title {
        font-size: 0.95rem;
        font-weight: 800;
        color: #f87171;
        margin-bottom: 8px;
      }

      p {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.5;
      }
    }

    .bad-instantiation-tag {
      background: rgba(239, 68, 68, 0.15);
      border: 1px dashed rgba(239, 68, 68, 0.4);
      padding: 6px 10px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #fca5a5;
      margin-top: 6px;
    }

    .lookup-inspector-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;

      .lookup-title {
        font-size: 0.92rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 4px;
      }

      .lookup-desc {
        font-size: 0.78rem;
        color: var(--text-muted);
        margin-bottom: 12px;
      }
    }

    .entity-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .entity-tab {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        color: var(--text-main);
      }

      &.active {
        background: var(--ts-blue);
        color: #fff;
        border-color: var(--ts-blue);
      }

      &.rejected.active {
        background: #ef4444;
        border-color: #ef4444;
      }
    }

    .resolution-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.82rem;

      &.rejected {
        border-color: rgba(239, 68, 68, 0.4);
        background: rgba(239, 68, 68, 0.05);
      }

      .res-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .res-label {
          color: var(--text-muted);
        }
      }

      .res-verdict {
        margin-top: 6px;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 0.78rem;

        &.good {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        &.bad {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }
      }
    }

    .key-rule-box {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);

      .rule-icon {
        font-size: 1.5rem;
      }

      h4 {
        font-size: 0.92rem;
        font-weight: 700;
        color: #fbbf24;
        margin-bottom: 4px;
      }

      p {
        font-size: 0.82rem;
        color: var(--text-main);
        line-height: 1.5;
      }
    }
  `]
})
export class GenericConstraintsComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly showConstraintSolution = signal<boolean>(false);
  readonly selectedEntity = signal<'Produit' | 'Client' | 'Coordonnees'>('Produit');
}
