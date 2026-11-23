import { Component, signal, computed } from '@angular/core';

interface BugTrap {
  id: number;
  title: string;
  category: string;
  symptom: string;
  brokenCode: string;
  cleanCode: string;
  explanation: string;
  resolved: boolean;
}

@Component({
  selector: 'app-antipattern-scanner',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 13 · Module 07</span>
          <span class="badge badge-danger">Diagnostic de Bugs</span>
          <span class="badge badge-warning">6 Pièges Juniors</span>
          <span class="badge badge-success">{{ resolvedCount() }} / 6 Résolus</span>
        </div>
        <h2>Le Scanner d'Anti-Patterns Réactifs (Diagnostic & Résolution)</h2>
        <p class="module-desc">
          Identifiez en un coup d'œil les 6 erreurs classiques commises par les développeurs juniors lors du passage aux signaux. Cliquez sur chaque cas pour analyser les symptômes, inspecter le piège et révéler la solution architecturale.
        </p>
      </div>

      <div class="scanner-workbench">
        <!-- Grille des 6 Pièges -->
        <div class="traps-grid">
          @for (trap of traps(); track trap.id) {
            <div 
              class="card-panel trap-card" 
              [class.active]="selectedTrapId() === trap.id"
              [class.resolved]="trap.resolved"
              (click)="selectTrap(trap.id)"
            >
              <div class="trap-head">
                <span class="trap-num">#0{{ trap.id }}</span>
                <span class="badge" [class.badge-danger]="!trap.resolved" [class.badge-success]="trap.resolved">
                  {{ trap.resolved ? '✔ Neutralisé' : '⚠ Piège Actif' }}
                </span>
              </div>
              <h4 class="trap-title">{{ trap.title }}</h4>
              <p class="trap-symptom">{{ trap.symptom }}</p>
            </div>
          }
        </div>

        <!-- Panneau de Diagnostic & Résolution détaillée -->
        <div class="card-panel inspector-panel mt-3">
          <div class="inspector-header">
            <div>
              <span class="badge badge-purple">{{ activeTrap().category }} · Piège #0{{ activeTrap().id }}</span>
              <h3 class="inspector-title">{{ activeTrap().title }}</h3>
            </div>
            <button 
              class="btn-primary btn-sm" 
              (click)="toggleResolve(activeTrap().id)"
            >
              {{ activeTrap().resolved ? 'Marquer comme non résolu' : '🎯 Diagnostiquer & Neutraliser' }}
            </button>
          </div>

          <div class="symptom-banner mt-3">
            <strong>🚨 Symptôme constaté :</strong> {{ activeTrap().symptom }}
          </div>

          <div class="code-comparison-grid mt-3">
            <!-- Code Cassé -->
            <div class="code-block broken">
              <div class="block-title text-danger">❌ Code Cassé (Anti-Pattern) :</div>
              <pre><code>{{ activeTrap().brokenCode }}</code></pre>
            </div>

            <!-- Code Corrigé -->
            <div class="code-block clean">
              <div class="block-title text-success">✅ Code Corrigé (Bonne Pratique) :</div>
              <pre><code>{{ activeTrap().cleanCode }}</code></pre>
            </div>
          </div>

          <!-- Explication technique approfondie -->
          <div class="explanation-box mt-3">
            <div class="exp-title">🔬 Diagnostic & Règle d'Ingénierie :</div>
            <p>{{ activeTrap().explanation }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scanner-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .traps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;

      @media (max-width: 1000px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 650px) {
        grid-template-columns: 1fr;
      }
    }

    .trap-card {
      padding: 14px 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        border-color: var(--bs-purple);
      }

      &.active {
        border-color: var(--bs-purple-light);
        background: rgba(121, 82, 179, 0.08);
        box-shadow: 0 4px 14px rgba(121, 82, 179, 0.3);
      }

      &.resolved {
        border-color: rgba(16, 185, 129, 0.4);
      }
    }

    .trap-head {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .trap-num {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        font-weight: 800;
        color: var(--text-dim);
      }
    }

    .trap-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .trap-symptom {
      font-size: 0.74rem;
      color: var(--text-muted);
      line-height: 1.35;
    }

    .inspector-panel {
      padding: 20px;
    }

    .inspector-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;

      .inspector-title {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-main);
        margin-top: 4px;
      }
    }

    .symptom-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 0.84rem;
      color: #fca5a5;
    }

    .code-comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .code-block {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .block-title {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 8px 12px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-color);
      }

      pre {
        margin: 0;
        padding: 12px;
        font-size: 0.76rem;
        line-height: 1.45;
      }

      &.broken { border-color: rgba(239, 68, 68, 0.4); }
      &.clean { border-color: rgba(16, 185, 129, 0.4); }
    }

    .explanation-box {
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 14px;
      border: 1px solid var(--border-color);

      .exp-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--bs-purple-light);
        margin-bottom: 4px;
      }

      p {
        font-size: 0.84rem;
        color: var(--text-main);
        line-height: 1.5;
        margin: 0;
      }
    }
  `]
})
export class AntipatternScannerComponent {
  readonly selectedTrapId = signal<number>(1);

  readonly traps = signal<BugTrap[]>([
    {
      id: 1,
      title: 'Omission des parenthèses () à la lecture',
      category: 'Syntaxe de Lecture',
      symptom: 'Le template affiche "[Function: signal]" ou "function() { ... }" au lieu de la valeur.',
      brokenCode: `<!-- Dans le template HTML -->\n<p>Score : {{ compteur }}</p>\n\n// En TypeScript :\nconst total = this.compteur + 10;`,
      cleanCode: `<!-- Dans le template HTML -->\n<p>Score : {{ compteur() }}</p>\n\n// En TypeScript :\nconst total = this.compteur() + 10;`,
      explanation: 'Un signal est un accesseur fonctionnel. Si vous omettez les parenthèses, vous manipulez la référence de l\'objet fonction, et non la valeur encapsulée. De plus, l\'hameçon réactif n\'est pas posé et le graphe ignore l\'abonnement.',
      resolved: false
    },
    {
      id: 2,
      title: 'Mutation d\'un tableau en place via .push()',
      category: 'Modèle Mémoire (Pile/Tas)',
      symptom: 'L\'utilisateur clique pour ajouter un article, la console montre le tableau modifié, mais l\'écran reste figé !',
      brokenCode: `const panier = signal<string[]>(['Pomme']);\n\n// Mutation directe de la référence 0x10A :\npanier().push('Poire');\npanier.set(panier());`,
      cleanCode: `const panier = signal<string[]>(['Pomme']);\n\n// Allocation d'une nouvelle adresse 0x20B :\npanier.update(items => [...items, 'Poire']);`,
      explanation: 'Angular compare l\'ancienne et la nouvelle référence via Object.is(). Comme .push() mute le tableau sur place dans le Tas, l\'adresse dans la Pile ne change pas (0x10A === 0x10A). Angular déduit que rien n\'a bougé et ne repeint rien !',
      resolved: false
    },
    {
      id: 3,
      title: 'Écriture dans un signal depuis un effect()',
      category: 'Boucle Réactive & Sécurité',
      symptom: 'Crash de l\'application au chargement avec l\'erreur fatale NG0600 : Writing to signals is forbidden.',
      brokenCode: `const prix = signal(50);\nconst quantite = signal(2);\nconst total = signal(0);\n\neffect(() => {\n  total.set(prix() * quantite()); // 💥 NG0600 !\n});`,
      cleanCode: `const prix = signal(50);\nconst quantite = signal(2);\n\n// Remplacer l'effet par une dérivation pure :\nconst total = computed(() => prix() * quantite());`,
      explanation: 'Angular bloque par défaut toute écriture dans un signal au sein d\'un effect() afin de prévenir les boucles infinies destructrices. Pour dériver une donnée d\'autres signaux, il faut impérativement utiliser computed().',
      resolved: false
    },
    {
      id: 4,
      title: 'Calcul impur ou appel asynchrone dans computed()',
      category: 'Fonctions Pures',
      symptom: 'Requêtes HTTP dupliquées, comportements aléatoires ou valeur indéfinie lors du premier affichage.',
      brokenCode: `const userProfile = computed(() => {\n  // ❌ Appel réseau ou effet de bord dans computed !\n  fetch('/api/user/' + userId());\n  return 'Chargé';\n});`,
      cleanCode: `// computed() doit être une projection mathématique PURE :\nconst nomComplet = computed(() => \n  prenom() + ' ' + nom().toUpperCase()\n);`,
      explanation: 'La fonction passée à computed() doit être déterministe et exempte de tout effet de bord (aucun appel HTTP, aucune écriture DOM). Si vous devez exécuter une action extérieure lors d\'un changement, utilisez effect().',
      resolved: false
    },
    {
      id: 5,
      title: 'Création de effect() hors contexte d\'injection',
      category: 'Injection de Dépendances',
      symptom: 'Erreur runtime lors du clic sur un bouton : NG0203: effect() can only be used within an injection context.',
      brokenCode: `class UserComponent {\n  onSaveClick(): void {\n    // 💥 Hors du constructor / champ de classe !\n    effect(() => {\n      console.log(this.user());\n    });\n  }\n}`,
      cleanCode: `class UserComponent {\n  constructor() {\n    // ✅ Contexte d'injection valide :\n    effect(() => {\n      console.log(this.user());\n    });\n  }\n}`,
      explanation: 'effect() a impérativement besoin de s\'accrocher au cycle de vie du composant pour être détruit lorsque celui-ci quitte l\'écran (prévention des fuites mémoire). Il doit donc être déclaré dans le constructor() ou à l\'initialisation d\'un champ.',
      resolved: false
    },
    {
      id: 6,
      title: 'Dépendance circulaire entre signaux',
      category: 'Topologie du Graphe (DAG)',
      symptom: 'Crash avec "Maximum call stack size exceeded" et blocage complet de l\'onglet de navigateur.',
      brokenCode: `// A dépend de B qui dépend de A :\nconst a = computed(() => b() + 1);\nconst b = computed(() => a() * 2); // 💥 Boucle infinie !`,
      cleanCode: `// Graphe Acyclique Strict (DAG) :\nconst source = signal(10);\nconst a = computed(() => source() + 1);\nconst b = computed(() => a() * 2);`,
      explanation: 'Le graphe de dépendances d\'Angular doit être strictement acyclique (DAG). Deux signaux ne peuvent jamais dépendre mutuellement l\'un de l\'autre. Le flux de données doit être strictement unidirectionnel de la source vers les feuilles.',
      resolved: false
    }
  ]);

  readonly activeTrap = computed(() => {
    const id = this.selectedTrapId();
    return this.traps().find(t => t.id === id) || this.traps()[0];
  });

  readonly resolvedCount = computed(() => this.traps().filter(t => t.resolved).length);

  selectTrap(id: number): void {
    this.selectedTrapId.set(id);
  }

  toggleResolve(id: number): void {
    this.traps.update(list =>
      list.map(t => (t.id === id ? { ...t, resolved: !t.resolved } : t))
    );
  }
}
