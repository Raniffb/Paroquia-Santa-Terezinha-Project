/**
 * Normaliza uma string de horário para o formato HHhMM.
 * Aceita tanto "18:00" quanto "18h00".
 * Retorna null se o valor não for um horário válido.
 */
export function normalizeTime(raw: string): string | null {
  const m = raw.trim().match(/^(\d{2})[h:](\d{2})$/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h > 23 || min > 59) return null;
  return `${m[1]}h${m[2]}`;
}

/**
 * Normaliza todos os tokens de horário dentro de uma string de escala,
 * por exemplo: "08:00 às 08h45" → "08h00 às 08h45".
 * Retorna null se algum token de horário for inválido.
 */
export function normalizeSchedule(raw: string): string | null {
  let valid = true;
  const result = raw.trim().replace(/\d{2}[h:]\d{2}/g, token => {
    const n = normalizeTime(token);
    if (!n) { valid = false; return token; }
    return n;
  });
  return valid ? result : null;
}

/** Verifica se uma string de escala contém apenas horários bem formados. */
export function isValidSchedule(raw: string): boolean {
  return normalizeSchedule(raw) !== null;
}
