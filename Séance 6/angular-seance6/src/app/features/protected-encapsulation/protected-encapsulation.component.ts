import { Component, signal, computed } from '@angular/core';
import { VisibilityModifier, AccessZoneStatus } from '../../core/models/app.models';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-protected-encapsulation',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="badge badge-purple">Module 4 · Encapsulation</span>
          <span class="badge badge-css">Visibilité & Sécurité</span>
        </div>
        <h2>Le Dilemme d'Encapsulation & la Visibilité <code>protected</code></h2>
        <p class="module-desc">
          Comment partager des données et des méthodes avec ses classes dérivées sans les livrer en pâture au monde extérieur ? <code>protected</code> est le « secret de famille » de la POO.
        </p>
      </div>

      <!-- Mode Théorie vs Labo -->
      <div class="section-mode-tabs">
        <button
          class="mode-tab-btn"
          [class.active]="activeView() === 'theory'"
          (click)="activeView.set('theory')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Scanner des 3 Cercles Concentriques</span>
        </button>
        <button
          class="mode-tab-btn"
          [class.active]="activeView() === 'lab'"
          (click)="activeView.set('lab')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span>Atelier Pratique (Labo 2)</span>
        </button>
      </div>

      @if (activeView() === 'theory') {
        <!-- Sélecteur Interactif du Modificateur -->
        <div class="theory-content mt-2">
        <div class="modifier-selector-bar card-panel">
          <div class="selector-label">
            <span class="label-title">EXPÉRIMENTATION SUR L'ATTRIBUT <code>titre</code> DE <code>Media</code> :</span>
            <span class="label-sub">Basculez le mot-clé de visibilité et observez la réaction des 3 cercles :</span>
          </div>

          <div class="modifier-buttons">
            <button
              class="mod-btn"
              [class.active]="currentModifier() === 'private'"
              (click)="setModifier('private')"
            >
              <span class="mod-icon">🔒</span>
              <span class="mod-name">private</span>
            </button>

            <button
              class="mod-btn"
              [class.active]="currentModifier() === 'protected'"
              (click)="setModifier('protected')"
            >
              <span class="mod-icon">🛡️</span>
              <span class="mod-name">protected (Recommandé)</span>
            </button>

            <button
              class="mod-btn"
              [class.active]="currentModifier() === 'public'"
              (click)="setModifier('public')"
            >
              <span class="mod-icon">🌐</span>
              <span class="mod-name">public</span>
            </button>
          </div>
        </div>

        <!-- Scanner à 3 Cercles Concentriques -->
        <div class="scanner-grid mt-4">
          <!-- Visuel des Cercles Concentriques -->
          <div class="circles-card card-panel">
            <div class="card-subtitle">SCANNER DE PORTÉE (SCOPE MAP)</div>

            <div class="concentric-container">
              <!-- Cercle 3 : Extérieur (Reste du monde) -->
              <div class="concentric-ring outer-ring" [class.alert-flash]="outsideZone().riskLevel === 'danger-corrupt'" [class.blocked]="!outsideZone().allowed">
                <div class="ring-tag outside-tag">
                  <span>3. Extérieur (main.ts, app.component.ts)</span>
                  <span class="access-badge" [class.allowed]="outsideZone().allowed" [class.forbidden]="!outsideZone().allowed">
                    {{ outsideZone().allowed ? '🔓 ACCÈS OUVERT' : '⛔ ACCÈS VERROUILLÉ' }}
                  </span>
                </div>

                <!-- Cercle 2 : Classes Dérivées (Famille) -->
                <div class="concentric-ring middle-ring" [class.alert-flash]="derivedZone().riskLevel === 'forbidden'" [class.allowed]="derivedZone().allowed">
                  <div class="ring-tag derived-tag">
                    <span>2. Classes Filles (Livre, Film)</span>
                    <span class="access-badge" [class.allowed]="derivedZone().allowed" [class.forbidden]="!derivedZone().allowed">
                      {{ derivedZone().allowed ? '✔ ACCÈS AUTORISÉ' : '✖ ERREUR TS2341' }}
                    </span>
                  </div>

                  <!-- Cercle 1 : Classe Mère (Media) -->
                  <div class="concentric-ring inner-ring">
                    <div class="inner-content">
                      <div class="class-title">1. Classe Mère Media</div>
                      <div class="property-tag">
                        <code><span class="kw">{{ currentModifier() }}</span> titre: string;</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panneau d'Analyse Contextuelle -->
          <div class="analysis-card card-panel">
            <div class="analysis-header">
              <span class="badge" [class.badge-success]="currentModifier() === 'protected'" [class.badge-warning]="currentModifier() === 'public'" [class.badge-html]="currentModifier() === 'private'">
                MODIFICATEUR SÉLECTIONNÉ : {{ currentModifier().toUpperCase() }}
              </span>
              <h3>{{ getModifierSummaryTitle() }}</h3>
            </div>

            <div class="diagnostic-zones">
              <!-- Zone 1 : Classe Mère -->
              <div class="diag-item ok">
                <div class="d-icon">✔</div>
                <div class="d-info">
                  <div class="d-zone">Classe Mère (Media)</div>
                  <div class="d-desc">Accès total sans restriction via <code>this.titre</code>.</div>
                </div>
              </div>

              <!-- Zone 2 : Classes Filles -->
              <div class="diag-item" [class.ok]="derivedZone().allowed" [class.err]="!derivedZone().allowed">
                <div class="d-icon">{{ derivedZone().allowed ? '✔' : '✖' }}</div>
                <div class="d-info">
                  <div class="d-zone">Classes Dérivées (Livre, Film)</div>
                  <div class="d-desc">{{ derivedZone().message }}</div>
                  @if (derivedZone().tsErrorCode) {
                    <code class="ts-error-line">{{ derivedZone().tsErrorCode }}</code>
                  }
                </div>
              </div>

              <!-- Zone 3 : Extérieur -->
              <div class="diag-item" [class.warn]="outsideZone().riskLevel === 'danger-corrupt'" [class.safe]="!outsideZone().allowed">
                <div class="d-icon">{{ outsideZone().allowed ? '⚠️' : '🛡️' }}</div>
                <div class="d-info">
                  <div class="d-zone">Monde Extérieur (Composants, Services)</div>
                  <div class="d-desc">{{ outsideZone().message }}</div>
                  @if (outsideZone().tsErrorCode) {
                    <code class="ts-error-line">{{ outsideZone().tsErrorCode }}</code>
                  }
                </div>
              </div>
            </div>

            <!-- Règle d'or de protected -->
            <div class="family-secret-banner">
              <div class="banner-title">🔑 Pourquoi protected est « le secret de famille » ?</div>
              <p>
                Il offre l'équilibre architectural idéal : la classe fille a l'intimité nécessaire pour spécialiser le comportement métier, tout en interdisant au reste de l'application de court-circuiter l'encapsulation.
              </p>
            </div>
          </div>
        </div>

        <!-- Matrice de Référence Interactive -->
        <div class="matrix-card card-panel mt-4">
          <div class="matrix-title text-muted fs-6 mb-2">Matrice Comparative Officielle TypeScript</div>
          <table class="matrix-table">
            <thead>
              <tr>
                <th>Modificateur</th>
                <th>Même classe (Media)</th>
                <th>Sous-classes (Livre, Film)</th>
                <th>Extérieur (main.ts)</th>
                <th>Intention Architecturale</th>
              </tr>
            </thead>
            <tbody>
              <tr [class.highlighted]="currentModifier() === 'public'">
                <td><span class="code-badge">public</span></td>
                <td class="yes">✔ Oui</td>
                <td class="yes">✔ Oui</td>
                <td class="yes">✔ Oui</td>
                <td>Interface publique exposée à tous les consommateurs.</td>
              </tr>
              <tr [class.highlighted]="currentModifier() === 'protected'">
                <td><span class="code-badge protected">protected</span></td>
                <td class="yes">✔ Oui</td>
                <td class="yes">✔ Oui</td>
                <td class="no">⛔ Non</td>
                <td><strong>Héritage pur</strong> : réservé à la lignée familiale.</td>
              </tr>
              <tr [class.highlighted]="currentModifier() === 'private'">
                <td><span class="code-badge private">private</span></td>
                <td class="yes">✔ Oui</td>
                <td class="no">⛔ Non</td>
                <td class="no">⛔ Non</td>
                <td>Détail d'implémentation interne strictement confidentiel.</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="2"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .modifier-selector-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      gap: 16px;
      flex-wrap: wrap;

      .label-title {
        font-size: 0.8rem;
        font-weight: 800;
        color: var(--text-main);
        display: block;
        letter-spacing: 0.04em;
      }

      .label-sub {
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }

    .modifier-buttons {
      display: flex;
      gap: 8px;
    }

    .mod-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 600;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: var(--bs-purple);
        color: #ffffff;
        border-color: var(--bs-purple-light);
        box-shadow: 0 2px 8px rgba(121, 82, 179, 0.4);
      }
    }

    .scanner-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 20px;

      @media (max-width: 1000px) {
        grid-template-columns: 1fr;
      }
    }

    .circles-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .card-subtitle {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: var(--text-dim);
      margin-bottom: 20px;
    }

    .concentric-container {
      width: 100%;
      max-width: 380px;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .concentric-ring {
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
    }

    .outer-ring {
      width: 100%;
      height: 100%;
      border: 2px dashed #475569;
      background: rgba(15, 23, 42, 0.5);

      &.blocked {
        border-color: #64748b;
      }

      &.alert-flash {
        border-color: #f59e0b;
        background: rgba(245, 158, 11, 0.08);
        animation: pulseWarning 1.5s infinite;
      }
    }

    .middle-ring {
      width: 75%;
      height: 75%;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.08);

      &.allowed {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.08);
      }

      &.alert-flash {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.12);
        animation: pulseError 1s infinite;
      }
    }

    .inner-ring {
      width: 55%;
      height: 55%;
      border: 2px solid #7952b3;
      background: rgba(121, 82, 179, 0.2);
      text-align: center;
      padding: 10px;
    }

    .ring-tag {
      position: absolute;
      top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--text-muted);
      text-align: center;
    }

    .outside-tag { top: 12px; }
    .derived-tag { top: 10px; }

    .access-badge {
      font-size: 0.65rem;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 800;

      &.allowed {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
      }

      &.forbidden {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
      }
    }

    .inner-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;

      .class-title {
        font-size: 0.72rem;
        font-weight: 800;
        color: #c4b5fd;
      }

      .property-tag {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        background: var(--bg-code);
        padding: 3px 8px;
        border-radius: 4px;
        border: 1px solid var(--border-subtle);

        .kw { color: #c678dd; font-weight: 700; }
      }

      /* Wrapper dédié pour le mode théorie */
      .theory-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        flex: 1;
        overflow-y: auto; /* Permet à tout le contenu théorique de défiler naturellement */
        padding-bottom: 24px;
      }

      /* Sécurisation de la carte matrice */
      .matrix-card {
        padding: 20px;
        flex-shrink: 0;       /* Empêche formellement Flexbox d'écraser la carte */
        min-height: fit-content;
        margin-bottom: 32px;

        .matrix-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          text-transform: uppercase;
          margin-bottom: 12px;
        }
      }

      /* Gestion propre du scroll horizontal sur mobile/écrans étroits */
      .table-responsive {
        width: 100%;
        overflow-x: auto;
      }
    }

    @keyframes pulseError {
      0%, 100% { border-color: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
      50% { border-color: rgba(239, 68, 68, 0.4); box-shadow: none; }
    }

    @keyframes pulseWarning {
      0%, 100% { border-color: #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
      50% { border-color: rgba(245, 158, 11, 0.3); box-shadow: none; }
    }

    .analysis-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .analysis-header {
      display: flex;
      flex-direction: column;
      gap: 6px;

      h3 {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-main);
      }
    }

    .diagnostic-zones {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .diag-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-subtle);

      .d-icon {
        font-size: 1rem;
        margin-top: 2px;
      }

      .d-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .d-zone {
        font-weight: 700;
        font-size: 0.82rem;
        color: var(--text-main);
      }

      .d-desc {
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .ts-error-line {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
        padding: 2px 6px;
        border-radius: 4px;
        margin-top: 4px;
        display: inline-block;
      }

      &.ok {
        border-color: rgba(16, 185, 129, 0.3);
        background: rgba(16, 185, 129, 0.04);
        .d-icon { color: #34d399; }
      }

      &.err {
        border-color: rgba(239, 68, 68, 0.3);
        background: rgba(239, 68, 68, 0.05);
        .d-icon { color: #ef4444; }
      }

      &.warn {
        border-color: rgba(245, 158, 11, 0.3);
        background: rgba(245, 158, 11, 0.05);
        .d-icon { color: #f59e0b; }
      }

      &.safe {
        border-color: rgba(14, 165, 233, 0.3);
        background: rgba(14, 165, 233, 0.04);
        .d-icon { color: #38bdf8; }
      }
    }

    .family-secret-banner {
      background: rgba(121, 82, 179, 0.12);
      border-left: 3px solid #7952b3;
      padding: 12px;
      border-radius: 4px;
      margin-top: auto;

      .banner-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: #c4b5fd;
        margin-bottom: 4px;
      }

      p {
        font-size: 0.78rem;
        color: var(--text-main);
        line-height: 1.4;
      }
    }



    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84rem;

      th, td {
        padding: 12px 14px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-main) !important;
        background-color: transparent !important;
        box-shadow: none !important;
      }

      th {
        font-size: 0.76rem;
        font-weight: 700;
        color: var(--text-muted) !important;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: var(--bg-subtle) !important;
      }

      tr.highlighted td {
        background: rgba(121, 82, 179, 0.2) !important;
      }

      tbody tr:hover td {
        background: var(--bg-subtle) !important;
      }

      .yes { color: #34d399 !important; font-weight: 700; }
      .no { color: #f87171 !important; font-weight: 700; }

      .code-badge {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 4px;
        background: var(--bg-subtle);
        color: #38bdf8;

        &.protected { color: #c4b5fd; }
        &.private { color: #f472b6; }
      }
    }
  `]
})
export class ProtectedEncapsulationComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly currentModifier = signal<VisibilityModifier>('protected');

  setModifier(mod: VisibilityModifier): void {
    this.currentModifier.set(mod);
  }

  getModifierSummaryTitle(): string {
    switch (this.currentModifier()) {
      case 'private':
        return 'Hermétisme Total : Les filles sont rejetées !';
      case 'protected':
        return 'Le Secret de Famille : Partage ciblé et sécurisé';
      case 'public':
        return 'Porte Ouverte : Risque d\'altération externe incontrôlée';
    }
  }

  readonly derivedZone = computed<AccessZoneStatus>(() => {
    switch (this.currentModifier()) {
      case 'private':
        return {
          zone: 'derived',
          label: 'Classes Filles',
          icon: '✖',
          allowed: false,
          riskLevel: 'forbidden',
          message: 'L\'accès depuis Livre.getDescription() est REFUSÉ par le compilateur.',
          tsErrorCode: 'TS2341: Property "titre" is private and only accessible within class "Media".'
        };
      case 'protected':
        return {
          zone: 'derived',
          label: 'Classes Filles',
          icon: '✔',
          allowed: true,
          riskLevel: 'family-safe',
          message: 'Accès direct et naturel autorisé pour spécialiser l\'affichage ou le comportement.'
        };
      case 'public':
        return {
          zone: 'derived',
          label: 'Classes Filles',
          icon: '✔',
          allowed: true,
          riskLevel: 'safe',
          message: 'Accès autorisé, mais aucune protection contre l\'extérieur.'
        };
    }
  });

  readonly outsideZone = computed<AccessZoneStatus>(() => {
    switch (this.currentModifier()) {
      case 'private':
        return {
          zone: 'outside',
          label: 'Extérieur',
          icon: '🛡️',
          allowed: false,
          riskLevel: 'safe',
          message: 'Hermétique. Aucun composant extérieur ne peut modifier media.titre.',
          tsErrorCode: 'TS2341: Property "titre" is private and only accessible within class "Media".'
        };
      case 'protected':
        return {
          zone: 'outside',
          label: 'Extérieur',
          icon: '🛡️',
          allowed: false,
          riskLevel: 'safe',
          message: 'Hermétique. L\'attribut n\'est pas exposé publiquement (lecture possible via getter).',
          tsErrorCode: 'TS2445: Property "titre" is protected and only accessible within class "Media" and its subclasses.'
        };
      case 'public':
        return {
          zone: 'outside',
          label: 'Extérieur',
          icon: '⚠️',
          allowed: true,
          riskLevel: 'danger-corrupt',
          message: 'Danger : n\'importe quel script externe peut exécuter media.titre = "" et corrompre l\'état.'
        };
    }
  });
}
