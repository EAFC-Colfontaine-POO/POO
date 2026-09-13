import { Component, signal } from '@angular/core';

interface CliStep {
  step: number;
  title: string;
  badge: string;
  commands: string[];
  output: string[];
  explanation: string;
}

interface TsConfigKey {
  key: string;
  value: string;
  description: string;
  pedagogicalFocus: string;
  recommendedValue: string;
}

@Component({
  selector: 'app-tooling-cli',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Module 2 — Environnement & Outillage</div>
        <h2>Environnement de Travail : Compilateur tsc & tsconfig.json</h2>
        <p class="module-desc">
          Comprenez comment installer TypeScript, compiler vos fichiers vers du JavaScript exécutable par Node.js,
          et configurer le compilateur pour bénéficier d'une rigueur maximale dès le début de votre apprentissage.
        </p>
      </div>

      <!-- Section 1 : Simulateur de Terminal CLI Pas-à-Pas -->
      <div class="card-panel cli-simulator-section">
        <div class="section-title-row">
          <div>
            <h3>Simulateur de Terminal CLI : Les 3 flux d'exécution</h3>
            <p class="section-sub">Testez interactivement les commandes en cliquant sur chaque étape pour voir les sorties console.</p>
          </div>
        </div>

        <!-- Sélecteur d'étapes -->
        <div class="steps-nav">
          @for (s of cliSteps; track s.step; let idx = $index) {
            <button 
              class="step-nav-btn" 
              [class.active]="activeStepIndex() === idx"
              (click)="activeStepIndex.set(idx)"
            >
              <span class="step-num">{{ s.step }}</span>
              <div class="step-text">
                <span class="step-title">{{ s.title }}</span>
                <span class="step-badge">{{ s.badge }}</span>
              </div>
            </button>
          }
        </div>

        <!-- Affichage du Terminal CLI Actif -->
        <div class="terminal-card">
          <div class="terminal-bar">
            <div class="dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="bar-title">Terminal Bash — {{ activeStep().badge }}</span>
          </div>

          <div class="terminal-screen">
            @for (cmd of activeStep().commands; track cmd; let cIdx = $index) {
              <div class="cmd-line">
                <span class="prompt">$</span>
                <span class="command-text">{{ cmd }}</span>
              </div>
            }

            <div class="terminal-output">
              @for (out of activeStep().output; track out) {
                <div class="out-line">{{ out }}</div>
              }
            </div>
          </div>
        </div>

        <!-- Explication de l'étape -->
        <div class="step-explanation-box">
          <div class="box-icon">📌</div>
          <div class="box-text">
            <strong>Explication du flux :</strong>
            {{ activeStep().explanation }}
          </div>
        </div>
      </div>

      <!-- Section 2 : Inspecteur de tsconfig.json -->
      <div class="card-panel tsconfig-section">
        <div class="section-title-row">
          <div>
            <h3>Inspecteur de tsconfig.json : Anatomie du fichier de configuration</h3>
            <p class="section-sub">Généré avec <code>tsc --init</code>, il pilote les règles imposées par le compilateur au projet entier.</p>
          </div>
        </div>

        <!-- Focus Pédagogique sur "strict": true -->
        <div class="strict-highlight-card">
          <div class="strict-header">
            <span class="strict-badge">🎯 FOCUS PÉDAGOGIQUE ESSENTIEL</span>
            <h4>Pourquoi impose-t-on toujours <code>"strict": true</code> aux étudiants ?</h4>
          </div>
          <p class="strict-body">
            Par défaut sans le mode strict, TypeScript accepte des approximations dangereuses (variables sans type devenant implicitement <code>any</code>, absence de vérification sur <code>null</code> et <code>undefined</code>).
            En activant <strong><code>"strict": true</code></strong>, vous forcez l'adoption immédiate des <strong>bonnes pratiques professionnelles</strong> :
            chaque variable est sûre, chaque risque de plantage sur une valeur non définie est anticipé, et vous tirez 100% de la puissance de TypeScript.
          </p>
        </div>

        <!-- Tableau interactif des options tsconfig -->
        <div class="tsconfig-grid">
          <div class="options-list">
            <div class="list-title">Options clés du compilateur :</div>
            @for (opt of tsconfigOptions; track opt.key; let idx = $index) {
              <button 
                class="option-item-btn" 
                [class.active]="selectedOptionIndex() === idx"
                (click)="selectedOptionIndex.set(idx)"
              >
                <div class="opt-name-col">
                  <code>"{{ opt.key }}"</code>
                  <span class="opt-val">{{ opt.value }}</span>
                </div>
                <span class="opt-arrow">→</span>
              </button>
            }
          </div>

          <!-- Détail de l'option sélectionnée -->
          <div class="option-detail-card">
            <div class="detail-header">
              <span class="badge badge-ts">Propriété</span>
              <h3>"{{ currentOption().key }}": {{ currentOption().value }}</h3>
            </div>
            <div class="detail-row">
              <span class="detail-label">Rôle technique :</span>
              <p class="detail-value">{{ currentOption().description }}</p>
            </div>
            <div class="detail-row">
              <span class="detail-label">Intérêt pour l'apprentissage :</span>
              <p class="detail-value highlight">{{ currentOption().pedagogicalFocus }}</p>
            </div>
            <div class="detail-row">
              <span class="detail-label">Valeur recommandée pour vos cours :</span>
              <code>{{ currentOption().recommendedValue }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cli-simulator-section, .tsconfig-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .section-sub {
        font-size: 0.84rem;
        color: var(--text-muted);
      }
    }

    .steps-nav {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;
    }

    .step-nav-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      text-align: left;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-card-hover);
        border-color: var(--border-focus);
      }

      &.active {
        background: rgba(49, 120, 198, 0.15);
        border-color: var(--ts-blue);

        .step-num {
          background: var(--ts-blue);
          color: #ffffff;
        }

        .step-title {
          color: var(--ts-blue-light);
          font-weight: 700;
        }
      }
    }

    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .step-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .step-title {
      font-size: 0.85rem;
      color: var(--text-main);
    }

    .step-badge {
      font-size: 0.72rem;
      color: var(--text-dim);
    }

    .terminal-card {
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .terminal-bar {
      background: var(--terminal-header);
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border-color);

      .dots {
        display: flex;
        gap: 6px;

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          &.red { background: #ef4444; }
          &.yellow { background: #f59e0b; }
          &.green { background: #10b981; }
        }
      }

      .bar-title {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-muted);
      }
    }

    .terminal-screen {
      padding: 16px;
      font-family: var(--font-mono);
      font-size: 0.86rem;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 150px;
    }

    .cmd-line {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #60a5fa;

      .prompt {
        color: #10b981;
        font-weight: 700;
      }

      .command-text {
        color: #f8fafc;
        font-weight: 600;
      }
    }

    .terminal-output {
      display: flex;
      flex-direction: column;
      gap: 3px;
      color: #94a3b8;
      padding-left: 18px;
    }

    .out-line {
      line-height: 1.4;
    }

    .step-explanation-box {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--bg-subtle);
      border-left: 3px solid var(--ts-blue);
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 0.88rem;
      line-height: 1.5;

      .box-icon {
        font-size: 1.2rem;
      }

      strong {
        color: var(--text-main);
      }
    }

    .strict-highlight-card {
      background: linear-gradient(135deg, rgba(221, 0, 49, 0.08), rgba(49, 120, 198, 0.08));
      border: 1px solid rgba(221, 0, 49, 0.3);
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .strict-badge {
        font-size: 0.7rem;
        font-weight: 800;
        color: #dd0031;
        letter-spacing: 0.05em;
      }

      h4 {
        font-size: 1.05rem;
        color: var(--text-main);

        code {
          background: rgba(221, 0, 49, 0.15);
          color: #f87171;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }

      .strict-body {
        font-size: 0.88rem;
        line-height: 1.5;
        color: var(--text-muted);

        strong {
          color: var(--text-main);
        }
      }
    }

    .tsconfig-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 16px;
      margin-top: 8px;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .list-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-dim);
        margin-bottom: 4px;
      }
    }

    .option-item-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-card-hover);
        border-color: var(--border-focus);
      }

      &.active {
        background: rgba(49, 120, 198, 0.15);
        border-color: var(--ts-blue);

        code {
          color: var(--ts-blue-light);
          font-weight: 700;
        }
      }

      .opt-name-col {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
      }

      .opt-val {
        font-size: 0.72rem;
        color: var(--text-dim);
      }

      .opt-arrow {
        color: var(--text-dim);
      }
    }

    .option-detail-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .detail-header {
        display: flex;
        align-items: center;
        gap: 10px;

        h3 {
          font-family: var(--font-mono);
          font-size: 1.1rem;
          color: var(--text-main);
        }
      }

      .detail-row {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .detail-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .detail-value {
          font-size: 0.88rem;
          color: var(--text-main);
          line-height: 1.5;

          &.highlight {
            color: #38bdf8;
          }
        }

        code {
          background: var(--bg-code);
          border: 1px solid var(--border-color);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #34d399;
          width: fit-content;
        }
      }
    }
  `]
})
export class ToolingCliComponent {
  readonly activeStepIndex = signal<number>(0);
  readonly selectedOptionIndex = signal<number>(0);

  readonly cliSteps: CliStep[] = [
    {
      step: 1,
      title: "Installation & Vérification",
      badge: "npm install & tsc --version",
      commands: [
        "npm install -g typescript",
        "tsc --version"
      ],
      output: [
        "added 1 package in 1.2s",
        "Version 5.8.2"
      ],
      explanation: "TypeScript s'installe globalement via npm (Node Package Manager). La commande tsc (TypeScript Compiler) devient immédiatement accessible dans tout terminal pour vérifier la version installée."
    },
    {
      step: 2,
      title: "Le Flux Traditionnel (2 Étapes)",
      badge: "tsc main.ts && node main.js",
      commands: [
        "tsc main.ts",
        "node main.js"
      ],
      output: [
        "[INFO] Fichier main.js généré sans erreur avec succès.",
        "Bonjour le monde depuis TypeScript !"
      ],
      explanation: "C'est le flux standard de production : tsc transpile le code source main.ts en un fichier JavaScript classique main.js sur votre disque dur. Ensuite, Node.js (ou le navigateur) exécute le fichier .js généré."
    },
    {
      step: 3,
      title: "Le Raccourci d'Apprentissage",
      badge: "ts-node main.ts",
      commands: [
        "npm install -g ts-node",
        "ts-node main.ts"
      ],
      output: [
        "[ts-node] Transpilation en mémoire vive...",
        "Bonjour le monde depuis TypeScript !"
      ],
      explanation: "ts-node combine compilation et exécution à la volée en mémoire, sans créer de fichier .js intermédiaire sur le disque. C'est le moyen le plus rapide de tester vos scripts pendant les séances d'exercices !"
    }
  ];

  readonly tsconfigOptions: TsConfigKey[] = [
    {
      key: "strict",
      value: "true",
      description: "Active l'ensemble des vérifications strictes du compilateur (noImplicitAny, strictNullChecks, etc.).",
      pedagogicalFocus: "Obligatoire en apprentissage pour interdire les types any non voulus et habituer les étudiants à déclarer des types rigoureux dès le premier jour.",
      recommendedValue: `"strict": true`
    },
    {
      key: "target",
      value: `"ES2022"`,
      description: "Définit la version de JavaScript ciblée pour le code généré (ex: ES5, ES2020, ES2022).",
      pedagogicalFocus: "Permet de générer du code moderne (classes, arrow functions, template literals) sans alourdir avec des polyfills obsolètes.",
      recommendedValue: `"target": "ES2022"`
    },
    {
      key: "module",
      value: `"commonjs"`,
      description: "Spécifie le système de modules pour l'organisation des fichiers (CommonJS pour Node.js classique, ou NodeNext / ESNext pour les modules ES modernes).",
      pedagogicalFocus: "Détermine la syntaxe d'import/export générée dans les fichiers JavaScript cibles.",
      recommendedValue: `"module": "commonjs"`
    },
    {
      key: "outDir",
      value: `"./dist"`,
      description: "Dossier où sont déposés les fichiers .js transpilés.",
      pedagogicalFocus: "Évite de polluer les dossiers sources avec des fichiers JavaScript doublons.",
      recommendedValue: `"outDir": "./dist"`
    },
    {
      key: "rootDir",
      value: `"./src"`,
      description: "Dossier racine contenant exclusivement les fichiers sources TypeScript (.ts).",
      pedagogicalFocus: "Assure une séparation nette entre le code de développement (.ts) et les artefacts de build (.js).",
      recommendedValue: `"rootDir": "./src"`
    }
  ];

  activeStep(): CliStep {
    return this.cliSteps[this.activeStepIndex()];
  }

  currentOption(): TsConfigKey {
    return this.tsconfigOptions[this.selectedOptionIndex()];
  }
}
