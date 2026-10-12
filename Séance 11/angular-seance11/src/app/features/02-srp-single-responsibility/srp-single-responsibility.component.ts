import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-srp-single-responsibility',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 11 · Pilier 1</span>
          <span class="badge badge-blue">S : Single Responsibility</span>
          <span class="badge badge-purple">Haute Cohésion</span>
        </div>
        <h2>'S' — Single Responsibility Principle (SRP)</h2>
        <p class="module-desc">
          <em>« Une classe ne doit avoir qu'une seule et unique raison de changer. »</em> — Robert C. Martin.
          Une responsabilité correspond à un <strong>acteur métier</strong> ou une <strong>source d'exigences</strong>.
          Démantelez les classes « Dieu » (<em>God Objects</em>) et organisez une brigade d'experts spécialisés.
        </p>

        <!-- Bascule Théorie & Simulateurs vs Atelier Pratique -->
        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'interactive'"
            (click)="activeMode.set('interactive')"
          >
            🔬 Simulateurs &amp; Audit SRP
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            💻 Atelier Monaco (Labo 1 · 4 Exercices)
          </button>
        </div>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- SIMULATEUR 1 : GOD OBJECT VS BRIGADE SPÉCIALISÉE -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-blue">Démonstrateur #1</span>
            <h3>Visualiseur : God Object vs Brigade Spécialisée</h3>
          </div>
          <p class="section-intro">
            Observez la classe <code>RapportVente</code>. Elle cumule la logique financière, la mise en forme HTML et l'écriture sur disque.
            Explorez les 3 raisons de changer ou décomposez-la instantanément en 3 briques spécialisées :
          </p>

          <div class="stepper-controls-row">
            <span class="control-label">Inspecter par Acteur :</span>
            <button class="choice-btn" [class.active]="inspectedActor() === 'all'" (click)="inspectedActor.set('all')">
              Vue Globale (Tout-en-un)
            </button>
            <button class="choice-btn" [class.active]="inspectedActor() === 'finance'" (click)="inspectedActor.set('finance')">
              💼 1. Acteur Finance (Calcul Métier)
            </button>
            <button class="choice-btn" [class.active]="inspectedActor() === 'design'" (click)="inspectedActor.set('design')">
              🎨 2. Acteur UI (Rendu HTML)
            </button>
            <button class="choice-btn" [class.active]="inspectedActor() === 'sysadmin'" (click)="inspectedActor.set('sysadmin')">
              ☁️ 3. Acteur DevOps (Stockage I/O)
            </button>

            <button class="btn-primary btn-sm ml-auto" (click)="toggleDecomposition()">
              {{ isDecomposed() ? '⏪ Revenir au Monolithe' : '✨ Décomposer en Brigade Spécialisée' }}
            </button>
          </div>

          <!-- Affichage du code ou des briques décomposées -->
          <div class="split-architecture-box mt-3">
            @if (!isDecomposed()) {
              <!-- CODE MONOLITHE AVEC ZONES COLORÉES -->
              <div class="monolith-code-view">
                <div class="code-zone" [class.highlighted]="inspectedActor() === 'all' || inspectedActor() === 'finance'">
                  <div class="zone-tag tag-finance">Responsabilité 1 · Cœur Métier (Directeur Financier)</div>
                  <pre><code>export class RapportVente &#123;
  private ventes: Vente[] = [];
  ajouterVente(v: Vente) &#123; this.ventes.push(v); &#125;
  calculerTotal(): number &#123; return this.ventes.reduce((acc, v) => acc + v.montant, 0); &#125;
  calculerTva(taux: number): number &#123; return this.calculerTotal() * taux; &#125;</code></pre>
                </div>

                <div class="code-zone" [class.highlighted]="inspectedActor() === 'all' || inspectedActor() === 'design'">
                  <div class="zone-tag tag-design">Responsabilité 2 · Présentation UI (Designer Front)</div>
                  <pre><code>  formaterEnHtml(): string &#123;
    const rows = this.ventes.map(v => \`&lt;tr&gt;&lt;td&gt;\${{ 'v.label' }}&lt;/td&gt;&lt;/tr&gt;\`).join('');
    return \`&lt;div class="rapport"&gt;&lt;h1&gt;Ventes&lt;/h1&gt;&lt;table&gt;\${{ 'rows' }}&lt;/table&gt;&lt;/div&gt;\`;
  &#125;</code></pre>
                </div>

                <div class="code-zone" [class.highlighted]="inspectedActor() === 'all' || inspectedActor() === 'sysadmin'">
                  <div class="zone-tag tag-sysadmin">Responsabilité 3 · Infrastructure I/O (Sysadmin / Cloud)</div>
                  <pre><code>  sauvegarderFichier(chemin: string): void &#123;
    const contenu = this.formaterEnHtml();
    fs.writeFileSync(chemin, contenu, 'utf-8'); // Couplage lourd !
  &#125;
&#125;</code></pre>
                </div>
              </div>
            } @else {
              <!-- BRIGADE DÉCOMPOSÉE (3 CLASSES) -->
              <div class="brigade-grid">
                <div class="brigade-card card-metier">
                  <div class="b-header">
                    <span class="icon">💼</span>
                    <span class="name">RapportVente</span>
                  </div>
                  <p class="b-desc">Ne gère <strong>que</strong> les données et les règles comptables pures en RAM.</p>
                  <pre><code>export class RapportVente &#123;
  ajouterVente(...) &#123; ... &#125;
  calculerTotal(): number &#123; ... &#125;
&#125;</code></pre>
                  <span class="b-foot">1 Raison : Évolution des règles financières</span>
                </div>

                <div class="brigade-card card-ui">
                  <div class="b-header">
                    <span class="icon">🎨</span>
                    <span class="name">FormateurRapportHtml</span>
                  </div>
                  <p class="b-desc">Ne gère <strong>que</strong> la restitution visuelle (HTML, Tailwind, CSS).</p>
                  <pre><code>export class FormateurRapportHtml &#123;
  formater(rapport: RapportVente): string &#123;
    // Produit le HTML pur
  &#125;
&#125;</code></pre>
                  <span class="b-foot">1 Raison : Refonte de la charte graphique</span>
                </div>

                <div class="brigade-card card-io">
                  <div class="b-header">
                    <span class="icon">☁️</span>
                    <span class="name">PersistenceFichier</span>
                  </div>
                  <p class="b-desc">Ne gère <strong>que</strong> les entrées/sorties (I/O, disque, cloud S3).</p>
                  <pre><code>export class PersistenceFichier &#123;
  sauvegarder(chemin: string, data: string) &#123;
    // Écriture sur disque
  &#125;
&#125;</code></pre>
                  <span class="b-foot">1 Raison : Changement de technologie de stockage</span>
                </div>
              </div>
            }
          </div>

          <div class="conflict-alert mt-2" [class.danger]="!isDecomposed()">
            @if (!isDecomposed()) {
              <span>⚠️ <strong>Risque de Conflit Git Majeur :</strong> Le développeur UI (change les balises) et le sysadmin (change le stockage) modifient le même fichier en même temps. Fusion manuelle périlleuse garantie !</span>
            } @else {
              <span>✅ <strong>Parallélisation Totale :</strong> L'équipe design et l'équipe infra travaillent sur des fichiers indépendants sans aucun conflit de merge Git.</span>
            }
          </div>
        </div>

        <!-- SIMULATEUR 2 : COMPARATEUR ANGULAR "FAT COMPONENT VS SERVICE" -->
        <div class="card-panel">
          <div class="card-title-row">
            <span class="badge badge-emerald">Pratique Angular</span>
            <h3>Comparateur Angular : Fat Component vs Architecture Découplée</h3>
          </div>
          <p class="section-intro">
            Dans Angular, la violation la plus fréquente de SRP consiste à surcharger le composant d'appels HTTP et de calculs métier :
          </p>

          <div class="angular-comparison-grid mt-3">
            <!-- ❌ Fat Component -->
            <div class="comp-col anti-pattern">
              <div class="col-head">
                <span class="badge badge-rose">❌ Anti-Pattern : Fat Component</span>
                <h4>PanierComponent (Trop de rôles)</h4>
              </div>
              <div class="col-code">
<pre><code>@Component(&#123; ... &#125;)
export class PanierComponent &#123;
  // 1. État UI
  articles = signal&lt;Article[]&gt;([]);

  // 2. Logique HTTP dans le composant !
  charger() &#123;
    fetch('/api/panier')
      .then(res => res.json())
      .then(d => this.articles.set(d));
  &#125;

  // 3. Calculs financiers dans l'UI !
  totalTtc = computed(() => &#123;
    return this.articles().reduce(
      (acc, a) => acc + (a.prix * 1.21), 0
    );
  &#125;);
&#125;</code></pre>
              </div>
              <div class="col-footer text-danger">
                ✖ Impossible de tester le calcul sans instancier le composant DOM.<br>
                ✖ Aucune réutilisation possible dans une autre page.
              </div>
            </div>

            <!-- ✅ Decoupled Architecture -->
            <div class="comp-col clean-pattern">
              <div class="col-head">
                <span class="badge badge-emerald">✅ Clean Code : Découplage SRP</span>
                <h4>PanierService + Composant Visuel</h4>
              </div>
              <div class="col-code">
<pre><code>// 1. Service pur injecté (@Injectable)
@Injectable(&#123; providedIn: 'root' &#125;)
export class PanierService &#123;
  private http = inject(HttpClient);
  readonly articles = signal&lt;Article[]&gt;([]);

  charger() &#123; /* fetch via service */ &#125;
  calculerTtc(ht: number): number &#123; return ht * 1.21; &#125;
&#125;

// 2. Composant fin (Rendu UI pur)
@Component(&#123; ... &#125;)
export class PanierComponent &#123;
  readonly panier = inject(PanierService);
&#125;</code></pre>
              </div>
              <div class="col-footer text-success">
                ✔ Test unitaire instantané du service en 1 ms.<br>
                ✔ Composant ultra-lisible dédié uniquement au template.
              </div>
            </div>
          </div>
        </div>

        <!-- SIMULATEUR 3 : AUDIT DE CODE INTERACTIF -->
        <div class="card-panel">
          <div class="card-title-row">
            <span class="badge badge-amber">Outil d'Audit</span>
            <h3>Analyseur Lexical de Violations SRP</h3>
          </div>
          <p class="section-intro">
            Testez des noms de classes suspects pour détecter instantanément les violations de SRP :
          </p>

          <div class="audit-tool-box mt-3">
            <div class="input-row">
              <input 
                type="text" 
                class="audit-input" 
                [value]="testClassName()" 
                (input)="onInputChange($event)"
                placeholder="Ex: UtilisateurManager, CommandeAndEmailSender, CalculateurTva..."
              />
              <button class="btn-primary btn-sm" (click)="analyserNom()">
                🔍 Auditer la Classe
              </button>
            </div>

            <!-- Suggestions rapides -->
            <div class="quick-samples">
              <span class="quick-label">Exemples à tester :</span>
              <button class="chip-btn" (click)="setAuditSample('UtilisateurManager')">UtilisateurManager</button>
              <button class="chip-btn" (click)="setAuditSample('CommandeAndInvoiceSender')">CommandeAndInvoiceSender</button>
              <button class="chip-btn" (click)="setAuditSample('AppHelper')">AppHelper</button>
              <button class="chip-btn" (click)="setAuditSample('CalculateurRemise')">CalculateurRemise</button>
            </div>

            <div class="audit-result-card" [class.alert-danger]="auditResult().isViolating" [class.alert-success]="!auditResult().isViolating">
              <div class="res-title">
                {{ auditResult().isViolating ? '⚠️ Suspicion Forte de Violation SRP' : '✅ Nommage Spécifique & Cohésif' }}
              </div>
              <p class="res-desc">{{ auditResult().verdict }}</p>
              <div class="res-rule"><strong>Conseil :</strong> {{ auditResult().conseil }}</div>
            </div>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO : LABO 1 (4 EXERCICES) -->
        <app-lab-runner [filterLabNumber]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .demo-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 10px;

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .section-intro {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .stepper-controls-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .control-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
      }

      .ml-auto {
        margin-left: auto;
      }
    }

    .choice-btn {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        border-color: #3b82f6;
      }
    }

    .monolith-code-view {
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--bg-code);
      border-radius: 8px;
      padding: 14px;
      border: 1px solid var(--border-color);
    }

    .code-zone {
      padding: 8px 12px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid transparent;
      opacity: 0.4;
      transition: all 0.3s;

      &.highlighted {
        opacity: 1;
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.15);
      }

      .zone-tag {
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 6px;

        &.tag-finance { color: #60a5fa; }
        &.tag-design { color: #f472b6; }
        &.tag-sysadmin { color: #34d399; }
      }

      pre {
        margin: 0;
        font-size: 0.78rem;
        color: var(--text-code);
      }
    }

    .brigade-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .brigade-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.card-metier { border-top: 4px solid #3b82f6; }
      &.card-ui { border-top: 4px solid #f472b6; }
      &.card-io { border-top: 4px solid #10b981; }

      .b-header {
        display: flex;
        align-items: center;
        gap: 8px;

        .name {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--text-main);
        }
      }

      .b-desc {
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      pre {
        background: var(--bg-subtle);
        padding: 8px;
        border-radius: 4px;
        font-size: 0.74rem;
        color: #93c5fd;
      }

      .b-foot {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--text-dim);
        margin-top: auto;
      }
    }

    .conflict-alert {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      line-height: 1.4;

      &.danger {
        background: rgba(244, 63, 94, 0.15);
        border: 1px solid #f43f5e;
        color: #fecdd3;
      }

      &:not(.danger) {
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid #10b981;
        color: #a7f3d0;
      }
    }

    .angular-comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .comp-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.anti-pattern {
        border-left: 4px solid #f43f5e;
      }

      &.clean-pattern {
        border-left: 4px solid #10b981;
      }

      .col-head {
        display: flex;
        flex-direction: column;
        gap: 4px;

        h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }
      }

      .col-code pre {
        background: var(--bg-code);
        padding: 12px;
        border-radius: 6px;
        font-size: 0.76rem;
        color: var(--text-code);
        line-height: 1.4;
      }

      .col-footer {
        font-size: 0.78rem;
        line-height: 1.5;

        &.text-danger { color: #fca5a5; }
        &.text-success { color: #86efac; }
      }
    }

    .audit-tool-box {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .input-row {
      display: flex;
      gap: 10px;

      .audit-input {
        flex: 1;
        padding: 8px 14px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-main);
        font-family: var(--font-mono);
        font-size: 0.85rem;

        &:focus {
          outline: none;
          border-color: #6366f1;
        }
      }
    }

    .quick-samples {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;

      .quick-label {
        font-size: 0.75rem;
        color: var(--text-dim);
      }

      .chip-btn {
        padding: 4px 8px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 0.72rem;
        font-family: var(--font-mono);
        color: var(--text-muted);

        &:hover {
          color: var(--text-main);
          border-color: #6366f1;
        }
      }
    }

    .audit-result-card {
      padding: 14px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      &.alert-danger {
        background: rgba(244, 63, 94, 0.12);
        border: 1px solid #f43f5e;
        color: #fecdd3;
      }

      &.alert-success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid #10b981;
        color: #a7f3d0;
      }

      .res-title {
        font-size: 0.88rem;
        font-weight: 800;
      }

      .res-desc {
        font-size: 0.82rem;
        line-height: 1.4;
      }

      .res-rule {
        font-size: 0.78rem;
        opacity: 0.9;
        margin-top: 4px;
      }
    }
  `]
})
export class SrpSingleResponsibilityComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly inspectedActor = signal<'all' | 'finance' | 'design' | 'sysadmin'>('all');
  readonly isDecomposed = signal<boolean>(false);

  readonly testClassName = signal<string>('UtilisateurManager');
  readonly auditResult = signal<{ isViolating: boolean; verdict: string; conseil: string }>({
    isViolating: true,
    verdict: 'Le suffixe "...Manager" est un aveu implicite que la classe n\'a pas de rôle délimité et gère "un peu de tout".',
    conseil: 'Scindez-la en classes ciblées : ServiceSecurite, SessionStorage, ServiceNotification.'
  });

  toggleDecomposition(): void {
    this.isDecomposed.update(v => !v);
  }

  onInputChange(event: any): void {
    this.testClassName.set(event.target.value);
  }

  setAuditSample(name: string): void {
    this.testClassName.set(name);
    this.analyserNom();
  }

  analyserNom(): void {
    const name = this.testClassName().trim();
    if (!name) return;

    if (/manager|handler|helper|processor/i.test(name)) {
      this.auditResult.set({
        isViolating: true,
        verdict: `Le nom "${name}" comporte un mot-valise suspect ("Manager/Helper/Processor"). Ces classes deviennent inévitablement des God Objects.`,
        conseil: 'Définissez la "fiche de poste" exacte de l\'objet : que fait-il concrètement ? S\'il fait 3 choses, créez 3 classes.'
      });
    } else if (/and|et/i.test(name)) {
      this.auditResult.set({
        isViolating: true,
        verdict: `Le nom "${name}" contient la conjonction "And" ! C\'est l\'aveu textuel formel d\'au moins deux responsabilités distinctes.`,
        conseil: `Séparez les deux rôles de chaque côté du "And" en deux classes autonomes.`
      });
    } else {
      this.auditResult.set({
        isViolating: false,
        verdict: `"${name}" semble avoir un nommage précis et une intention focalisée.`,
        conseil: 'Vérifiez simplement qu\'elle ne cumule pas de dépendances I/O ou de conversion d\'affichage en plus de son rôle principal.'
      });
    }
  }
}
