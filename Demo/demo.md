
### 0 : Préambule

```
ng new products-app

npm install bootstrap
```

### 1 : Configuration

angular.json : 

```
"styles": [
  "node_modules/bootstrap/scss/bootstrap.scss",
  "src/styles.css"
]
```

app.config.ts : Ajout de ceci dans providers.  Permet d'injecter le service pour faire appel http.

```
provideHttpClient()
```

tsconfig.app.json : 

```
"compilerOptions": {
    "target": "ES2022",      
    "downlevelIteration": true, // autorise l'itération propre sur Set/Map,
    "ignoreDeprecations": "6.0"
  },
```


### 2 : Start

créer les deux composants :

```
ng g c /components/api-page

ng g c /components/crud-page
```

création des routes : 

```ts
export const routes: Routes = [
	{
		path: 'api',
		loadComponent: () => import('./components/api-page/api-page')
			.then(m => m.ApiPage)
	},
	{
		path: 'crud',
		loadComponent: () => import('./components/crud-page/crud-page')
			.then(m => m.CrudPage)
	},
	{ 
		path: '', 
		redirectTo: 'api', 
		pathMatch: 'full' 
	}
];
```

modifications app.html :

```html
<nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
  <div class="container">
    <span class="navbar-brand">DummyJSON : démo POO</span>
    <div class="navbar-nav">
      <a class="nav-link" routerLink="/api" routerLinkActive="active">1. Données de l'API</a>
      <a class="nav-link" routerLink="/crud" routerLinkActive="active">2. CRUD</a>
    </div>
  </div>
</nav>

<div class="container">
  <router-outlet />
</div>

```


models : 

```ts
// src/app/models/catalog.models.ts

// 1. La classe Category (id généré par un compteur static, nom non modifiable)
export class Category {
  private static counter = 0;

  // STATIC : appartient à la classe, pas aux objets
  static nextId(): number {
    return ++Category.counter;
  }

  constructor(
    public readonly id: number,
    public readonly name: string
  ) {
    if (name.trim().length < 2) {
      throw new Error("Invariant Category : Le nom doit contenir au moins 2 caractères.");
    }
  }
}

// 2. La Classe Abstraite (avec invariant sur le titre)
export abstract class CatalogItem {
  private static counter = 1000;

  static generateId(): number {
    return ++CatalogItem.counter;
  }

  constructor(
    public readonly id: number, // READONLY : l'id ne change jamais après la création
    public title: string
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error("Invariant CatalogItem : Le titre est obligatoire.");
    }
  }

  abstract getDetails(): string;

  getDisplayInfo(): string {
    return `#${this.id} - ${this.title}`;
  }
}

// 3. INTERFACE : une capacité (un "contrat") que Product s'engage à respecter
export interface IPerishable {
  daysBeforeExpiry?: number;
  isExpired(): boolean;
}

// 4. La Classe Product (Héritage + Interface + Composition + Redéfinition + Encapsulation)
export class Product extends CatalogItem implements IPerishable {
  private _price = 0; // ENCAPSULATION : impossible de modifier le prix sans passer par le setter

  constructor(
    id: number,
    title: string,
    price: number,
    public category: Category, // <-- COMPOSITION
    public daysBeforeExpiry?: number // optionnel : seulement pour les produits périssables
  ) {
    super(id, title);
    this.price = price; // passe par le setter : l'invariant est vérifié au même endroit

    // INVARIANT : La composition est obligatoire
    if (!category) {
      throw new Error("Invariant Product : Un produit doit appartenir à une catégorie.");
    }
  }

  get price(): number {
    return this._price;
  }

  // INVARIANT : Le prix doit être strictement positif (à la création ET à chaque modification)
  set price(value: number) {
    if (value <= 0) {
      throw new Error("Invariant Product : Le prix doit être supérieur à 0 €.");
    }
    this._price = value;
  }

  // Le produit modifie son propre état de manière contrôlée
  applyDiscount(percent: number): void {
    if (percent <= 0 || percent >= 100) {
      throw new Error("Product : La remise doit être entre 0 et 100 %.");
    }
    this.price = Math.round(this._price * (100 - percent)) / 100;
  }

  isExpired(): boolean {
    return this.daysBeforeExpiry !== undefined && this.daysBeforeExpiry <= 0;
  }

  override getDetails(): string {
    const expiry = this.daysBeforeExpiry === undefined ? '' : ` | Périme dans ${this.daysBeforeExpiry} j`;
    return `Prix: ${this.price} € | Rayon: ${this.category.name}${expiry}`;
  }

  // REDÉFINITION (Polymorphisme)
  override getDisplayInfo(): string {
    return `[${this.category.name.toUpperCase()}] ${super.getDisplayInfo()} (${this.price} €)`;
  }
}


```

interface :

```ts
//src/app/interfaces/repository.interface.ts

export interface IRepository<T> {
  getAll(): T[];
  add(item: T): void;
  delete(id: number): void;
}

```

services : 

```ts
// src/app/services/category.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { IRepository } from '../interfaces/repository.interface';
import { Category } from '../models/catalog.models';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class CategoryService implements IRepository<Category> {
  private productService = inject(ProductService);
  private categories = signal<Category[]>([]);

  getAll(): Category[] {
    return this.categories();
  }

  add(item: Category): void {
    // RÈGLE SERVICE : Pas de doublon de catégorie
    const exists = this.categories().some(
      c => c.name.toLowerCase() === item.name.trim().toLowerCase()
    );
    if (exists) {
      throw new Error(`Service : La catégorie "${item.name}" existe déjà.`);
    }
    this.categories.set([...this.categories(), item]);
  }

  delete(id: number): void {
    // RÈGLE SERVICE : on ne supprime pas une catégorie qui contient des produits
    const used = this.productService.getAll().some(p => p.category.id === id);
    if (used) {
      throw new Error("Service : Impossible de supprimer une catégorie qui contient des produits.");
    }
    this.categories.set(this.categories().filter(c => c.id !== id));
  }

  createByName(name: string): void {
    // Si 'name' fait moins de 2 lettres, new Category() lèvera l'erreur d'invariant !
    this.add(new Category(Category.nextId(), name));
  }
}

```

```ts
// src/app/services/product.service.ts

import { Injectable, signal } from '@angular/core';
import { IRepository } from '../interfaces/repository.interface';
import { Product, Category, CatalogItem } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class ProductService implements IRepository<Product> {
  private products = signal<Product[]>([]);

  getAll(): Product[] {
    return this.products();
  }

  getTotalPrice(): number {
    return this.products().reduce((total, p) => total + p.price, 0);
  }

  add(item: Product): void {
    // RÈGLE SERVICE : Pas deux produits avec le même nom
    const exists = this.products().some(
      p => p.title.toLowerCase() === item.title.trim().toLowerCase()
    );
    if (exists) {
      throw new Error(`Service : Le produit "${item.title}" est déjà au catalogue.`);
    }
    this.products.set([...this.products(), item]);
  }

  delete(id: number): void {
    this.products.set(this.products().filter(p => p.id !== id));
  }

  createProduct(title: string, price: number, category: Category, daysBeforeExpiry?: number): void {
    // Si price <= 0, titre vide ou catégorie absente, le constructeur lèvera l'erreur d'invariant !
    this.add(new Product(CatalogItem.generateId(), title, price, category, daysBeforeExpiry));
  }
}


```

```ts

// src/app/services/product-api.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CatalogItem, Category, Product } from '../models/catalog.models';
import { CategoryService } from './category.service';
import { ProductService } from './product.service';

interface ProductDto {
  id: number;
  title: string;
  price: number;
  category: string; // chez DummyJSON, la catégorie n'est qu'une chaîne
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private http = inject(HttpClient);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  // Les services gardent les données en mémoire : on n'appelle l'API qu'une seule fois
  load(): void {
    if (this.productService.getAll().length > 0) {
      return;
    }
    this.http
      .get<{ products: ProductDto[] }>('https://dummyjson.com/products?limit=10')
      .subscribe(response => {
        // Transforme les données de l'API (DTO) en objets : Category + Product
        for (const dto of response.products) {
          const category = this.getOrCreateCategory(dto.category);
          this.productService.add(new Product(dto.id, dto.title, dto.price, category));
        }

        // Ajout manuel : DummyJSON ne fournit aucun produit périssable
        this.productService.add(
          new Product(CatalogItem.generateId(), 'Lait frais', 1.5, this.getOrCreateCategory('groceries'), 3)
        );
      });
  }

  private getOrCreateCategory(name: string): Category {
    let category = this.categoryService.getAll().find(c => c.name === name);
    if (!category) {
      category = new Category(Category.nextId(), name);
      this.categoryService.add(category);
    }
    return category;
  }
}

```

components : api-crud

```ts
import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  imports: [],
  selector: 'app-api-page',
  templateUrl: './api-page.html',
})
export class ApiPage {
  protected productService = inject(ProductService);
  protected apiService = inject(ProductApiService);
}

```

```html
<h3>Produits reçus de DummyJSON (convertis en objets)</h3>
<button class="btn btn-primary mb-3" (click)="apiService.load()">Lancer l'appel API</button>

<ul class="list-group">
  @for (prod of productService.getAll(); track prod.id) {
    <li class="list-group-item">
      <strong>{{ prod.getDisplayInfo() }}</strong><br />
      <small class="text-muted">{{ prod.getDetails() }}</small>
    </li>
  } @empty {
    <li class="list-group-item text-muted">Aucune donnée : lance l'appel API.</li>
  }
</ul>

<p class="mt-3">Valeur totale du catalogue : <strong>{{ productService.getTotalPrice().toFixed(2) }} €</strong></p>

```


```ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Category, Product } from '../../models/catalog.models';

@Component({
  imports: [FormsModule],
  selector: 'app-crud-page',
  templateUrl: './crud-page.html',
})
export class CrudPage {
  protected categoryService = inject(CategoryService);
  protected productService = inject(ProductService);

  // État de la mini-snackbar
  protected toastMessage = signal<string | null>(null);

  protected newCatName = '';
  protected prodTitle = '';
  protected prodPrice = 15;
  protected selectedCategory?: Category;
  protected isPerishable = false;
  protected daysBeforeExpiry = 5;

  protected addCategory(): void {
    this.attempt(() => {
      this.categoryService.createByName(this.newCatName);
      this.newCatName = '';
    });
  }

  protected removeCategory(id: number): void {
    this.attempt(() => this.categoryService.delete(id));
  }

  protected discount(product: Product): void {
    this.attempt(() => product.applyDiscount(10));
  }

  protected addProduct(): void {
    this.attempt(() => {
      // Si aucune catégorie n'est choisie, c'est l'invariant de Product qui refusera
      this.productService.createProduct(
        this.prodTitle,
        this.prodPrice,
        this.selectedCategory!,
        this.isPerishable ? this.daysBeforeExpiry : undefined
      );
      this.prodTitle = '';
    });
  }

  // try/catch unique : le composant ne valide rien, il affiche les erreurs du modèle/service
  // pour éviter de mettre un try-catch partout
  private attempt(action: () => void): void {
    try {
      action();
    } catch (err: any) {
      this.toastMessage.set(err.message);
      setTimeout(() => this.toastMessage.set(null), 3500);
    }
  }
}

```

```html
@if (toastMessage()) {
  <div class="alert alert-danger position-fixed bottom-0 end-0 m-3 shadow" style="z-index: 2000;">
    ⚠️ {{ toastMessage() }}
  </div>
}

<div class="card mb-4">
  <div class="card-header">Catégories</div>
  <div class="card-body">
    <div class="input-group mb-3">
      <input class="form-control" [(ngModel)]="newCatName" placeholder="Nom (min 2 lettres)..." />
      <button class="btn btn-primary" (click)="addCategory()">Ajouter</button>
    </div>
    <ul class="list-group">
      @for (cat of categoryService.getAll(); track cat.id) {
        <li class="list-group-item d-flex justify-content-between align-items-center">
          {{ cat.name }}
          <button class="btn btn-sm btn-outline-danger" (click)="removeCategory(cat.id)">X</button>
        </li>
      }
    </ul>
  </div>
</div>

<div class="card">
  <div class="card-header">Produits</div>
  <div class="card-body">
    <div class="input-group mb-3">
      <input class="form-control" [(ngModel)]="prodTitle" placeholder="Titre du produit" />
      <input class="form-control" type="number" [(ngModel)]="prodPrice" placeholder="Prix (> 0)" />
      <select class="form-select" [(ngModel)]="selectedCategory">
        <option [ngValue]="undefined">-- catégorie --</option>
        @for (cat of categoryService.getAll(); track cat.id) {
          <option [ngValue]="cat">{{ cat.name }}</option>
        }
      </select>
      <button class="btn btn-primary" (click)="addProduct()">Ajouter</button>
    </div>
    <div class="form-check form-check-inline mb-3">
      <input class="form-check-input" type="checkbox" id="perishable" [(ngModel)]="isPerishable" />
      <label class="form-check-label" for="perishable">Périssable</label>
    </div>
    @if (isPerishable) {
      <input class="form-control d-inline-block w-auto mb-3" type="number" [(ngModel)]="daysBeforeExpiry" /> jours
    }
    <ul class="list-group">
      @for (prod of productService.getAll(); track prod.id) {
        <li class="list-group-item d-flex justify-content-between align-items-center">
          {{ prod.getDisplayInfo() }}
          <span>
            <button class="btn btn-sm btn-outline-secondary me-1" (click)="discount(prod)">-10%</button>
            <button class="btn btn-sm btn-outline-danger" (click)="productService.delete(prod.id)">Supprimer</button>
          </span>
        </li>
      }
    </ul>
  </div>
</div>

```
