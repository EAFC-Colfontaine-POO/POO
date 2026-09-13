import { Injectable, signal, computed } from '@angular/core';
import { WorkshopExercise, ValidationCriterion, WorkshopFile } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private readonly STORAGE_KEY = 'angular_seance3_workshops_v1';

  private readonly initialExercises: WorkshopExercise[] = [
    {
      id: 'ws-3-1',
      number: '3.1',
      title: 'Déclaration & Interpolation {{ }}',
      subtitle: 'Manipuler l\'état TypeScript et injecter des données dynamiques dans le DOM',
      estimatedTime: '10 min',
      difficulty: 'Débutant',
      statement: `1. Dans app.component.ts, déclarez deux nouvelles propriétés dans la classe AppComponent :
   - studentName (string) contenant votre nom et prénom (ex. 'Jean Dupont').
   - academicYear (string) contenant l'année académique courante (ex. '2025-2026').
2. Dans app.component.html, modifiez le template pour afficher ces deux variables au bas de la carte via l'interpolation {{ }}.`,
      hint: `Dans la classe AppComponent, ajoutez :
studentName: string = 'Jean Dupont';
academicYear: string = '2025-2026';

Puis dans le template HTML, utilisez la syntaxe d'interpolation à double accolades :
<p>Étudiant : <strong>{{ studentName }}</strong> (Année académique : {{ academicYear }})</p>`,
      solutionExplanation: [
        'En Angular, chaque propriété publique d\'une classe de composant est directement accessible dans son template associé.',
        'La syntaxe d\'interpolation {{ expression }} évalue l\'expression TypeScript et insère la représentation textuelle dans le nœud textuel du DOM.',
        'Aucun appel manuel de type document.getElementById() ou innerHTML n\'est requis : le compilateur Angular assure la synchronisation réactive automatique.'
      ],
      activeFileIndex: 0,
      files: [
        {
          name: 'app.component.ts',
          path: 'src/app/app.component.ts',
          language: 'typescript',
          initialContent: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
  isOnline: boolean = true;

  // TODO : Déclarez ici studentName et academicYear
  

  toggleStatus(): void {
    this.isOnline = !this.isOnline;
  }
}
`,
          solutionContent: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
  isOnline: boolean = true;

  // Ajout des nouvelles propriétés (Atelier 3.1)
  studentName: string = 'Jean Dupont';
  academicYear: string = '2025-2026';

  toggleStatus(): void {
    this.isOnline = !this.isOnline;
  }
}
`,
          currentContent: ''
        },
        {
          name: 'app.component.html',
          path: 'src/app/app.component.html',
          language: 'html',
          initialContent: `<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>

  <!-- TODO : Affichez studentName et academicYear avec l'interpolation {{ }} -->

  <p>Statut du cours : 
    <span [class.online]="isOnline" [class.offline]="!isOnline">
      {{ isOnline ? 'En direct' : 'Hors ligne' }}
    </span>
  </p>

  <button (click)="toggleStatus()">Changer le statut</button>
</div>
`,
          solutionContent: `<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>

  <!-- Affichage des informations de l'étudiant (Atelier 3.1) -->
  <p>Étudiant : <strong>{{ studentName }}</strong> (Année académique : {{ academicYear }})</p>

  <p>Statut du cours : 
    <span [class.online]="isOnline" [class.offline]="!isOnline">
      {{ isOnline ? 'En direct' : 'Hors ligne' }}
    </span>
  </p>

  <button (click)="toggleStatus()">Changer le statut</button>
</div>
`,
          currentContent: ''
        }
      ],
      criteria: [
        {
          id: 'c1',
          label: 'Déclaration de studentName',
          description: 'La classe AppComponent doit comporter une propriété studentName de type string initialisée.',
          passed: false,
          hint: 'Vérifiez la présence de studentName dans la classe AppComponent.'
        },
        {
          id: 'c2',
          label: 'Déclaration de academicYear',
          description: 'La classe AppComponent doit comporter une propriété academicYear de type string initialisée.',
          passed: false,
          hint: 'Vérifiez la présence de academicYear dans la classe AppComponent.'
        },
        {
          id: 'c3',
          label: 'Interpolation {{ studentName }} dans le template',
          description: 'Le template app.component.html doit utiliser la syntaxe {{ studentName }}.',
          passed: false,
          hint: 'Ajoutez {{ studentName }} dans le code HTML.'
        },
        {
          id: 'c4',
          label: 'Interpolation {{ academicYear }} dans le template',
          description: 'Le template app.component.html doit utiliser la syntaxe {{ academicYear }}.',
          passed: false,
          hint: 'Ajoutez {{ academicYear }} dans le code HTML.'
        }
      ],
      isCompleted: false
    },
    {
      id: 'ws-3-2',
      number: '3.2',
      title: 'Compteur & Property / Event Binding',
      subtitle: 'Liaison d\'événement (click) et liaison de propriété [disabled]',
      estimatedTime: '15 min',
      difficulty: 'Facile',
      statement: `1. Dans app.component.ts :
   - Ajoutez une propriété clickCount de type number initialisée à 0.
   - Ajoutez une méthode increment(): void qui augmente clickCount de 1.
   - Ajoutez une méthode resetCounter(): void qui remet clickCount à 0.
2. Dans app.component.html :
   - Affichez le nombre de clics dans un titre <h3>.
   - Ajoutez un bouton « Compter » relié à increment() via (click).
   - Ajoutez un bouton « Réinitialiser » relié à resetCounter() via (click).
   - Désactivez le bouton « Réinitialiser » via [disabled]="clickCount === 0".`,
      hint: `TypeScript :
clickCount: number = 0;
increment(): void { this.clickCount++; }
resetCounter(): void { this.clickCount = 0; }

HTML :
<h3>Nombre d'interactions : {{ clickCount }}</h3>
<button (click)="increment()">Compter</button>
<button (click)="resetCounter()" [disabled]="clickCount === 0">Réinitialiser</button>`,
      solutionExplanation: [
        'Le Property Binding [propriété]="expression" évalue dynamiquement une expression TypeScript et lie le résultat à la propriété d\'élément du DOM (ici disabled).',
        'L\'Event Binding (événement)="méthode()" écoute les événements déclenchés par l\'utilisateur (click) et exécute la méthode TypeScript correspondante sans intervention manuelle de addEventListener.',
        'La désactivation dynamique [disabled]="clickCount === 0" offre une ergonomie intuitive immédiate sans code de manipulation DOM complexe.'
      ],
      activeFileIndex: 0,
      files: [
        {
          name: 'app.component.ts',
          path: 'src/app/app.component.ts',
          language: 'typescript',
          initialContent: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
  isOnline: boolean = true;
  studentName: string = 'Jean Dupont';
  academicYear: string = '2025-2026';

  // TODO : Ajoutez clickCount, increment() et resetCounter()


  toggleStatus(): void {
    this.isOnline = !this.isOnline;
  }
}
`,
          solutionContent: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
  isOnline: boolean = true;
  studentName: string = 'Jean Dupont';
  academicYear: string = '2025-2026';

  // Propriété du compteur (Atelier 3.2)
  clickCount: number = 0;

  toggleStatus(): void {
    this.isOnline = !this.isOnline;
  }

  // Méthodes pour gérer le compteur (Atelier 3.2)
  increment(): void {
    this.clickCount++;
  }

  resetCounter(): void {
    this.clickCount = 0;
  }
}
`,
          currentContent: ''
        },
        {
          name: 'app.component.html',
          path: 'src/app/app.component.html',
          language: 'html',
          initialContent: `<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>

  <p>Étudiant : <strong>{{ studentName }}</strong> (Année {{ academicYear }})</p>

  <!-- TODO : Section Compteur avec <h3>, bouton Compter et bouton Réinitialiser désactivé à 0 -->


  <p>Statut du cours : 
    <span [class.online]="isOnline" [class.offline]="!isOnline">
      {{ isOnline ? 'En direct' : 'Hors ligne' }}
    </span>
  </p>

  <button (click)="toggleStatus()">Changer le statut</button>
</div>
`,
          solutionContent: `<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>

  <p>Étudiant : <strong>{{ studentName }}</strong> (Année {{ academicYear }})</p>

  <!-- Section Compteur (Atelier 3.2) -->
  <hr />
  <h3>Nombre d'interactions : {{ clickCount }}</h3>
  <button (click)="increment()">Compter</button>
  <button (click)="resetCounter()" [disabled]="clickCount === 0">Réinitialiser</button>
  <hr />

  <p>Statut du cours : 
    <span [class.online]="isOnline" [class.offline]="!isOnline">
      {{ isOnline ? 'En direct' : 'Hors ligne' }}
    </span>
  </p>

  <button (click)="toggleStatus()">Changer le statut</button>
</div>
`,
          currentContent: ''
        }
      ],
      criteria: [
        {
          id: 'c1',
          label: 'Propriété clickCount',
          description: 'clickCount doit être déclarée et initialisée à 0 dans AppComponent.',
          passed: false,
          hint: 'Déclarez clickCount: number = 0;'
        },
        {
          id: 'c2',
          label: 'Méthodes increment() et resetCounter()',
          description: 'Les méthodes increment() et resetCounter() doivent être présentes.',
          passed: false,
          hint: 'Vérifiez les noms et l\'implémentation de increment() et resetCounter().'
        },
        {
          id: 'c3',
          label: 'Liaisons d\'événement (click)',
          description: 'Le template doit lier (click)="increment()" et (click)="resetCounter()".',
          passed: false,
          hint: 'Utilisez la syntaxe (click)="increment()" et (click)="resetCounter()".'
        },
        {
          id: 'c4',
          label: 'Liaison de propriété [disabled]',
          description: 'Le bouton Réinitialiser doit comporter [disabled]="clickCount === 0".',
          passed: false,
          hint: 'Utilisez [disabled]="clickCount === 0" sur le bouton de réinitialisation.'
        }
      ],
      isCompleted: false
    },
    {
      id: 'ws-3-3',
      number: '3.3',
      title: 'Arbre de Composants Standalone',
      subtitle: 'Déclaration explicite des dépendances dans le tableau imports: []',
      estimatedTime: '15 min',
      difficulty: 'Intermédiaire',
      statement: `1. Inspectez le composant enfant HeaderComponent situé dans components/header/header.component.ts.
2. Dans app.component.ts :
   - Importez HeaderComponent depuis './components/header/header.component'.
   - Ajoutez HeaderComponent dans le tableau imports: [] du décorateur @Component.
3. Dans app.component.html :
   - Insérez la balise personnalisée <app-header></app-header> tout en haut du fichier.`,
      hint: `Dans app.component.ts :
import { HeaderComponent } from './components/header/header.component';

@Component({
  ...
  imports: [HeaderComponent],
  ...
})

Dans app.component.html :
<app-header></app-header>`,
      solutionExplanation: [
        'Dans l\'architecture Standalone (introduite et généralisée dans les versions récentes d\'Angular), les composants gèrent explicitement leurs dépendances.',
        'Pour utiliser un composant enfant <app-header> dans le template d\'un parent, celui-ci doit impérativement figurer dans le tableau imports: [] de son décorateur @Component.',
        'Les anciens NgModules monolithiques ne sont plus requis, ce qui rend le code plus modulaire, plus facile à tester et plus optimisable par tree-shaking.'
      ],
      activeFileIndex: 0,
      files: [
        {
          name: 'app.component.ts',
          path: 'src/app/app.component.ts',
          language: 'typescript',
          initialContent: `import { Component } from '@angular/core';
// TODO 1 : Importer HeaderComponent depuis './components/header/header.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [], // TODO 2 : Ajouter HeaderComponent dans ce tableau
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
}
`,
          solutionContent: `import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  courseName: string = 'Programmation Orientée Objet';
  sessionNumber: number = 3;
}
`,
          currentContent: ''
        },
        {
          name: 'app.component.html',
          path: 'src/app/app.component.html',
          language: 'html',
          initialContent: `<!-- TODO 3 : Insérer la balise personnalisée de HeaderComponent ici -->

<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>
</div>
`,
          solutionContent: `<app-header></app-header>

<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <h2>Séance n°{{ sessionNumber }} : Présentation générale d'Angular</h2>
</div>
`,
          currentContent: ''
        },
        {
          name: 'header.component.ts',
          path: 'src/app/components/header/header.component.ts',
          language: 'typescript',
          initialContent: `import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: \`
    <header class="header-box">
      <h2>🎓 {{ title }}</h2>
      <p>Plateforme d'apprentissage Angular — EAFC Colfontaine</p>
    </header>
  \`,
  styles: [\`
    .header-box {
      background: #1e293b;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      border-left: 4px solid #dd0031;
    }
    h2 { margin: 0 0 6px 0; color: #f8fafc; font-size: 1.2rem; }
    p { margin: 0; color: #94a3b8; font-size: 0.85rem; }
  \`]
})
export class HeaderComponent {
  title: string = 'En-tête de l\\'application';
}
`,
          solutionContent: `import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: \`
    <header class="header-box">
      <h2>🎓 {{ title }}</h2>
      <p>Plateforme d'apprentissage Angular — EAFC Colfontaine</p>
    </header>
  \`,
  styles: [\`
    .header-box {
      background: #1e293b;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      border-left: 4px solid #dd0031;
    }
    h2 { margin: 0 0 6px 0; color: #f8fafc; font-size: 1.2rem; }
    p { margin: 0; color: #94a3b8; font-size: 0.85rem; }
  \`]
})
export class HeaderComponent {
  title: string = 'En-tête de l\\'application';
}
`,
          currentContent: ''
        }
      ],
      criteria: [
        {
          id: 'c1',
          label: 'Import de HeaderComponent',
          description: 'HeaderComponent doit être importé dans app.component.ts.',
          passed: false,
          hint: 'Vérifiez la ligne : import { HeaderComponent } from \'./components/header/header.component\';'
        },
        {
          id: 'c2',
          label: 'Déclaration dans imports: []',
          description: 'HeaderComponent doit figurer dans le tableau imports du décorateur @Component.',
          passed: false,
          hint: 'Ajoutez HeaderComponent dans imports: [HeaderComponent].'
        },
        {
          id: 'c3',
          label: 'Balise <app-header> dans le template',
          description: 'La balise <app-header></app-header> doit être insérée dans app.component.html.',
          passed: false,
          hint: 'Insérez <app-header></app-header> au début du fichier HTML.'
        }
      ],
      isCompleted: false
    },
    {
      id: 'ws-3-4',
      number: '3.4',
      title: 'Isolation des Styles CSS (View Encapsulation)',
      subtitle: 'Comprendre le scopage automatique des styles et l\'attribut _ngcontent',
      estimatedTime: '10 min',
      difficulty: 'Facile',
      statement: `1. Dans le fichier de style du composant d'en-tête (header.component.css), ajoutez une règle CSS ciblant la balise <p> :
   - color: purple;
   - font-style: italic;
2. Validez le code et observez l'impact visuel :
   - Les paragraphes du composant Enfant (HeaderComponent) prennent-ils le style violet et italique ?
   - Les paragraphes du composant Parent (AppComponent) sont-ils affectés ? Pourquoi ?`,
      hint: `Dans header.component.css, écrivez simplement :
p {
  color: purple;
  font-style: italic;
}`,
      solutionExplanation: [
        'Par défaut, Angular applique le mode ViewEncapsulation.Emulated.',
        'À la compilation, Angular injecte un attribut unique (ex. _ngcontent-ng-c123456) sur les éléments du template du composant et réécrit la règle CSS sous la forme p[_ngcontent-ng-c123456] { color: purple; }.',
        'Cela garantit une imperméabilité totale des styles : aucune règle CSS d\'un sous-composant ne peut polluer ou écraser les styles du composant parent ou d\'autres composants tiers.'
      ],
      activeFileIndex: 0,
      files: [
        {
          name: 'header.component.css',
          path: 'src/app/components/header/header.component.css',
          language: 'css',
          initialContent: `/* TODO : Ajoutez ici une règle ciblant la balise p avec color: purple et font-style: italic */
`,
          solutionContent: `/* Style isolé au composant HeaderComponent */
p {
  color: purple;
  font-style: italic;
}
`,
          currentContent: ''
        },
        {
          name: 'header.component.html',
          path: 'src/app/components/header/header.component.html',
          language: 'html',
          initialContent: `<header class="header-box">
  <h2>🎓 En-tête de l'application</h2>
  <p>Je suis un paragraphe situé dans le composant ENFANT (HeaderComponent).</p>
</header>
`,
          solutionContent: `<header class="header-box">
  <h2>🎓 En-tête de l'application</h2>
  <p>Je suis un paragraphe situé dans le composant ENFANT (HeaderComponent).</p>
</header>
`,
          currentContent: ''
        },
        {
          name: 'app.component.html',
          path: 'src/app/app.component.html',
          language: 'html',
          initialContent: `<app-header></app-header>

<div class="card">
  <h1>Composant Racine (AppComponent)</h1>
  <p>Je suis un paragraphe situé dans le composant PARENT (AppComponent). Je ne dois PAS devenir violet !</p>
</div>
`,
          solutionContent: `<app-header></app-header>

<div class="card">
  <h1>Composant Racine (AppComponent)</h1>
  <p>Je suis un paragraphe situé dans le composant PARENT (AppComponent). Je ne dois PAS devenir violet !</p>
</div>
`,
          currentContent: ''
        }
      ],
      criteria: [
        {
          id: 'c1',
          label: 'Sélecteur p défini',
          description: 'header.component.css doit définir une règle pour les balises p.',
          passed: false,
          hint: 'Définissez le sélecteur p { ... }.'
        },
        {
          id: 'c2',
          label: 'Couleur violette (purple)',
          description: 'La propriété color doit être égale à purple, #800080 ou une variante violette.',
          passed: false,
          hint: 'Ajoutez color: purple;'
        },
        {
          id: 'c3',
          label: 'Style italique (font-style: italic)',
          description: 'La propriété font-style doit être égale à italic.',
          passed: false,
          hint: 'Ajoutez font-style: italic;'
        }
      ],
      isCompleted: false
    }
  ];

  readonly exercises = signal<WorkshopExercise[]>([]);
  readonly selectedExerciseId = signal<string>('ws-3-1');

  readonly activeExercise = computed(() => {
    const list = this.exercises();
    return list.find(ex => ex.id === this.selectedExerciseId()) || list[0];
  });

  readonly completedCount = computed(() => {
    return this.exercises().filter(ex => ex.isCompleted).length;
  });

  readonly totalCount = computed(() => {
    return this.exercises().length;
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
    let list = this.initialExercises.map(ex => ({
      ...ex,
      files: ex.files.map(f => ({
        ...f,
        currentContent: f.initialContent
      }))
    }));

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        list = list.map(ex => {
          const found = parsed.find((p: any) => p.id === ex.id);
          if (found) {
            return {
              ...ex,
              isCompleted: found.isCompleted,
              criteria: ex.criteria.map(c => {
                const fc = found.criteria?.find((x: any) => x.id === c.id);
                return fc ? { ...c, passed: fc.passed } : c;
              }),
              files: ex.files.map(f => {
                const ff = found.files?.find((x: any) => x.name === f.name);
                return ff && ff.currentContent ? { ...f, currentContent: ff.currentContent } : f;
              })
            };
          }
          return ex;
        });
      } catch (err) {
        console.warn('[WorkshopService] Erreur lecture localStorage :', err);
      }
    }

    this.exercises.set(list);
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = this.exercises().map(ex => ({
        id: ex.id,
        isCompleted: ex.isCompleted,
        criteria: ex.criteria.map(c => ({ id: c.id, passed: c.passed })),
        files: ex.files.map(f => ({ name: f.name, currentContent: f.currentContent }))
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('[WorkshopService] Erreur persistence localStorage :', err);
    }
  }

  selectExercise(id: string): void {
    this.selectedExerciseId.set(id);
  }

  updateFileContent(exerciseId: string, fileIndex: number, newContent: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const newFiles = [...ex.files];
        if (newFiles[fileIndex]) {
          newFiles[fileIndex] = { ...newFiles[fileIndex], currentContent: newContent };
        }
        return { ...ex, files: newFiles };
      });
    });
    this.persist();
  }

  setActiveFileIndex(exerciseId: string, index: number): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return { ...ex, activeFileIndex: index };
      });
    });
  }

  injectSolution(exerciseId: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const newFiles = ex.files.map(f => ({
          ...f,
          currentContent: f.solutionContent
        }));
        return { ...ex, files: newFiles };
      });
    });
    this.validateExercise(exerciseId);
  }

  resetExercise(exerciseId: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const newFiles = ex.files.map(f => ({
          ...f,
          currentContent: f.initialContent
        }));
        const newCriteria = ex.criteria.map(c => ({ ...c, passed: false }));
        return { ...ex, files: newFiles, criteria: newCriteria, isCompleted: false };
      });
    });
    this.persist();
  }

  validateExercise(exerciseId: string): boolean {
    let allPassed = false;

    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id !== exerciseId) return ex;

        const tsFile = ex.files.find(f => f.name.endsWith('.ts'));
        const htmlFile = ex.files.find(f => f.name.endsWith('.html'));
        const cssFile = ex.files.find(f => f.name.endsWith('.css'));

        const tsCode = tsFile?.currentContent || '';
        const htmlCode = htmlFile?.currentContent || '';
        const cssCode = cssFile?.currentContent || '';

        const newCriteria = ex.criteria.map(c => {
          let passed = false;

          switch (ex.id) {
            case 'ws-3-1':
              if (c.id === 'c1') {
                // studentName
                passed = /\bstudentName\s*(:\s*string)?\s*=/.test(tsCode);
              } else if (c.id === 'c2') {
                // academicYear
                passed = /\bacademicYear\s*(:\s*string)?\s*=/.test(tsCode);
              } else if (c.id === 'c3') {
                // {{ studentName }}
                passed = /\{\{\s*studentName\s*\}\}/.test(htmlCode);
              } else if (c.id === 'c4') {
                // {{ academicYear }}
                passed = /\{\{\s*academicYear\s*\}\}/.test(htmlCode);
              }
              break;

            case 'ws-3-2':
              if (c.id === 'c1') {
                // clickCount: number = 0;
                passed = /\bclickCount\s*(:\s*number)?\s*=\s*0/.test(tsCode);
              } else if (c.id === 'c2') {
                // increment() and resetCounter()
                const hasIncrement = /\bincrement\s*\(\s*\)/.test(tsCode) && /clickCount\s*(\+\+|\+=\s*1)/.test(tsCode);
                const hasReset = /\bresetCounter\s*\(\s*\)/.test(tsCode) && /clickCount\s*=\s*0/.test(tsCode);
                passed = hasIncrement && hasReset;
              } else if (c.id === 'c3') {
                // (click)="increment()" and (click)="resetCounter()"
                const hasClickInc = /\(click\)\s*=\s*["']increment\(\)["']/.test(htmlCode);
                const hasClickReset = /\(click\)\s*=\s*["']resetCounter\(\)["']/.test(htmlCode);
                passed = hasClickInc && hasClickReset;
              } else if (c.id === 'c4') {
                // [disabled]="clickCount === 0"
                passed = /\[disabled\]\s*=\s*["']clickCount\s*===?\s*0["']/.test(htmlCode);
              }
              break;

            case 'ws-3-3':
              if (c.id === 'c1') {
                // import HeaderComponent
                passed = /import\s*\{\s*HeaderComponent\s*\}\s*from\s*['"]\.\/components\/header\/header\.component['"]/.test(tsCode);
              } else if (c.id === 'c2') {
                // imports: [HeaderComponent]
                passed = /imports\s*:\s*\[[^\]]*\bHeaderComponent\b[^\]]*\]/.test(tsCode);
              } else if (c.id === 'c3') {
                // <app-header>
                passed = /<app-header(\s*\/?>|><\/app-header>)/.test(htmlCode);
              }
              break;

            case 'ws-3-4':
              if (c.id === 'c1') {
                // p selector in CSS
                passed = /(^|\})\s*p\s*\{[^}]*\}/.test(cssCode) || /p\s*\{/.test(cssCode);
              } else if (c.id === 'c2') {
                // color: purple
                passed = /color\s*:\s*(purple|#800080|#9333ea|rgb\s*\(\s*128)/i.test(cssCode);
              } else if (c.id === 'c3') {
                // font-style: italic
                passed = /font-style\s*:\s*italic/i.test(cssCode);
              }
              break;
          }

          return { ...c, passed };
        });

        allPassed = newCriteria.every(c => c.passed);
        return { ...ex, criteria: newCriteria, isCompleted: allPassed };
      });
    });

    this.persist();
    return allPassed;
  }
}
