import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {
  triggerSuccess(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
      const testCanvas = document.createElement('canvas');
      if (!testCanvas.getContext || !testCanvas.getContext('2d')) {
        return;
      }

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#7952b3', '#10b981', '#3b82f6', '#f59e0b', '#dd0031']
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#7952b3', '#10b981', '#f59e0b']
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#7952b3', '#3b82f6', '#dd0031']
        });
      }, 200);
    } catch (e) {
      console.warn('[ConfettiService] Échec affichage confettis', e);
    }
  }
}
