/**
 * Mini-runtime réactif utilisé par le bac à sable des exercices.
 *
 * Contrairement aux anciens « mocks » (un signal sans abonnés, un effect exécuté une seule fois),
 * celui-ci reproduit réellement le comportement d'Angular :
 *  - un signal notifie ses consommateurs lorsqu'il change ;
 *  - un computed est mémoïsé et paresseux ;
 *  - un effect se ré-exécute (de façon synchrone dans le bac à sable) quand une dépendance change,
 *    et appelle son callback onCleanup avant chaque ré-exécution.
 */
interface ProducerNode {
  version: number;
  subs: Set<ConsumerNode>;
  refresh?: () => void;
}

interface ConsumerNode {
  deps: Map<ProducerNode, number>;
  notify(): void;
}

interface EffectNode extends ConsumerNode {
  first: boolean;
  destroyed: boolean;
  cleanups: (() => void)[];
  run(): void;
}

export function createReactiveRuntime(onError: (message: string) => void) {
  let active: ConsumerNode | null = null;
  const pending = new Set<EffectNode>();
  let flushing = false;

  const track = (node: ProducerNode) => {
    if (active) {
      active.deps.set(node, node.version);
      node.subs.add(active);
    }
  };

  const unsubscribe = (consumer: ConsumerNode) => {
    consumer.deps.forEach((_v, node) => node.subs.delete(consumer));
    consumer.deps.clear();
  };

  const depsChanged = (consumer: ConsumerNode): boolean => {
    for (const [node, seen] of Array.from(consumer.deps)) {
      node.refresh?.();
      if (node.version !== seen) return true;
    }
    return false;
  };

  const notifySubs = (node: ProducerNode) => {
    Array.from(node.subs).forEach(sub => sub.notify());
  };

  const flush = () => {
    if (flushing) return;
    flushing = true;
    let guard = 0;
    try {
      while (pending.size > 0) {
        if (++guard > 1000) {
          pending.clear();
          onError('Boucle infinie détectée dans un effect()');
          break;
        }
        const eff = pending.values().next().value as EffectNode;
        pending.delete(eff);
        if (!eff.destroyed && (eff.first || depsChanged(eff))) {
          eff.run();
        }
      }
    } finally {
      flushing = false;
    }
  };

  const signal: any = (initial: any, opts?: any) => {
    const node: ProducerNode = { version: 0, subs: new Set() };
    let value = initial;
    const equal = opts?.equal ?? Object.is;
    const s: any = () => {
      track(node);
      return value;
    };
    s.set = (next: any) => {
      if (equal(value, next)) return;
      value = next;
      node.version++;
      notifySubs(node);
    };
    s.update = (fn: (prev: any) => any) => s.set(fn(value));
    s.asReadonly = () => {
      const r: any = () => s();
      return r;
    };
    return s;
  };

  const computed = (fn: () => any, opts?: any) => {
    const node: ProducerNode = { version: 0, subs: new Set() };
    const equal = opts?.equal ?? Object.is;
    let value: any;
    let hasValue = false;
    let dirty = true;
    const consumer: ConsumerNode = {
      deps: new Map(),
      notify() {
        if (!dirty) {
          dirty = true;
          notifySubs(node);
        }
      }
    };
    node.refresh = () => {
      if (!dirty) return;
      if (hasValue && !depsChanged(consumer)) {
        dirty = false;
        return;
      }
      unsubscribe(consumer);
      const prev = active;
      active = consumer;
      try {
        const next = fn();
        if (!hasValue || !equal(value, next)) {
          value = next;
          node.version++;
        }
        hasValue = true;
      } finally {
        active = prev;
        dirty = false;
      }
    };
    const c: any = () => {
      node.refresh!();
      track(node);
      return value;
    };
    return c;
  };

  const effect = (effectFn: (onCleanup: (cleanup: () => void) => void) => void) => {
    const eff: EffectNode = {
      deps: new Map(),
      first: true,
      destroyed: false,
      cleanups: [],
      notify() {
        pending.add(eff);
        flush();
      },
      run() {
        eff.first = false;
        const toRun = eff.cleanups.splice(0);
        toRun.forEach(cleanup => {
          try { cleanup(); } catch (err: any) { onError(`[Cleanup Error] ${err?.message}`); }
        });
        unsubscribe(eff);
        const prev = active;
        active = eff;
        try {
          effectFn((cleanup: () => void) => eff.cleanups.push(cleanup));
        } catch (err: any) {
          onError(`[Effect Error] ${err?.message ?? err}`);
        } finally {
          active = prev;
        }
      }
    };
    pending.add(eff);
    flush();
    return {
      destroy: () => {
        eff.destroyed = true;
        unsubscribe(eff);
        const toRun = eff.cleanups.splice(0);
        toRun.forEach(cleanup => cleanup());
      }
    };
  };

  const untracked = <T>(fn: () => T): T => {
    const prev = active;
    active = null;
    try {
      return fn();
    } finally {
      active = prev;
    }
  };

  return { signal, computed, effect, untracked };
}
