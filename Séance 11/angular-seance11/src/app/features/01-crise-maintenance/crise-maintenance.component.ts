import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { TabId } from '../../core/models/app.models';

@Component({
  selector: 'app-crise-maintenance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 11 · Diagnostic Architectural</span>
          <span class="badge badge-rose">Code Smells</span>
          <span class="badge badge-indigo">Focus S, O, D</span>
        </div>
        <h2>La Crise de la Maintenance &amp; Les 3 Symptômes du Mauvais Code</h2>
        <p class="module-desc">
          L'illusion la plus destructrice en programmation est : <em>« Mon code tourne sans erreur en local, donc il est de qualité »</em>.
          Découvrez pourquoi un code non modulaire se transforme en bombe à retardement, et expérimentez le contraste saisissant
          entre un système <strong>Château de cartes</strong> et une architecture <strong>LEGO</strong>.
        </p>
      </div>

      <!-- SIMULATEUR 1 : L'EFFET DOMINO (Château de cartes vs LEGO) -->
      <div class="card-panel demo-card">
        <div class="card-title-row">
          <span class="badge badge-indigo">Simulateur Visuel #1</span>
          <h3>L'Effet Domino : Château de Cartes vs Briques LEGO</h3>
        </div>
        <p class="section-intro">
          Le client exige une simple évolution : <em>« Mettre à jour le calcul de TVA de 21% à 25% »</em>. Observez l'impact selon l'architecture logicielle :
        </p>

        <div class="mode-switch-row">
          <button 
            class="choice-btn" 
            [class.active]="archMode() === 'cards'"
            (click)="setArchMode('cards')"
          >
            🃏 Mode Monolithe (Château de Cartes)
          </button>
          <button 
            class="choice-btn" 
            [class.active]="archMode() === 'lego'"
            (click)="setArchMode('lego')"
          >
            🧱 Mode Modulaire (Briques LEGO)
          </button>
        </div>

        <div class="sim-grid mt-2">
          <!-- Visualisation Graphique des Briques -->
          <div class="domino-visual-box">
            <div class="box-title">
              {{ archMode() === 'cards' ? 'Structure Monolithique Hautement Couplée' : 'Architecture Découplée & Spécialisée' }}
            </div>

            <div class="blocks-container" [class.shake-anim]="isCollapsing()">
              @if (archMode() === 'cards') {
                <!-- CHATEAU DE CARTES -->
                <div class="monolith-block" [class.broken]="dominoStep() >= 1">
                  <div class="block-header">
                    <span class="icon">📦</span>
                    <span class="title">ApplicationBoutique.ts (650 lignes)</span>
                  </div>
                  <div class="inner-subsystems">
                    <div class="sub-item" [class.trigger]="dominoStep() >= 1">
                      <span class="dot"></span>
                      <span>1. Calcul TVA &amp; Remises (Modifié)</span>
                    </div>
                    <div class="sub-item" [class.error-item]="dominoStep() >= 2">
                      <span class="dot"></span>
                      <span>2. Écriture Base SQL (Crash Format Date)</span>
                    </div>
                    <div class="sub-item" [class.error-item]="dominoStep() >= 3">
                      <span class="dot"></span>
                      <span>3. Client SMTP / Emails (Connexion rompue)</span>
                    </div>
                  </div>
                </div>

                @if (dominoStep() >= 3) {
                  <div class="collapse-banner">
                    💥 <strong>CRASH COLLATÉRAL GÉNÉRALISÉ</strong> : Modifier une simple taxe a brisé l'envoi d'e-mails et corrompu la base de données !
                  </div>
                }
              } @else {
                <!-- BRICK LEGO -->
                <div class="lego-grid">
                  <div class="lego-brick brick-tva" [class.updated]="dominoStep() >= 1">
                    <div class="brick-pin"></div>
                    <span class="brick-label">CalculateurTva</span>
                    <span class="brick-status">{{ dominoStep() >= 1 ? '✨ Mis à jour (25%)' : 'Actif (21%)' }}</span>
                  </div>

                  <div class="lego-brick brick-db">
                    <div class="brick-pin"></div>
                    <span class="brick-label">CommandeRepository</span>
                    <span class="brick-status safe">✅ Stable &amp; Isolé</span>
                  </div>

                  <div class="lego-brick brick-mail">
                    <div class="brick-pin"></div>
                    <span class="brick-label">NotificationService</span>
                    <span class="brick-status safe">✅ Stable &amp; Isolé</span>
                  </div>
                </div>

                @if (dominoStep() >= 1) {
                  <div class="lego-success-banner">
                    🛡️ <strong>RÉSILIENCE 100%</strong> : Seule la brique de calcul a été touchée. Aucune ligne de code SQL ou SMTP n'a été mise en péril !
                  </div>
                }
              }
            </div>

            <!-- Bouton d'action -->
            <div class="sim-actions-row mt-3">
              <button class="btn-primary" (click)="triggerEvolution()" [disabled]="dominoStep() > 0">
                🚀 Déclencher : « Modifier la règle de TVA »
              </button>
              <button class="btn-secondary" (click)="resetSimulation()">
                🔄 Réinitialiser
              </button>
              <span class="sim-status-text">{{ statusText() }}</span>
            </div>
          </div>

          <!-- Panneau Code / Analyse -->
          <div class="analysis-box">
            <div class="box-title">Explication Architecturale</div>
            @if (archMode() === 'cards') {
              <div class="card-explanation">
                <p class="text-danger-title">⚠️ Le syndrome de la classe Dieu (God Object)</p>
                <p>
                  Dans <code>ApplicationBoutique</code>, les calculs de TVA partagent les mêmes variables d'état et le même flux d'exécution
                  que la requête SQL brute et le client SMTP.
                </p>
                <div class="code-snippet-box">
<pre><code>// ❌ Spaghetti entremêlé
validerPanier(panier) &#123;
  let total = panier.calc() * 1.25; // Modifié ici
  db.execute("INSERT ... " + total); // Bug: type casting
  smtp.send("Total: " + total);     // Crash: SMTP timeout
&#125;</code></pre>
                </div>
                <p class="dim-note">
                  Le moindre changement dans une zone sensible fait vaciller l'ensemble des dépendances soudées.
                </p>
              </div>
            } @else {
              <div class="card-explanation">
                <p class="text-success-title">🧩 L'élégance de la Décomposition Modulaire</p>
                <p>
                  Chaque brique possède un <strong>contrat clair</strong>. Le calcul de TVA est encapsulé dans sa propre classe (SRP).
                  La commande ne dépend que d'abstractions (DIP).
                </p>
                <div class="code-snippet-box">
<pre><code>// ✅ Brique isolée
export class CalculateurTva &#123;
  calculer(ht: number): number &#123;
    return ht * 1.25; // Zéro impact collatéral !
  &#125;
&#125;</code></pre>
                </div>
                <p class="dim-note">
                  Les autres briques continuent d'exécuter leur contrat sans avoir besoin d'être re-testées ni re-déployées.
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- MATRICE INTERACTIVE DES 3 PATHOLOGIES (Code Smells) -->
      <div class="card-panel">
        <div class="card-title-row">
          <span class="badge badge-amber">Pathologies de Martin</span>
          <h3>Les 3 Maladies Mortelles du Mauvais Code</h3>
        </div>
        <p class="section-intro">
          Formulées par Robert C. Martin, ces trois pathologies signalent la décomposition architecturale imminente d'une application :
        </p>

        <div class="pathologies-grid mt-3">
          <!-- 1. RIGIDITÉ -->
          <div 
            class="pathology-card" 
            [class.active]="selectedPathology() === 'rigidity'"
            (click)="selectedPathology.set('rigidity')"
          >
            <div class="path-header">
              <span class="path-icon">🧱</span>
              <h4>1. La Rigidité</h4>
              <span class="badge badge-rose">Cascade</span>
            </div>
            <p class="path-summary">
              Une modification minime impose une cascade de retouches dans 10 fichiers distincts.
            </p>
            @if (selectedPathology() === 'rigidity') {
              <div class="path-details">
                <div class="symptom-tag">Symptôme vécu :</div>
                <p>« On a juste changé le format du code postal, et on a dû modifier 8 composants, 3 services et 4 modèles ! »</p>
                <div class="antidote-tag">Antidote SOLID :</div>
                <p class="antidote-text"><strong>OCP &amp; SRP</strong> : Découper les responsabilités et étendre sans modifier l'existant.</p>
              </div>
            }
          </div>

          <!-- 2. FRAGILITÉ -->
          <div 
            class="pathology-card" 
            [class.active]="selectedPathology() === 'fragility'"
            (click)="selectedPathology.set('fragility')"
          >
            <div class="path-header">
              <span class="path-icon">💥</span>
              <h4>2. La Fragilité</h4>
              <span class="badge badge-rose">Effet de bord</span>
            </div>
            <p class="path-summary">
              Réparer un calcul dans un coin du système casse une fonctionnalité sans lien apparent ailleurs.
            </p>
            @if (selectedPathology() === 'fragility') {
              <div class="path-details">
                <div class="symptom-tag">Symptôme vécu :</div>
                <p>« Corriger la remise VIP a mystérieusement empêché l'impression des factures PDF des clients réguliers ! »</p>
                <div class="antidote-tag">Antidote SOLID :</div>
                <p class="antidote-text"><strong>SRP &amp; DIP</strong> : Isoler les acteurs et injecter des contrats d'interfaces étanches.</p>
              </div>
            }
          </div>

          <!-- 3. IMMOBILITÉ -->
          <div 
            class="pathology-card" 
            [class.active]="selectedPathology() === 'immobility'"
            (click)="selectedPathology.set('immobility')"
          >
            <div class="path-header">
              <span class="path-icon">⚓</span>
              <h4>3. L'Immobilité</h4>
              <span class="badge badge-rose">Couplage fort</span>
            </div>
            <p class="path-summary">
              Impossible d'extraire une brique de calcul sans embarquer toute l'infrastructure (BDD, HTTP).
            </p>
            @if (selectedPathology() === 'immobility') {
              <div class="path-details">
                <div class="symptom-tag">Symptôme vécu :</div>
                <p>« Je voulais réutiliser la validation de TVA dans notre app mobile, mais elle instancie la base SQLite du serveur ! »</p>
                <div class="antidote-tag">Antidote SOLID :</div>
                <p class="antidote-text"><strong>DIP</strong> : Bannir les <code>new</code> techniques en dur dans les règles métier.</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- PANORAMA INTERACTIF SOLID -->
      <div class="card-panel">
        <div class="card-title-row">
          <span class="badge badge-purple">Panorama Global</span>
          <h3>L'Acronyme SOLID : Vos 5 Piliers d'Ingénierie Logicielle</h3>
        </div>
        <p class="section-intro">
          Formulés par Robert C. Martin (Uncle Bob), ces cinq principes régissent la conception orientée objet pérenne :
        </p>

        <div class="solid-strip mt-3">
          <!-- S -->
          <div class="solid-pillar highlight s-pillar" (click)="goToTab('srp-single-responsibility')">
            <div class="letter-box">S</div>
            <div class="letter-info">
              <h5>Single Responsibility</h5>
              <p>Une classe ne doit avoir qu'une <strong>seule et unique raison de changer</strong>.</p>
              <span class="pillar-tag active">🎯 Focus Majeur S11</span>
            </div>
          </div>

          <!-- O -->
          <div class="solid-pillar highlight o-pillar" (click)="goToTab('ocp-open-closed')">
            <div class="letter-box">O</div>
            <div class="letter-info">
              <h5>Open / Closed</h5>
              <p>Ouvert à l'<strong>extension</strong>, mais fermé à la <strong>modification</strong>.</p>
              <span class="pillar-tag active">🎯 Focus Majeur S11</span>
            </div>
          </div>

          <!-- L -->
          <div class="solid-pillar dim-pillar">
            <div class="letter-box">L</div>
            <div class="letter-info">
              <h5>Liskov Substitution</h5>
              <p>Une sous-classe doit être substituable à sa classe mère sans altérer le programme.</p>
              <span class="pillar-tag seen">Pratiqué en S6/S7</span>
            </div>
          </div>

          <!-- I -->
          <div class="solid-pillar dim-pillar">
            <div class="letter-box">I</div>
            <div class="letter-info">
              <h5>Interface Segregation</h5>
              <p>Mieux vaut plusieurs petites interfaces ciblées qu'une seule interface obèse.</p>
              <span class="pillar-tag seen">Pratiqué en S8</span>
            </div>
          </div>

          <!-- D -->
          <div class="solid-pillar highlight d-pillar" (click)="goToTab('dip-dependency-inversion')">
            <div class="letter-box">D</div>
            <div class="letter-info">
              <h5>Dependency Inversion</h5>
              <p>Dépendre d'<strong>abstractions</strong>, jamais de détails d'implémentation concrets.</p>
              <span class="pillar-tag active">🎯 Focus Majeur S11</span>
            </div>
          </div>
        </div>
      </div>
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

    .mode-switch-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .choice-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.84rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: rgba(99, 102, 241, 0.2);
        color: #818cf8;
        border-color: #6366f1;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
      }
    }

    .sim-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .domino-visual-box, .analysis-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .box-title {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .blocks-container {
      min-height: 220px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
      transition: all 0.3s;

      &.shake-anim {
        animation: shake 0.5s ease-in-out;
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }

    .monolith-block {
      background: var(--bg-card);
      border: 2px dashed #f43f5e;
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.3s;

      &.broken {
        background: rgba(244, 63, 94, 0.1);
        border-color: #f43f5e;
        box-shadow: 0 0 20px rgba(244, 63, 94, 0.3);
      }

      .block-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 0.88rem;
        color: #fb7185;
      }

      .inner-subsystems {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .sub-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        border-radius: 4px;
        background: var(--bg-subtle);
        font-size: 0.8rem;
        color: var(--text-muted);
        transition: all 0.3s;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #64748b;
        }

        &.trigger {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          font-weight: 600;
          .dot { background: #f59e0b; }
        }

        &.error-item {
          background: rgba(244, 63, 94, 0.25);
          color: #fda4af;
          font-weight: 700;
          .dot { background: #f43f5e; }
        }
      }
    }

    .collapse-banner {
      padding: 10px 14px;
      border-radius: 6px;
      background: rgba(244, 63, 94, 0.2);
      border: 1px solid #f43f5e;
      font-size: 0.82rem;
      color: #fecdd3;
    }

    .lego-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .lego-brick {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-top: 4px solid #3b82f6;
      border-radius: 6px;
      padding: 14px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-align: center;
      transition: all 0.3s;

      .brick-pin {
        width: 14px;
        height: 5px;
        background: #3b82f6;
        border-radius: 3px;
        position: absolute;
        top: -6px;
      }

      &.brick-db {
        border-top-color: #10b981;
        .brick-pin { background: #10b981; }
      }

      &.brick-mail {
        border-top-color: #8b5cf6;
        .brick-pin { background: #8b5cf6; }
      }

      &.updated {
        background: rgba(59, 130, 246, 0.15);
        border-color: #3b82f6;
        transform: scale(1.03);
      }

      .brick-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .brick-status {
        font-size: 0.72rem;
        color: #94a3b8;

        &.safe {
          color: #34d399;
          font-weight: 600;
        }
      }
    }

    .lego-success-banner {
      padding: 10px 14px;
      border-radius: 6px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      font-size: 0.82rem;
      color: #a7f3d0;
    }

    .sim-actions-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;

      .sim-status-text {
        font-size: 0.8rem;
        color: #818cf8;
        font-weight: 600;
      }
    }

    .analysis-box {
      font-size: 0.84rem;
      line-height: 1.5;

      .text-danger-title {
        color: #fb7185;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .text-success-title {
        color: #34d399;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .code-snippet-box {
        margin: 10px 0;
        background: var(--bg-code);
        padding: 10px;
        border-radius: 6px;
        font-size: 0.76rem;
        overflow-x: auto;
        color: #e2e8f0;
      }

      .dim-note {
        font-size: 0.78rem;
        color: var(--text-muted);
        font-style: italic;
      }
    }

    .pathologies-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .pathology-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.2s;

      &:hover {
        border-color: rgba(99, 102, 241, 0.4);
        background: var(--bg-card);
      }

      &.active {
        border-color: #6366f1;
        background: var(--bg-card);
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2);
      }

      .path-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h4 {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-main);
          margin-right: auto;
          margin-left: 8px;
        }

        .path-icon {
          font-size: 1.2rem;
        }
      }

      .path-summary {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .path-details {
        margin-top: 6px;
        padding-top: 8px;
        border-top: 1px dashed var(--border-color);
        font-size: 0.78rem;
        line-height: 1.4;

        .symptom-tag {
          color: #fb7185;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .antidote-tag {
          color: #34d399;
          font-weight: 700;
          margin-top: 6px;
          margin-bottom: 2px;
        }

        .antidote-text {
          color: var(--text-main);
        }
      }
    }

    .solid-strip {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .solid-pillar {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.2s;

      &.highlight {
        cursor: pointer;
        border-color: rgba(99, 102, 241, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
        }
      }

      &.s-pillar:hover { border-color: #3b82f6; }
      &.o-pillar:hover { border-color: #10b981; }
      &.d-pillar:hover { border-color: #8b5cf6; }

      &.dim-pillar {
        opacity: 0.65;
      }

      .letter-box {
        width: 38px;
        height: 38px;
        border-radius: 6px;
        background: var(--bg-card);
        border: 2px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        font-weight: 900;
        font-family: var(--font-mono);
        color: #818cf8;
      }

      .letter-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        h5 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
        }

        p {
          font-size: 0.74rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .pillar-tag {
          margin-top: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          display: inline-block;

          &.active {
            color: #34d399;
          }
          &.seen {
            color: var(--text-dim);
          }
        }
      }
    }
  `]
})
export class CriseMaintenanceComponent {
  private readonly nav = inject(NavigationService);

  readonly archMode = signal<'cards' | 'lego'>('cards');
  readonly dominoStep = signal<number>(0);
  readonly isCollapsing = signal<boolean>(false);
  readonly statusText = signal<string>('Cliquez sur le bouton pour simuler l\'évolution métier.');
  readonly selectedPathology = signal<'rigidity' | 'fragility' | 'immobility'>('rigidity');

  setArchMode(mode: 'cards' | 'lego'): void {
    this.archMode.set(mode);
    this.resetSimulation();
  }

  triggerEvolution(): void {
    this.dominoStep.set(1);

    if (this.archMode() === 'cards') {
      this.statusText.set('⚡ 1. Calcul modifié... propagation en cours...');
      this.isCollapsing.set(true);

      setTimeout(() => {
        this.dominoStep.set(2);
        this.statusText.set('💥 2. Requête SQL corrompue !');
      }, 700);

      setTimeout(() => {
        this.dominoStep.set(3);
        this.statusText.set('🔥 3. Client SMTP hors service ! Le château de cartes s\'effondre.');
        this.isCollapsing.set(false);
      }, 1500);

    } else {
      this.statusText.set('✨ CalculateurTva mis à jour à 25%. Zéro propagation d\'erreur.');
    }
  }

  resetSimulation(): void {
    this.dominoStep.set(0);
    this.isCollapsing.set(false);
    this.statusText.set('Cliquez sur le bouton pour simuler l\'évolution métier.');
  }

  goToTab(tab: TabId): void {
    this.nav.setTab(tab);
  }
}
