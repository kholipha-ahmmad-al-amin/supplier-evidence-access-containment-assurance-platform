import { conflict, forbidden, missing } from './errors.mjs';
import { containmentType, text } from './validation.mjs';

const transitions = {
  plan: { from: 'submitted', to: 'planned', role: 'containment_planner', event: 'containment_planned' },
  verifyExecution: { from: 'planned', to: 'execution_verified', role: 'execution_verifier', event: 'containment_execution_verified' },
  validateEffectiveness: { from: 'execution_verified', to: 'effectiveness_validated', role: 'effectiveness_validator', event: 'containment_effectiveness_validated' },
  authorize: { from: 'effectiveness_validated', to: 'authorized', role: 'containment_authority', event: 'containment_authorized' },
  close: { from: 'authorized', to: 'closed', role: 'containment_registrar', event: 'containment_closed' }
};

const timestamp = () => new Date().toISOString();
const requireRole = (actor, role) => { if (!actor?.id || actor.role !== role) throw forbidden(`role ${role} is required`); };
export class ContainmentService {
  constructor(store) { this.store = store; }
  submit(input, actor, requestId) {
    requireRole(actor, 'evidence_owner');
    const database = this.store.read(); const now = timestamp();
    const containment = { id: crypto.randomUUID(), supplierId: text(input.supplierId, 'supplier id'), evidenceReference: text(input.evidenceReference, 'evidence reference'), scope: text(input.scope, 'scope'), containmentType: containmentType(input.containmentType), status: 'submitted', createdAt: now, updatedAt: now, events: [{ type: 'containment_submitted', actorId: actor.id, requestId, at: now }] };
    database.containments.push(containment); this.store.write(database); return containment;
  }
  transition(id, action, input, actor, requestId) {
    const policy = transitions[action]; if (!policy) throw missing('action was not found'); requireRole(actor, policy.role);
    const database = this.store.read(); const containment = database.containments.find((entry) => entry.id === id); if (!containment) throw missing('containment was not found');
    if (containment.status !== policy.from) throw conflict(`containment must be ${policy.from}`);
    const note = text(input.note, 'note'); const now = timestamp(); containment.status = policy.to; containment.updatedAt = now; containment.events.push({ type: policy.event, actorId: actor.id, requestId, note, at: now }); database.containments = database.containments.map((entry) => entry.id === id ? containment : entry); this.store.write(database); return containment;
  }
  get(id) { const containment = this.store.read().containments.find((entry) => entry.id === id); if (!containment) throw missing('containment was not found'); return containment; }
}
