import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyFields, isConfirmedSubmission, payloadFor, validate } from '../src/features/requests/model.ts';

test('el contrato de Formspree exige estado exitoso y next, no un ok supuesto', () => {
  assert.equal(isConfirmedSubmission(true, { next: '/thanks' }), true);
  assert.equal(isConfirmedSubmission(true, { ok: true }), false);
  assert.equal(isConfirmedSubmission(false, { next: '/thanks' }), false);
  assert.equal(isConfirmedSubmission(true, { next: '/thanks', errors: [{ message: 'Error' }] }), false);
  for (const body of [null, {}, '', { error: 'Error' }]) assert.equal(isConfirmedSubmission(true, body), false);
});

test('un regalo solo usa el contacto del comprador y la localidad de destino', () => {
  const fields = { ...emptyFields(), nombre: ' Ana ', email: ' ana@example.com ', ciudad: 'Rosario', provincia: 'Santa Fe', codigo_postal: '2000', espacio: 'No enviar', direccion_local: 'No enviar', gestion: 'No enviar' };
  assert.deepEqual(validate('regalar', fields), {});
  const body = payloadFor('regalar', fields, 'id-regalo', '2026-09-13T20:00:00Z');
  assert.equal(body.nombre, 'Ana'); assert.equal(body.email, 'ana@example.com');
  for (const field of ['espacio', 'direccion_local', 'gestion', 'destinatario_email', 'consentimiento_fecha']) assert.equal(field in body, false);
  assert.equal(body.avisos_encuentros, false);
});
test('el pedido de avisos requiere una elección expresa y deja evidencia del permiso', () => {
  const fields = { ...emptyFields(), email: 'lector@example.com' };
  assert.ok(validate('encuentros', fields).avisos_encuentros);
  fields.avisos_encuentros = true;
  assert.deepEqual(validate('encuentros', fields), {});
  const body = payloadFor('encuentros', fields, 'avisos', '2026-09-13T20:00:00Z');
  assert.equal(body.consentimiento_fecha, '2026-09-13T20:00:00Z'); assert.ok(body.consentimiento_version); assert.ok(body.consentimiento_texto);
  assert.equal('nombre' in body, false); assert.equal('codigo_postal' in body, false);
});
test('una baja no vuelve a dar permiso aunque existiera un borrador anterior', () => {
  const fields = { ...emptyFields(), email: 'lector@example.com', avisos_encuentros: true };
  assert.deepEqual(validate('preferencias', fields), {});
  const body = payloadFor('preferencias', fields, 'baja', 'hoy');
  assert.equal(body.gestion, 'baja_encuentros'); assert.equal('avisos_encuentros' in body, false); assert.equal('consentimiento_fecha' in body, false);
});
test('se rechazan contactos y destinos incompletos antes de enviar', () => {
  const fields = { ...emptyFields(), nombre: '   ', email: 'no-es-mail', codigo_postal: '12' };
  const errors = validate('recibir', fields);
  for (const field of ['nombre', 'email', 'ciudad', 'provincia', 'codigo_postal']) assert.ok(errors[field]);
  for (const codigo_postal of ['1425', 'C1425ABC', 'c1425abc']) assert.equal(validate('recibir', { ...fields, codigo_postal }).codigo_postal, undefined);
});
test('locales y mensajeros tienen requisitos diferentes', () => {
  const fields = { ...emptyFields(), nombre: 'Lector', email: 'lector@example.com', ciudad: 'Córdoba' };
  assert.deepEqual(validate('mensajero', fields), {});
  const errors = validate('foco', fields);
  for (const field of ['espacio', 'tipo_espacio', 'direccion_local']) assert.ok(errors[field]);
  assert.equal('direccion_local' in payloadFor('mensajero', fields, 'id', 'hoy'), false);
});
