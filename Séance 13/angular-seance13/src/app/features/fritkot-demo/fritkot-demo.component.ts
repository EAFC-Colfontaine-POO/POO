import { Component, signal, computed, effect, input, output, model, ModelSignal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export type Taille = 'MOYENNE' | 'LARGE' | 'XXL';

export interface Article {
  id: number;
  nom: string;
  taille: Taille;
  prixUnitaire: number;
  quantite: number;
}

export function prixLigne(a: Article): number {
  return a.prixUnitaire * a.quantite;
}

// ==========================================
// COMPOSANT ENFANT : Compteur de Quantité (model)
// ==========================================
@Component({
  selector: 'app-compteur-stepper',
  standalone: true,
  template: `
    <span class="stepper-box">
      <button class="btn-step" (click)="moins()" title="Diminuer">− </button>
      <span class="step-num">{{ quantite() }}</span>
      <button class="btn-step" (click)="plus()" title="Augmenter">＋</button>
    </span>
  `,
  styles: [`
    .stepper-box {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 2px 6px;
    }
    .btn-step {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--bs-purple-light);
      padding: 2px 6px;
      line-height: 1;
      &:hover { color: #fff; }
    }
    .step-num {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 700;
      min-width: 18px;
      text-align: center;
      color: var(--text-main);
    }
  `]
})
export class CompteurStepperComponent {
  quantite: ModelSignal<number> = model<number>(1);

  moins(): void {
    if (this.quantite() > 1) {
      this.quantite.update(n => n - 1);
    }
  }

  plus(): void {
    this.quantite.update(n => n + 1);
  }
}

// ==========================================
// COMPOSANT ENFANT : LigneCommandeComponent
// ==========================================
@Component({
  selector: 'app-ligne-commande',
  standalone: true,
  imports: [CompteurStepperComponent, DecimalPipe],
  template: `
    <div class="ligne-ticket-card">
      <div class="ligne-left">
        <app-compteur-stepper 
          [quantite]="article().quantite" 
          (quantiteChange)="onQtyChange($event)"
        />
        <div class="item-details">
          <span class="item-name">{{ article().nom }}</span>
          <span class="item-taille">{{ article().taille }} · {{ article().prixUnitaire | number:'1.2-2' }} €/u</span>
        </div>
      </div>

      <div class="ligne-right">
        <span class="ligne-prix font-mono">{{ prixTotal() | number:'1.2-2' }} €</span>
        <button class="btn-trash" (click)="suppression.emit(article().id)" title="Supprimer la ligne">
          🗑️
        </button>
      </div>
    </div>
  `,
  styles: [`
    .ligne-ticket-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      gap: 12px;
      transition: all 0.2s;

      &:hover {
        border-color: rgba(121, 82, 179, 0.4);
      }
    }
    .ligne-left, .ligne-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .item-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .item-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .item-taille {
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .ligne-prix {
      font-size: 1rem;
      font-weight: 800;
      color: #38bdf8;
    }
    .btn-trash {
      font-size: 1rem;
      opacity: 0.6;
      &:hover { opacity: 1; transform: scale(1.15); }
    }
  `]
})
export class LigneCommandeComponent {
  article = input.required<Article>();
  suppression = output<number>();
  quantiteChange = output<{ id: number; quantite: number }>();

  prixTotal = computed(() => prixLigne(this.article()));

  onQtyChange(qte: number): void {
    this.quantiteChange.emit({ id: this.article().id, quantite: qte });
  }
}

// ==========================================
// COMPOSANT PRINCIPAL : FritkotDemoComponent
// ==========================================
@Component({
  selector: 'app-fritkot-demo',
  standalone: true,
  imports: [LigneCommandeComponent, DecimalPipe],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 13 · Module 06</span>
          <span class="badge badge-purple">Application Complète</span>
          <span class="badge badge-warning">🍟 Frit'Kot Réactive</span>
          <span class="badge badge-success">&#64;for ... track & &#64;empty</span>
        </div>
        <h2>Démonstration Complète : 🍟 La Friterie Réactive (Frit'Kot)</h2>
        <p class="module-desc">
          Une application concrète intégrant le triptyque au grand complet : source privée, vue publique readonly, totaux en <code>computed</code>, composant enfant avec <code>input.required</code> et <code>output</code>, stepper bidirectionnel avec <code>model()</code>, persistance automatique <code>localStorage</code> via <code>effect()</code>, et nouveau flux déclaratif <code>&#64;for ... track</code> / <code>&#64;empty</code>.
        </p>
      </div>

      <div class="fritkot-workbench">
        <div class="pos-grid">

          <!-- Colonne Gauche : Ticket de Commande Réactif -->
          <div class="card-panel pos-ticket-panel">
            <div class="ticket-header">
              <div class="brand-row">
                <span class="brand-icon">🍟</span>
                <div>
                  <h3 class="brand-name">Frit'Kot · Commande Réactive</h3>
                  <p class="brand-sub">Angular 22 · Fine-Grained Signals DAG</p>
                </div>
              </div>
              <div class="ticket-total-box">
                <div class="total-amount font-mono">{{ total() | number:'1.2-2' }} €</div>
                <div class="total-lbl">TOTAL (computed)</div>
              </div>
            </div>

            <!-- Barre de statut de livraison offerte (Exercice 01 du syllabus) -->
            <div class="delivery-status-box" [class.free]="livraisonOfferte()">
              @if (livraisonOfferte()) {
                <span class="del-icon">🚚</span>
                <span class="del-text"><strong>Livraison offerte !</strong> Votre commande dépasse 20.00 €.</span>
              } @else {
                <span class="del-icon">📦</span>
                <span class="del-text">Plus que <strong>{{ resteAvantLivraison() | number:'1.2-2' }} €</strong> pour la livraison offerte (dès 20 €).</span>
              }
            </div>

            <!-- Liste des lignes de commande avec @for ... track et @empty -->
            <div class="ticket-lines-container mt-3">
              <div class="lines-list">
                @for (art of commande(); track art.id) {
                  <app-ligne-commande 
                    [article]="art"
                    (suppression)="supprimer($event)"
                    (quantiteChange)="modifierQuantite($event.id, $event.quantite)"
                  />
                } @empty {
                  <div class="empty-ticket-alert">
                    <span class="empty-icon">🍽️</span>
                    <strong>Votre cornet est vide !</strong>
                    <p>Ajoutez des articles depuis la carte à droite pour démarrer votre commande.</p>
                  </div>
                }
              </div>
            </div>

            <!-- Pied du ticket -->
            <div class="ticket-footer mt-3">
              <div class="footer-stats">
                <span>{{ nbArticles() }} articles au total</span>
                <span class="dim">Persistance active (localStorage: 'fritkot')</span>
              </div>
              <div class="ticket-actions">
                <button class="btn-ghost btn-xs text-danger" (click)="viderCommande()" [disabled]="commande().length === 0">
                  Vider le panier
                </button>
                <button class="btn-secondary btn-xs" (click)="reinitialiserCommandeDefaut()">
                  Restaurer démo par défaut
                </button>
              </div>
            </div>
          </div>

          <!-- Colonne Droite : Carte du Restaurant & Ajout d'Articles -->
          <div class="card-panel pos-menu-panel">
            <div class="menu-head">
              <h4>🍔 Carte de la Friterie (Ajout Immuable)</h4>
              <p class="sub-text">Cliquez sur un mets pour l'insérer dans le panier via <code>_commande.update()</code> :</p>
            </div>

            <div class="menu-items-grid mt-3">
              @for (item of catalogueMets; track item.nom + item.taille) {
                <button class="menu-item-btn" (click)="ajouterAuPanier(item)">
                  <div class="item-top">
                    <span class="item-icon">{{ item.icon }}</span>
                    <span class="item-price font-mono">{{ item.prixUnitaire | number:'1.2-2' }} €</span>
                  </div>
                  <div class="item-title">{{ item.nom }}</div>
                  <div class="item-badge-taille">{{ item.taille }}</div>
                </button>
              }
            </div>

            <!-- Rappel Architectural des 5 Piliers -->
            <div class="card-panel pillars-mini-card mt-4">
              <h5>🏛️ Les 5 Piliers Réactifs à l'Œuvre :</h5>
              <ul class="pillars-list">
                <li><strong>1. Source privée :</strong> <code>private readonly _commande = signal&lt;Article[]&gt;(...)</code>.</li>
                <li><strong>2. Vue readonly :</strong> <code>readonly commande = this._commande.asReadonly()</code>.</li>
                <li><strong>3. Deux <code>computed</code> :</strong> <code>total</code> et <code>nbArticles</code> recalculés sans aucun code de synchronisation.</li>
                <li><strong>4. Un <code>effect</code> :</strong> Sauvegarde automatique du panier dans <code>localStorage</code>.</li>
                <li><strong>5. Mutation immuable :</strong> <code>_commande.update(l =&gt; l.filter(...))</code> fournit une nouvelle référence à <code>Object.is</code>.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .fritkot-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pos-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 20px;

      @media (max-width: 1100px) {
        grid-template-columns: 1fr;
      }
    }

    .pos-ticket-panel, .pos-menu-panel {
      padding: 20px;
    }

    .ticket-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 14px;
      gap: 12px;

      .brand-row {
        display: flex;
        align-items: center;
        gap: 10px;

        .brand-icon { font-size: 2rem; }
        .brand-name {
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--text-main);
        }
        .brand-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
      }

      .ticket-total-box {
        text-align: right;

        .total-amount {
          font-size: 1.5rem;
          font-weight: 900;
          color: #f59e0b;
        }

        .total-lbl {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-dim);
        }
      }
    }

    .delivery-status-box {
      margin-top: 12px;
      padding: 8px 12px;
      border-radius: 6px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.78rem;
      color: #93c5fd;

      &.free {
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.3);
        color: #86efac;
      }

      .del-icon { font-size: 1.2rem; }
    }

    .ticket-lines-container {
      min-height: 250px;
    }

    .lines-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .empty-ticket-alert {
      padding: 30px 20px;
      text-align: center;
      background: var(--bg-subtle);
      border: 2px dashed var(--border-color);
      border-radius: 8px;
      color: var(--text-muted);

      .empty-icon { font-size: 2.2rem; display: block; margin-bottom: 8px; }
      strong { color: var(--text-main); font-size: 0.95rem; }
      p { font-size: 0.78rem; margin-top: 4px; }
    }

    .ticket-footer {
      border-top: 1px solid var(--border-color);
      padding-top: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.78rem;

      .footer-stats {
        display: flex;
        flex-direction: column;
        gap: 2px;
        color: var(--text-main);

        .dim {
          font-size: 0.68rem;
          color: var(--text-dim);
        }
      }

      .ticket-actions {
        display: flex;
        gap: 8px;
      }
    }

    /* Menu Panier */
    .menu-head h4 {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .sub-text {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .menu-items-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .menu-item-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 10px 12px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 4px;

      &:hover {
        background: var(--bg-card-hover);
        border-color: var(--bs-purple-light);
        transform: translateY(-1px);
      }

      .item-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item-icon { font-size: 1.4rem; }
        .item-price {
          font-size: 0.88rem;
          font-weight: 800;
          color: #34d399;
        }
      }

      .item-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .item-badge-taille {
        font-size: 0.65rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }
    }

    .pillars-mini-card {
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 14px;

      h5 {
        font-size: 0.85rem;
        font-weight: 800;
        color: var(--bs-purple-light);
        margin-bottom: 8px;
      }

      .pillars-list {
        margin-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 0.76rem;
        color: var(--text-muted);
        line-height: 1.4;

        strong { color: var(--text-main); }
        code { color: #38bdf8; font-size: 0.72rem; }
      }
    }
  `]
})
export class FritkotDemoComponent {
  // 1. Source de vérité privée (S05)
  private readonly _commande = signal<Article[]>([
    { id: 1, nom: 'Cornet de frites', taille: 'LARGE', prixUnitaire: 3.5, quantite: 2 },
    { id: 2, nom: 'Burger maison', taille: 'MOYENNE', prixUnitaire: 5.0, quantite: 1 },
    { id: 3, nom: 'Frikandel XXL', taille: 'XXL', prixUnitaire: 2.5, quantite: 3 }
  ]);

  // 2. Vue publique en lecture seule
  readonly commande = this._commande.asReadonly();

  // 3. Projections dérivées (computed)
  readonly total = computed(() =>
    this._commande().reduce((somme, a) => somme + prixLigne(a), 0)
  );

  readonly nbArticles = computed(() =>
    this._commande().reduce((somme, a) => somme + a.quantite, 0)
  );

  readonly livraisonOfferte = computed(() => this.total() >= 20);

  readonly resteAvantLivraison = computed(() =>
    Math.max(0, 20 - this.total())
  );

  // 4. Effet de bord contrôlé : persistance locale
  constructor() {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('fritkot');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this._commande.set(parsed);
          }
        }
      } catch (e) {}
    }

    effect(() => {
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('fritkot', JSON.stringify(this._commande()));
        } catch (e) {}
      }
    });
  }

  // 5. Mutations immuables (Séance 12)
  supprimer(id: number): void {
    this._commande.update(liste => liste.filter(a => a.id !== id));
  }

  modifierQuantite(id: number, quantite: number): void {
    this._commande.update(liste =>
      liste.map(a => (a.id === id ? { ...a, quantite } : a))
    );
  }

  ajouterAuPanier(item: { nom: string; taille: Taille; prixUnitaire: number }): void {
    const existant = this._commande().find(a => a.nom === item.nom && a.taille === item.taille);
    if (existant) {
      this.modifierQuantite(existant.id, existant.quantite + 1);
    } else {
      const nextId = this._commande().reduce((max, a) => Math.max(max, a.id), 0) + 1;
      this._commande.update(liste => [
        ...liste,
        { id: nextId, nom: item.nom, taille: item.taille, prixUnitaire: item.prixUnitaire, quantite: 1 }
      ]);
    }
  }

  viderCommande(): void {
    this._commande.set([]);
  }

  reinitialiserCommandeDefaut(): void {
    this._commande.set([
      { id: 1, nom: 'Cornet de frites', taille: 'LARGE', prixUnitaire: 3.5, quantite: 2 },
      { id: 2, nom: 'Burger maison', taille: 'MOYENNE', prixUnitaire: 5.0, quantite: 1 },
      { id: 3, nom: 'Frikandel XXL', taille: 'XXL', prixUnitaire: 2.5, quantite: 3 }
    ]);
  }

  readonly catalogueMets: { icon: string; nom: string; taille: Taille; prixUnitaire: number }[] = [
    { icon: '🍟', nom: 'Cornet de frites', taille: 'MOYENNE', prixUnitaire: 3.0 },
    { icon: '🍟', nom: 'Cornet de frites', taille: 'LARGE', prixUnitaire: 3.5 },
    { icon: '🍔', nom: 'Burger maison', taille: 'MOYENNE', prixUnitaire: 5.0 },
    { icon: '🌭', nom: 'Frikandel XXL', taille: 'XXL', prixUnitaire: 2.5 },
    { icon: '🥫', nom: 'Sauce Mayonnaise', taille: 'MOYENNE', prixUnitaire: 0.8 },
    { icon: '🥫', nom: 'Sauce Samouraï', taille: 'MOYENNE', prixUnitaire: 0.8 },
    { icon: '🥤', nom: 'Soda Artisanal', taille: 'MOYENNE', prixUnitaire: 2.2 }
  ];
}
