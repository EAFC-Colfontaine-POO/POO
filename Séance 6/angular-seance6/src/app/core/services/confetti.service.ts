import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {
  triggerSuccess(): void {
    this.celebrate();
  }

  celebrate(): void {
    if (typeof window === 'undefined') return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#7952b3', '#dd0031', '#10b981', '#3b82f6', '#f59e0b']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#7952b3', '#06b6d4', '#10b981']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#dd0031', '#f59e0b', '#7952b3']
        });
      }, 200);
    } catch (e) {
      console.warn('[ConfettiService] Erreur animation confetti', e);
    }
  }
}
