import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Aviso,
  CategoriaAviso,
  Confissao,
  ContatoInfo,
  Evento,
  CategoriaEvento,
  Missa,
  Noticia,
  CategoriaNoticia,
  ObservacaoMissa
} from '../models/parish.models';

// ────────────────────────────────────────────────────────────────────────────
// Dados mockados — substitua os métodos por chamadas HttpClient ao integrar API
// ────────────────────────────────────────────────────────────────────────────

const AVISOS: Aviso[] = [
  {
    id: 1,
    titulo: 'Festa de Santa Teresinha – 1º de outubro',
    resumo: 'Programação especial com missa solene, procissão e apresentações culturais. Venha celebrar conosco a padroeira da nossa comunidade!',
    data: '2026-10-01',
    destaque: true,
    categoria: 'liturgia'
  },
  {
    id: 2,
    titulo: 'Campanha do Agasalho 2026',
    resumo: 'Arrecadação de roupas e cobertores para famílias carentes da zona norte de Manaus. Entregue até 30 de junho na secretaria da paróquia, de segunda a sexta, das 8h às 17h.',
    data: '2026-06-01',
    urgente: true,
    categoria: 'social'
  },
  {
    id: 3,
    titulo: 'Primeira Comunhão – Inscrições Abertas',
    resumo: 'Crianças a partir de 9 anos. Curso preparatório às quartas-feiras, das 18h às 19h30, no salão paroquial. Documentos: certidão de batismo e foto 3x4.',
    data: '2026-05-20',
    categoria: 'formacao'
  },
  {
    id: 4,
    titulo: 'Retiro Espiritual para Adultos',
    resumo: 'Dias 12 e 13 de julho no Sítio Esperança. Inscrições na secretaria. Vagas limitadas a 40 participantes. Valor simbólico de R$ 30 para alimentação.',
    data: '2026-05-15',
    categoria: 'formacao'
  },
  {
    id: 5,
    titulo: 'Reunião do Conselho Paroquial',
    resumo: 'Reunião ordinária do Conselho Paroquial Financeiro e Pastoral. Pauta: prestação de contas do 1º semestre e planejamento da Festa da Padroeira.',
    data: '2026-06-05',
    categoria: 'administrativo'
  },
  {
    id: 6,
    titulo: 'Missa de Sétimo Dia – Família Souza',
    resumo: 'Celebração em sufrágio de Maria das Graças Souza no domingo, dia 15 de junho, às 09h00, na Igreja Principal.',
    data: '2026-06-08',
    categoria: 'liturgia'
  },
  {
    id: 7,
    titulo: 'Grupo Jovem – Novos Integrantes',
    resumo: 'O Grupo Jovem Paroquial está com inscrições abertas para jovens de 15 a 30 anos. Encontros todas as sextas-feiras às 19h30 no salão paroquial.',
    data: '2026-06-03',
    categoria: 'comunidade'
  },
  {
    id: 8,
    titulo: 'Secretaria Paroquial – Novo Horário',
    resumo: 'A partir de julho, a secretaria funcionará de segunda a sexta, das 7h30 às 12h e das 14h às 17h. Atendimento para sacramentos, declarações e outras demandas.',
    data: '2026-06-01',
    categoria: 'administrativo'
  }
];

const NOTICIAS: Noticia[] = [
  {
    id: 1,
    titulo: 'Paróquia recebe título de Patrimônio Cultural Imaterial de Manaus',
    subtitulo: 'Reconhecimento pela trajetória de 60 anos de serviço à comunidade',
    resumo: 'A Câmara Municipal de Manaus aprovou, em sessão solene, o título de Patrimônio Cultural Imaterial para a Paróquia Santa Teresinha, em reconhecimento à sua trajetória de seis décadas de serviço à comunidade do bairro Aleixo.',
    corpo: 'A Câmara Municipal de Manaus aprovou por unanimidade, em sessão solene realizada na última terça-feira, o título de Patrimônio Cultural Imaterial de Manaus para a Paróquia Santa Teresinha. O reconhecimento celebra os 60 anos de história da paróquia, que desde 1966 serve à comunidade do bairro Aleixo e adjacências.\n\nO pároco, Padre João Batista, expressou gratidão em nome de toda a comunidade: "Este título é da comunidade, de cada família que ao longo dessas seis décadas fez desta paróquia um espaço de fé, acolhimento e caridade." A cerimônia contou com a presença do Bispo Diocesano e representantes de diversas pastorais.',
    data: '2026-06-01',
    categoria: 'paroquia',
    autor: 'Secretaria Paroquial'
  },
  {
    id: 2,
    titulo: 'Diocese lança campanha de solidariedade às vítimas das chuvas no Amazonas',
    subtitulo: 'Paróquias de Manaus acolhem doações de alimentos e roupas',
    resumo: 'Em resposta às enchentes que afetaram comunidades ribeirinhas do interior do Amazonas, a Diocese de Manaus lançou uma campanha emergencial de solidariedade. A Paróquia Santa Teresinha é um dos pontos de coleta.',
    corpo: 'A Diocese de Manaus, em parceria com a Cáritas Diocesana, lança a Campanha Solidária pelas Famílias do Amazonas. Chuvas intensas nas últimas semanas causaram enchentes que afetaram mais de 15 municípios do interior do estado, desalojando milhares de famílias.\n\nA Paróquia Santa Teresinha é um dos pontos de coleta em Manaus. Podem ser doados: alimentos não perecíveis, água mineral, roupas em bom estado, produtos de higiene e medicamentos básicos. A coleta funciona durante os horários da secretaria paroquial.',
    data: '2026-05-28',
    categoria: 'diocese',
    autor: 'Comunicação Diocesana'
  },
  {
    id: 3,
    titulo: 'Projeto "Sopa Quente" completa dois anos de atividade ininterrupta',
    subtitulo: 'Voluntários da paróquia servem mais de 200 refeições por semana',
    resumo: 'O projeto social "Sopa Quente", iniciado há dois anos por um grupo de voluntários da Paróquia Santa Teresinha, completa mais um ano de atividade contínua, tendo servido até hoje mais de 20 mil refeições a pessoas em situação de vulnerabilidade.',
    corpo: 'Toda segunda-feira, às 18h, um grupo de 15 voluntários da Paróquia Santa Teresinha se reúne no refeitório paroquial para preparar e servir sopa, pão e suco a pessoas em situação de rua e vulnerabilidade social do entorno da igreja. O projeto "Sopa Quente" completou dois anos de funcionamento ininterrupto neste mês de maio.\n\nCoordinado pela Pastoral da Caridade, o projeto já atendeu mais de 20 mil pessoas e conta com a doação mensal de insumos por parte de famílias da comunidade. "A sopa é o menos. O mais importante é a conversa, o acolhimento, o olhar nos olhos", conta a coordenadora voluntária Dona Maria da Conceição.',
    data: '2026-05-20',
    categoria: 'social',
    autor: 'Pastoral da Caridade'
  },
  {
    id: 4,
    titulo: 'Semana Litúrgica: triduo em honra a Santa Teresinha',
    resumo: 'Nos dias 29 de setembro a 1º de outubro, a paróquia celebra o Triduo em honra à padroeira com missas especiais, rosário meditado e adoração eucarística.',
    corpo: 'A Semana Litúrgica em honra a Santa Teresinha do Menino Jesus acontece entre os dias 29 de setembro e 1º de outubro. A programação inclui missas solenes às 19h nos três dias, rosário meditado às 18h, adoração eucarística e confissões disponíveis das 16h às 18h. No dia 1º de outubro, solenidade da santa padroeira, a missa pontifical será presidida pelo Bispo Diocesano às 10h, seguida de procissão pelo bairro.',
    data: '2026-05-10',
    categoria: 'liturgia',
    autor: 'Secretaria Paroquial'
  },
  {
    id: 5,
    titulo: 'Encontro Diocesano de Catequistas reúne 300 participantes em Manaus',
    resumo: 'A Paróquia Santa Teresinha sediou o Encontro Diocesano de Catequistas, com participantes de mais de 40 paróquias. O tema central foi a catequese como processo de iniciação à vida cristã.',
    corpo: 'O Encontro Diocesano de Catequistas 2026 foi realizado nas dependências da Paróquia Santa Teresinha no último sábado. Cerca de 300 catequistas de mais de 40 paróquias da Diocese de Manaus participaram de palestras, grupos de partilha e celebração eucarística.\n\nO evento foi coordenado pela Equipe Diocesana de Catequese e contou com a palestra de abertura do Padre Marcos Aurélio, especialista em Catequética pela PUC-Rio. "A catequese não é aula de religião. É o processo pelo qual a comunidade acompanha alguém na descoberta da fé vivida", afirmou o palestrante.',
    data: '2026-04-22',
    categoria: 'formacao',
    autor: 'Equipe de Catequese'
  },
  {
    id: 6,
    titulo: 'Nova horta comunitária é inaugurada no pátio da paróquia',
    resumo: 'Com o apoio de famílias da comunidade e da Pastoral do Meio Ambiente, a paróquia inaugurou uma horta comunitária que produzirá alimentos para o projeto Sopa Quente.',
    corpo: 'Uma horta comunitária foi inaugurada no pátio lateral da Paróquia Santa Teresinha. O projeto, desenvolvido pela Pastoral do Meio Ambiente em parceria com famílias da comunidade, ocupa uma área de 80 m² e produzirá hortaliças, ervas e temperos destinados principalmente ao projeto Sopa Quente.\n\nO espaço conta com 12 canteiros, sistema de irrigação por gotejamento e foi projetado para ser mantido pelos próprios voluntários das pastorais. "Queremos que as pessoas entendam que cuidar da terra é também uma forma de oração e de serviço ao próximo", disse a coordenadora da Pastoral do Meio Ambiente.',
    data: '2026-04-10',
    categoria: 'social',
    autor: 'Pastoral do Meio Ambiente'
  }
];

const MISSAS: Missa[] = [
  { dia: 'Segunda-feira', horarios: ['07h00'] },
  { dia: 'Terça-feira', horarios: ['07h00'] },
  { dia: 'Quarta-feira', horarios: ['07h00', '19h00'] },
  { dia: 'Quinta-feira', horarios: ['07h00'] },
  { dia: 'Sexta-feira', horarios: ['07h00', '19h00'] },
  { dia: 'Sábado', horarios: ['07h00', '19h00'] },
  { dia: 'Domingo', horarios: ['07h00', '09h00', '11h00', '19h00'] },
  { dia: 'Feriados Nacionais', horarios: ['09h00', '19h00'] }
];

const CONFISSOES: Confissao[] = [
  { dia: 'Quarta-feira', horario: '18h00 às 18h45' },
  { dia: 'Sexta-feira', horario: '18h00 às 18h45' },
  { dia: 'Sábado', horario: '08h00 às 09h00 e 18h00 às 18h45' },
  { dia: 'Domingo', horario: '08h00 às 08h45' }
];

const OBSERVACOES: ObservacaoMissa[] = [
  {
    titulo: 'Horários especiais',
    descricao: 'Em dias de festas litúrgicas especiais (Natal, Semana Santa, Corpus Christi, festa da padroeira) os horários podem ser alterados. Acompanhe os avisos.'
  },
  {
    titulo: 'Missa de intenção',
    descricao: 'Para solicitar missa em intenção de alguém (falecidos, enfermos, aniversariantes etc.), procure a secretaria paroquial durante o horário de atendimento.'
  },
  {
    titulo: 'Acessibilidade',
    descricao: 'A Igreja conta com rampa de acesso para cadeirantes, espaço reservado para pessoas com mobilidade reduzida e loop indutivo para deficientes auditivos.'
  }
];

const EVENTOS: Evento[] = [
  {
    id: 1,
    titulo: 'Adoração ao Santíssimo',
    local: 'Igreja Principal',
    data: '2026-06-12',
    diaSemana: 'Sexta-feira',
    dia: '12',
    mes: 'JUN',
    ano: '2026',
    hora: '18h00',
    categoria: 'encontro',
    descricao: 'Hora santa com adoração ao Santíssimo Sacramento, canto, oração e bênção eucarística.'
  },
  {
    id: 2,
    titulo: 'Grupo de Oração da Renovação',
    local: 'Salão Paroquial',
    data: '2026-06-14',
    diaSemana: 'Domingo',
    dia: '14',
    mes: 'JUN',
    ano: '2026',
    hora: '16h00',
    categoria: 'encontro',
    descricao: 'Reunião quinzenal do Grupo de Oração da Renovação Carismática Católica.'
  },
  {
    id: 3,
    titulo: 'Retiro de Casais "Encontro de Casais com Cristo"',
    local: 'Sítio Esperança – Iranduba',
    data: '2026-06-20',
    diaSemana: 'Sábado',
    dia: '20',
    mes: 'JUN',
    ano: '2026',
    hora: '08h00',
    categoria: 'retiro',
    descricao: 'Retiro de um dia para casais, com dinâmicas, testemunhos e celebração eucarística. Inscrições na secretaria paroquial.'
  },
  {
    id: 4,
    titulo: 'Missa de São João',
    local: 'Igreja Principal',
    data: '2026-06-24',
    diaSemana: 'Quarta-feira',
    dia: '24',
    mes: 'JUN',
    ano: '2026',
    hora: '19h00',
    categoria: 'missa',
    descricao: 'Missa em honra a São João Batista, precursor de Cristo. Após a celebração, festa junina no pátio da paróquia.'
  },
  {
    id: 5,
    titulo: 'Festa Junina Paroquial 2026',
    local: 'Pátio da Igreja',
    data: '2026-06-27',
    diaSemana: 'Sábado',
    dia: '27',
    mes: 'JUN',
    ano: '2026',
    hora: '17h00',
    categoria: 'festivo',
    descricao: 'Animação ao vivo, comidas típicas, quadrilha, pescaria e muito mais. Renda revertida para o projeto Sopa Quente.'
  },
  {
    id: 6,
    titulo: 'Catequese de Adultos – Início das Aulas',
    local: 'Salão Paroquial',
    data: '2026-07-05',
    diaSemana: 'Domingo',
    dia: '05',
    mes: 'JUL',
    ano: '2026',
    hora: '09h00',
    categoria: 'formacao',
    descricao: 'Início da catequese de adultos para quem deseja receber a Crisma ou aprofundar a fé. Inscrições abertas.'
  },
  {
    id: 7,
    titulo: 'Retiro Espiritual para Adultos',
    local: 'Sítio Esperança – Iranduba',
    data: '2026-07-12',
    diaSemana: 'Domingo',
    dia: '12',
    mes: 'JUL',
    ano: '2026',
    hora: '08h00',
    categoria: 'retiro',
    descricao: 'Retiro de dois dias com tema "Silêncio e Oração". Vagas limitadas a 40 participantes. Valor: R$30 (alimentação).'
  },
  {
    id: 8,
    titulo: 'Missa em Sufrágio – Aniversário de Falecimento',
    local: 'Igreja Principal',
    data: '2026-07-20',
    diaSemana: 'Segunda-feira',
    dia: '20',
    mes: 'JUL',
    ano: '2026',
    hora: '07h00',
    categoria: 'missa',
    descricao: 'Missa de aniversário de falecimento em memória dos fiéis da paróquia.'
  },
  {
    id: 9,
    titulo: 'Triduo em honra a Santa Teresinha',
    local: 'Igreja Principal',
    data: '2026-09-29',
    diaSemana: 'Terça-feira',
    dia: '29',
    mes: 'SET',
    ano: '2026',
    hora: '19h00',
    categoria: 'festivo',
    descricao: 'Início do Triduo com missas solenes, rosário meditado e adoração. Encerra no dia 1º de outubro, solenidade da padroeira.'
  },
  {
    id: 10,
    titulo: 'Festa de Santa Teresinha – Missa Solene',
    local: 'Igreja Principal',
    data: '2026-10-01',
    diaSemana: 'Quinta-feira',
    dia: '01',
    mes: 'OUT',
    ano: '2026',
    hora: '10h00',
    categoria: 'festivo',
    descricao: 'Missa pontifical presidida pelo Bispo Diocesano, seguida de procissão pelo bairro Aleixo. Venha com sua família!'
  }
];

const CONTATO_INFO: ContatoInfo = {
  endereco: 'Rua das Flores, 123',
  bairro: 'Aleixo',
  cidade: 'Manaus',
  estado: 'AM',
  cep: '69060-000',
  telefone: '(92) 1234-5678',
  email: 'contato@paroquiasantateresinha.com.br',
  horariosSecretaria: [
    { dias: 'Segunda a Sexta', horas: '08h00 às 12h00 e 14h00 às 17h00' },
    { dias: 'Sábado', horas: '08h00 às 12h00' },
    { dias: 'Domingo', horas: 'Após as missas das 9h e 11h' }
  ]
};

// ────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ParishService {

  // ── Avisos ────────────────────────────────────────────────────────────────

  getAvisoDestaque(): Observable<Aviso> {
    return of(AVISOS.find(a => a.destaque)!);
  }

  getAvisos(categoria?: CategoriaAviso): Observable<Aviso[]> {
    const lista = categoria
      ? AVISOS.filter(a => a.categoria === categoria)
      : AVISOS;
    return of([...lista].sort((a, b) => b.data.localeCompare(a.data)));
  }

  // ── Notícias ──────────────────────────────────────────────────────────────

  getNoticias(categoria?: CategoriaNoticia): Observable<Noticia[]> {
    const lista = categoria
      ? NOTICIAS.filter(n => n.categoria === categoria)
      : NOTICIAS;
    return of([...lista].sort((a, b) => b.data.localeCompare(a.data)));
  }

  getNoticia(id: number): Observable<Noticia | undefined> {
    return of(NOTICIAS.find(n => n.id === id));
  }

  // ── Horários ──────────────────────────────────────────────────────────────

  getMissas(): Observable<Missa[]> {
    return of(MISSAS);
  }

  getConfissoes(): Observable<Confissao[]> {
    return of(CONFISSOES);
  }

  getObservacoesMissa(): Observable<ObservacaoMissa[]> {
    return of(OBSERVACOES);
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  getEventos(categoria?: CategoriaEvento): Observable<Evento[]> {
    const lista = categoria
      ? EVENTOS.filter(e => e.categoria === categoria)
      : EVENTOS;
    return of([...lista].sort((a, b) => a.data.localeCompare(b.data)));
  }

  getMeses(): Observable<string[]> {
    const meses = [...new Set(EVENTOS.map(e => `${e.mes}/${e.ano}`))];
    return of(meses);
  }

  // ── Contato ───────────────────────────────────────────────────────────────

  getContatoInfo(): Observable<ContatoInfo> {
    return of(CONTATO_INFO);
  }

  enviarMensagem(dados: {
    nome: string;
    email: string;
    telefone?: string;
    assunto: string;
    mensagem: string;
  }): Observable<{ sucesso: boolean; mensagem: string }> {
    console.log('[mock] Mensagem recebida:', dados);
    return of({ sucesso: true, mensagem: 'Mensagem enviada com sucesso! Retornaremos em breve.' });
  }
}
