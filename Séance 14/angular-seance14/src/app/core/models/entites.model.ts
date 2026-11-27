/**
 * Modèles Métier fondamentaux pour la Séance 14
 */

export interface Identifiable {
  readonly id: number | string;
}

export class Produit implements Identifiable {
  constructor(
    public readonly id: number,
    public readonly nom: string,
    public readonly prix: number,
    public stock: number
  ) {
    if (prix < 0) {
      throw new Error('Le prix ne peut pas être négatif.');
    }
    if (stock < 0) {
      throw new Error('Le stock ne peut pas être négatif.');
    }
  }
}

export class Client implements Identifiable {
  constructor(
    public readonly id: string,
    public readonly nom: string,
    public readonly email?: string
  ) {}
}

export class Film implements Identifiable {
  constructor(
    public readonly id: number,
    public readonly titre: string,
    public readonly dureeMinutes: number
  ) {
    if (dureeMinutes <= 0) {
      throw new Error('La durée du film doit être supérieure à 0 minute.');
    }
    if (dureeMinutes > 240) {
      throw new Error('La durée du film ne peut pas excéder 240 minutes (4h).');
    }
  }
}

export interface PanierItem {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
}
