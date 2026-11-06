import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface DataTypeItem {
  id: string;
  name: string;
  category: 'survie' | 'altere' | 'mort' | 'crash';
  badgeLabel: string;
  icon: string;
  ramCode: string;
  jsonOutput: string;
  verdict: string;
  explanation: string;
}

@Component({
  selector: 'app-ram-vs-storage',
  standalone: true,
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <div class="module-header card-panel">
        <div class="module-tag">Module 01 · Persistance &amp; Volatilité</div>
        <h2>Mémoire Vive (RAM) vs Persistance &amp; L'Armoire IKEA</h2>
        <p class="module-desc">
          En mémoire vive (RAM), vos objets vivent sous forme d'un <strong>graphe multidimensionnel</strong> relié par des pointeurs et enrichi de méthodes actives.
          Pour franchir la frontière du disque ou du réseau, ils doivent obligatoirement être aplatis en une <strong>bande linéaire 1D de texte ou d'octets</strong>.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'theory'" (click)="activeSubTab.set('theory')">
              📘 Visualiseur Tas vs Flux Plat &amp; Armoire IKEA
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'bilan'" (click)="activeSubTab.set('bilan')">
              ⚖️ Le Bilan des Pertes (Survie vs Mort)
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices Pratiques (Labo 1) ➔
          </button>
        </div>
      </div>

      @if (activeSubTab() === 'theory') {
        <!-- 1. VISUALISEUR HEAP vs FLUX PLAT -->
        <div class="card-panel interactive-zone">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">1</span>
              <div>
                <h3 class="zone-title">Le Tas (Heap RAM) vs Le Flux Linéaire 1D (Disque/Réseau)</h3>
                <p class="zone-subtitle">Comparez le comportement dynamique de la RAM avec la froideur passive du fichier persistant.</p>
              </div>
            </div>

            <div class="zone-controls">
              <button class="btn-secondary" (click)="triggerF5()" [class.danger-glow]="isF5Triggered()">
                ⚡ Simuler Touche F5 / Coupure de courant
              </button>
              <button class="btn-primary" (click)="serializeHeap()">
                📦 Sérialiser le Graphe vers le Fichier ➔
              </button>
            </div>
          </div>

          <div class="dual-viewport">
            <!-- Côté GAUCHE : LE TAS (HEAP RAM) -->
            <div class="viewport-side heap-side" [class.flashed]="isF5Triggered()">
              <div class="viewport-header">
                <div class="header-left-col">
                  <span class="indicator-dot live-dot"></span>
                  <strong>MÉMOIRE VIVE (RAM) — Le Tas (Heap)</strong>
                </div>
                <span class="badge badge-ts">Adresses Mémoire · Méthodes Actives</span>
              </div>

              @if (isF5Triggered()) {
                <div class="f5-overlay">
                  <div class="f5-icon">💥</div>
                  <h4>MÉMOIRE PURGÉE PAR LE GARBAGE COLLECTOR</h4>
                  <p>Extinction du processus / Rechargement de la page : les adresses mémoire ont été libérées. Toutes les instances non sauvegardées sont détruites !</p>
                  <button class="btn-secondary" (click)="restoreHeap()">Réinstancier les Objets en RAM</button>
                </div>
              } @else {
                <div class="heap-objects-grid">
                  <div class="heap-card">
                    <div class="obj-address">&commat;0x7ffe-3b10</div>
                    <div class="obj-header">
                      <span class="obj-type">class Tache</span>
                      <span class="obj-id">#t1</span>
                    </div>
                    <div class="obj-props">
                      <div><code>id:</code> "T-101"</div>
                      <div><code>titre:</code> "Préparer cours"</div>
                      <div><code>terminee:</code> {{ t1Terminee() ? 'true' : 'false' }}</div>
                    </div>
                    <div class="obj-methods">
                      <button class="method-chip" (click)="toggleT1()">
                        ⚙️ .terminer() ➔ {{ t1Terminee() ? 'Annuler' : 'Exécuter' }}
                      </button>
                    </div>
                  </div>

                  <div class="heap-pointer-arrow">
                    <span>référence</span>
                    ➔
                  </div>

                  <div class="heap-card">
                    <div class="obj-address">&commat;0x7ffe-4c28</div>
                    <div class="obj-header">
                      <span class="obj-type">class Projet</span>
                      <span class="obj-id">#p1</span>
                    </div>
                    <div class="obj-props">
                      <div><code>code:</code> "PERSISTENCE"</div>
                      <div><code>taches:</code> [&commat;0x7ffe-3b10]</div>
                    </div>
                    <div class="obj-methods">
                      <span class="method-chip read-only">⚙️ .calculerProgression()</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Côté DROIT : LE MONDE LINÉAIRE (FICHIER DISQUE) -->
            <div class="viewport-side storage-side">
              <div class="viewport-header">
                <div class="header-left-col">
                  <span class="indicator-dot disk-dot"></span>
                  <strong>LE MONDE DU STOCKAGE — Séquence 1D Plate</strong>
                </div>
                <span class="badge badge-purple">texte / octets durables</span>
              </div>

              <div class="storage-content">
                <div class="file-name-bar">
                  <span>📄 projet_export.json</span>
                  <span class="file-size">{{ serializedText().length }} octets</span>
                </div>
                <pre class="linear-stream-pre"><code>{{ serializedText() }}</code></pre>

                <div class="storage-expl">
                  <p>💡 <strong>Constat fondamental :</strong> Le fichier ne contient aucun pointeur <code>&commat;0x7ffe...</code>, aucune table de méthodes virtuelles, aucun code exécutable. Ce n'est qu'une bande de caractères passifs et froids.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. L'ANIMATION DE L'ARMOIRE EN KIT IKEA -->
        <div class="card-panel ikea-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">2</span>
              <div>
                <h3 class="zone-title">L'Analogie de l'Armoire en Kit IKEA</h3>
                <p class="zone-subtitle">La métaphore indispensable pour comprendre la perte des charnières (méthodes) et la nécessité de la notice (classe).</p>
              </div>
            </div>

            <div class="ikea-stepper-nav">
              @for (st of ikeaSteps; track st.num) {
                <button 
                  class="ikea-step-btn" 
                  [class.active]="currentIkeaStep() === st.num"
                  (click)="currentIkeaStep.set(st.num)"
                >
                  <span class="step-circle">{{ st.num }}</span>
                  <span class="step-name">{{ st.title }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Affichage de l'étape courante IKEA -->
          <div class="ikea-stage-card">
            @switch (currentIkeaStep()) {
              @case (1) {
                <div class="ikea-slide">
                  <div class="ikea-visual wardrobe-active">
                    <div class="wardrobe-box">
                      <div class="wardrobe-door left-door" [class.open]="doorOpen()" (click)="doorOpen.set(!doorOpen())">
                        <span class="hinge top-hinge">⚙️</span>
                        <span class="handle">|</span>
                        <span class="hinge bottom-hinge">⚙️</span>
                        <div class="door-label">Porte Gauche</div>
                      </div>
                      <div class="wardrobe-interior">
                        <div class="interior-shelf">Cintres &amp; Vêtements</div>
                        <div class="interior-drawer" [class.pulled]="drawerPulled()" (click)="drawerPulled.set(!drawerPulled())">
                          <span>🗄️ Tiroir Coulissant (cliquer)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ikea-text">
                    <span class="badge badge-ts">ÉTAPE 1 : ÉTAT EN RAM</span>
                    <h4>L'Armoire Montée dans votre Chambre (Objet Vivant)</h4>
                    <p>
                      L'armoire est assemblée en 3 dimensions. Les charnières pivotent, les rails de tiroir glissent : ce sont vos <strong>méthodes POO</strong> (<code>ouvrirPorte()</code>, <code>glisserTiroir()</code>).
                      Tout est vivant, fonctionnel et interactif.
                    </p>
                    <div class="alert-box alert-info">
                      🚗 Problème physique : Impossible de faire entrer l'armoire entière montée dans le coffre d'une berline pour la transporter sur l'autoroute !
                    </div>
                  </div>
                </div>
              }
              @case (2) {
                <div class="ikea-slide">
                  <div class="ikea-visual flat-pack">
                    <div class="carton-box">
                      <div class="planks-stack">
                        <div class="plank">Planche A (Étagère)</div>
                        <div class="plank">Planche B (Montant gauche)</div>
                        <div class="plank">Planche C (Porte)</div>
                      </div>
                      <div class="lost-hinges">
                        <span class="cross-icon">❌</span> Les charnières (méthodes) ont été dévissées et jetées !
                      </div>
                    </div>
                  </div>
                  <div class="ikea-text">
                    <span class="badge badge-purple">ÉTAPE 2 : SÉRIALISATION (JSON.stringify)</span>
                    <h4>Le Démontage à Plat dans le Carton</h4>
                    <p>
                      Pour transporter l'armoire, vous démontez chaque planche et les empilez à plat dans un carton rectangulaire 2D standardisé.
                      <strong>Les charnières et rails sont retirés</strong> : un carton plat ne peut ni coulisser ni s'ouvrir sur des gonds !
                    </p>
                    <div class="alert-box alert-warning">
                      ⚠️ Le comportement s'éteint : les fonctions ne peuvent pas voyager sous forme de planches brutes.
                    </div>
                  </div>
                </div>
              }
              @case (3) {
                <div class="ikea-slide">
                  <div class="ikea-visual transport-truck">
                    <div class="truck-box">
                      <div class="truck-label">📦 CARTON ÉTIQUETÉ n°8849</div>
                      <div class="truck-data">
                        <code>&#123; "bois": "chene", "hauteur": 200, "tiroirs": 2 &#125;</code>
                      </div>
                    </div>
                  </div>
                  <div class="ikea-text">
                    <span class="badge badge-ts">ÉTAPE 3 : TRANSPORT &amp; PERSISTANCE</span>
                    <h4>Le Carton Neutre sur l'Autoroute (Réseau ou Disque)</h4>
                    <p>
                      Le carton voyage sur l'autoroute (câble réseau, requête HTTP) ou dort dans un entrepôt (fichier sur disque dur SSD).
                      N'importe quel transporteur peut le manipuler, car le format du carton est standard et universel.
                    </p>
                    <div class="alert-box alert-info">
                      🌍 Interopérabilité totale : Un camionneur Linux, Windows ou Java peut transporter ce même carton neutre sans rien connaître de votre chambre.
                    </div>
                  </div>
                </div>
              }
              @case (4) {
                <div class="ikea-slide">
                  <div class="ikea-visual reconstruction-arena">
                    <div class="comparison-split">
                      <div class="sub-case naive-case">
                        <div class="sub-case-tag">❌ Désérialisation Naïve (JSON.parse as Armoire)</div>
                        <div class="messy-planks">🪵 Planches posées par terre</div>
                        <p>Ouvrir le carton dépose des planches au sol. Si vous essayez de ranger un manteau dessus, il tombe par terre : <strong>TypeError : pas de charnière !</strong></p>
                      </div>

                      <div class="sub-case notice-case">
                        <div class="sub-case-tag">✅ Notice POO (Armoire.fromDTO())</div>
                        <div class="assembled-again">🚪 Armoire Réassemblée</div>
                        <p>Grâce à la <strong>notice (la classe POO)</strong>, le constructeur réinstalle les charnières, valide les pièces et rend l'armoire à nouveau opérationnelle !</p>
                      </div>
                    </div>
                  </div>
                  <div class="ikea-text">
                    <span class="badge badge-success">ÉTAPE 4 : LE MIRACLE DE LA NOTICE</span>
                    <h4>Désérialisation Naïve vs Fabrique POO</h4>
                    <p>
                      Poser des planches sur la moquette ne crée pas une armoire. C'est exactement l'erreur de <code>JSON.parse(str) as Armoire</code> !
                      Pour retrouver les tiroirs et charnières, il faut obligatoirement la notice d'assemblage : <strong>votre classe POO et sa fabrique <code>fromDTO()</code></strong>.
                    </p>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      } @else {
        <!-- 3. LE BILAN DES PERTES (SURVIE VS MORT) -->
        <div class="card-panel bilan-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">3</span>
              <div>
                <h3 class="zone-title">Le Bilan des Pertes : Ce qui Survit vs Ce qui Meurt</h3>
                <p class="zone-subtitle">Cliquez sur un type de donnée pour observer immédiatement son sort après sérialisation JSON.</p>
              </div>
            </div>
          </div>

          <div class="types-selector-grid">
            @for (item of dataTypes; track item.id) {
              <button 
                class="type-btn" 
                [class.active]="selectedType().id === item.id"
                [class]="'category-' + item.category"
                (click)="selectedType.set(item)"
              >
                <span class="type-icon">{{ item.icon }}</span>
                <span class="type-name">{{ item.name }}</span>
                <span class="status-pill">{{ item.badgeLabel }}</span>
              </button>
            }
          </div>

          <!-- Panneau d'inspection détaillée du type sélectionné -->
          <div class="inspection-display">
            <div class="inspect-header">
              <div class="inspect-title-row">
                <span class="inspect-badge" [class]="'badge-' + selectedType().category">
                  {{ selectedType().badgeLabel }}
                </span>
                <h4>Type analysé : <code>{{ selectedType().name }}</code></h4>
              </div>
              <div class="verdict-banner">{{ selectedType().verdict }}</div>
            </div>

            <div class="inspect-code-columns">
              <div class="code-box">
                <div class="box-title">🧠 En Mémoire Vive (RAM - TypeScript)</div>
                <pre><code>{{ selectedType().ramCode }}</code></pre>
              </div>

              <div class="code-box">
                <div class="box-title">📦 Après JSON.stringify() (Disque/Réseau)</div>
                <pre><code>{{ selectedType().jsonOutput }}</code></pre>
              </div>
            </div>

            <div class="inspect-explanation">
              <strong>💡 Explication architecturale :</strong>
              <p>{{ selectedType().explanation }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .interactive-zone, .ikea-panel, .bilan-panel {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .zone-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
    }

    .zone-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(147, 51, 234, 0.2);
      color: #c084fc;
      font-weight: 800;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .zone-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .zone-subtitle {
      font-size: 0.84rem;
      color: var(--text-muted);
    }

    .zone-controls {
      display: flex;
      gap: 10px;
    }

    .danger-glow {
      border-color: #ef4444 !important;
      color: #f87171 !important;
      background: rgba(239, 68, 68, 0.15) !important;
    }

    /* Dual viewport */
    .dual-viewport {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      min-height: 280px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .viewport-side {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      overflow: hidden;
    }

    .viewport-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.8rem;
    }

    .header-left-col {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;

      &.live-dot {
        background: #10b981;
        box-shadow: 0 0 6px #10b981;
      }
      &.disk-dot {
        background: #a855f7;
        box-shadow: 0 0 6px #a855f7;
      }
    }

    .heap-objects-grid {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
    }

    .heap-card {
      background: var(--bg-card);
      border: 1px solid var(--border-focus);
      border-radius: 8px;
      padding: 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .obj-address {
      font-size: 0.68rem;
      font-family: var(--font-mono);
      color: #60a5fa;
    }

    .obj-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .obj-type {
      color: #c084fc;
    }

    .obj-props {
      font-size: 0.78rem;
      font-family: var(--font-mono);
      background: var(--bg-app);
      padding: 6px 8px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .method-chip {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.74rem;
      font-weight: 600;
      width: 100%;
      text-align: center;

      &.read-only {
        background: rgba(49, 120, 198, 0.15);
        color: #60a5fa;
        border-color: rgba(49, 120, 198, 0.3);
      }
    }

    .heap-pointer-arrow {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.7rem;
      color: #60a5fa;
      font-weight: 600;
    }

    .f5-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 100%;
      padding: 20px;
      gap: 10px;
      color: #f87171;

      .f5-icon {
        font-size: 2.2rem;
      }
      p {
        font-size: 0.8rem;
        color: var(--text-muted);
        max-width: 320px;
      }
    }

    .storage-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 100%;
    }

    .file-name-bar {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      color: var(--text-muted);
      padding: 4px 0;
    }

    .linear-stream-pre {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      font-size: 0.78rem;
      font-family: var(--font-mono);
      color: #34d399;
      white-space: pre-wrap;
      word-break: break-all;
      flex: 1;
    }

    .storage-expl {
      font-size: 0.78rem;
      color: var(--text-muted);
      background: var(--bg-card);
      padding: 8px 12px;
      border-radius: 6px;
    }

    /* IKEA Stepper */
    .ikea-stepper-nav {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .ikea-step-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);

      &.active {
        background: rgba(147, 51, 234, 0.18);
        border-color: #a855f7;
        color: #ffffff;

        .step-circle {
          background: #a855f7;
          color: #ffffff;
        }
      }
    }

    .step-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--bg-subtle);
      color: var(--text-dim);
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ikea-stage-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
    }

    .ikea-slide {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 24px;
      align-items: center;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .ikea-visual {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .wardrobe-box {
      width: 200px;
      height: 180px;
      border: 3px solid #f59e0b;
      background: #78350f;
      border-radius: 6px;
      position: relative;
      display: flex;
    }

    .wardrobe-door {
      width: 100px;
      height: 100%;
      background: #92400e;
      border-right: 2px solid #b45309;
      position: relative;
      cursor: pointer;
      transition: transform 0.3s;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 6px;

      &.open {
        transform: rotateY(-80deg);
        transform-origin: left;
        background: #b45309;
      }
    }

    .hinge {
      font-size: 0.7rem;
    }

    .handle {
      align-self: flex-end;
      font-weight: 800;
      color: #fbbf24;
    }

    .door-label {
      font-size: 0.65rem;
      color: #fef3c7;
      text-align: center;
    }

    .wardrobe-interior {
      flex: 1;
      padding: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #fde68a;
      font-size: 0.68rem;
    }

    .interior-drawer {
      background: #b45309;
      padding: 6px;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      transition: transform 0.2s;

      &.pulled {
        transform: translateY(6px);
        background: #d97706;
      }
    }

    .carton-box {
      width: 220px;
      padding: 14px;
      background: #d97706;
      border: 2px dashed #78350f;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: #451a03;
      font-weight: 700;
      font-size: 0.75rem;
    }

    .plank {
      background: #fde68a;
      padding: 4px 8px;
      border-radius: 3px;
      border: 1px solid #b45309;
    }

    .lost-hinges {
      color: #dc2626;
      font-size: 0.72rem;
      margin-top: 6px;
    }

    .truck-box {
      width: 240px;
      background: #1e293b;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 14px;
      color: #ffffff;
      font-size: 0.75rem;
    }

    .comparison-split {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    .sub-case {
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.72rem;

      &.naive-case {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }
      &.notice-case {
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #86efac;
      }
    }

    .sub-case-tag {
      font-weight: 700;
      margin-bottom: 2px;
    }

    .ikea-text {
      display: flex;
      flex-direction: column;
      gap: 8px;

      h4 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }

      p {
        font-size: 0.88rem;
        color: var(--text-muted);
        line-height: 1.5;
      }
    }

    .alert-box {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 500;

      &.alert-info {
        background: rgba(49, 120, 198, 0.15);
        color: #93c5fd;
        border: 1px solid rgba(49, 120, 198, 0.3);
      }
      &.alert-warning {
        background: rgba(245, 158, 11, 0.15);
        color: #fcd34d;
        border: 1px solid rgba(245, 158, 11, 0.3);
      }
    }

    /* Bilan des pertes */
    .types-selector-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
      gap: 10px;
    }

    .type-btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      padding: 10px 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        border-color: var(--border-focus);
      }

      &.active {
        border-color: #a855f7;
        background: rgba(147, 51, 234, 0.15);
      }
    }

    .type-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-main);
      font-family: var(--font-mono);
    }

    .status-pill {
      font-size: 0.68rem;
      color: var(--text-muted);
    }

    .inspection-display {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .inspect-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .inspect-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      h4 {
        font-size: 1rem;
        font-weight: 700;
      }
    }

    .verdict-banner {
      font-size: 0.82rem;
      font-weight: 700;
      color: #c084fc;
      background: rgba(147, 51, 234, 0.15);
      padding: 4px 10px;
      border-radius: 20px;
    }

    .inspect-code-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .code-box {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .box-title {
        font-size: 0.74rem;
        font-weight: 600;
        color: var(--text-muted);
      }

      pre {
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 10px;
        font-size: 0.78rem;
        font-family: var(--font-mono);
        color: #e2e8f0;
        overflow-x: auto;
      }
    }

    .inspect-explanation {
      background: var(--bg-card);
      border-left: 3px solid #a855f7;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 0.85rem;
      color: var(--text-main);

      p {
        margin-top: 4px;
        color: var(--text-muted);
      }
    }
  `]
})
export class RamVsStorageComponent {
  private readonly nav = inject(NavigationService);
  private readonly exercises = inject(ExerciseService);

  readonly activeSubTab = signal<'theory' | 'bilan'>('theory');
  readonly isF5Triggered = signal<boolean>(false);
  readonly t1Terminee = signal<boolean>(false);

  readonly serializedText = signal<string>(`{
  "code": "PERSISTENCE",
  "taches": [
    {
      "id": "T-101",
      "titre": "Préparer cours",
      "terminee": false
    }
  ]
}`);

  // IKEA Stepper
  readonly currentIkeaStep = signal<number>(1);
  readonly doorOpen = signal<boolean>(false);
  readonly drawerPulled = signal<boolean>(false);

  readonly ikeaSteps = [
    { num: 1, title: '1. Armoire en RAM' },
    { num: 2, title: '2. Démontage (Sérialisation)' },
    { num: 3, title: '3. Carton Neutre (Transport)' },
    { num: 4, title: '4. Notice POO vs Planches' }
  ];

  readonly dataTypes: DataTypeItem[] = [
    {
      id: 'number',
      name: 'number / string / bool',
      category: 'survie',
      badgeLabel: '✅ Survie Intacte',
      icon: '🔢',
      ramCode: 'const user = {\n  age: 21,\n  nom: "Alice",\n  actif: true\n};',
      jsonOutput: '{\n  "age": 21,\n  "nom": "Alice",\n  "actif": true\n}',
      verdict: 'Conservé fidèlement à l\'identique',
      explanation: 'Les valeurs scalaires primitives sont l\'ADN naturel de JSON. Elles sont sérialisées sans aucune perte de fidélité.'
    },
    {
      id: 'null',
      name: 'null',
      category: 'survie',
      badgeLabel: '✅ Survie Intacte',
      icon: '⭕',
      ramCode: 'const user = { adresse: null };',
      jsonOutput: '{\n  "adresse": null\n}',
      verdict: 'Conservé formellement',
      explanation: 'JSON reconnaît nativement le mot-clé null pour signifier l\'absence intentionnelle de valeur.'
    },
    {
      id: 'date',
      name: 'Date (instance)',
      category: 'altere',
      badgeLabel: '⚠️ Altéré en String ISO',
      icon: '📅',
      ramCode: 'const event = {\n  creeLe: new Date("2026-10-28T14:00:00Z")\n};\nconsole.log(event.creeLe.getFullYear()); // 2026',
      jsonOutput: '{\n  "creeLe": "2026-10-28T14:00:00.000Z"\n}',
      verdict: 'Perte des méthodes Date (.getFullYear() crashe !)',
      explanation: 'Date.prototype.toJSON transforme la Date en texte ISO. Après JSON.parse, vous récupérez un banal string : le prototype Date a disparu !'
    },
    {
      id: 'undefined',
      name: 'undefined',
      category: 'mort',
      badgeLabel: '❌ Éliminé / Effacé',
      icon: '👻',
      ramCode: 'const profil = {\n  id: 1,\n  note: undefined,\n  tags: [undefined, "test"]\n};',
      jsonOutput: '{\n  "id": 1,\n  "tags": [null, "test"]\n}',
      verdict: 'Propriété effacée dans l\'objet, null dans un tableau',
      explanation: 'JSON ignore complètement undefined. Dans un objet, la clé est tout bonnement supprimée. Dans un tableau, elle est remplacée par null pour préserver les indices.'
    },
    {
      id: 'function',
      name: 'Fonctions & Méthodes',
      category: 'mort',
      badgeLabel: '❌ Détruit / Évaporé',
      icon: '⚙️',
      ramCode: 'class Compte {\n  solde = 100;\n  retirer(m: number) { this.solde -= m; }\n}\nconst c = new Compte();',
      jsonOutput: '{\n  "solde": 100\n}',
      verdict: 'Toutes les méthodes de classe disparaissent !',
      explanation: 'JSON est un format de DONNÉES passives, pas de code exécutable. Transmettre du code ouvrirait de gigantesques failles d\'injection de sécurité.'
    },
    {
      id: 'private',
      name: 'Champs #privés',
      category: 'mort',
      badgeLabel: '❌ Invisible & Ignoré',
      icon: '🔒',
      ramCode: 'class Utilisateur {\n  #motDePasse = "Secret123!";\n  login = "alice";\n}',
      jsonOutput: '{\n  "login": "alice"\n}',
      verdict: 'Inaccessible au sérialiseur (sécurité garantie)',
      explanation: 'Les champs privés natifs ECMAScript (#champ) sont protégés au runtime. JSON.stringify ne peut pas les lire : ils ne fuiteront jamais dans le JSON.'
    },
    {
      id: 'set-map',
      name: 'Set & Map',
      category: 'mort',
      badgeLabel: '❌ Transformé en objet vide {}',
      icon: '📦',
      ramCode: 'const data = {\n  uniques: new Set([1, 2, 3]),\n  dico: new Map([["a", 1]])\n};',
      jsonOutput: '{\n  "uniques": {},\n  "dico": {}\n}',
      verdict: 'Perte intégrale des données de collection',
      explanation: 'JSON.stringify n\'a pas de correspondance pour Set ou Map. Il les traite comme des objets génériques sans propriétés énumérables propres : sortie = {}. Il faut convertir en Array !'
    },
    {
      id: 'circular',
      name: 'Référence Circulaire',
      category: 'crash',
      badgeLabel: '💥 Exception Fatale Crash',
      icon: '♾️',
      ramCode: 'const parent: any = { nom: "Parent" };\nconst enfant: any = { nom: "Enfant", parent };\nparent.enfant = enfant;\n\nJSON.stringify(parent);',
      jsonOutput: '💥 TypeError: Converting circular structure to JSON\n    at JSON.stringify (<anonymous>)',
      verdict: 'Arrêt immédiat de l\'exécution avec exception',
      explanation: 'Le sérialiseur parcourt le graphe en profondeur. Face à une boucle infinie, il ne peut pas s\'arrêter et lance une exception fatale pour protéger la pile d\'appels.'
    }
  ];

  readonly selectedType = signal<DataTypeItem>(this.dataTypes[0]);

  toggleT1(): void {
    this.t1Terminee.update(v => !v);
    this.serializeHeap();
  }

  triggerF5(): void {
    this.isF5Triggered.set(true);
  }

  restoreHeap(): void {
    this.isF5Triggered.set(false);
  }

  serializeHeap(): void {
    const data = {
      code: "PERSISTENCE",
      taches: [
        {
          id: "T-101",
          titre: "Préparer cours",
          terminee: this.t1Terminee()
        }
      ]
    };
    this.serializedText.set(JSON.stringify(data, null, 2));
  }

  jumpToLab(): void {
    this.exercises.setFilterLab(1);
    this.nav.setTab('workshops-lab');
  }
}
