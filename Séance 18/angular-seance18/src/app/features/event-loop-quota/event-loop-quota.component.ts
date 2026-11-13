import { Component, signal, OnDestroy, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-event-loop-quota',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 03 · PHYSIQUE DU DISQUE &amp; SÉCURISATION POO</div>
        <h2>Simulateur d'Event Loop &amp; Gestion du Quota (5 Mo)</h2>
        <p class="module-desc">
          Ressentez physiquement la nature synchrone et bloquante de <code>localStorage</code> sur l'Event Loop,
          et apprenez à dompter le crash critique <code>QuotaExceededError</code> grâce au patron <code>try / catch</code> (S10).
        </p>
      </div>

      <!-- Section 1 : Visualiseur de Gel Synchrone -->
      <div class="card-panel freeze-panel">
        <div class="section-title-row">
          <div class="s-title">🧊 Visualiseur de Blocage Synchrone de l'Event Loop</div>
          <span class="badge badge-warning">Thread Principal Monopolisé</span>
        </div>

        <div class="freeze-grid">
          <!-- Animation témoin du thread -->
          <div class="loop-indicator-box">
            <div class="indicator-header">
              <span>Animation Témoin (Event Loop)</span>
              <span class="fps-pill" [class.frozen]="currentFps() < 30">{{ currentFps() }} FPS</span>
            </div>

            <div class="spinner-stage">
              <div class="orbit-wheel" [class.slow]="isFreezing()">
                <div class="satellite sat-1"></div>
                <div class="satellite sat-2"></div>
                <div class="satellite sat-3"></div>
                <div class="satellite sat-4"></div>
              </div>
              <div class="core-clock">⚡</div>
            </div>

            <div class="thread-status" [class.blocked]="isFreezing()">
              {{ isFreezing() ? '🚨 THREAD PRINCIPAL GELÉ (ÉCRITURE EN COURS)' : '🟢 Event Loop fluide (60 FPS)' }}
            </div>
          </div>

          <!-- Contrôles du test synchrone -->
          <div class="controls-box">
            <div class="slider-row">
              <label>Volume d'objets à sérialiser &amp; persister :</label>
              <div class="range-display">
                <input 
                  type="range" 
                  min="500" 
                  max="25000" 
                  step="500" 
                  [value]="itemCount()" 
                  (input)="itemCount.set(+$any($event.target).value)" 
                />
                <strong class="count-badge">{{ itemCount().toLocaleString() }} objets</strong>
              </div>
            </div>

            <p class="info-note">
              Chaque objet contient un ID, un UUID, un texte et une date. À la différence de <code>fetch()</code> qui est asynchrone,
              <code>localStorage.setItem()</code> <strong>gèle l'écran</strong> jusqu'à la fin de la sérialisation et de l'écriture disque !
            </p>

            <div class="benchmark-btn-row">
              <button class="btn-primary" [disabled]="isFreezing()" (click)="triggerSynchronousFreeze()">
                🐌 Lancer l'Écriture Synchrone (Tester le Gel)
              </button>
            </div>

            @if (freezeDuration() > 0) {
              <div class="freeze-result-card animate-fade">
                <div class="res-row">
                  <span>Temps de gel du thread :</span>
                  <strong class="text-danger">{{ freezeDuration().toFixed(1) }} ms</strong>
                </div>
                <div class="res-row">
                  <span>Images manquées (Frames Drop) :</span>
                  <strong>~{{ droppedFrames() }} frames</strong>
                </div>
                <div class="res-desc">
                  Pendant ces {{ freezeDuration().toFixed(0) }} ms, aucun clic n'était cliquable et l'animation s'est figée à 0 FPS.
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Section 2 : Crash Test QuotaExceededError & Stratégie de Repli -->
      <div class="card-panel quota-panel">
        <div class="section-title-row">
          <div class="s-title">💥 Crash Test : QuotaExceededError (Plafond 5 Mo)</div>
          <span class="badge badge-red">DOMException · Code 22</span>
        </div>

        <div class="quota-layout">
          <!-- Jauge visuelle de 5 Mo -->
          <div class="gauge-card">
            <div class="gauge-label">
              <span>Espace consommé simulé :</span>
              <strong>{{ (quotaUsageKo() / 1024).toFixed(2) }} Mo / 5.00 Mo</strong>
            </div>
            <div class="gauge-track">
              <div 
                class="gauge-bar" 
                [style.width.%]="quotaPercent()"
                [class.warn]="quotaPercent() > 70"
                [class.danger]="quotaPercent() >= 98"
              ></div>
            </div>
            <div class="gauge-legend">
              <span>0 Mo</span>
              <span>2.5 Mo</span>
              <span>5.0 Mo (Plafond navigateur)</span>
            </div>

            <div class="quota-buttons">
              <button class="btn-primary" (click)="addChunk(512)">+ Ajouter 512 Ko</button>
              <button class="btn-danger" (click)="triggerQuotaCrash()">💣 Remplir jusqu'à Saturation</button>
              <button class="btn-secondary" (click)="resetQuota()">Purger le quota</button>
            </div>
          </div>

          <!-- Comparateur POO : Sans try/catch vs Avec try/catch -->
          <div class="code-compare-grid">
            <div class="code-box crash-box" [class.triggered]="quotaErrorOccurred() && !handledWithTryCatch()">
              <div class="box-tag">❌ Sans try / catch (Le Crash Fatal)</div>
              <pre><code>// Sauvegarde naïve :
localStorage.setItem(cle, grosJSON);

// 💣 Résultat si 5 Mo dépassés :
// Uncaught DOMException: Failed to execute
// 'setItem' on 'Storage': Setting the value
// exceeded the quota.
// ➔ Écran blanc, app Angular plantée !</code></pre>
            </div>

            <div class="code-box safe-box" [class.triggered]="quotaErrorOccurred() && handledWithTryCatch()">
              <div class="box-tag">✅ Résilience POO (Interception S10 &amp; LRU)</div>
              <pre><code>try &#123;
  localStorage.setItem(cle, grosJSON);
&#125; catch (erreur) &#123;
  if (erreur instanceof DOMException &amp;&amp; 
     (erreur.name === 'QuotaExceededError' || erreur.code === 22)) &#123;
    console.error('Plafond 5 Mo atteint !');
    purgerCleLaPlusAncienne(); // Repli LRU
  &#125;
&#125;</code></pre>
            </div>
          </div>
        </div>

        @if (quotaErrorOccurred()) {
          <div class="exception-banner animate-fade">
            <div class="ex-icon">🛑</div>
            <div class="ex-content">
              <div class="ex-title">Exception interceptée : DOMException (QuotaExceededError)</div>
              <p class="ex-msg">
                Le navigateur a refusé d'écrire sur le disque dur. Grâce au bloc <code>try / catch</code>, 
                l'application ne s'est pas effondrée et a déclenché une alerte protectrice.
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .freeze-panel, .quota-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .s-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .freeze-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
    }

    .loop-indicator-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .indicator-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-muted);

        .fps-pill {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 2px 8px;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.76rem;

          &.frozen {
            background: rgba(221, 0, 49, 0.2);
            color: #f87171;
          }
        }
      }

      .spinner-stage {
        position: relative;
        width: 130px;
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;

        .orbit-wheel {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;

          &.slow {
            animation-duration: 10s;
          }

          .satellite {
            position: absolute;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #3b82f6;
            box-shadow: 0 0 10px #3b82f6;

            &.sat-1 { top: 0; left: 58px; background: #3b82f6; }
            &.sat-2 { top: 58px; right: 0; background: #9333ea; }
            &.sat-3 { bottom: 0; left: 58px; background: #10b981; }
            &.sat-4 { top: 58px; left: 0; background: #f59e0b; }
          }
        }

        .core-clock {
          font-size: 1.8rem;
        }
      }

      .thread-status {
        font-size: 0.78rem;
        font-weight: 700;
        text-align: center;
        color: #34d399;

        &.blocked {
          color: #f87171;
        }
      }
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .controls-box {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .slider-row {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .range-display {
          display: flex;
          align-items: center;
          gap: 16px;

          input[type="range"] {
            flex: 1;
          }

          .count-badge {
            font-family: var(--font-mono);
            font-size: 0.9rem;
            color: var(--ts-blue-light);
            min-width: 110px;
          }
        }
      }

      .info-note {
        font-size: 0.84rem;
        color: var(--text-muted);
        line-height: 1.5;
        background: var(--bg-subtle);
        padding: 10px 12px;
        border-radius: 6px;
        border-left: 3px solid var(--ts-blue);
      }

      .freeze-result-card {
        background: rgba(221, 0, 49, 0.08);
        border: 1px solid rgba(221, 0, 49, 0.25);
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.84rem;

        .res-row {
          display: flex;
          justify-content: space-between;

          .text-danger {
            color: #f87171;
            font-size: 1rem;
          }
        }

        .res-desc {
          font-size: 0.76rem;
          color: var(--text-dim);
          margin-top: 4px;
        }
      }
    }

    .quota-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .gauge-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .gauge-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.82rem;
        color: var(--text-main);
      }

      .gauge-track {
        height: 16px;
        background: var(--bg-card);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--border-color);

        .gauge-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          transition: width 0.3s ease, background 0.3s ease;

          &.warn {
            background: linear-gradient(90deg, #f59e0b, #ef4444);
          }

          &.danger {
            background: #ef4444;
          }
        }
      }

      .gauge-legend {
        display: flex;
        justify-content: space-between;
        font-size: 0.72rem;
        color: var(--text-dim);
      }

      .quota-buttons {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        flex-wrap: wrap;

        button {
          padding: 8px 12px;
          font-size: 0.8rem;
        }
      }
    }

    .code-compare-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;

      .code-box {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 10px;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        display: flex;
        flex-direction: column;
        gap: 4px;

        &.triggered {
          border-color: #f87171;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
        }

        &.safe-box.triggered {
          border-color: #34d399;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }

        .box-tag {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        pre code {
          line-height: 1.35;
        }
      }
    }

    .exception-banner {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(221, 0, 49, 0.1);
      border: 1px solid rgba(221, 0, 49, 0.35);
      border-radius: 8px;
      padding: 14px 18px;

      .ex-icon {
        font-size: 2rem;
      }

      .ex-content {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .ex-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #f87171;
        }

        .ex-msg {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
      }
    }
  `]
})
export class EventLoopQuotaComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly currentFps = signal<number>(60);
  readonly isFreezing = signal<boolean>(false);
  readonly itemCount = signal<number>(5000);
  readonly freezeDuration = signal<number>(0);
  readonly droppedFrames = signal<number>(0);

  // Quota state
  readonly quotaUsageKo = signal<number>(1200); // 1.2 Mo départ
  readonly quotaPercent = signal<number>(24);
  readonly quotaErrorOccurred = signal<boolean>(false);
  readonly handledWithTryCatch = signal<boolean>(true);

  private animFrameId: number | null = null;
  private lastTime = performance.now();
  private frames = 0;

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.startFpsLoop();
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  private startFpsLoop(): void {
    const loop = (now: number) => {
      this.frames++;
      if (now - this.lastTime >= 500) {
        const fps = Math.round((this.frames * 1000) / (now - this.lastTime));
        this.currentFps.set(Math.min(60, fps));
        this.frames = 0;
        this.lastTime = now;
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  triggerSynchronousFreeze(): void {
    this.isFreezing.set(true);

    setTimeout(() => {
      const count = this.itemCount();
      const start = performance.now();

      // Construction d'un gros volume de données
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push({
          id: i,
          uuid: 'uuid-1234-5678-' + i,
          titre: 'Article ' + i + ' — Cours POO Séance 18',
          date: new Date().toISOString()
        });
      }

      // Sérialisation synchrone bloquante (JSON.stringify intensif)
      const serialized = JSON.stringify(list);

      // Simulation de travail disque synchrone
      for (let j = 0; j < 5; j++) {
        JSON.parse(serialized);
      }

      const end = performance.now();
      const duration = end - start;

      this.freezeDuration.set(duration);
      this.droppedFrames.set(Math.max(1, Math.round(duration / 16.6)));
      this.isFreezing.set(false);
    }, 50);
  }

  addChunk(ko: number): void {
    const nextKo = this.quotaUsageKo() + ko;
    if (nextKo >= 5120) {
      this.triggerQuotaCrash();
    } else {
      this.quotaUsageKo.set(nextKo);
      this.quotaPercent.set(Math.min(100, Math.round((nextKo / 5120) * 100)));
      this.quotaErrorOccurred.set(false);
    }
  }

  triggerQuotaCrash(): void {
    this.quotaUsageKo.set(5120);
    this.quotaPercent.set(100);
    this.quotaErrorOccurred.set(true);
    this.handledWithTryCatch.set(true);
  }

  resetQuota(): void {
    this.quotaUsageKo.set(0);
    this.quotaPercent.set(0);
    this.quotaErrorOccurred.set(false);
  }
}
