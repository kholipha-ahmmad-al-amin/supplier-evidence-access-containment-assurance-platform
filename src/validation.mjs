import { inputError } from './errors.mjs';
export const text = (value, name) => { if (typeof value !== 'string' || !value.trim()) throw inputError(`${name} is required`); return value.trim(); };
export const containmentType = (value) => { value = text(value, 'containment type'); if (!['access_suspension', 'data_isolation', 'control_lockdown'].includes(value)) throw inputError('containment type is invalid'); return value; };
export const actor = (headers) => ({ id: headers['x-actor-id'], role: headers['x-actor-role'] });
