import { Injectable, signal, computed } from '@angular/core';
import { Exercise, ExerciseDef, ValidationSummary, TabId } from '../models/app.models';
import { ConfettiService } from './confetti.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'seance4_exercises_progress';

  private readonly RAW_EXERCISES: ExerciseDef[] = [
    // ==========================================
    // LABO 1 : Structure Sémantique & DOM (4 ex)
    // ==========================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Squelette sémantique HTML5',
      subtitle: 'Structuration essentielle avec balises sémantiques',
      sectionId: 'dom-oop',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Créez un document respectant la sémantique HTML5 : il doit comporter une balise <header> contenant un titre <h1>, un contenu principal <main> contenant une <section> avec un paragraphe <p>, et enfin un pied de page <footer>.',
      hint: 'Utilisez l\'imbrication : <header><h1>...</h1></header><main><section><p>...</p></section></main><footer><p>...</p></footer>',
      initialHtml: `<!-- Construisez la structure sémantique ici -->
<div>
  <!-- Remplacez cette structure div non sémantique -->
  <p>Mon en-tête avec un titre</p>
  <p>Mon contenu de section</p>
  <p>Mon pied de page</p>
</div>`,
      initialCss: `/* Aucun style CSS obligatoire pour cet exercice */
body {
  font-family: system-ui, sans-serif;
  padding: 1rem;
}`,
      solutionHtml: `<header>
  <h1>Mon Application Web</h1>
</header>
<main>
  <section>
    <p>Bienvenue dans le contenu principal de l'application.</p>
  </section>
</main>
<footer>
  <p>© 2026 — Bachelier en informatique</p>
</footer>`,
      solutionCss: `body {
  font-family: system-ui, sans-serif;
  padding: 1rem;
}`,
      solutionExplanation: [
        'La balise <header> représente l\'en-tête de page ou de section et héberge le titre de premier niveau <h1>.',
        'La balise <main> est strictement unique par page et accueille le contenu principal.',
        'La balise <section> regroupe logiquement un bloc thématique dans le <main>.',
        'La balise <footer> conclut la page avec les mentions légales ou droits d\'auteur.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-header-h1',
          label: 'En-tête sémantique',
          description: 'Présence d\'une balise <header> contenant un titre <h1>',
          passed: false,
          hint: 'Vérifiez que votre balise <header> englobe directement ou indirectement un <h1>.'
        },
        {
          id: 'c-main-section',
          label: 'Contenu principal et section',
          description: 'Présence d\'un <main> contenant une <section>',
          passed: false,
          hint: 'Placez <section> à l\'intérieur de la balise <main>.'
        },
        {
          id: 'c-footer',
          label: 'Pied de page sémantique',
          description: 'Présence d\'une balise <footer>',
          passed: false,
          hint: 'Ajoutez une balise <footer> à la fin du document.'
        }
      ],
      validateFn: (doc: Document) => {
        const header = doc.querySelector('header');
        const h1InHeader = header ? header.querySelector('h1') : null;
        const main = doc.querySelector('main');
        const sectionInMain = main ? main.querySelector('section') : null;
        const footer = doc.querySelector('footer');

        return [
          {
            criterionId: 'c-header-h1',
            passed: !!header && !!h1InHeader,
            message: !header ? 'Balise <header> introuvable' : (!h1InHeader ? 'Balise <h1> introuvable dans <header>' : undefined)
          },
          {
            criterionId: 'c-main-section',
            passed: !!main && !!sectionInMain,
            message: !main ? 'Balise <main> introuvable' : (!sectionInMain ? '<section> introuvable dans <main>' : undefined)
          },
          {
            criterionId: 'c-footer',
            passed: !!footer,
            message: !footer ? 'Balise <footer> introuvable' : undefined
          }
        ];
      }
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: 'Navigation sémantique avec liens',
      subtitle: 'Structuration d\'un menu avec <nav> et <ul>',
      sectionId: 'semantic-attributes',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Créez un menu de navigation sémantique : insérez une balise <nav> contenant une liste non ordonnée <ul> composée d\'au moins 2 éléments <li> avec chacun un lien <a href="#">.',
      hint: 'Modèle : <nav><ul><li><a href="#">Accueil</a></li><li><a href="#">Profil</a></li></ul></nav>',
      initialHtml: `<!-- Créez le menu de navigation ici -->
<header>
  <h2>Mon Site</h2>
  <!-- Insérez la balise <nav> avec sa liste de liens -->
</header>`,
      initialCss: `nav ul {
  list-style: none;
  display: flex;
  gap: 16px;
  padding: 0;
}`,
      solutionHtml: `<header>
  <h2>Mon Site</h2>
  <nav>
    <ul>
      <li><a href="#">Accueil</a></li>
      <li><a href="#">Profil</a></li>
    </ul>
  </nav>
</header>`,
      solutionCss: `nav ul {
  list-style: none;
  display: flex;
  gap: 16px;
  padding: 0;
}`,
      solutionExplanation: [
        'La balise <nav> indique expressément aux moteurs de recherche et lecteurs d\'écran qu\'il s\'agit de la navigation principale.',
        'L\'utilisation d\'une liste <ul><li> permet aux outils d\'accessibilité d\'annoncer le nombre de liens présents aux personnes malvoyantes.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-nav-exists',
          label: 'Balise de navigation',
          description: 'Présence d\'une balise <nav>',
          passed: false,
          hint: 'Ajoutez une balise <nav>.'
        },
        {
          id: 'c-ul-li-links',
          label: 'Liste de 2 liens ou plus',
          description: '<nav> contient <ul> avec au moins 2 éléments <li> contenant un <a>',
          passed: false,
          hint: 'Insérez <ul> avec 2 balises <li> contenant chacune un <a href="#">.'
        }
      ],
      validateFn: (doc: Document) => {
        const nav = doc.querySelector('nav');
        const ul = nav ? nav.querySelector('ul') : null;
        const links = nav ? nav.querySelectorAll('li a') : [];

        return [
          {
            criterionId: 'c-nav-exists',
            passed: !!nav,
            message: !nav ? 'Balise <nav> manquante' : undefined
          },
          {
            criterionId: 'c-ul-li-links',
            passed: !!ul && links.length >= 2,
            message: !ul ? 'Balise <ul> manquante dans <nav>' : (links.length < 2 ? `Trouvé seulement ${links.length} lien(s) dans la liste (2 minimum requis)` : undefined)
          }
        ];
      }
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: 'Blocs vs En-ligne (CSS display)',
      subtitle: 'Modification du comportement naturel en flux',
      sectionId: 'dom-oop',
      estimatedTime: '6 min',
      difficulty: 'Facile',
      statement: 'Par défaut, <span> est un élément en-ligne (inline) et <p> est un élément bloc (block). Modifiez le fichier CSS pour forcer le <span> portant l\'identifiant #badge-bloc à s\'afficher en bloc (display: block) et le paragraphe <p id="texte-inline"> à se comporter en élément en-ligne (display: inline).',
      hint: 'Utilisez les sélecteurs #badge-bloc { display: block; } et #texte-inline { display: inline; }',
      initialHtml: `<div class="conteneur">
  <span id="badge-bloc">Je dois devenir un Bloc !</span>
  <p id="texte-inline">Je dois devenir En-Ligne !</p>
  <span>Élément témoin voisin</span>
</div>`,
      initialCss: `/* Complétez les deux règles CSS ci-dessous */
#badge-bloc {
  background: #c4b5fd;
  padding: 8px;
}

#texte-inline {
  background: #fed7aa;
  padding: 8px;
}`,
      solutionHtml: `<div class="conteneur">
  <span id="badge-bloc">Je dois devenir un Bloc !</span>
  <p id="texte-inline">Je dois devenir En-Ligne !</p>
  <span>Élément témoin voisin</span>
</div>`,
      solutionCss: `#badge-bloc {
  background: #c4b5fd;
  padding: 8px;
  display: block;
}

#texte-inline {
  background: #fed7aa;
  padding: 8px;
  display: inline;
}`,
      solutionExplanation: [
        'display: block force le <span> à occuper toute la largeur disponible et à provoquer un saut de ligne automatique avant et après lui.',
        'display: inline contraint le <p> à abandonner son saut de ligne et à s\'insérer directement dans le flux horizontal du texte.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-span-block',
          label: '<span> en display: block',
          description: '#badge-bloc possède display: block',
          passed: false,
          hint: 'Ajoutez "display: block;" dans la règle CSS de #badge-bloc.'
        },
        {
          id: 'c-p-inline',
          label: '<p> en display: inline',
          description: '#texte-inline possède display: inline',
          passed: false,
          hint: 'Ajoutez "display: inline;" dans la règle CSS de #texte-inline.'
        }
      ],
      validateFn: (doc: Document) => {
        const span = doc.querySelector('#badge-bloc') as HTMLElement;
        const p = doc.querySelector('#texte-inline') as HTMLElement;

        const spanDisplay = span ? doc.defaultView?.getComputedStyle(span).display : null;
        const pDisplay = p ? doc.defaultView?.getComputedStyle(p).display : null;

        return [
          {
            criterionId: 'c-span-block',
            passed: spanDisplay === 'block',
            message: `Style calculé pour #badge-bloc : display=${spanDisplay} (attendu: block)`
          },
          {
            criterionId: 'c-p-inline',
            passed: pDisplay === 'inline',
            message: `Style calculé pour #texte-inline : display=${pDisplay} (attendu: inline)`
          }
        ];
      }
    },
    {
      id: 'ex-1-4',
      labNumber: 1,
      number: '1.4',
      title: 'Attributs universels : class et id',
      subtitle: 'Identification unique et classes cumulatives',
      sectionId: 'semantic-attributes',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement: 'Créez un paragraphe <p> ayant à la fois l\'identifiant unique id="presentation" et les deux classes réutilisables class="texte-bleu important".',
      hint: 'Syntaxe : <p id="presentation" class="texte-bleu important">Votre texte...</p>',
      initialHtml: `<!-- Créez le paragraphe avec id="presentation" et class="texte-bleu important" -->
<section>
  <h2>Profil Utilisateur</h2>
  <p>Remplacer ou enrichir ce paragraphe avec les attributs demandés.</p>
</section>`,
      initialCss: `.texte-bleu {
  color: #2563eb;
}
.important {
  font-weight: bold;
  text-decoration: underline;
}`,
      solutionHtml: `<section>
  <h2>Profil Utilisateur</h2>
  <p id="presentation" class="texte-bleu important">Bienvenue sur mon profil de développeur web !</p>
</section>`,
      solutionCss: `.texte-bleu {
  color: #2563eb;
}
.important {
  font-weight: bold;
  text-decoration: underline;
}`,
      solutionExplanation: [
        'L\'identifiant `id="presentation"` doit être unique dans tout le document.',
        'L\'attribut `class` permet de séparer plusieurs noms de classes par un espace afin de cumuler leurs règles graphiques (principe fondateur des frameworks CSS comme Bootstrap).'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-id-presentation',
          label: 'Identifiant unique presentation',
          description: 'Présence d\'un élément avec id="presentation"',
          passed: false,
          hint: 'Vérifiez id="presentation" sur votre paragraphe.'
        },
        {
          id: 'c-classes-cumul',
          label: 'Classes texte-bleu et important',
          description: 'L\'élément cumule les classes texte-bleu et important',
          passed: false,
          hint: 'Écrivez class="texte-bleu important" avec un espace entre les deux classes.'
        }
      ],
      validateFn: (doc: Document) => {
        const el = doc.querySelector('#presentation');
        const hasClasses = el ? (el.classList.contains('texte-bleu') && el.classList.contains('important')) : false;

        return [
          {
            criterionId: 'c-id-presentation',
            passed: !!el,
            message: !el ? 'Aucun élément trouvé avec id="presentation"' : undefined
          },
          {
            criterionId: 'c-classes-cumul',
            passed: hasClasses,
            message: !hasClasses ? 'L\'élément #presentation ne possède pas simultanément les classes "texte-bleu" et "important"' : undefined
          }
        ];
      }
    },

    // ========================================================
    // LABO 2 : Sélecteurs CSS, Spécificité & Box Model (4 ex)
    // ========================================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Sélecteur de classe CSS',
      subtitle: 'Stylisation réutilisable avec une classe',
      sectionId: 'cascade-specificity',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Dans le fichier CSS, rédigez la règle ciblant tous les éléments portant la classe .carte afin de leur appliquer un fond gris clair (background-color: #f8f9fa), une bordure de 1px solide (#dee2e6) et un arrondi de 8px (border-radius: 8px).',
      hint: 'Écrivez : .carte { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; }',
      initialHtml: `<div class="conteneur">
  <div class="carte">
    <h3>Carte 1</h3>
    <p>Contenu stylisé par la classe.</p>
  </div>
  <div class="carte">
    <h3>Carte 2</h3>
    <p>Deuxième carte identique.</p>
  </div>
</div>`,
      initialCss: `/* Rédigez la règle .carte ci-dessous */
.conteneur {
  display: flex;
  gap: 16px;
  padding: 16px;
}`,
      solutionHtml: `<div class="conteneur">
  <div class="carte">
    <h3>Carte 1</h3>
    <p>Contenu stylisé par la classe.</p>
  </div>
  <div class="carte">
    <h3>Carte 2</h3>
    <p>Deuxième carte identique.</p>
  </div>
</div>`,
      solutionCss: `.conteneur {
  display: flex;
  gap: 16px;
  padding: 16px;
}

.carte {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
}`,
      solutionExplanation: [
        'Le point `.` préfixe les sélecteurs de classe dans la feuille de style.',
        'Cette classe s\'applique immédiatement et simultanément à tous les éléments HTML comportant `class="carte"`.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-carte-bg',
          label: 'Couleur de fond appliquée',
          description: '.carte possède une couleur de fond gris clair (#f8f9fa ou rgb(248, 249, 250))',
          passed: false,
          hint: 'Ajoutez "background-color: #f8f9fa;" dans votre règle .carte.'
        },
        {
          id: 'c-carte-border',
          label: 'Bordure et coins arrondis',
          description: '.carte possède une bordure de 1px et border-radius: 8px',
          passed: false,
          hint: 'Définissez border: 1px solid #dee2e6 et border-radius: 8px.'
        }
      ],
      validateFn: (doc: Document) => {
        const carte = doc.querySelector('.carte') as HTMLElement;
        if (!carte) {
          return [
            { criterionId: 'c-carte-bg', passed: false, message: 'Élément .carte introuvable' },
            { criterionId: 'c-carte-border', passed: false, message: 'Élément .carte introuvable' }
          ];
        }
        const style = doc.defaultView?.getComputedStyle(carte);
        const bg = style?.backgroundColor;
        const br = style?.borderRadius;
        const bw = style?.borderTopWidth;

        const isBgOk = bg === 'rgb(248, 249, 250)' || bg === '#f8f9fa';
        const isBorderOk = (bw === '1px') && (br === '8px');

        return [
          {
            criterionId: 'c-carte-bg',
            passed: isBgOk,
            message: `Background calculé : ${bg} (attendu: #f8f9fa)`
          },
          {
            criterionId: 'c-carte-border',
            passed: isBorderOk,
            message: `Bordure calculée : width=${bw}, radius=${br} (attendu: 1px et 8px)`
          }
        ];
      }
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Résolution de conflit (Cascade & Spécificité)',
      subtitle: 'Comprendre l\'arbitrage des sélecteurs par score',
      sectionId: 'cascade-specificity',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Dans le code ci-dessous, une règle concurrente sur #barre-actions button (101 pts : 1 ID + 1 balise) écrase la couleur verte voulue sur .btn-succes (10 pts : 1 classe). Sans modifier le code HTML, ajustez le sélecteur CSS de la classe de succès pour qu\'il soit plus spécifique et l\'emporte en affichant la couleur de fond verte (#28a745).',
      hint: 'Combinez l\'identifiant parent et la classe, ou ajoutez l\'élément et la classe : "#barre-actions button.btn-succes" totalise 111 pts (1 ID + 1 balise + 1 classe) et bat les 101 pts !',
      initialHtml: `<div id="barre-actions">
  <button class="btn-succes">Enregistrer</button>
</div>`,
      initialCss: `/* Règle prioritaire actuelle (100 pts ID + 1 pt Balise = 101 pts) */
#barre-actions button {
  background-color: #dc3545; /* Rouge */
  color: white;
}

/* Cette règle ne pèse que 10 pts (1 classe) et perd le duel ! */
.btn-succes {
  background-color: #28a745; /* Vert attendu */
}`,
      solutionHtml: `<div id="barre-actions">
  <button class="btn-succes">Enregistrer</button>
</div>`,
      solutionCss: `#barre-actions button {
  background-color: #dc3545;
  color: white;
}

/* Nouveau score : 100 pts (ID) + 1 pt (button) + 10 pts (classe) = 111 pts -> Gagne ! */
#barre-actions button.btn-succes {
  background-color: #28a745;
}`,
      solutionExplanation: [
        'Le sélecteur `#barre-actions button` possède un score de spécificité de (0, 1, 0, 1) = 101 pts.',
        'Le sélecteur d\'origine `.btn-succes` ne valait que (0, 0, 1, 0) = 10 pts, il était donc écrasé.',
        'En renforçant le sélecteur avec `#barre-actions button.btn-succes`, son score passe à (0, 1, 1, 1) = 111 pts, surpassant ainsi la règle concurrente sans avoir besoin de recourir au mot-clé destructeur !important.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-btn-green',
          label: 'Bouton avec fond vert',
          description: 'Le bouton possède la couleur de fond #28a745 (rgb(40, 167, 69))',
          passed: false,
          hint: 'Renforcez la spécificité du sélecteur vert, par exemple avec #barre-actions .btn-succes ou #barre-actions button.btn-succes.'
        }
      ],
      validateFn: (doc: Document) => {
        const btn = doc.querySelector('.btn-succes') as HTMLElement;
        const bg = btn ? doc.defaultView?.getComputedStyle(btn).backgroundColor : null;
        const isGreen = bg === 'rgb(40, 167, 69)' || bg === '#28a745';

        return [
          {
            criterionId: 'c-btn-green',
            passed: isGreen,
            message: `Couleur calculée : ${bg} (attendu: rgb(40, 167, 69))`
          }
        ];
      }
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Le Modèle de Boîte (Box Model)',
      subtitle: 'Maîtriser Padding, Border et Margin',
      sectionId: 'box-model',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Dans le fichier CSS, configurez les 4 couches du Box Model sur l\'élément .boite-modele : attribuez-lui une marge interne de 16px (padding: 16px), une bordure solide rouge de 2px (border: 2px solid #ef4444) et une marge externe basse de 24px (margin-bottom: 24px).',
      hint: 'Utilisez : padding: 16px; border: 2px solid #ef4444; margin-bottom: 24px;',
      initialHtml: `<div class="conteneur">
  <div class="boite-modele">
    Contenu de la boîte d'entraînement
  </div>
  <p>Élément suivant pour constater la marge basse.</p>
</div>`,
      initialCss: `.boite-modele {
  background: #dbeafe;
  /* Ajoutez padding, border et margin-bottom ici */
}`,
      solutionHtml: `<div class="conteneur">
  <div class="boite-modele">
    Contenu de la boîte d'entraînement
  </div>
  <p>Élément suivant pour constater la marge basse.</p>
</div>`,
      solutionCss: `.boite-modele {
  background: #dbeafe;
  padding: 16px;
  border: 2px solid #ef4444;
  margin-bottom: 24px;
}`,
      solutionExplanation: [
        'Le Padding crée un espace de respiration interne entre le texte et la bordure rouge.',
        'La Border de 2px délimite physiquement la boîte.',
        'Le Margin-bottom repousse l\'élément suivant de 24px vers le bas.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-padding-16',
          label: 'Padding de 16px',
          description: '.boite-modele a un padding calculé de 16px',
          passed: false,
          hint: 'Définissez padding: 16px;'
        },
        {
          id: 'c-border-2',
          label: 'Bordure 2px rouge',
          description: '.boite-modele a une bordure de 2px',
          passed: false,
          hint: 'Définissez border: 2px solid #ef4444;'
        },
        {
          id: 'c-margin-24',
          label: 'Marge basse de 24px',
          description: '.boite-modele a margin-bottom: 24px',
          passed: false,
          hint: 'Définissez margin-bottom: 24px;'
        }
      ],
      validateFn: (doc: Document) => {
        const el = doc.querySelector('.boite-modele') as HTMLElement;
        if (!el) {
          return [
            { criterionId: 'c-padding-16', passed: false, message: 'Élément introuvable' },
            { criterionId: 'c-border-2', passed: false, message: 'Élément introuvable' },
            { criterionId: 'c-margin-24', passed: false, message: 'Élément introuvable' }
          ];
        }
        const s = doc.defaultView?.getComputedStyle(el);

        return [
          {
            criterionId: 'c-padding-16',
            passed: s?.paddingTop === '16px' && s?.paddingLeft === '16px',
            message: `Padding calculé : ${s?.paddingTop} (attendu: 16px)`
          },
          {
            criterionId: 'c-border-2',
            passed: s?.borderTopWidth === '2px',
            message: `Bordure calculée : ${s?.borderTopWidth} (attendu: 2px)`
          },
          {
            criterionId: 'c-margin-24',
            passed: s?.marginBottom === '24px',
            message: `Marge basse calculée : ${s?.marginBottom} (attendu: 24px)`
          }
        ];
      }
    },
    {
      id: 'ex-2-4',
      labNumber: 2,
      number: '2.4',
      title: 'Adoption du box-sizing: border-box',
      subtitle: 'Éviter le débordement de grille et les sauts de ligne',
      sectionId: 'box-model',
      estimatedTime: '6 min',
      difficulty: 'Facile',
      statement: 'Deux colonnes à 50% de largeur avec 20px de padding débordent de 100% et s\'empilent sous le modèle content-box par défaut. Appliquez box-sizing: border-box sur les colonnes .col-demo pour qu\'elles mesurent exactement 50% au total et s\'alignent côte à côte.',
      hint: 'Ajoutez "box-sizing: border-box;" dans la règle .col-demo.',
      initialHtml: `<div class="grille-flex">
  <div class="col-demo">Colonne Gauche (50%)</div>
  <div class="col-demo">Colonne Droite (50%)</div>
</div>`,
      initialCss: `.grille-flex {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.col-demo {
  width: 50%;
  padding: 20px;
  border: 2px solid #3b82f6;
  background: #eff6ff;
  /* Ajoutez la propriété box-sizing ici pour empêcher l'empilement */
}`,
      solutionHtml: `<div class="grille-flex">
  <div class="col-demo">Colonne Gauche (50%)</div>
  <div class="col-demo">Colonne Droite (50%)</div>
</div>`,
      solutionCss: `.grille-flex {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.col-demo {
  box-sizing: border-box;
  width: 50%;
  padding: 20px;
  border: 2px solid #3b82f6;
  background: #eff6ff;
}`,
      solutionExplanation: [
        'Sous content-box, la largeur totale était 50% + 40px (padding) + 4px (bordure), soit plus de 100% au cumul, provoquant un retour à la ligne forcé.',
        'Avec box-sizing: border-box, le padding et la bordure sont inclus dans les 50%, garantissant que 50% + 50% = 100% pile.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-border-box',
          label: 'Propriété box-sizing: border-box',
          description: '.col-demo a le style calculé box-sizing: border-box',
          passed: false,
          hint: 'Ajoutez "box-sizing: border-box;" sur .col-demo.'
        }
      ],
      validateFn: (doc: Document) => {
        const col = doc.querySelector('.col-demo') as HTMLElement;
        const bs = col ? doc.defaultView?.getComputedStyle(col).boxSizing : null;

        return [
          {
            criterionId: 'c-border-box',
            passed: bs === 'border-box',
            message: `box-sizing calculé : ${bs} (attendu: border-box)`
          }
        ];
      }
    },

    // =============================================
    // LABO 3 : Flexbox en Pratique (4 ex)
    // =============================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'Activation et direction Flexbox',
      subtitle: 'Mise en ligne d\'éléments avec espacement gap',
      sectionId: 'flexbox-lab',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Transformez le conteneur #badge-bar en conteneur flexible horizontal en lui appliquant display: flex, flex-direction: row, et un espacement uniforme de 12px entre les badges grâce à la propriété gap: 12px.',
      hint: 'Écrivez dans le CSS : #badge-bar { display: flex; flex-direction: row; gap: 12px; }',
      initialHtml: `<div id="badge-bar">
  <span class="badge-item">HTML5</span>
  <span class="badge-item">CSS3</span>
  <span class="badge-item">Bootstrap 5</span>
</div>`,
      initialCss: `#badge-bar {
  /* Activez Flexbox et configurez direction et gap */
  background: #f1f5f9;
  padding: 12px;
}

.badge-item {
  background: #7952b3;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
}`,
      solutionHtml: `<div id="badge-bar">
  <span class="badge-item">HTML5</span>
  <span class="badge-item">CSS3</span>
  <span class="badge-item">Bootstrap 5</span>
</div>`,
      solutionCss: `#badge-bar {
  display: flex;
  flex-direction: row;
  gap: 12px;
  background: #f1f5f9;
  padding: 12px;
}

.badge-item {
  background: #7952b3;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
}`,
      solutionExplanation: [
        'display: flex active le contexte de formatage flexible.',
        'flex-direction: row aligne les enfants horizontalement le long de l\'axe principal.',
        'gap: 12px crée un espacement net entre chaque badge sans polluer les extrémités avec des marges indésirables.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-display-flex',
          label: 'display: flex',
          description: '#badge-bar est un conteneur flex',
          passed: false,
          hint: 'Définissez display: flex;'
        },
        {
          id: 'c-flex-row',
          label: 'flex-direction: row',
          description: 'L\'axe principal est horizontal (row)',
          passed: false,
          hint: 'Définissez flex-direction: row;'
        },
        {
          id: 'c-gap-12',
          label: 'gap de 12px',
          description: 'L\'espacement inter-éléments est de 12px',
          passed: false,
          hint: 'Définissez gap: 12px;'
        }
      ],
      validateFn: (doc: Document) => {
        const bar = doc.querySelector('#badge-bar') as HTMLElement;
        const s = bar ? doc.defaultView?.getComputedStyle(bar) : null;

        return [
          {
            criterionId: 'c-display-flex',
            passed: s?.display === 'flex',
            message: `display calculé : ${s?.display} (attendu: flex)`
          },
          {
            criterionId: 'c-flex-row',
            passed: s?.flexDirection === 'row',
            message: `flexDirection calculé : ${s?.flexDirection} (attendu: row)`
          },
          {
            criterionId: 'c-gap-12',
            passed: s?.gap === '12px' || s?.columnGap === '12px',
            message: `gap calculé : ${s?.gap} (attendu: 12px)`
          }
        ];
      }
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Distribution horizontale avec space-between',
      subtitle: 'Aligner les extrémités d\'une barre de navigation',
      sectionId: 'flexbox-lab',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Dans la barre d\'en-tête .navbar-custom, utilisez Flexbox pour coller le logo à l\'extrémité gauche et le bouton d\'action à l\'extrémité droite en appliquant justify-content: space-between. Centrez également les éléments verticalement avec align-items: center.',
      hint: 'Ajoutez justify-content: space-between; et align-items: center; dans .navbar-custom.',
      initialHtml: `<header class="navbar-custom">
  <div class="logo">🚀 MonApp</div>
  <button class="action-btn">Connexion</button>
</header>`,
      initialCss: `.navbar-custom {
  display: flex;
  /* Ajoutez justify-content et align-items ici */
  padding: 12px 20px;
  background: #1e293b;
  color: white;
}

.action-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
}`,
      solutionHtml: `<header class="navbar-custom">
  <div class="logo">🚀 MonApp</div>
  <button class="action-btn">Connexion</button>
</header>`,
      solutionCss: `.navbar-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #1e293b;
  color: white;
}

.action-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
}`,
      solutionExplanation: [
        'justify-content: space-between répartit l\'espace disponible entre les deux enfants en les repoussant sur les bords opposés.',
        'align-items: center assure un alignement parfait sur l\'axe secondaire (vertical).'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-space-between',
          label: 'justify-content: space-between',
          description: 'Distribution des éléments aux extrémités',
          passed: false,
          hint: 'Appliquez justify-content: space-between;'
        },
        {
          id: 'c-align-center',
          label: 'align-items: center',
          description: 'Centrage vertical des éléments',
          passed: false,
          hint: 'Appliquez align-items: center;'
        }
      ],
      validateFn: (doc: Document) => {
        const nav = doc.querySelector('.navbar-custom') as HTMLElement;
        const s = nav ? doc.defaultView?.getComputedStyle(nav) : null;

        return [
          {
            criterionId: 'c-space-between',
            passed: s?.justifyContent === 'space-between',
            message: `justifyContent calculé : ${s?.justifyContent} (attendu: space-between)`
          },
          {
            criterionId: 'c-align-center',
            passed: s?.alignItems === 'center',
            message: `alignItems calculé : ${s?.alignItems} (attendu: center)`
          }
        ];
      }
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: 'Centrage absolu sur les deux axes',
      subtitle: 'La formule magique du centrage parfait',
      sectionId: 'flexbox-lab',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Centrez parfaitement le bouton au cœur du conteneur #cadre-hero (hauteur de 200px) en combinant display: flex, justify-content: center et align-items: center.',
      hint: 'Appliquez display: flex; justify-content: center; align-items: center; sur #cadre-hero.',
      initialHtml: `<div id="cadre-hero">
  <button class="cta-btn">Commencer l'Aventure</button>
</div>`,
      initialCss: `#cadre-hero {
  height: 200px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  /* Centrage parfait sur les 2 axes à implémenter ici */
}

.cta-btn {
  background: #10b981;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
}`,
      solutionHtml: `<div id="cadre-hero">
  <button class="cta-btn">Commencer l'Aventure</button>
</div>`,
      solutionCss: `#cadre-hero {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
}

.cta-btn {
  background: #10b981;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
}`,
      solutionExplanation: [
        'Le duo `justify-content: center` (axe principal) et `align-items: center` (axe secondaire) est la solution universelle moderne pour centrer n\'importe quel élément verticalement et horizontalement sans calcul complexe de marges ou de positionnement absolu.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-perfect-center',
          label: 'Centrage horizontal et vertical',
          description: '#cadre-hero a display: flex, justify-content: center et align-items: center',
          passed: false,
          hint: 'Combinez display: flex, justify-content: center et align-items: center.'
        }
      ],
      validateFn: (doc: Document) => {
        const el = doc.querySelector('#cadre-hero') as HTMLElement;
        const s = el ? doc.defaultView?.getComputedStyle(el) : null;
        const isOk = s?.display === 'flex' && s?.justifyContent === 'center' && s?.alignItems === 'center';

        return [
          {
            criterionId: 'c-perfect-center',
            passed: isOk,
            message: `Alignements calculés : display=${s?.display}, justify=${s?.justifyContent}, align=${s?.alignItems}`
          }
        ];
      }
    },
    {
      id: 'ex-3-4',
      labNumber: 3,
      number: '3.4',
      title: 'Empilement vertical en colonne',
      subtitle: 'Inversion de l\'axe principal avec flex-direction: column',
      sectionId: 'flexbox-lab',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Configurez la liste d\'options #menu-vertical pour qu\'elle empile ses éléments verticalement les uns sous les autres en utilisant flex-direction: column, avec un espacement de 8px (gap: 8px).',
      hint: 'Appliquez flex-direction: column; et gap: 8px; sur #menu-vertical.',
      initialHtml: `<div id="menu-vertical">
  <div class="menu-item">Tableau de bord</div>
  <div class="menu-item">Utilisateurs</div>
  <div class="menu-item">Paramètres</div>
</div>`,
      initialCss: `#menu-vertical {
  display: flex;
  /* Passez la direction en colonne et appliquez gap: 8px */
}

.menu-item {
  background: #f1f5f9;
  padding: 8px 16px;
  border-radius: 4px;
}`,
      solutionHtml: `<div id="menu-vertical">
  <div class="menu-item">Tableau de bord</div>
  <div class="menu-item">Utilisateurs</div>
  <div class="menu-item">Paramètres</div>
</div>`,
      solutionCss: `#menu-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  background: #f1f5f9;
  padding: 8px 16px;
  border-radius: 4px;
}`,
      solutionExplanation: [
        'En passant `flex-direction` à `column`, l\'axe principal devient vertical (du haut vers le bas).',
        'Les éléments s\'empilent alors naturellement tout en conservant la puissance du gap et des alignements.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-col-direction',
          label: 'flex-direction: column',
          description: '#menu-vertical a flex-direction: column',
          passed: false,
          hint: 'Définissez flex-direction: column;'
        },
        {
          id: 'c-col-gap',
          label: 'gap: 8px',
          description: 'L\'espacement entre éléments est de 8px',
          passed: false,
          hint: 'Définissez gap: 8px;'
        }
      ],
      validateFn: (doc: Document) => {
        const el = doc.querySelector('#menu-vertical') as HTMLElement;
        const s = el ? doc.defaultView?.getComputedStyle(el) : null;

        return [
          {
            criterionId: 'c-col-direction',
            passed: s?.flexDirection === 'column',
            message: `flexDirection calculé : ${s?.flexDirection} (attendu: column)`
          },
          {
            criterionId: 'c-col-gap',
            passed: s?.gap === '8px' || s?.rowGap === '8px',
            message: `gap calculé : ${s?.gap} (attendu: 8px)`
          }
        ];
      }
    },

    // =======================================================
    // LABO 4 : Grille Responsive Bootstrap (5 ex)
    // =======================================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: 'Grille 2 colonnes égales (50% / 50%)',
      subtitle: 'Structure standard .container > .row > .col-6',
      sectionId: 'bootstrap-grid',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Utilisez le système de grille Bootstrap 5 pour créer un conteneur centré (<div class="container">) renfermant une ligne (<div class="row">) divisée en deux colonnes d\'égale largeur (<div class="col-6">).',
      hint: 'Modèle Bootstrap : <div class="container"><div class="row"><div class="col-6">Col 1</div><div class="col-6">Col 2</div></div></div>',
      initialHtml: `<!-- Construisez la grille Bootstrap ici -->
<div>
  <div>Colonne Gauche (6/12)</div>
  <div>Colonne Droite (6/12)</div>
</div>`,
      initialCss: `/* Le CSS de Bootstrap 5 est déjà actif ! */
.col-6 {
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  padding: 16px;
  text-align: center;
}`,
      solutionHtml: `<div class="container">
  <div class="row">
    <div class="col-6">Colonne Gauche (6/12)</div>
    <div class="col-6">Colonne Droite (6/12)</div>
  </div>
</div>`,
      solutionCss: `.col-6 {
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  padding: 16px;
  text-align: center;
}`,
      solutionExplanation: [
        'Le `.container` applique des marges de sécurité horizontales et centre le contenu.',
        'La `.row` est un conteneur flex avec des marges négatives compensant les gouttières.',
        'Deux colonnes `.col-6` totalisent 6 + 6 = 12 colonnes, soit un partage parfait à 50% / 50%.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-has-container-row',
          label: 'Structure .container > .row',
          description: 'Présence d\'un .container abritant un .row',
          passed: false,
          hint: 'Vérifiez les classes class="container" et class="row".'
        },
        {
          id: 'c-two-col-6',
          label: 'Deux colonnes .col-6',
          description: 'La ligne contient au moins 2 éléments avec la classe .col-6',
          passed: false,
          hint: 'Ajoutez class="col-6" sur chacune des deux colonnes.'
        }
      ],
      validateFn: (doc: Document) => {
        const container = doc.querySelector('.container');
        const row = container ? container.querySelector('.row') : null;
        const col6s = row ? row.querySelectorAll('.col-6') : [];

        return [
          {
            criterionId: 'c-has-container-row',
            passed: !!container && !!row,
            message: !container ? '.container manquant' : (!row ? '.row manquant dans .container' : undefined)
          },
          {
            criterionId: 'c-two-col-6',
            passed: col6s.length >= 2,
            message: `Trouvé ${col6s.length} colonne(s) .col-6 (2 attendues)`
          }
        ];
      }
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Grille asymétrique (Sidebar 3 / Contenu 9)',
      subtitle: 'Disposition classique avec total de 12 colonnes',
      sectionId: 'bootstrap-grid',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Concevez une disposition asymétrique dans un .container > .row : une barre latérale occupant 3 colonnes (.col-3) et une zone de contenu principal occupant 9 colonnes (.col-9).',
      hint: 'Combinez <div class="col-3">Sidebar</div> et <div class="col-9">Contenu principal</div>.',
      initialHtml: `<div class="container">
  <div class="row">
    <!-- Remplacez par les classes col-3 et col-9 -->
    <div>Barre Latérale (3/12)</div>
    <div>Zone Principale (9/12)</div>
  </div>
</div>`,
      initialCss: `.col-3 {
  background: #f1f5f9;
  padding: 16px;
}
.col-9 {
  background: #f8fafc;
  padding: 16px;
}`,
      solutionHtml: `<div class="container">
  <div class="row">
    <div class="col-3">Barre Latérale (3/12)</div>
    <div class="col-9">Zone Principale (9/12)</div>
  </div>
</div>`,
      solutionCss: `.col-3 {
  background: #f1f5f9;
  padding: 16px;
}
.col-9 {
  background: #f8fafc;
  padding: 16px;
}`,
      solutionExplanation: [
        'Le total 3 + 9 = 12 remplit exactement une ligne Bootstrap sans débordement.',
        'La barre latérale prend 25% de la largeur et le contenu prend 75%.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-col-3-and-9',
          label: 'Présence de .col-3 et .col-9',
          description: 'La ligne contient une colonne .col-3 et une colonne .col-9',
          passed: false,
          hint: 'Ajoutez les classes "col-3" et "col-9".'
        }
      ],
      validateFn: (doc: Document) => {
        const row = doc.querySelector('.container .row');
        const col3 = row ? row.querySelector('.col-3') : null;
        const col9 = row ? row.querySelector('.col-9') : null;

        return [
          {
            criterionId: 'c-col-3-and-9',
            passed: !!col3 && !!col9,
            message: !col3 ? 'Colonne .col-3 manquante' : (!col9 ? 'Colonne .col-9 manquante' : undefined)
          }
        ];
      }
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: 'Grille responsive Mobile-First',
      subtitle: 'La combinaison reine : col-12 col-md-6 col-lg-4',
      sectionId: 'bootstrap-grid',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Créez 3 cartes dans une .row appliquant la règle responsive Mobile-First : pleine largeur sur mobile (col-12), 2 éléments par ligne sur tablette à partir de 768px (col-md-6) et 3 éléments par ligne sur écran d\'ordinateur à partir de 992px (col-lg-4).',
      hint: 'Appliquez la classe combinée "col-12 col-md-6 col-lg-4" sur les 3 colonnes.',
      initialHtml: `<div class="container">
  <div class="row">
    <!-- Appliquez la classe combinée sur chacune des 3 colonnes -->
    <div>Carte A</div>
    <div>Carte B</div>
    <div>Carte C</div>
  </div>
</div>`,
      initialCss: `.col-12 {
  padding: 12px;
}
.card-box {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 16px;
  border-radius: 6px;
}`,
      solutionHtml: `<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card-box">Carte A</div>
    </div>
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card-box">Carte B</div>
    </div>
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card-box">Carte C</div>
    </div>
  </div>
</div>`,
      solutionCss: `.col-12 {
  padding: 12px;
}
.card-box {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 16px;
  border-radius: 6px;
}`,
      solutionExplanation: [
        '`col-12` (par défaut sur écran < 768px) : 100% de largeur, 1 carte par ligne.',
        '`col-md-6` (≥ 768px) : 50% de largeur, 2 cartes par ligne.',
        '`col-lg-4` (≥ 992px) : 33.33% de largeur, 3 cartes par ligne.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-3-responsive-cols',
          label: '3 colonnes avec les 3 breakpoints',
          description: 'Au moins 3 colonnes possèdent "col-12 col-md-6 col-lg-4"',
          passed: false,
          hint: 'Vérifiez que vos 3 div possèdent class="col-12 col-md-6 col-lg-4".'
        }
      ],
      validateFn: (doc: Document) => {
        const cols = doc.querySelectorAll('.row > div');
        let validCount = 0;

        cols.forEach(el => {
          if (el.classList.contains('col-12') && el.classList.contains('col-md-6') && el.classList.contains('col-lg-4')) {
            validCount++;
          }
        });

        return [
          {
            criterionId: 'c-3-responsive-cols',
            passed: validCount >= 3,
            message: `Trouvé ${validCount} colonne(s) avec la classe complète col-12 col-md-6 col-lg-4 (3 requises)`
          }
        ];
      }
    },
    {
      id: 'ex-4-4',
      labNumber: 4,
      number: '4.4',
      title: 'Gestion de la gouttière (.g-3)',
      subtitle: 'Espacement uniforme sans déborder du conteneur',
      sectionId: 'bootstrap-grid',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Ajoutez la classe utilitaire de gouttière .g-3 sur la balise .row afin de créer un espacement uniforme de niveau 3 (1rem / 16px) entre les colonnes et entre les lignes.',
      hint: 'Écrivez <div class="row g-3">.',
      initialHtml: `<div class="container">
  <!-- Ajoutez la classe g-3 à la ligne row -->
  <div class="row">
    <div class="col-6"><div class="p-3 bg-light border">Bloc 1</div></div>
    <div class="col-6"><div class="p-3 bg-light border">Bloc 2</div></div>
    <div class="col-6"><div class="p-3 bg-light border">Bloc 3</div></div>
    <div class="col-6"><div class="p-3 bg-light border">Bloc 4</div></div>
  </div>
</div>`,
      initialCss: `/* Bootstrap 5 gère automatiquement la gouttière */`,
      solutionHtml: `<div class="container">
  <div class="row g-3">
    <div class="col-6"><div class="p-3 bg-light border">Bloc 1</div></div>
    <div class="col-6"><div class="p-3 bg-light border">Bloc 2</div></div>
    <div class="col-6"><div class="p-3 bg-light border">Bloc 3</div></div>
    <div class="col-6"><div class="p-3 bg-light border">Bloc 4</div></div>
  </div>
</div>`,
      solutionCss: ``,
      solutionExplanation: [
        'La classe `.g-3` définit simultanément les gouttières horizontales (`gx-3`) et verticales (`gy-3`).',
        'Bootstrap ajuste les marges négatives de la `.row` et les paddings des `.col` pour éviter tout débordement horizontal.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-row-g3',
          label: 'Classe .g-3 sur la .row',
          description: 'L\'élément .row possède la classe g-3',
          passed: false,
          hint: 'Ajoutez la classe g-3 sur la ligne : <div class="row g-3">'
        }
      ],
      validateFn: (doc: Document) => {
        const row = doc.querySelector('.row');
        const hasG3 = row ? row.classList.contains('g-3') : false;

        return [
          {
            criterionId: 'c-row-g3',
            passed: hasG3,
            message: !hasG3 ? 'La classe g-3 n\'est pas présente sur la balise .row' : undefined
          }
        ];
      }
    },
    {
      id: 'ex-4-5',
      labNumber: 4,
      number: '4.5',
      title: 'Réinitialisation automatique des colonnes',
      subtitle: 'Comprendre le passage à la ligne au-delà de 12',
      sectionId: 'bootstrap-grid',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Créez une seule ligne .row contenant trois colonnes .col-8, .col-4 et .col-6. Constatez que 8 + 4 = 12 (ligne 1 complète), puis la troisième colonne .col-6 passe automatiquement à la ligne suivante sans nécessiter de nouvelle balise .row.',
      hint: 'Créez <div class="row"><div class="col-8">...</div><div class="col-4">...</div><div class="col-6">...</div></div>.',
      initialHtml: `<div class="container">
  <div class="row">
    <!-- Insérez les colonnes col-8, col-4 et col-6 -->
  </div>
</div>`,
      initialCss: `.col-8, .col-4, .col-6 {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 14px;
}`,
      solutionHtml: `<div class="container">
  <div class="row">
    <div class="col-8">Première colonne (8 unités)</div>
    <div class="col-4">Deuxième colonne (4 unités - fin de ligne)</div>
    <div class="col-6">Troisième colonne (6 unités - nouvelle ligne automatique)</div>
  </div>
</div>`,
      solutionCss: `.col-8, .col-4, .col-6 {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 14px;
}`,
      solutionExplanation: [
        'Le système Flexbox de Bootstrap est configuré avec `flex-wrap: wrap`. Dès que la somme des largeurs dépasse 12 colonnes, l\'élément suivant est automatiquement rejeté sur la ligne d\'en-dessous.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-cols-overflow',
          label: 'Présence de .col-8, .col-4 et .col-6',
          description: 'La même ligne contient .col-8, .col-4 et .col-6',
          passed: false,
          hint: 'Ajoutez les 3 colonnes avec col-8, col-4 et col-6 dans la même .row.'
        }
      ],
      validateFn: (doc: Document) => {
        const row = doc.querySelector('.row');
        const c8 = row ? row.querySelector('.col-8') : null;
        const c4 = row ? row.querySelector('.col-4') : null;
        const c6 = row ? row.querySelector('.col-6') : null;

        return [
          {
            criterionId: 'c-cols-overflow',
            passed: !!c8 && !!c4 && !!c6,
            message: (!c8 ? '.col-8 manquant ' : '') + (!c4 ? '.col-4 manquant ' : '') + (!c6 ? '.col-6 manquant' : '')
          }
        ];
      }
    },

    // ========================================================
    // LABO 5 : Composants & Utilitaires Bootstrap (5 ex)
    // ========================================================
    {
      id: 'ex-5-1',
      labNumber: 5,
      number: '5.1',
      title: 'Boutons thématiques Bootstrap',
      subtitle: 'Variations pleines et avec contour (.btn-outline-*)',
      sectionId: 'bootstrap-components',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement: 'Créez deux boutons Bootstrap : le premier avec le style principal plein (btn btn-primary) et le second avec un style de contour d\'avertissement (btn btn-outline-warning).',
      hint: 'Écrivez <button class="btn btn-primary">Valider</button> et <button class="btn btn-outline-warning">Attention</button>.',
      initialHtml: `<!-- Créez les 2 boutons Bootstrap demandés -->
<div class="p-3">
  <!-- Bouton 1 : btn btn-primary -->
  <!-- Bouton 2 : btn btn-outline-warning -->
</div>`,
      initialCss: `/* Bootstrap fournit tous les styles de boutons */`,
      solutionHtml: `<div class="p-3">
  <button class="btn btn-primary me-2">Valider l'action</button>
  <button class="btn btn-outline-warning">Avertissement</button>
</div>`,
      solutionCss: ``,
      solutionExplanation: [
        '.btn initialise la typographie, les transitions et les bordures.',
        '.btn-primary applique la couleur de marque primaire pleine.',
        '.btn-outline-warning crée un fond transparent avec bordure colorée s\'inversant au survol.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-btn-primary',
          label: 'Bouton .btn-primary',
          description: 'Présence d\'un bouton avec class="btn btn-primary"',
          passed: false,
          hint: 'Vérifiez la classe "btn btn-primary".'
        },
        {
          id: 'c-btn-outline-warning',
          label: 'Bouton .btn-outline-warning',
          description: 'Présence d\'un bouton avec class="btn btn-outline-warning"',
          passed: false,
          hint: 'Vérifiez la classe "btn btn-outline-warning".'
        }
      ],
      validateFn: (doc: Document) => {
        const bp = doc.querySelector('.btn.btn-primary');
        const bow = doc.querySelector('.btn.btn-outline-warning');

        return [
          {
            criterionId: 'c-btn-primary',
            passed: !!bp,
            message: !bp ? 'Bouton .btn.btn-primary manquant' : undefined
          },
          {
            criterionId: 'c-btn-outline-warning',
            passed: !!bow,
            message: !bow ? 'Bouton .btn.btn-outline-warning manquant' : undefined
          }
        ];
      }
    },
    {
      id: 'ex-5-2',
      labNumber: 5,
      number: '5.2',
      title: 'Carte structurée complète (.card)',
      subtitle: 'Anatomie d\'une carte Bootstrap avec ombre',
      sectionId: 'bootstrap-components',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Construisez une carte Bootstrap complète : un conteneur .card doté d\'une ombre légère (.shadow-sm), contenant un corps de carte (.card-body) avec un titre (.card-title) et un paragraphe de description (.card-text).',
      hint: 'Structure : <div class="card shadow-sm"><div class="card-body"><h5 class="card-title">Titre</h5><p class="card-text">Texte</p></div></div>',
      initialHtml: `<!-- Construisez la carte ici -->
<div>
  <h5>Titre</h5>
  <p>Description</p>
</div>`,
      initialCss: ``,
      solutionHtml: `<div class="card shadow-sm" style="max-width: 350px;">
  <div class="card-body">
    <h5 class="card-title">Séance 4 — HTML/CSS</h5>
    <p class="card-text">Apprenez à structurer des interfaces professionnelles avec Bootstrap 5.</p>
    <a href="#" class="btn btn-primary">Explorer</a>
  </div>
</div>`,
      solutionCss: ``,
      solutionExplanation: [
        '.card forme le conteneur arrondi avec bordure subtile.',
        '.shadow-sm injecte une ombre portée élégante.',
        '.card-body fournit le padding interne adéquat (1rem / 16px).',
        '.card-title et .card-text gèrent la hiérarchie typographique.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-card-shadow',
          label: 'Conteneur .card.shadow-sm',
          description: 'Présence d\'un élément cumulant .card et .shadow-sm',
          passed: false,
          hint: 'Appliquez class="card shadow-sm".'
        },
        {
          id: 'c-card-body-elements',
          label: '.card-body avec titre et texte',
          description: '.card-body contient .card-title et .card-text',
          passed: false,
          hint: 'Vérifiez .card-body, .card-title et .card-text.'
        }
      ],
      validateFn: (doc: Document) => {
        const card = doc.querySelector('.card.shadow-sm');
        const body = card ? card.querySelector('.card-body') : null;
        const title = body ? body.querySelector('.card-title') : null;
        const text = body ? body.querySelector('.card-text') : null;

        return [
          {
            criterionId: 'c-card-shadow',
            passed: !!card,
            message: !card ? 'Élément avec classes "card shadow-sm" manquant' : undefined
          },
          {
            criterionId: 'c-card-body-elements',
            passed: !!body && !!title && !!text,
            message: !body ? '.card-body manquant' : (!title ? '.card-title manquant dans le body' : (!text ? '.card-text manquant' : undefined))
          }
        ];
      }
    },
    {
      id: 'ex-5-3',
      labNumber: 5,
      number: '5.3',
      title: 'Alignement des hauteurs avec .h-100',
      subtitle: 'Égaliser les hauteurs de cartes côte à côte',
      sectionId: 'bootstrap-components',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Deux cartes adjacentes possèdent des quantités de texte très inégales, créant un déséquilibre inesthétique. Ajoutez la classe utilitaire .h-100 sur les deux balises .card pour forcer leur hauteur à 100% de la colonne parente et égaliser leur alignement.',
      hint: 'Modifiez <div class="card"> en <div class="card h-100"> sur les deux cartes.',
      initialHtml: `<div class="container">
  <div class="row g-3">
    <div class="col-md-6">
      <!-- Ajoutez h-100 à la classe card -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Carte Courte</h5>
          <p class="card-text">Quelques mots seulement.</p>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <!-- Ajoutez h-100 à la classe card -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Carte Longue</h5>
          <p class="card-text">Un paragraphe beaucoup plus détaillé avec plusieurs phrases d'explications et des détails techniques nécessitant beaucoup plus de hauteur que la carte voisine.</p>
        </div>
      </div>
    </div>
  </div>
</div>`,
      initialCss: ``,
      solutionHtml: `<div class="container">
  <div class="row g-3">
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">Carte Courte</h5>
          <p class="card-text">Quelques mots seulement.</p>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">Carte Longue</h5>
          <p class="card-text">Un paragraphe beaucoup plus détaillé avec plusieurs phrases d'explications et des détails techniques nécessitant beaucoup plus de hauteur que la carte voisine.</p>
        </div>
      </div>
    </div>
  </div>
</div>`,
      solutionCss: ``,
      solutionExplanation: [
        'Dans une grille Bootstrap, les colonnes flex s\'étirent par défaut à la hauteur de la plus grande (stretch).',
        'En appliquant `.h-100` (`height: 100% !important;`) sur la `.card`, celle-ci remplit l\'intégralité de sa colonne hôte, créant un bas de carte parfaitement aligné.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-cards-h100',
          label: 'Les 2 cartes possèdent .h-100',
          description: 'Deux éléments .card possèdent la classe .h-100',
          passed: false,
          hint: 'Ajoutez class="card h-100" sur les deux cartes.'
        }
      ],
      validateFn: (doc: Document) => {
        const cardsH100 = doc.querySelectorAll('.card.h-100');

        return [
          {
            criterionId: 'c-cards-h100',
            passed: cardsH100.length >= 2,
            message: `Trouvé ${cardsH100.length} carte(s) avec la classe .h-100 (2 attendues)`
          }
        ];
      }
    },
    {
      id: 'ex-5-4',
      labNumber: 5,
      number: '5.4',
      title: 'Formulaire soigné avec Bootstrap',
      subtitle: 'Composants form-label, form-control et marge basse mb-3',
      sectionId: 'bootstrap-components',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Mettez en forme un champ de formulaire pour la saisie de l\'email : un conteneur avec marge basse (.mb-3), un label portant la classe .form-label (relié par for="email"), et un champ texte input de type email portant la classe .form-control (avec id="email").',
      hint: 'Structure : <div class="mb-3"><label for="email" class="form-label">Email</label><input type="email" class="form-control" id="email"></div>',
      initialHtml: `<!-- Mettez en forme ce champ avec les classes Bootstrap -->
<form>
  <div>
    <label>Votre courriel</label>
    <input type="email" />
  </div>
  <button type="submit" class="btn btn-primary">Envoyer</button>
</form>`,
      initialCss: ``,
      solutionHtml: `<form>
  <div class="mb-3">
    <label for="email" class="form-label">Votre courriel</label>
    <input type="email" class="form-control" id="email" placeholder="nom@exemple.com" />
  </div>
  <button type="submit" class="btn btn-primary">Envoyer</button>
</form>`,
      solutionCss: ``,
      solutionExplanation: [
        '.mb-3 applique une marge basse standard de 1rem (16px) séparant les champs.',
        '.form-label configure la taille de police et la marge sous le texte du libellé.',
        '.form-control confère au champ sa pleine largeur (100%), ses bordures douces et son halo bleuté au focus.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-mb3-wrapper',
          label: 'Conteneur avec classe mb-3',
          description: 'Le groupe de champ est englobé dans un conteneur .mb-3',
          passed: false,
          hint: 'Ajoutez class="mb-3" sur le div englobant le label et l\'input.'
        },
        {
          id: 'c-form-label-control',
          label: 'Classes .form-label et .form-control',
          description: 'Le label a .form-label et l\'input a .form-control avec id="email"',
          passed: false,
          hint: 'Vérifiez class="form-label" sur le label et class="form-control" id="email" sur l\'input.'
        }
      ],
      validateFn: (doc: Document) => {
        const mb3 = doc.querySelector('.mb-3');
        const label = doc.querySelector('label.form-label');
        const input = doc.querySelector('input.form-control#email');

        return [
          {
            criterionId: 'c-mb3-wrapper',
            passed: !!mb3,
            message: !mb3 ? 'Conteneur .mb-3 introuvable' : undefined
          },
          {
            criterionId: 'c-form-label-control',
            passed: !!label && !!input,
            message: !label ? 'Label avec classe .form-label manquant' : (!input ? 'Input avec classe .form-control et id="email" manquant' : undefined)
          }
        ];
      }
    },
    {
      id: 'ex-5-5',
      labNumber: 5,
      number: '5.5',
      title: 'Centrage et espacements utilitaires',
      subtitle: 'Maîtriser .mx-auto et les échelles de padding .p-*',
      sectionId: 'bootstrap-components',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Appliquez sur la boîte .panneau-alerte la classe de centrage horizontal automatique .mx-auto (margin-left: auto; margin-right: auto) et un padding interne de niveau 4 (.p-4, soit 1.5rem / 24px).',
      hint: 'Ajoutez les classes "mx-auto p-4" sur la balise .panneau-alerte.',
      initialHtml: `<div class="container py-4">
  <!-- Ajoutez mx-auto et p-4 sur cet élément -->
  <div class="panneau-alerte bg-light border text-center" style="max-width: 400px;">
    <h4>Notification importante</h4>
    <p class="mb-0">Votre compte a été synchronisé avec succès.</p>
  </div>
</div>`,
      initialCss: ``,
      solutionHtml: `<div class="container py-4">
  <div class="panneau-alerte mx-auto p-4 bg-light border text-center" style="max-width: 400px;">
    <h4>Notification importante</h4>
    <p class="mb-0">Votre compte a été synchronisé avec succès.</p>
  </div>
</div>`,
      solutionCss: ``,
      solutionExplanation: [
        '.mx-auto applique `margin-right: auto` et `margin-left: auto`, centrant un bloc à largeur restreinte au milieu de son conteneur.',
        '.p-4 applique 1.5rem (24px) de padding interne sur les 4 côtés.'
      ],
      isCompleted: false,
      criteria: [
        {
          id: 'c-mx-auto',
          label: 'Centrage horizontal avec .mx-auto',
          description: '.panneau-alerte possède la classe mx-auto',
          passed: false,
          hint: 'Ajoutez la classe mx-auto sur l\'élément.'
        },
        {
          id: 'c-p4-padding',
          label: 'Marge interne .p-4',
          description: '.panneau-alerte possède la classe p-4',
          passed: false,
          hint: 'Ajoutez la classe p-4 sur l\'élément.'
        }
      ],
      validateFn: (doc: Document) => {
        const el = doc.querySelector('.panneau-alerte');
        const hasMxAuto = el ? el.classList.contains('mx-auto') : false;
        const hasP4 = el ? el.classList.contains('p-4') : false;

        return [
          {
            criterionId: 'c-mx-auto',
            passed: hasMxAuto,
            message: !hasMxAuto ? 'Classe mx-auto manquante' : undefined
          },
          {
            criterionId: 'c-p4-padding',
            passed: hasP4,
            message: !hasP4 ? 'Classe p-4 manquante' : undefined
          }
        ];
      }
    }
  ];

  readonly exercises = signal<Exercise[]>(this.RAW_EXERCISES.map(e => ({ ...e, currentHtml: e.initialHtml, currentCss: e.initialCss })));

  readonly activeExerciseId = signal<string>('ex-1-1');

  readonly activeExercise = computed<Exercise>(() => {
    const list = this.exercises();
    return list.find(e => e.id === this.activeExerciseId()) || list[0];
  });

  readonly totalCount = computed(() => this.exercises().length);

  readonly completedCount = computed(() => {
    return this.exercises().filter(e => e.isCompleted).length;
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  constructor(private readonly confetti: ConfettiService) {
    this.exercises.update(list => list.map(e => ({
      ...e,
      currentHtml: e.currentHtml ?? e.initialHtml,
      currentCss: e.currentCss ?? e.initialCss
    })));
    this.loadProgress();
  }

  selectExercise(id: string): void {
    if (this.exercises().some(e => e.id === id)) {
      this.activeExerciseId.set(id);
    }
  }

  getExercisesByLab(labNumber: number): Exercise[] {
    return this.exercises().filter(e => e.labNumber === labNumber);
  }

  getExercisesBySection(sectionId: TabId): Exercise[] {
    return this.exercises().filter(e => e.sectionId === sectionId);
  }

  updateExerciseCode(id: string, html: string, css: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === id) {
          return { ...ex, currentHtml: html, currentCss: css };
        }
        return ex;
      });
    });
    this.saveProgress();
  }

  resetExercise(id: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === id) {
          return {
            ...ex,
            currentHtml: ex.initialHtml,
            currentCss: ex.initialCss,
            isCompleted: false,
            criteria: ex.criteria.map(c => ({ ...c, passed: false }))
          };
        }
        return ex;
      });
    });
    this.saveProgress();
  }

  injectSolution(id: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === id) {
          return {
            ...ex,
            currentHtml: ex.solutionHtml,
            currentCss: ex.solutionCss
          };
        }
        return ex;
      });
    });
  }

  evaluateExercise(id: string, doc: Document): ValidationSummary {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) {
      return { success: false, passedCount: 0, totalCount: 0, messages: ['Exercice introuvable'] };
    }

    const testResults = ex.validateFn(doc);
    const messages: string[] = [];

    let passedCount = 0;
    const updatedCriteria = ex.criteria.map(criterion => {
      const result = testResults.find(r => r.criterionId === criterion.id);
      const passed = !!result?.passed;
      if (passed) {
        passedCount++;
      } else if (result?.message) {
        messages.push(result.message);
      }
      return { ...criterion, passed };
    });

    const isSuccess = passedCount === ex.criteria.length;

    this.exercises.update(list => {
      return list.map(item => {
        if (item.id === id) {
          return {
            ...item,
            criteria: updatedCriteria,
            isCompleted: isSuccess
          };
        }
        return item;
      });
    });

    this.saveProgress();

    if (isSuccess) {
      this.confetti.celebrate();
    }

    return {
      success: isSuccess,
      passedCount,
      totalCount: ex.criteria.length,
      messages
    };
  }

  private loadProgress(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as Record<string, { currentHtml: string; currentCss: string; isCompleted: boolean }>;
        this.exercises.update(list => {
          return list.map(ex => {
            const saved = parsed[ex.id];
            if (saved) {
              return {
                ...ex,
                currentHtml: saved.currentHtml ?? ex.initialHtml,
                currentCss: saved.currentCss ?? ex.initialCss,
                isCompleted: saved.isCompleted ?? false,
                criteria: ex.criteria.map(c => ({ ...c, passed: saved.isCompleted ?? false }))
              };
            }
            return ex;
          });
        });
      }
    } catch (e) {
      console.warn('[ExerciseService] Erreur lecture localStorage', e);
    }
  }

  private saveProgress(): void {
    if (typeof window === 'undefined') return;

    try {
      const state: Record<string, { currentHtml: string; currentCss: string; isCompleted: boolean }> = {};
      this.exercises().forEach(ex => {
        state[ex.id] = {
          currentHtml: ex.currentHtml ?? ex.initialHtml,
          currentCss: ex.currentCss ?? ex.initialCss,
          isCompleted: ex.isCompleted
        };
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[ExerciseService] Erreur sauvegarde localStorage', e);
    }
  }
}
