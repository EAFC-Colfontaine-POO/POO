import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFileNode } from '../../core/models/app.models';

@Component({
  selector: 'app-tree-explorer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Organisation du Projet — Convention & Écosystème CLI</div>
        <h2>2. Explorateur d'Arborescence & Fichiers Clés</h2>
        <p class="module-desc">
          Découvrez la structure normalisée d'un projet Angular généré par le CLI (<code>@angular/cli</code>).
          Cliquez sur chaque fichier ou dossier pour inspecter son code type, son rôle architectural exact,
          sa fréquence de modification et les pièges classiques à éviter lors des examens.
        </p>
      </div>

      <div class="explorer-layout">
        <!-- Arborescence interactive (Tree-view) -->
        <div class="tree-panel card-panel">
          <div class="tree-header">
            <div class="tree-title">
              <span class="folder-icon">📂</span>
              <span>mon-projet-angular/</span>
            </div>
            <button class="expand-all-btn" (click)="toggleAllFolders()">
              {{ allExpanded() ? 'Tout replier' : 'Tout déplier' }}
            </button>
          </div>

          <div class="tree-nodes-list">
            <ng-container *ngTemplateOutlet="recursiveTree; context: { $implicit: fileTree }"></ng-container>
          </div>
        </div>

        <!-- Template récursif pour les nœuds -->
        <ng-template #recursiveTree let-nodes>
          @for (node of nodes; track node.id) {
            <div class="node-wrapper">
              <div 
                class="node-row" 
                [class.selected]="selectedNode()?.id === node.id"
                [class.is-folder]="node.type === 'folder'"
                (click)="selectNode(node)"
              >
                <!-- Flèche de pliage si dossier -->
                @if (node.type === 'folder') {
                  <span class="chevron-icon" [class.rotated]="node.isExpanded" (click)="toggleFolder($event, node)">
                    ▶
                  </span>
                } @else {
                  <span class="leaf-spacer"></span>
                }

                <!-- Icône du nœud -->
                <span class="file-icon" [ngClass]="'icon-' + node.iconType">
                  @switch (node.iconType) {
                    @case ('folder') { 📁 }
                    @case ('ts') { 🔷 }
                    @case ('html') { 🌐 }
                    @case ('css') { 🎨 }
                    @case ('json') { ⚙️ }
                    @case ('angular') { 🅰️ }
                    @default { 📄 }
                  }
                </span>

                <span class="node-name">{{ node.name }}</span>

                @if (node.shouldEditFrequently) {
                  <span class="edit-badge">Fréquent</span>
                }
              </div>

              <!-- Enfants si dossier ouvert -->
              @if (node.type === 'folder' && node.isExpanded && node.children) {
                <div class="children-block">
                  <ng-container *ngTemplateOutlet="recursiveTree; context: { $implicit: node.children }"></ng-container>
                </div>
              }
            </div>
          }
        </ng-template>

        <!-- Inspecteur de rôle & Aperçu de code -->
        <div class="inspector-panel card-panel">
          @if (selectedNode(); as active) {
            <div class="inspector-header">
              <div class="file-identity">
                <span class="file-badge" [ngClass]="'badge-' + active.iconType">{{ active.type === 'folder' ? 'Dossier' : 'Fichier' }}</span>
                <span class="file-full-path">{{ active.path }}</span>
              </div>
              <h3>{{ active.roleTitle || active.name }}</h3>
            </div>

            <!-- Fiche de rôle architectural -->
            <div class="role-card">
              <div class="role-desc">
                {{ active.roleDescription }}
              </div>

              @if (active.keyConcepts && active.keyConcepts.length > 0) {
                <div class="key-concepts-box">
                  <span class="box-title">🔑 Concepts clés associés :</span>
                  <div class="tags-row">
                    @for (concept of active.keyConcepts; track concept) {
                      <span class="concept-tag">{{ concept }}</span>
                    }
                  </div>
                </div>
              }

              @if (active.studentPitfall) {
                <div class="pitfall-box">
                  <span class="pitfall-title">⚠️ Piège classique d'étudiant :</span>
                  <p>{{ active.studentPitfall }}</p>
                </div>
              }
            </div>

            <!-- Visualiseur de code type du fichier -->
            @if (active.content) {
              <div class="code-preview-box">
                <div class="code-bar">
                  <span>Contenu type du fichier (<code>{{ active.name }}</code>)</span>
                  <span class="badge badge-subtle">Lecture seule</span>
                </div>
                <pre class="code-snippet"><code>{{ active.content }}</code></pre>
              </div>
            }
          } @else {
            <div class="no-selection">
              <span>Sélectionnez un fichier ou un dossier dans l'arborescence à gauche pour inspecter son rôle architectural.</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .explorer-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
      min-height: 560px;
    }

    .tree-panel {
      display: flex;
      flex-direction: column;
      padding: 14px;
      gap: 12px;
      overflow-y: auto;
      max-height: 750px;
    }

    .tree-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-color);

      .tree-title {
        font-weight: 700;
        font-size: 0.88rem;
        color: var(--text-main);
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .expand-all-btn {
        font-size: 0.72rem;
        color: var(--text-muted);
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        padding: 2px 8px;
        border-radius: 4px;

        &:hover {
          color: var(--text-main);
          border-color: #dd0031;
        }
      }
    }

    .tree-nodes-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
    }

    .node-wrapper {
      display: flex;
      flex-direction: column;
    }

    .node-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      border-radius: 5px;
      cursor: pointer;
      user-select: none;
      color: var(--text-muted);

      &:hover {
        background: var(--bg-subtle);
        color: var(--text-main);
      }

      &.selected {
        background: rgba(221, 0, 49, 0.12);
        color: #f87171;
        font-weight: 600;
        border-left: 2px solid #dd0031;
      }
    }

    .chevron-icon {
      font-size: 0.65rem;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--text-dim);
      transition: transform 0.15s ease;

      &.rotated {
        transform: rotate(90deg);
      }
    }

    .leaf-spacer {
      width: 14px;
    }

    .file-icon {
      font-size: 0.85rem;
    }

    .node-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .edit-badge {
      font-size: 0.62rem;
      font-weight: 700;
      color: #10b981;
      background: rgba(16, 185, 129, 0.15);
      padding: 1px 4px;
      border-radius: 3px;
    }

    .children-block {
      padding-left: 18px;
      border-left: 1px dotted var(--border-subtle);
      margin-left: 6px;
    }

    /* Inspecteur de rôle */
    .inspector-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      max-height: 750px;
    }

    .inspector-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;

      .file-identity {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
      }

      .file-full-path {
        font-family: var(--font-mono);
        color: var(--text-dim);
      }

      h3 {
        font-size: 1.25rem;
        color: var(--text-main);
        font-weight: 800;
      }
    }

    .file-badge {
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.68rem;
      text-transform: uppercase;

      &.badge-ts { background: rgba(49, 120, 198, 0.2); color: #60a5fa; }
      &.badge-html { background: rgba(234, 88, 12, 0.2); color: #fb923c; }
      &.badge-css { background: rgba(147, 51, 234, 0.2); color: #c084fc; }
      &.badge-json { background: rgba(234, 179, 8, 0.2); color: #fde047; }
      &.badge-angular { background: rgba(221, 0, 49, 0.2); color: #f87171; }
      &.badge-folder { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }
    }

    .role-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .role-desc {
      font-size: 0.88rem;
      color: var(--text-main);
      line-height: 1.5;
    }

    .key-concepts-box {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .box-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
      }

      .tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .concept-tag {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-family: var(--font-mono);
        color: #38bdf8;
      }
    }

    .pitfall-box {
      background: rgba(239, 68, 68, 0.08);
      border-left: 3px solid #ef4444;
      padding: 10px 12px;
      border-radius: 0 6px 6px 0;

      .pitfall-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: #f87171;
        display: block;
        margin-bottom: 2px;
      }

      p {
        font-size: 0.8rem;
        color: var(--text-main);
        margin: 0;
        line-height: 1.4;
      }
    }

    .code-preview-box {
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .code-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: var(--terminal-header, #121826);
      border-bottom: 1px solid var(--border-color);
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .code-snippet {
      padding: 14px;
      margin: 0;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #e2e8f0;
      line-height: 1.45;
    }

    .no-selection {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: var(--text-dim);
      font-size: 0.85rem;
      text-align: center;
    }
  `]
})
export class TreeExplorerComponent {
  readonly allExpanded = signal<boolean>(true);

  readonly fileTree: ProjectFileNode[] = [
    {
      id: 'node-dot-angular',
      name: '.angular/',
      path: '.angular/',
      type: 'folder',
      iconType: 'folder',
      isExpanded: false,
      roleTitle: 'Cache Interne du Compilateur Angular',
      roleDescription: 'Dossier généré et maintenu automatiquement par le CLI Angular. Il stocke les métadonnées de cache de compilation pour accélérer les reconstructions incrémentales.',
      keyConcepts: ['Cache de build', 'Non commité (.gitignore)'],
      studentPitfall: 'Ne jamais toucher ni commiter ce dossier dans Git. Si un bug de cache survient, il suffit de supprimer le dossier .angular/ pour forcer un re-build complet.',
      shouldEditFrequently: false
    },
    {
      id: 'node-public',
      name: 'public/',
      path: 'public/',
      type: 'folder',
      iconType: 'folder',
      isExpanded: true,
      roleTitle: 'Ressources Statiques Publiques',
      roleDescription: 'Contient tous les assets statiques qui ne nécessitent pas de traitement ou de compilation par Vite/esbuild (images, favicons, polices, robots.txt).',
      keyConcepts: ['Fichiers bruts', 'Accessible à la racine /'],
      studentPitfall: 'Dans les versions modernes d\'Angular (v17-22), le dossier "public/" remplace l\'ancien dossier "src/assets/".',
      children: [
        {
          id: 'node-favicon',
          name: 'favicon.ico',
          path: 'public/favicon.ico',
          type: 'file',
          iconType: 'json',
          roleTitle: 'Icône de l\'onglet Navigateur',
          roleDescription: 'L\'icône de marque affichée dans l\'onglet du navigateur et les favoris.',
          keyConcepts: ['Asset statique']
        }
      ]
    },
    {
      id: 'node-src',
      name: 'src/',
      path: 'src/',
      type: 'folder',
      iconType: 'folder',
      isExpanded: true,
      roleTitle: 'Répertoire Source Principal',
      roleDescription: 'Le cœur battant de votre projet. C\'est ici que réside 99% du code que vous concevez (composants, templates, styles globaux, configuration de démarrage).',
      shouldEditFrequently: true,
      children: [
        {
          id: 'node-src-app',
          name: 'app/',
          path: 'src/app/',
          type: 'folder',
          iconType: 'folder',
          isExpanded: true,
          roleTitle: 'Module Applicatif Racine',
          roleDescription: 'Regroupe le composant racine (AppComponent) ainsi que toute l\'architecture de votre application (sous-composants, services, routes).',
          shouldEditFrequently: true,
          children: [
            {
              id: 'node-app-component-ts',
              name: 'app.component.ts',
              path: 'src/app/app.component.ts',
              type: 'file',
              iconType: 'ts',
              roleTitle: 'Logique TypeScript du Composant Racine',
              roleDescription: 'Définit le composant racine instancié au démarrage. Contient le décorateur @Component (avec selector: "app-root", standalone: true) et la classe TypeScript.',
              keyConcepts: ['@Component', 'standalone: true', 'imports: []', 'Classe AppComponent'],
              studentPitfall: 'N\'oubliez pas de déclarer les sous-composants dans le tableau imports: [] pour pouvoir utiliser leurs balises HTML dans le template !',
              shouldEditFrequently: true,
              content: `import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Mon Application Angular';
  author = 'Département Informatique';
}`
            },
            {
              id: 'node-app-component-html',
              name: 'app.component.html',
              path: 'src/app/app.component.html',
              type: 'file',
              iconType: 'html',
              roleTitle: 'Template HTML du Composant Racine',
              roleDescription: 'Définit la vue HTML du composant racine. Contient le balisage, les liaisons de données ({{ }}, [prop], (event)) et la balise <router-outlet>.',
              keyConcepts: ['Interpolation {{ }}', 'Property Binding []', 'Event Binding ()', 'router-outlet'],
              studentPitfall: 'Attention : le template d\'un composant ne doit pas contenir de balises <html>, <head> ou <body>, mais uniquement le fragment d\'interface.',
              shouldEditFrequently: true,
              content: `<div class="container">
  <h1>{{ title }}</h1>
  <p>Créé par {{ author }}</p>
  
  <!-- Point d'injection du routeur client -->
  <router-outlet></router-outlet>
</div>`
            },
            {
              id: 'node-app-component-css',
              name: 'app.component.css',
              path: 'src/app/app.component.css',
              type: 'file',
              iconType: 'css',
              roleTitle: 'Styles CSS Scopés du Composant Racine',
              roleDescription: 'Styles graphiques appliqués UNIQUEMENT à app.component.html. Grâce à l\'encapsulation Angular (ViewEncapsulation), ces règles ne polluent aucun autre composant.',
              keyConcepts: ['View Encapsulation', 'Styles scopés', 'Attributs _ngcontent'],
              shouldEditFrequently: true,
              content: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}`
            },
            {
              id: 'node-app-component-spec',
              name: 'app.component.spec.ts',
              path: 'src/app/app.component.spec.ts',
              type: 'file',
              iconType: 'ts',
              roleTitle: 'Suite de Tests Unitaires',
              roleDescription: 'Fichier de test exécuté par Vitest ou Karma pour tester unitairement le composant racine.',
              keyConcepts: ['TestBed', 'Tests unitaires', 'ng test'],
              content: `import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});`
            },
            {
              id: 'node-app-config-ts',
              name: 'app.config.ts',
              path: 'src/app/app.config.ts',
              type: 'file',
              iconType: 'config',
              roleTitle: 'Configuration Globale de l\'Application',
              roleDescription: 'Remplace les anciens modules AppModule (NgModule). Fournit au moteur d\'injection de dépendances les services globaux (routes, client HTTP, animations).',
              keyConcepts: ['ApplicationConfig', 'provideRouter', 'provideHttpClient', 'Zero NgModule'],
              studentPitfall: 'C\'est ici qu\'on enregistre les providers comme provideHttpClient() et non plus dans un tableau providers d\'un module.',
              content: `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};`
            },
            {
              id: 'node-app-routes-ts',
              name: 'app.routes.ts',
              path: 'src/app/app.routes.ts',
              type: 'file',
              iconType: 'ts',
              roleTitle: 'Table de Routage de l\'Application',
              roleDescription: 'Définit les correspondances entre les chemins d\'URL du navigateur et les composants Standalone à afficher dans <router-outlet>.',
              keyConcepts: ['Routes', 'path', 'component', 'loadComponent (Lazy Loading)'],
              content: `import { Routes } from '@angular/router';

export const routes: Routes = [
  // Exemple : { path: 'accueil', component: HomeComponent }
];`
            }
          ]
        },
        {
          id: 'node-src-index-html',
          name: 'index.html',
          path: 'src/index.html',
          type: 'file',
          iconType: 'html',
          roleTitle: 'Unique Document HTML Servi par la SPA',
          roleDescription: 'Le squelette HTML initial téléchargé par le navigateur. Il ne contient que les balises meta de base et la balise personnalisée <app-root></app-root>.',
          keyConcepts: ['Squelette SPA', '<app-root></app-root>', '<base href="/">'],
          studentPitfall: 'ERREUR GRAVE D\'ÉXAMEN : Ne JAMAIS rédiger votre contenu d\'interface directement dans index.html ! Le code applicatif appartient aux composants.',
          content: `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Mon Application Angular</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <!-- Point de montage du composant racine AppComponent -->
  <app-root></app-root>
</body>
</html>`
        },
        {
          id: 'node-src-main-ts',
          name: 'main.ts',
          path: 'src/main.ts',
          type: 'file',
          iconType: 'ts',
          roleTitle: 'Point d\'Entrée Exécutable de l\'Application',
          roleDescription: 'Le script TypeScript initialement exécuté dans le navigateur. Il appelle bootstrapApplication() en liant AppComponent et appConfig.',
          keyConcepts: ['bootstrapApplication()', 'Point d\'entrée JS', 'Initialisation Angular'],
          studentPitfall: 'Ne modifiez main.ts que si vous devez configurer le démarrage ou capturer des erreurs globales de démarrage.',
          content: `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`
        },
        {
          id: 'node-src-styles-css',
          name: 'styles.css',
          path: 'src/styles.css',
          type: 'file',
          iconType: 'css',
          roleTitle: 'Feuille de Styles Globale',
          roleDescription: 'Styles CSS globaux appliqués à l\'intégralité de l\'application (polices web, reset CSS, variables de thème).',
          keyConcepts: ['Styles globaux', 'Non scopé'],
          content: `/* Styles globaux de l'application */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}`
        }
      ]
    },
    {
      id: 'node-angular-json',
      name: 'angular.json',
      path: 'angular.json',
      type: 'file',
      iconType: 'angular',
      roleTitle: 'Configuration Maître du Workspace Angular',
      roleDescription: 'Indique au CLI comment construire, servir et tester le projet (builder esbuild/vite, fichiers d\'entrée, budgets de taille, assets à inclure).',
      keyConcepts: ['CLI Config', 'Build options', 'Budgets', 'Assets mapping'],
      studentPitfall: 'Si vous modifiez angular.json, vous DEVEZ redémarrer le serveur de développement (ng serve) pour que les changements prennent effet.',
      content: `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "mon-projet-angular": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "architect": {
        "build": {
          "builder": "@angular/build:application"
        }
      }
    }
  }
}`
    },
    {
      id: 'node-package-json',
      name: 'package.json',
      path: 'package.json',
      type: 'file',
      iconType: 'json',
      roleTitle: 'Dépendances npm & Scripts du Projet',
      roleDescription: 'Déclare les paquets officiels Angular (@angular/core, @angular/common), les outils de dev (@angular/cli, typescript) et les commandes scripts (npm start, npm run build).',
      keyConcepts: ['dependencies', 'devDependencies', 'npm start / ng serve'],
      studentPitfall: 'Lorsqu\'on clone un projet sur Git, le dossier node_modules/ n\'est pas fourni : il faut toujours exécuter "npm install" en premier !',
      content: `{
  "name": "mon-projet-angular",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/core": "^22.1.0",
    "@angular/common": "^22.1.0",
    "@angular/router": "^22.1.0"
  }
}`
    },
    {
      id: 'node-tsconfig-json',
      name: 'tsconfig.json',
      path: 'tsconfig.json',
      type: 'file',
      iconType: 'json',
      roleTitle: 'Configuration Racine du Compilateur TypeScript',
      roleDescription: 'Définit les règles de typage et de transpilation globales de TypeScript (cible ECMAScript, strict mode).',
      keyConcepts: ['strict: true', 'target', 'moduleResolution'],
      content: `{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "moduleResolution": "bundler"
  }
}`
    }
  ];

  readonly selectedNode = signal<ProjectFileNode | null>(this.fileTree[2].children![0].children![0]); // Select app.component.ts by default

  selectNode(node: ProjectFileNode): void {
    this.selectedNode.set(node);
  }

  toggleFolder(event: Event, node: ProjectFileNode): void {
    event.stopPropagation();
    node.isExpanded = !node.isExpanded;
  }

  toggleAllFolders(): void {
    const newState = !this.allExpanded();
    this.allExpanded.set(newState);

    const toggle = (nodes: ProjectFileNode[]) => {
      for (const n of nodes) {
        if (n.type === 'folder') {
          n.isExpanded = newState;
          if (n.children) toggle(n.children);
        }
      }
    };

    toggle(this.fileTree);
  }
}
