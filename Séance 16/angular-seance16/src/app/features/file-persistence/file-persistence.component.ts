import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;
  terminee: boolean;
}

class Tache {
  constructor(
    public id: string,
    public titre: string,
    public echeance: string,
    public terminee: boolean = false
  ) {
    if (!titre || titre.trim() === '') {
      throw new Error('Titre obligatoire : un invariant métier interdit une tâche sans titre.');
    }
  }

  static fromDTO(dto: TacheDTO): Tache {
    return new Tache(dto.id, dto.titre, dto.echeance, dto.terminee);
  }

  toDTO(): TacheDTO {
    return {
      id: this.id,
      titre: this.titre,
      echeance: this.echeance,
      terminee: this.terminee
    };
  }
}

@Component({
  selector: 'app-file-persistence',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <div class="module-header card-panel">
        <div class="module-tag">Module 07 · Persistance Locale sur Fichier</div>
        <h2>Démonstrateur : Persistance Locale par Fichier Web</h2>
        <p class="module-desc">
          Une application Web Angular s'exécute dans un bac à sable de sécurité (*sandbox*) :
          elle ne peut pas écrire arbitrairement sur le disque comme un programme Java ou C#.
          Grâce à l'API <strong>File System Access</strong> (<code>showOpenFilePicker</code> / <code>showSaveFilePicker</code>),
          l'utilisateur autorise le navigateur à lire et écrire des fichiers JSON directement sur son stockage local.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeTab() === 'demo'" (click)="activeTab.set('demo')">
              💾 Démonstrateur Interactif en Direct
            </button>
            <button class="mode-tab-btn" [class.active]="activeTab() === 'arch'" (click)="activeTab.set('arch')">
              🏛️ Architecture Sandbox Web vs Desktop
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Aller aux Exercices du Labo 4 ➔
          </button>
        </div>
      </div>

      <!-- ONGLET 1 : DÉMONSTRATEUR EN DIRECT -->
      @if (activeTab() === 'demo') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">1</span>
              <div>
                <h3 class="zone-title">Gestionnaire de Tâches Réactif (Signal-First)</h3>
                <p class="zone-subtitle">Ajoutez des tâches en RAM et écrivez-les dans un véritable fichier <code>taches.json</code> sur votre machine.</p>
              </div>
            </div>

            <div class="file-action-buttons">
              <button class="btn-secondary" (click)="ouvrirFichier()">
                📂 Ouvrir un Fichier JSON
              </button>
              <button class="btn-primary" (click)="enregistrerFichier()">
                💾 Enregistrer sous (taches.json)
              </button>
              <button class="btn-ghost" (click)="reinitialiserListe()">
                ↺ Réinitialiser
              </button>
            </div>
          </div>

          <!-- Notification feedback -->
          @if (statusMessage()) {
            <div class="status-alert" [class.alert-ok]="statusType() === 'ok'" [class.alert-err]="statusType() === 'err'">
              {{ statusMessage() }}
            </div>
          }

          <div class="demo-grid">
            <!-- Colonne 1 : Formulaire et Liste en RAM -->
            <div class="tasks-col">
              <!-- Formulaire d'ajout -->
              <form class="task-form" (ngSubmit)="ajouterTache()">
                <div class="form-row">
                  <input 
                    type="text" 
                    [(ngModel)]="nouveauTitre" 
                    name="titre" 
                    placeholder="Titre de la tâche (ex: Réviser DTO)"
                    class="form-input"
                  />
                  <input 
                    type="date" 
                    [(ngModel)]="nouvelleDate" 
                    name="echeance" 
                    class="form-input date-input"
                  />
                  <button type="submit" class="btn-primary btn-add">
                    + Ajouter en RAM
                  </button>
                </div>
                @if (formError()) {
                  <span class="form-err-msg">⚠️ {{ formError() }}</span>
                }
              </form>

              <!-- Liste des tâches gérée par Signal -->
              <div class="tasks-list">
                <div class="list-head">
                  <span>Tâches en Mémoire Vive : <strong>{{ taches().length }}</strong></span>
                  <span class="badge badge-ts">signal&lt;Tache[]&gt;</span>
                </div>

                @if (taches().length === 0) {
                  <div class="empty-list">
                    Aucune tâche en mémoire. Utilisez le formulaire ou ouvrez un fichier JSON existant.
                  </div>
                } @else {
                  <div class="items-container">
                    @for (t of taches(); track t.id) {
                      <div class="task-card" [class.done]="t.terminee">
                        <input 
                          type="checkbox" 
                          [checked]="t.terminee" 
                          (change)="toggleTache(t.id)"
                          class="task-chk"
                        />
                        <div class="task-info">
                          <span class="task-titre">{{ t.titre }}</span>
                          <span class="task-date">📅 Échéance : {{ t.echeance }}</span>
                        </div>
                        <button class="btn-delete" (click)="supprimerTache(t.id)" title="Supprimer de la RAM">
                          🗑️
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Colonne 2 : Aperçu du flux JSON prêt pour le disque -->
            <div class="json-preview-col">
              <div class="col-bar">
                <span>📄 Flux Sérialisé en Temps Réel (JSON.stringify) :</span>
                <span class="badge badge-purple">{{ jsonByteLength() }} octets</span>
              </div>

              <pre class="json-stream-pre"><code>{{ jsonStream() }}</code></pre>

              <div class="sync-explanation">
                <span class="bullet">💡</span>
                <p>
                  <strong>Mémoire d'abord :</strong> Ajouter ou modifier une tâche met à jour le Signal réactif en RAM instantanément.
                  L'écriture physique sur le SSD n'intervient <em>que</em> lorsque l'utilisateur clique explicitement sur « Enregistrer sous ».
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ONGLET 2 : ANALYSE SANDBOX VS DESKTOP -->
      @if (activeTab() === 'arch') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">2</span>
              <div>
                <h3 class="zone-title">Pourquoi pas comme une Application Java ou C# ?</h3>
                <p class="zone-subtitle">La frontière infranchissable du modèle de sécurité du Web.</p>
              </div>
            </div>
          </div>

          <div class="sandbox-comparison-grid">
            <div class="arch-card desktop-card">
              <div class="arch-badge">APPLICATION DESKTOP (JAVA, C#, PYTHON)</div>
              <h4>Accès Direct au Système de Fichiers de l'OS</h4>
              <p>
                Le programme s'exécute avec les privilèges de l'utilisateur connecté sur la machine. Il peut créer, modifier ou écraser n'importe quel fichier sur le disque sans demander de permission à chaque opération :
              </p>
              <pre class="code-box"><code>// Java (NIO) :
Files.writeString(Path.of("taches.json"), json);

// C# (.NET) :
File.WriteAllText("taches.json", json);</code></pre>
              <div class="note-box">
                🔓 Risque de sécurité : Si le programme est malveillant, il peut chiffrer ou détruire vos données à votre insu.
              </div>
            </div>

            <div class="arch-card web-card">
              <div class="arch-badge badge-purple">APPLICATION WEB (ANGULAR DANS LE NAVIGATEUR)</div>
              <h4>Isolation Stricte dans la Sandbox</h4>
              <p>
                Un onglet de navigateur n'a <strong>strictement aucun droit</strong> d'accès direct au disque dur. C'est l'utilisateur qui garde le contrôle total via les boîtes de dialogue natives de l'OS :
              </p>
              <pre class="code-box"><code>// Navigateur (File System Access API) :
const [handle] = await window.showOpenFilePicker();
const data = JSON.parse(await (await handle.getFile()).text());
this.taches.set(data.map(Tache.fromDTO));</code></pre>
              <div class="note-box note-safe">
                🛡️ Garantie sécurité : Aucune écriture ni lecture ne peut être déclenchée sans un clic délibéré de l'utilisateur.
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
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
      margin-bottom: 16px;
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

    .file-action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .status-alert {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 14px;

      &.alert-ok {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      &.alert-err {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
    }

    /* Demo Grid */
    .demo-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .tasks-col, .json-preview-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .task-form {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .form-input {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 12px;
      color: var(--text-main);
      font-size: 0.82rem;
      flex: 1;

      &:focus {
        border-color: var(--border-focus);
        outline: none;
      }

      &.date-input {
        flex: 0 0 140px;
      }
    }

    .btn-add {
      white-space: nowrap;
    }

    .form-err-msg {
      font-size: 0.74rem;
      color: #f87171;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .list-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .empty-list {
      background: var(--bg-card);
      border: 1px dashed var(--border-color);
      border-radius: 6px;
      padding: 24px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-dim);
    }

    .items-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 280px;
      overflow-y: auto;
    }

    .task-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s;

      &.done {
        opacity: 0.6;
        .task-titre {
          text-decoration: line-through;
          color: var(--text-dim);
        }
      }
    }

    .task-chk {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .task-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .task-titre {
      font-size: 0.84rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .task-date {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .btn-delete {
      color: var(--text-dim);
      font-size: 0.85rem;
      padding: 4px;
      border-radius: 4px;

      &:hover {
        color: #ef4444;
        background: var(--bg-subtle);
      }
    }

    /* JSON Preview */
    .col-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .json-stream-pre {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      font-size: 0.78rem;
      font-family: var(--font-mono);
      color: #34d399;
      line-height: 1.4;
      overflow-x: auto;
      flex: 1;
      max-height: 280px;
    }

    .sync-explanation {
      background: var(--bg-card);
      border-left: 3px solid #3b82f6;
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 0.78rem;
      color: var(--text-muted);

      p {
        line-height: 1.4;
      }
    }

    /* Sandbox comparison */
    .sandbox-comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .arch-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .arch-badge {
        font-size: 0.68rem;
        font-weight: 800;
        color: #60a5fa;
      }

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    .code-box {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      padding: 10px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: #f1f5f9;
      line-height: 1.4;
    }

    .note-box {
      background: var(--bg-card);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.76rem;
      color: #f87171;

      &.note-safe {
        color: #34d399;
      }
    }
  `]
})
export class FilePersistenceComponent {
  private readonly nav = inject(NavigationService);
  private readonly exercises = inject(ExerciseService);

  readonly activeTab = signal<'demo' | 'arch'>('demo');

  // État réactif géré par Signal-First
  readonly taches = signal<Tache[]>([
    new Tache('T-1', 'Comprendre la volatilité de la RAM', '2026-10-28', true),
    new Tache('T-2', 'Maîtriser le patron DTO et fromDTO()', '2026-10-29', false),
    new Tache('T-3', 'Sauvegarder ce fichier sur disque local', '2026-10-30', false)
  ]);

  nouveauTitre = '';
  nouvelleDate = '2026-11-02';
  readonly formError = signal<string>('');
  readonly statusMessage = signal<string>('');
  readonly statusType = signal<'ok' | 'err'>('ok');

  readonly jsonStream = computed<string>(() => {
    const dtoList: TacheDTO[] = this.taches().map(t => t.toDTO());
    return JSON.stringify(dtoList, null, 2);
  });

  readonly jsonByteLength = computed<number>(() => {
    return new TextEncoder().encode(this.jsonStream()).length;
  });

  ajouterTache(): void {
    try {
      this.formError.set('');
      const nouvelle = new Tache(
        `T-${Date.now().toString().slice(-4)}`,
        this.nouveauTitre,
        this.nouvelleDate || '2026-11-02'
      );
      this.taches.update(liste => [...liste, nouvelle]);
      this.nouveauTitre = '';
      this.showStatus('Tâche instanciée avec succès dans la RAM !', 'ok');
    } catch (err: any) {
      this.formError.set(err.message);
    }
  }

  toggleTache(id: string): void {
    this.taches.update(list =>
      list.map(t => (t.id === id ? new Tache(t.id, t.titre, t.echeance, !t.terminee) : t))
    );
  }

  supprimerTache(id: string): void {
    this.taches.update(list => list.filter(t => t.id !== id));
    this.showStatus('Tâche supprimée de la mémoire vive.', 'ok');
  }

  reinitialiserListe(): void {
    this.taches.set([
      new Tache('T-1', 'Comprendre la volatilité de la RAM', '2026-10-28', true),
      new Tache('T-2', 'Maîtriser le patron DTO et fromDTO()', '2026-10-29', false)
    ]);
    this.showStatus('Liste réinitialisée en RAM.', 'ok');
  }

  async enregistrerFichier(): Promise<void> {
    const contenu = this.jsonStream();

    if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
      try {
        const picker = (window as any).showSaveFilePicker({
          suggestedName: 'taches.json',
          types: [
            {
              description: 'Fichier JSON',
              accept: { 'application/json': ['.json'] }
            }
          ]
        });
        const handle = await picker;
        const writable = await handle.createWritable();
        await writable.write(contenu);
        await writable.close();
        this.showStatus('Fichier taches.json écrit sur le disque avec succès !', 'ok');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          this.downloadFallback(contenu);
        }
      }
    } else {
      // Fallback de téléchargement direct
      this.downloadFallback(contenu);
    }
  }

  async ouvrirFichier(): Promise<void> {
    if (typeof window !== 'undefined' && 'showOpenFilePicker' in window) {
      try {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'Fichier JSON',
              accept: { 'application/json': ['.json'] }
            }
          ],
          multiple: false
        });
        const file = await handle.getFile();
        const text = await file.text();
        const rawArray = JSON.parse(text);

        if (Array.isArray(rawArray)) {
          const rehydrated = rawArray.map(Tache.fromDTO);
          this.taches.set(rehydrated);
          this.showStatus(`Fichier ${file.name} ouvert : ${rehydrated.length} tâches réhydratées !`, 'ok');
        } else {
          this.showStatus('Format invalide : le fichier doit contenir un tableau JSON [ ... ].', 'err');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          this.showStatus(`Erreur de lecture : ${err.message}`, 'err');
        }
      }
    } else {
      this.showStatus('L\'API showOpenFilePicker nécessite un navigateur basé sur Chromium (Chrome, Edge) ou HTTPS.', 'err');
    }
  }

  private downloadFallback(contenu: string): void {
    if (typeof document === 'undefined') return;
    const blob = new Blob([contenu], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taches.json';
    a.click();
    URL.revokeObjectURL(url);
    this.showStatus('Téléchargement de taches.json déclenché (mode de repli universel).', 'ok');
  }

  private showStatus(msg: string, type: 'ok' | 'err'): void {
    this.statusMessage.set(msg);
    this.statusType.set(type);
    setTimeout(() => {
      this.statusMessage.set('');
    }, 4500);
  }

  jumpToLab(): void {
    this.exercises.setFilterLab(4);
    this.nav.setTab('workshops-lab');
  }
}
