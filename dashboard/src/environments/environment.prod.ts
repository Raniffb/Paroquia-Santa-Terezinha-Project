// ─────────────────────────────────────────────────────────────────────────────
//  PRODUÇÃO — substitua apiUrl pelo domínio real antes do deploy.
//
//  Exemplos:
//    apiUrl: 'https://api.paroquia.com'        (subdomínio dedicado)
//    apiUrl: 'https://paroquia.com/api'        (mesmo domínio, path /api)
//
//  NUNCA aponte para localhost em produção: o browser do visitante não tem
//  acesso ao servidor local da máquina de hospedagem.
// ─────────────────────────────────────────────────────────────────────────────
export const environment = {
  production: true,
  apiUrl: 'https://api.paroquia.com'  // ← substitua pelo domínio real
};
