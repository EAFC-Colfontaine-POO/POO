import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-objects-interfaces',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Module 8 — Modélisation & Contrats</div>
        <h2>Objets, Interfaces & Typage Structurel (Duck Typing)</h2>
        <p class="module-desc">
          Les interfaces sont l'outil numéro un pour décrire la forme de vos objets en TypeScript.
          Découvrez la puissance du <strong>typage structurel</strong> : si un objet ressemble à un canard et marche comme un canard, TypeScript le traite comme un canard !
        </p>
      </div>

      <!-- Onglets Mode : Théorie / Labo 6 -->
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
          <span>🧪 Atelier Pratique : Labo 6 (5 Défis Monaco)</span>
        </button>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Déclaration d'Interface -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>1. Déclaration d'Interface : Modéliser la forme d'un objet</h3>
              <p class="section-sub">Une interface décrit un contrat de forme sans générer aucun code JavaScript à l'exécution.</p>
            </div>
          </div>

          <div class="interfaces-grid">
            <div class="iface-card">
              <div class="card-top">
                <span class="badge badge-ts">interface Produit</span>
                <span class="iface-tag">Contrat de forme</span>
              </div>
              <pre><code>interface Produit {{ '{' }}
  readonly id: number;      // Ne peut être modifié après création
  nom: string;              // Propriété obligatoire
  prix: number;             // Propriété obligatoire
  description?: string;     // Propriété optionnelle (?)
{{ '}' }}</code></pre>
              <div class="card-footer-notes">
                <span class="note-bullet">🔒 <code>readonly</code></span> : Empêche toute réassignation ultérieure de l'identifiant.<br>
                <span class="note-bullet">❓ <code>?</code></span> : Permet d'omettre <code>description</code> sans erreur.
              </div>
            </div>

            <div class="iface-card">
              <div class="card-top">
                <span class="badge badge-success">Objet Conforme</span>
                <span class="iface-tag">Validé par le compilateur</span>
              </div>
              <pre><code>const livre: Produit = {{ '{' }}
  id: 101,
  nom: "Guide TypeScript",
  prix: 24.90
  // description est omise : parfaitement légal !
{{ '}' }};

livre.nom = "Guide TypeScript v5"; // ✔ Autorisé
// livre.id = 202; // ❌ ERREUR : readonly !</code></pre>
              <div class="card-footer-notes">
                Si vous oubliez <code>prix</code> ou saisissez <code>prix: "gratuit"</code>, l'éditeur souligne l'objet en rouge instantanément.
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Démonstrateur de Typage Structurel (Duck Typing) -->
        <div class="card-panel duck-typing-section">
          <div class="section-title-row">
            <div>
              <h3>2. Démonstrateur de Typage Structurel (Duck Typing)</h3>
              <p class="section-sub">Pourquoi TypeScript accepte-t-il un objet qui contient <em>plus</em> de propriétés que l'interface ?</p>
            </div>
          </div>

          <div class="duck-typing-box">
            <div class="duck-quote">
              🦆 <em>« Si ça ressemble à un canard, nage comme un canard et cancane comme un canard, alors c'est un canard. »</em>
            </div>

            <div class="duck-demo-grid">
              <div class="duck-col">
                <div class="col-title">1. Ce que la fonction demande :</div>
                <pre><code>interface Identifiable {{ '{' }}
  id: number;
  nom: string;
{{ '}' }}

function afficher(element: Identifiable): void {{ '{' }}
  console.log(element.nom);
{{ '}' }}</code></pre>
                <p class="duck-rule">La fonction exige <strong>au minimum</strong> les propriétés <code>id</code> et <code>nom</code>.</p>
              </div>

              <div class="duck-col">
                <div class="col-title">2. L'objet concret que vous lui passez :</div>
                <pre><code>const clientVIP = {{ '{' }}
  id: 42,
  nom: "Chloé",
  solde: 1500,     // Propriété en plus !
  role: "admin"    // Propriété en plus !
{{ '}' }};

// Est-ce valide ?
afficher(clientVIP); // ✔ OUI, 100% VALIDE !</code></pre>
                <p class="duck-rule success">
                  <strong>Résultat :</strong> TypeScript valide l'appel car <code>clientVIP</code> possède bien <code>id</code> et <code>nom</code>.
                  Les propriétés additionnelles ne gênent absolument pas l'exécution de la fonction !
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Signatures d'Index -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>3. Signatures d'Index : Typer un Dictionnaire Dynamique</h3>
              <p class="section-sub">Quand vous connaissez le type des clés et des valeurs, mais pas leurs noms à l'avance.</p>
            </div>
          </div>

          <div class="index-sig-grid">
            <div class="index-code-col">
              <pre><code>interface TableauScores {{ '{' }}
  // N'importe quel nom de joueur (string) associé à un score (number) :
  [nomJoueur: string]: number;
{{ '}' }}

const scores: TableauScores = {{ '{' }}
  "Alice": 150,
  "Bob": 120,
  "Charlie": 180
{{ '}' }};

// scores["Lucas"] = "cent"; // ❌ ERREUR : 'string' non assignable à 'number'</code></pre>
            </div>
            <div class="index-expl-col">
              <h4>Utilité pratique :</h4>
              <p>
                Idéal pour les structures de données de type map, dictionnaires de configuration ou caches où les clés sont générées dynamiquement par les utilisateurs.
              </p>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Labo 6 -->
        <app-lab-runner [targetLabNumber]="6"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .interfaces-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .iface-card {
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

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .iface-tag {
        font-size: 0.75rem;
        color: var(--text-dim);
      }
    }

    .card-footer-notes {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.4;

      .note-bullet {
        color: var(--text-main);
        font-weight: 600;
      }
    }

    .duck-typing-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 14px;
    }

    .duck-quote {
      background: rgba(49, 120, 198, 0.1);
      border-left: 3px solid var(--ts-blue);
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 0.88rem;
      color: var(--ts-blue-light);
      font-weight: 500;
    }

    .duck-demo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .duck-col {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .col-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-dim);
      }

      pre {
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        padding: 12px;
        border-radius: 6px;
        font-size: 0.82rem;
        color: var(--text-code);
      }

      .duck-rule {
        font-size: 0.82rem;
        color: var(--text-muted);

        &.success {
          color: #34d399;
        }
      }
    }

    .index-sig-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
      align-items: center;

      pre {
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        padding: 12px;
        border-radius: 6px;
        font-size: 0.82rem;
        color: var(--text-code);
      }

      .index-expl-col {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;

        h4 {
          font-size: 0.95rem;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        p {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
      }
    }
  `]
})
export class ObjectsInterfacesComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');
}
