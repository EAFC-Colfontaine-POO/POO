import { Component, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TerminalLine {
  text: string;
  type: 'cmd' | 'output' | 'success' | 'warn' | 'error' | 'info';
}

@Component({
  selector: 'app-cli-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Outillage & CLI — Ligne de Commande Officielle (@angular/cli)</div>
        <h2>7. Console Virtuelle du CLI Angular</h2>
        <p class="module-desc">
          Le <strong>CLI Angular</strong> est le couteau suisse indispensable du développeur : il scaffold, compile, sert et optimise vos applications.
          Exécutez ou tapez les commandes clés : <code>ng serve</code> (avec simulation de Live Reload), <code>ng generate component</code> 
          (génération automatique des 4 fichiers) et <code>ng build</code> (minification et production dans <code>dist/</code>).
        </p>
      </div>

      <!-- Barre de commandes rapides -->
      <div class="quick-commands-bar card-panel">
        <div class="quick-label">⚡ Raccourcis commandes :</div>
        <div class="quick-btns">
          <button class="q-btn" (click)="runQuickCommand('ng serve')" [disabled]="isServing()">
            🚀 ng serve (Lancer Serveur)
          </button>
          <button class="q-btn" (click)="runQuickCommand('ng generate component components/header')">
            🧩 ng generate component
          </button>
          <button class="q-btn" (click)="runQuickCommand('ng build')">
            📦 ng build (Production)
          </button>
          <button class="q-btn" (click)="runQuickCommand('ng test')">
            🧪 ng test (Tests Unitaires)
          </button>
          <button class="q-btn" (click)="runQuickCommand('ng version')">
            🅰️ ng version
          </button>
          <button class="q-btn q-btn-danger" (click)="clearTerminal()">
            🧹 clear
          </button>
        </div>
      </div>

      <!-- Terminal Simulé -->
      <div class="terminal-wrapper card-panel">
        <div class="terminal-topbar">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="terminal-title">
            bash — cchiodo&#64;angular-dev: ~/mon-projet-angular
          </div>
          <div class="terminal-actions">
            @if (isServing()) {
              <span class="badge badge-success pulse-badge">● Serveur Actif (Port 4200)</span>
              <button class="stop-server-btn" (click)="stopServer()">Arrêter (Ctrl + C)</button>
            }
          </div>
        </div>

        <!-- Corps du terminal -->
        <div #terminalBody class="terminal-body">
          @for (line of history(); track $index) {
            <div class="term-line" [ngClass]="'term-' + line.type">
              @if (line.type === 'cmd') {
                <span class="prompt-prefix">cchiodo&#64;angular-dev:~/mon-projet-angular$</span>
                <span class="cmd-text">{{ line.text }}</span>
              } @else {
                <span class="output-text">{{ line.text }}</span>
              }
            </div>
          }

          <!-- Ligne d'invite active -->
          <div class="active-prompt-line">
            <span class="prompt-prefix">cchiodo&#64;angular-dev:~/mon-projet-angular$</span>
            <input 
              #cliInput
              type="text" 
              class="terminal-input" 
              [(ngModel)]="currentInput" 
              (keydown.enter)="executeCurrentInput()"
              placeholder="Tapez une commande (ex. ng serve, ng build, clear)..."
            />
          </div>
        </div>

        <!-- Si ng serve est actif : panneau d'interaction Live Reload -->
        @if (isServing()) {
          <div class="server-active-banner">
            <div class="banner-left">
              <span class="live-dot"></span>
              <span>Le serveur de dev tourne sur <strong>http://localhost:4200</strong></span>
            </div>
            <button class="live-reload-btn" (click)="triggerLiveReload()">
              ⚡ Simuler une modification dans app.component.html (Live Reload)
            </button>
          </div>
        }
      </div>

      <!-- Fiches explicatives pédagogiques des commandes -->
      <div class="commands-guide-grid">
        <div class="card-panel guide-card">
          <div class="guide-header">
            <code>ng serve</code> (ou <code>npm start</code>)
          </div>
          <p class="guide-text">
            Compile en mémoire l'application via le bundler Vite/esbuild et lance un serveur web local sur le port 4200.
            Surveille les fichiers en direct et recharge à chaud l'interface lors de toute modification (<em>Hot Module Replacement / Live Reload</em>).
          </p>
        </div>

        <div class="card-panel guide-card">
          <div class="guide-header">
            <code>ng generate component &lt;nom&gt;</code>
          </div>
          <p class="guide-text">
            Scaffold automatiquement les 4 fichiers constitutifs du composant (<code>.ts</code>, <code>.html</code>, <code>.css</code>, <code>.spec.ts</code>) 
            avec les conventions et métadonnées Standalone recommandées par l'équipe Google Angular.
          </p>
        </div>

        <div class="card-panel guide-card">
          <div class="guide-header">
            <code>ng build</code>
          </div>
          <p class="guide-text">
            Génère le dossier <code>dist/</code> optimisé pour le déploiement en production : minification du code, 
            élimination de code mort (<em>Tree-Shaking</em>), hachage des noms de fichiers pour la gestion du cache navigateur.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quick-commands-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      flex-wrap: wrap;

      .quick-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-dim);
      }

      .quick-btns {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .q-btn {
        padding: 5px 12px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.76rem;
        font-weight: 600;
        color: var(--text-muted);

        &:hover:not(:disabled) {
          background: var(--bg-card-hover);
          color: var(--text-main);
          border-color: #dd0031;
        }

        &.q-btn-danger:hover {
          border-color: #ef4444;
          color: #f87171;
        }
      }
    }

    .terminal-wrapper {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      min-height: 440px;
    }

    .terminal-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: var(--terminal-header, #121826);
      border-bottom: 1px solid var(--border-color);

      .terminal-dots {
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

      .terminal-title {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-dim);
      }

      .terminal-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }

    .pulse-badge {
      animation: pulse 2s infinite;
    }

    .stop-server-btn {
      font-size: 0.72rem;
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #ef4444;
      color: #f87171;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;

      &:hover {
        background: #ef4444;
        color: #ffffff;
      }
    }

    .terminal-body {
      flex: 1;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #e2e8f0;
      overflow-y: auto;
      max-height: 480px;
    }

    .term-line {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      line-height: 1.45;

      &.term-cmd { color: #f8fafc; font-weight: 600; }
      &.term-output { color: #cbd5e1; }
      &.term-success { color: #34d399; }
      &.term-warn { color: #fbbf24; }
      &.term-error { color: #f87171; }
      &.term-info { color: #38bdf8; }
    }

    .prompt-prefix {
      color: #10b981;
      font-weight: 700;
    }

    .cmd-text {
      color: #ffffff;
    }

    .output-text {
      white-space: pre-wrap;
      word-break: break-word;
    }

    .active-prompt-line {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;

      .terminal-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #ffffff;
        font-family: var(--font-mono);
        font-size: 0.8rem;
      }
    }

    .server-active-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: rgba(16, 185, 129, 0.12);
      border-top: 1px solid #10b981;

      .banner-left {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.82rem;
        color: var(--text-main);

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }
      }

      .live-reload-btn {
        background: #10b981;
        color: #ffffff;
        font-size: 0.78rem;
        font-weight: 600;
        padding: 5px 12px;
        border-radius: 6px;

        &:hover {
          background: #059669;
        }
      }
    }

    /* Guide des commandes */
    .commands-guide-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .guide-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;

      .guide-header {
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--text-main);

        code {
          color: #dd0031;
        }
      }

      .guide-text {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
        margin: 0;
      }
    }
  `]
})
export class CliTerminalComponent implements AfterViewChecked {
  @ViewChild('terminalBody') private terminalBodyRef!: ElementRef<HTMLDivElement>;

  readonly isServing = signal<boolean>(false);
  readonly history = signal<TerminalLine[]>([
    { text: 'Bienvenue dans la console de simulation Angular CLI (@angular/cli).', type: 'info' },
    { text: 'Tapez une commande ou cliquez sur les raccourcis ci-dessus pour expérimenter.', type: 'output' }
  ]);

  currentInput = '';

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.terminalBodyRef) {
        this.terminalBodyRef.nativeElement.scrollTop = this.terminalBodyRef.nativeElement.scrollHeight;
      }
    } catch {
      // Ignorer
    }
  }

  runQuickCommand(cmd: string): void {
    this.currentInput = cmd;
    this.executeCurrentInput();
  }

  executeCurrentInput(): void {
    const raw = this.currentInput.trim();
    if (!raw) return;

    this.history.update(h => [...h, { text: raw, type: 'cmd' }]);
    this.currentInput = '';

    const cmd = raw.toLowerCase();

    if (cmd === 'clear' || cmd === 'cls') {
      this.clearTerminal();
      return;
    }

    if (cmd === 'ng serve' || cmd === 'npm start' || cmd === 'ng s') {
      this.simulateNgServe();
      return;
    }

    if (cmd.startsWith('ng generate component') || cmd.startsWith('ng g c')) {
      this.simulateNgGenerate();
      return;
    }

    if (cmd === 'ng build' || cmd === 'npm run build') {
      this.simulateNgBuild();
      return;
    }

    if (cmd === 'ng test' || cmd === 'npm test') {
      this.simulateNgTest();
      return;
    }

    if (cmd === 'ng version' || cmd === 'ng v') {
      this.simulateNgVersion();
      return;
    }

    if (cmd === 'help') {
      this.history.update(h => [
        ...h,
        { text: 'Commandes disponibles :', type: 'info' },
        { text: '  ng serve                                    - Démarre le serveur local de dev (port 4200)', type: 'output' },
        { text: '  ng generate component components/<nom>      - Crée un composant Standalone et ses 4 fichiers', type: 'output' },
        { text: '  ng build                                    - Compile pour la production dans dist/', type: 'output' },
        { text: '  ng test                                     - Lance la suite de tests unitaires', type: 'output' },
        { text: '  ng version                                  - Affiche les versions d\'Angular et Node.js', type: 'output' },
        { text: '  clear                                       - Nettoie la console', type: 'output' }
      ]);
      return;
    }

    // Commande inconnue
    this.history.update(h => [
      ...h,
      { text: `Commande inconnue : "${raw}". Tapez "help" ou utilisez les boutons raccourcis.`, type: 'error' }
    ]);
  }

  private simulateNgServe(): void {
    if (this.isServing()) {
      this.history.update(h => [...h, { text: 'Le serveur est déjà en cours d\'exécution sur le port 4200.', type: 'warn' }]);
      return;
    }

    this.history.update(h => [
      ...h,
      { text: 'Initialisation de la compilation Vite / esbuild...', type: 'output' },
      { text: 'Application bundle generation complete. [0.384 seconds]', type: 'info' },
      { text: 'Initial chunk files | Names         | Raw size', type: 'output' },
      { text: 'main.js             | main          | 194.20 kB | ', type: 'output' },
      { text: 'styles.css          | styles        |  28.45 kB | ', type: 'output' },
      { text: 'polyfills.js        | polyfills     |  34.12 kB | ', type: 'output' },
      { text: '** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **', type: 'success' },
      { text: 'Application en écoute des modifications de fichiers (Live Reload activé)...', type: 'info' }
    ]);

    this.isServing.set(true);
  }

  stopServer(): void {
    this.isServing.set(false);
    this.history.update(h => [
      ...h,
      { text: '^C', type: 'cmd' },
      { text: 'Serveur de développement arrêté.', type: 'warn' }
    ]);
  }

  triggerLiveReload(): void {
    this.history.update(h => [
      ...h,
      { text: '[vite] hmr update /src/app/app.component.html', type: 'info' },
      { text: 'Application bundle generation complete. [0.024 seconds]', type: 'success' },
      { text: 'Rechargement instantané du navigateur effectué sans perte d\'état (HMR).', type: 'output' }
    ]);
  }

  private simulateNgGenerate(): void {
    this.history.update(h => [
      ...h,
      { text: 'CREATE src/app/components/header/header.component.html (24 bytes)', type: 'success' },
      { text: 'CREATE src/app/components/header/header.component.spec.ts (602 bytes)', type: 'success' },
      { text: 'CREATE src/app/components/header/header.component.ts (224 bytes)', type: 'success' },
      { text: 'CREATE src/app/components/header/header.component.css (0 bytes)', type: 'success' },
      { text: '✔ Composant HeaderComponent Standalone généré avec succès dans components/header !', type: 'info' },
      { text: '💡 Rappel : N\'oubliez pas d\'importer HeaderComponent dans imports: [HeaderComponent] de AppComponent.', type: 'warn' }
    ]);
  }

  private simulateNgBuild(): void {
    this.history.update(h => [
      ...h,
      { text: 'Building for production with minification, tree-shaking and dead code elimination...', type: 'output' },
      { text: '✔ Browser application bundle generation complete.', type: 'info' },
      { text: '✔ Copying assets complete.', type: 'info' },
      { text: '✔ Index html generation complete.', type: 'info' },
      { text: 'Output directory: dist/mon-projet-angular/browser', type: 'output' },
      { text: 'Initial chunk files | Names         | Raw size  | Estimated transfer size', type: 'output' },
      { text: 'main-7XZ89.js       | main          | 142.10 kB | 41.25 kB', type: 'success' },
      { text: 'polyfills-A1B2.js   | polyfills     |  33.40 kB | 10.80 kB', type: 'success' },
      { text: 'styles-C3D4.css     | styles        |  14.20 kB |  3.90 kB', type: 'success' },
      { text: '✔ Build optimisé réussi ! Les fichiers prêts pour le serveur de production se trouvent dans dist/.', type: 'success' }
    ]);
  }

  private simulateNgTest(): void {
    this.history.update(h => [
      ...h,
      { text: 'Exécution des tests unitaires via le runner de test...', type: 'output' },
      { text: 'PASS src/app/app.component.spec.ts (1 test)', type: 'success' },
      { text: '  ✓ AppComponent should create the app (18 ms)', type: 'success' },
      { text: 'Test Suites: 1 passed, 1 total', type: 'info' },
      { text: 'Tests:       1 passed, 1 total', type: 'success' },
      { text: 'Snapshots:   0 total', type: 'output' },
      { text: 'Time:        0.652 s', type: 'output' }
    ]);
  }

  private simulateNgVersion(): void {
    this.history.update(h => [
      ...h,
      { text: `     _                      _                 ____ _     ___
    / \\   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \\ | '_ \\ / _\` | | | | |/ _\` | '__|   | |   | |    | |
  / ___ \\| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \\_\\_| |_|\\__, |\\__,_|_|\\__,_|_|       \\____|_____|___|
                |___/`, type: 'info' },
      { text: 'Angular CLI: 22.1.7', type: 'output' },
      { text: 'Node: 24.20.0', type: 'output' },
      { text: 'Package Manager: npm 11.19.0', type: 'output' },
      { text: 'OS: linux x64', type: 'output' },
      { text: 'Angular: 22.1.0', type: 'success' }
    ]);
  }

  clearTerminal(): void {
    this.history.set([]);
  }
}
