import { List } from '../utils/List'

// Type definitions for grammatical concordancy
interface NounWithGender {
    singular: string
    plural: string
    gender: 'm' | 'f' | 'm/f'
}

interface ObjectWithArticle extends NounWithGender {
    article: string
}

interface EstablishmentWithArticle extends NounWithGender {
    article: string
}

interface Action {
    infinitive: string
    thirdPerson: string
    plural: string
}

// Data structure interfaces for dependency injection
interface LawsData {
    baseText?: string[]
    predicates?: string[]
    subjects?: NounWithGender[]
    objects?: ObjectWithArticle[]
    establishments?: EstablishmentWithArticle[]
    personActions?: Action[]
    establishmentActions?: Action[]
    resources?: string[]
    problems?: string[]
    diseases?: string[]
    drugs?: string[]
}

class Laws {

    // Default data - can be overridden via constructor
    private readonly defaultBaseText = [
        'Projeto de lei {predicate}',
        'Senado vota projeto de lei que {predicate}',
        'AGORA É LEI! Senado aprova PL{number,1000,99999,0}, que {predicate}',
    ]

    private readonly defaultPredicates = [
        'obriga {subject:plural} a {action:infinitive,person}',
        'proibe {subject:plural} de {action:infinitive,person}',
        'obriga {establishment:plural} a {action:infinitive,establishment}',
        'proibe {establishment:plural} de {action:infinitive,establishment}',
        'proíbe venda de {object:plural} em {establishment:plural}',
        'determina que {subject:plural} devem {action:infinitive,person}',
        'determina que {establishment:plural} devem {action:infinitive,establishment}',
        'estabelece multa de R${number,0,1000,2} para {subject:plural} que {action:plural,person}',
        'estabelece multa de R${number,0,1000,2} para {establishment:plural} que {action:plural,establishment}',
        'prevê o pagamento de auxílio de R${number,0,1000,2} mensais a {subject:plural}',
        'destina {number,1,105,0}% do {resource} para o combate a {problem}',
        'garante a {subject:plural} o direito de {action:infinitive,person}',
        'prevê novo imposto sobre {establishment:plural} que será usado no combate a {problem}',
        'estabelece cota mínima de {number,0.5,55}% para {subject:plural} em concursos públicos',
        'isenta {subject:plural} do imposto de renda',
        'declara {object:plural} como patrimônio cultural imaterial do Brasil',
        'torna obrigatório o uso de {object:plural} em {establishment:plural} durante {disease}',
        'cria o Dia Nacional do {subject:singular}',
        'institui a semana de conscientização sobre {problem}',
        'criminaliza a discriminação contra {subject:plural} em {establishment:plural}',
        'autoriza {subject:plural} a portar {object:plural} para autodefesa',
        'regulamenta a profissão de {subject:singular}',
        'estabelece que {establishment:plural} devem ter banheiros especiais para {subject:plural}',
        'cria voucher de R${number,50,500,2} para {subject:plural} comprarem {object:plural}',
        'proíbe {subject:plural} de frequentar {establishment:plural} em horário comercial',
        'prevê a criação do Conselho Nacional de {subject:plural}',
    ]

    private readonly defaultSubjects: NounWithGender[] = [
        { singular: 'pessoa', plural: 'pessoas', gender: 'f' },
        { singular: 'homem', plural: 'homens', gender: 'm' },
        { singular: 'mulher', plural: 'mulheres', gender: 'f' },
        { singular: 'transexual', plural: 'transexuais', gender: 'm/f' },
        { singular: 'idoso', plural: 'idosos', gender: 'm' },
        { singular: 'criança', plural: 'crianças', gender: 'f' },
        { singular: 'adulto', plural: 'adultos', gender: 'm' },
        { singular: 'pessoa com mais de {number,2,100,0} anos', plural: 'pessoas com mais de {number,2,100,0} anos', gender: 'f' },
        { singular: 'pessoa com menos de {number,2,100,0} anos', plural: 'pessoas com menos de {number,2,100,0} anos', gender: 'f' },
        { singular: 'pessoa com renda maior que R${number,1000,50000,2}', plural: 'pessoas com renda maior que R${number,1000,50000,2}', gender: 'f' },
        { singular: 'pessoa com renda menor que R${number,1000,50000,2}', plural: 'pessoas com renda menor que R${number,1000,50000,2}', gender: 'f' },
        { singular: 'portador de deficiência', plural: 'portadores de deficiência', gender: 'm' },
        { singular: 'servidor público', plural: 'servidores públicos', gender: 'm' },
        { singular: 'empregador', plural: 'empregadores', gender: 'm' },
        { singular: 'empresário', plural: 'empresários', gender: 'm' },
        { singular: 'empregado', plural: 'empregados', gender: 'm' },
        { singular: 'motorista de aplicativo', plural: 'motoristas de aplicativo', gender: 'm' },
        { singular: 'entregador de aplicativo', plural: 'entregadores de aplicativo', gender: 'm' },
        { singular: 'dona de casa', plural: 'donas de casa', gender: 'f' },
        { singular: 'prostituta', plural: 'prostitutas', gender: 'f' },
        { singular: 'pessoa que realizou cirurgia de redução bariátrica', plural: 'pessoas que realizaram cirurgia de redução bariátrica', gender: 'f' },
        { singular: 'pessoa que se infectou com {disease}', plural: 'pessoas que se infectaram com {disease}', gender: 'f' },
        { singular: 'milionário', plural: 'milionários', gender: 'm' },
        { singular: 'bilionário', plural: 'bilionários', gender: 'm' },
        { singular: 'traficante', plural: 'traficantes', gender: 'm' },
        { singular: 'minerador de Bitcoin', plural: 'mineradores de Bitcoin', gender: 'm' },
        { singular: 'investidor', plural: 'investidores', gender: 'm' },
        { singular: 'usuário de drogas', plural: 'usuários de drogas', gender: 'm' },
        { singular: 'usuário de {drug}', plural: 'usuários de {drug}', gender: 'm' },
        { singular: 'viciado em {drug}', plural: 'viciados em {drug}', gender: 'm' },
        { singular: 'anarcocapitalista', plural: 'anarcocapitalistas', gender: 'm' },
        { singular: 'nazista', plural: 'nazistas', gender: 'm' },
        { singular: 'senador', plural: 'senadores', gender: 'm' },
        { singular: 'grávida', plural: 'grávidas', gender: 'f' },
        { singular: 'morador de rua', plural: 'moradores de rua', gender: 'm' },
        { singular: 'vítima de {problem}', plural: 'vítimas de {problem}', gender: 'f' },
        { singular: 'estudante', plural: 'estudantes', gender: 'm' },
        { singular: 'funcionário público', plural: 'funcionários públicos', gender: 'm' },
        { singular: 'professor', plural: 'professores', gender: 'm' },
        { singular: 'influencer', plural: 'influencers', gender: 'm' },
        { singular: 'tiktoker', plural: 'tiktokers', gender: 'm' },
        { singular: 'youtuber', plural: 'youtubers', gender: 'm' },
        { singular: 'gamer', plural: 'gamers', gender: 'm' },
        { singular: 'otaku', plural: 'otakus', gender: 'm' },
        { singular: 'cosplayer', plural: 'cosplayers', gender: 'm' },
        { singular: 'streamer', plural: 'streamers', gender: 'm' },
        { singular: 'programador', plural: 'programadores', gender: 'm' },
        { singular: 'hacker ético', plural: 'hackers éticos', gender: 'm' },
        { singular: 'desenvolvedor full-stack', plural: 'desenvolvedores full-stack', gender: 'm' },
        { singular: 'analista de memes', plural: 'analistas de memes', gender: 'm' },
        { singular: 'especialista em NFTs', plural: 'especialistas em NFTs', gender: 'm' },
        { singular: 'trader de criptomoedas', plural: 'traders de criptomoedas', gender: 'm' },
        { singular: 'coach quântico', plural: 'coaches quânticos', gender: 'm' },
        { singular: 'terapeuta holístico', plural: 'terapeutas holísticos', gender: 'm' },
        { singular: 'curador de conteúdo', plural: 'curadores de conteúdo', gender: 'm' },
        { singular: 'pessoa que usa Linux', plural: 'pessoas que usam Linux', gender: 'f' },
        { singular: 'usuário de iPhone', plural: 'usuários de iPhone', gender: 'm' },
        { singular: 'fanático por café', plural: 'fanáticos por café', gender: 'm' },
        { singular: 'vegano', plural: 'veganos', gender: 'm' },
        { singular: 'crossfiteiro', plural: 'crossfiteiros', gender: 'm' },
        { singular: 'praticante de yoga', plural: 'praticantes de yoga', gender: 'm' },
        { singular: 'minimalista digital', plural: 'minimalistas digitais', gender: 'm' },
    ]

    private readonly defaultObjects: ObjectWithArticle[] = [
        { singular: 'álcool em gel', plural: 'álcoois em gel', gender: 'm', article: 'o' },
        { singular: 'máscara de proteção', plural: 'máscaras de proteção', gender: 'f', article: 'a' },
        { singular: 'telefone celular', plural: 'telefones celulares', gender: 'm', article: 'o' },
        { singular: 'água', plural: 'águas', gender: 'f', article: 'a' },
        { singular: 'comida', plural: 'comidas', gender: 'f', article: 'a' },
        { singular: 'cópia do Código de Defesa do Consumidor', plural: 'cópias do Código de Defesa do Consumidor', gender: 'f', article: 'a' },
        { singular: 'arma', plural: 'armas', gender: 'f', article: 'a' },
        { singular: 'medicamento', plural: 'medicamentos', gender: 'm', article: 'o' },
        { singular: 'ingresso', plural: 'ingressos', gender: 'm', article: 'o' },
        { singular: 'absorvente', plural: 'absorventes', gender: 'm', article: 'o' },
        { singular: 'faca', plural: 'facas', gender: 'f', article: 'a' },
        { singular: 'bitcoin', plural: 'bitcoins', gender: 'm', article: 'o' },
        { singular: 'dogecoin', plural: 'dogecoins', gender: 'm', article: 'o' },
        { singular: 'emoji de berinjela', plural: 'emojis de berinjela', gender: 'm', article: 'o' },
        { singular: 'filtro do Instagram', plural: 'filtros do Instagram', gender: 'm', article: 'o' },
        { singular: 'carregador de iPhone', plural: 'carregadores de iPhone', gender: 'm', article: 'o' },
        { singular: 'fone sem fio', plural: 'fones sem fio', gender: 'm', article: 'o' },
        { singular: 'powerbank', plural: 'powerbanks', gender: 'm', article: 'o' },
        { singular: 'selfie stick', plural: 'selfie sticks', gender: 'm', article: 'o' },
        { singular: 'óculos de realidade virtual', plural: 'óculos de realidade virtual', gender: 'm', article: 'o' },
        { singular: 'drone', plural: 'drones', gender: 'm', article: 'o' },
        { singular: 'smartwatch', plural: 'smartwatches', gender: 'm', article: 'o' },
        { singular: 'protetor solar FPS 60+', plural: 'protetores solares FPS 60+', gender: 'm', article: 'o' },
        { singular: 'copo stanley', plural: 'copos stanley', gender: 'm', article: 'o' },
        { singular: 'tênis de corrida', plural: 'tênis de corrida', gender: 'm', article: 'o' },
        { singular: 'suplemento de whey protein', plural: 'suplementos de whey protein', gender: 'm', article: 'o' },
        { singular: 'livro de autoajuda', plural: 'livros de autoajuda', gender: 'm', article: 'o' },
        { singular: 'cristal energético', plural: 'cristais energéticos', gender: 'm', article: 'o' },
        { singular: 'óleo essencial', plural: 'óleos essenciais', gender: 'm', article: 'o' },
        { singular: 'livro', plural: 'livros', gender: 'm', article: 'o' },
        { singular: 'remédio', plural: 'remédios', gender: 'm', article: 'o' },
        { singular: 'vacina', plural: 'vacinas', gender: 'f', article: 'a' },
        { singular: 'cigarro', plural: 'cigarros', gender: 'm', article: 'o' },
        { singular: 'cigarro eletrônico', plural: 'cigarros eletrônicos', gender: 'm', article: 'o' },
    ]

    private readonly defaultEstablishments: EstablishmentWithArticle[] = [
        { singular: 'restaurante', plural: 'restaurantes', gender: 'm', article: 'o' },
        { singular: 'farmácia', plural: 'farmácias', gender: 'f', article: 'a' },
        { singular: 'posto de gasolina', plural: 'postos de gasolina', gender: 'm', article: 'o' },
        { singular: 'puteiro', plural: 'puteiros', gender: 'm', article: 'o' },
        { singular: 'supermercado', plural: 'supermercados', gender: 'm', article: 'o' },
        { singular: 'casa de show', plural: 'casas de show', gender: 'f', article: 'a' },
        { singular: 'bar', plural: 'bares', gender: 'm', article: 'o' },
        { singular: 'estacionamento', plural: 'estacionamentos', gender: 'm', article: 'o' },
        { singular: 'banco', plural: 'bancos', gender: 'm', article: 'o' },
        { singular: 'cinema', plural: 'cinemas', gender: 'm', article: 'o' },
        { singular: 'motel', plural: 'motéis', gender: 'm', article: 'o' },
        { singular: 'estabelecimento com área fechada', plural: 'estabelecimentos com áreas fechadas', gender: 'm', article: 'o' },
        { singular: 'lanchonete', plural: 'lanchonetes', gender: 'f', article: 'a' },
        { singular: 'hospital', plural: 'hospitais', gender: 'm', article: 'o' },
        { singular: 'casa de massagem', plural: 'casas de massagem', gender: 'f', article: 'a' },
        { singular: 'igreja', plural: 'igrejas', gender: 'f', article: 'a' },
        { singular: 'hotel', plural: 'hotéis', gender: 'm', article: 'o' },
        { singular: 'coworking', plural: 'coworkings', gender: 'm', article: 'o' },
        { singular: 'startup', plural: 'startups', gender: 'f', article: 'a' },
        { singular: 'centro de distribuição', plural: 'centros de distribuição', gender: 'm', article: 'o' },
        { singular: 'dark kitchen', plural: 'dark kitchens', gender: 'f', article: 'a' },
        { singular: 'loja de conveniência', plural: 'lojas de conveniência', gender: 'f', article: 'a' },
        { singular: 'loja de departamentos', plural: 'lojas de departamentos', gender: 'f', article: 'a' },
        { singular: 'outlet', plural: 'outlets', gender: 'm', article: 'o' },
        { singular: 'shopping center', plural: 'shopping centers', gender: 'm', article: 'o' },
        { singular: 'food truck', plural: 'food trucks', gender: 'm', article: 'o' },
        { singular: 'café gourmet', plural: 'cafés gourmets', gender: 'm', article: 'o' },
        { singular: 'barbearia moderna', plural: 'barbearias modernas', gender: 'f', article: 'a' },
        { singular: 'salão de beleza', plural: 'salões de beleza', gender: 'm', article: 'o' },
        { singular: 'academia de crossfit', plural: 'academias de crossfit', gender: 'f', article: 'a' },
        { singular: 'estúdio de yoga', plural: 'estúdios de yoga', gender: 'm', article: 'o' },
        { singular: 'clínica de estética', plural: 'clínicas de estética', gender: 'f', article: 'a' },
        { singular: 'pet shop', plural: 'pet shops', gender: 'm', article: 'o' },
        { singular: 'loja de produtos naturais', plural: 'lojas de produtos naturais', gender: 'f', article: 'a' },
        { singular: 'escape room', plural: 'escape rooms', gender: 'f', article: 'a' },
        { singular: 'casa de jogos', plural: 'casas de jogos', gender: 'f', article: 'a' },
        { singular: 'lan house', plural: 'lan houses', gender: 'f', article: 'a' },
        { singular: 'loja de eletrônicos', plural: 'lojas de eletrônicos', gender: 'f', article: 'a' },
    ]

    private readonly defaultPersonActions: Action[] = [
        { infinitive: 'utilizar {object} dentro de {establishment} em horário comercial', thirdPerson: 'utilize {object} dentro de {establishment} em horário comercial', plural: 'utilizem {object} dentro de {establishment} em horário comercial' },
        { infinitive: 'agredir {subject}', thirdPerson: 'agrida {subject}', plural: 'agridam {subject}' },
        { infinitive: 'praticar tentativa de homicídio', thirdPerson: 'pratique tentativa de homicídio', plural: 'pratiquem tentativa de homicídio' },
        { infinitive: 'criar leis', thirdPerson: 'crie leis', plural: 'criem leis' },
        { infinitive: 'fumar', thirdPerson: 'fume', plural: 'fumem' },
        { infinitive: 'fumar em {establishment}', thirdPerson: 'fume em {establishment}', plural: 'fumem em {establishment}' },
        { infinitive: 'dirigir sob efeito de {drug}', thirdPerson: 'dirija sob efeito de {drug}', plural: 'dirijam sob efeito de {drug}' },
        { infinitive: 'praticar atividades ao ar livre', thirdPerson: 'pratique atividades ao ar livre', plural: 'pratiquem atividades ao ar livre' },
        { infinitive: 'postar memes no horário comercial', thirdPerson: 'poste memes no horário comercial', plural: 'postem memes no horário comercial' },
        { infinitive: 'fazer lives durante reuniões', thirdPerson: 'faça lives durante reuniões', plural: 'façam lives durante reuniões' },
        { infinitive: 'usar filtros do Instagram em documentos oficiais', thirdPerson: 'use filtros do Instagram em documentos oficiais', plural: 'usem filtros do Instagram em documentos oficiais' },
        { infinitive: 'fazer unboxing em {establishment}', thirdPerson: 'faça unboxing em {establishment}', plural: 'façam unboxing em {establishment}' },
        { infinitive: 'assistir TikTok durante o trabalho', thirdPerson: 'assista TikTok durante o trabalho', plural: 'assistam TikTok durante o trabalho' },
        { infinitive: 'fazer cosplay em ambiente profissional', thirdPerson: 'faça cosplay em ambiente profissional', plural: 'façam cosplay em ambiente profissional' },
        { infinitive: 'conversar sobre criptomoedas por mais de 5 minutos', thirdPerson: 'converse sobre criptomoedas por mais de 5 minutos', plural: 'conversem sobre criptomoedas por mais de 5 minutos' },
        { infinitive: 'falar mal do pineapple na pizza', thirdPerson: 'fale mal do pineapple na pizza', plural: 'falem mal do pineapple na pizza' },
        { infinitive: 'usar óculos de sol em ambiente fechado', thirdPerson: 'use óculos de sol em ambiente fechado', plural: 'usem óculos de sol em ambiente fechado' },
        { infinitive: 'jogar Pokemon GO durante expediente', thirdPerson: 'jogue Pokemon GO durante expediente', plural: 'joguem Pokemon GO durante expediente' },
        { infinitive: 'fazer carinha de emoji em fotos oficiais', thirdPerson: 'faça carinha de emoji em fotos oficiais', plural: 'façam carinha de emoji em fotos oficiais' },
        { infinitive: 'explicar NFTs para pessoas desinteressadas', thirdPerson: 'explique NFTs para pessoas desinteressadas', plural: 'expliquem NFTs para pessoas desinteressadas' },
    ]

    private readonly defaultEstablishmentActions: Action[] = [
        { infinitive: 'disponibilizar {object} grátis para {subject}', thirdPerson: 'disponibilize {object} grátis para {subject}', plural: 'disponibilizem {object} grátis para {subject}' },
        { infinitive: 'oferecer desconto de {number,0,100,0}% para {subject}', thirdPerson: 'ofereça desconto de {number,0,100,0}% para {subject}', plural: 'ofereçam desconto de {number,0,100,0}% para {subject}' },
        { infinitive: 'oferecer desconto de {number,0,100,0}% em {object} para {subject}', thirdPerson: 'ofereça desconto de {number,0,100,0}% em {object} para {subject}', plural: 'ofereçam desconto de {number,0,100,0}% em {object} para {subject}' },
        { infinitive: 'instalar Wi-Fi gratuito com velocidade mínima de {number,10,1000,0} Mbps', thirdPerson: 'instale Wi-Fi gratuito com velocidade mínima de {number,10,1000,0} Mbps', plural: 'instalem Wi-Fi gratuito com velocidade mínima de {number,10,1000,0} Mbps' },
        { infinitive: 'aceitar pagamento em criptomoedas', thirdPerson: 'aceite pagamento em criptomoedas', plural: 'aceitem pagamento em criptomoedas' },
        { infinitive: 'ter uma área instagramável obrigatória', thirdPerson: 'tenha uma área instagramável obrigatória', plural: 'tenham uma área instagramável obrigatória' },
        { infinitive: 'tocar apenas música brasileira dos anos 80', thirdPerson: 'toque apenas música brasileira dos anos 80', plural: 'toquem apenas música brasileira dos anos 80' },
        { infinitive: 'servir café expresso de graça para {subject}', thirdPerson: 'sirva café expresso de graça para {subject}', plural: 'sirvam café expresso de graça para {subject}' },
        { infinitive: 'disponibilizar carregador universal gratuito', thirdPerson: 'disponibilize carregador universal gratuito', plural: 'disponibilizem carregador universal gratuito' },
        { infinitive: 'ter banheiro com papel higiênico', thirdPerson: 'tenha banheiro com papel higiênico', plural: 'tenham banheiro com papel higiênico' },
        { infinitive: 'oferecer aulas de TikTok para {subject} acima de 60 anos', thirdPerson: 'ofereça aulas de TikTok para {subject} acima de 60 anos', plural: 'ofereçam aulas de TikTok para {subject} acima de 60 anos' },
        { infinitive: 'disponibilizar mesa de ping-pong para clientes', thirdPerson: 'disponibilize mesa de ping-pong para clientes', plural: 'disponibilizem mesa de ping-pong para clientes' },
    ]

    private readonly defaultResources = [
        'PIB',
        'valor arrecadado com impostos',
        'dinheiro do Auxílio Brasil',
        'verba da merenda escolar',
        'fundos de campanha eleitoral',
        'royalties do petróleo',
        'arrecadação dos pedágios',
        'lucros das loterias',
        'multas de trânsito',
        'FGTS abandonado',
        'dinheiro esquecido no Banco Central',
        'taxa de fiscalização da ANATEL',
        'contribuição sindical obrigatória',
        'arrecadação do ICMS sobre combustíveis',
        'Bolsa Família',
        'dinheiro do Fundo de Garantia',
        'imposto sobre {subject:plural}',
        'imposto sobre {establishment:plural}',
        'imposto sobre {object:plural}',
        'imposto sobre importação de {object:plural}',
    ]

    private readonly defaultProblems = [
        'pandemia de {disease}',
        'racismo',
        'homofobia',
        'heterofobia',
        'machismo',
        'transfobia',
        'anarcocapitalismo',
        'nazismo',
        'fascismo',
        'impostômetro',
        'liberalismo econômico',
        'homosexualismo',
        'tráfico de drogas',
        'tráfico de {drug:singular}',
        'violência contra {subject}',
        'aquecimento global',
        'vício em redes sociais',
        'fake news',
        'cyberbullying',
        'procrastinação digital',
        'ansiedade por notificações',
        'síndrome do impostor',
        'burnout profissional',
        'nomofobia (medo de ficar sem celular)',
        'FOMO (fear of missing out)',
        'addiction em séries da Netflix',
        'dependência de delivery',
        'síndrome do like infinito',
        'depressão pós-Black Friday',
        'ansiedade de não ter iPhone',
        'estresse por wifi lento',
        'trauma de bateria baixa',
        'síndrome de timeline vazia',
        'depressão por stories não visualizados',
    ]

    private readonly defaultDiseases = [
        'COVID-19',
        'coronavirus',
        'dengue',
        'zika',
        'chikungunya',
        'malária',
        'peste negra',
        'AIDS',
        'HIV',
        'Síndrome de Estocolmo',
        'estatismo',
        'anarcocapitalismo',
        'síndrome de Down',
        'síndrome de Tourette',
        'síndrome de Asperger',
        'autismo',
        'autismo leve',
        'autismo severo',
        'síndrome do impostor',
        'burnout',
        'depressão',
        'ansiedade',
        'transtorno de déficit de atenção',
        'transtorno obsessivo-compulsivo',
        'transtorno bipolar',
        'esquizofrenia',
        'transtorno de personalidade múltipla',
        'transtorno de estresse pós-traumático',
        'transtorno de ansiedade generalizada',
        'transtorno de pânico',
        'fobia social',
    ]

    private readonly defaultDrugs = [
        'maconha',
        'crack',
        'heroína',
        'cocaína',
        'anarcocapitalismo',
        'cerveja',
        'álcool',
        'açúcar',
        'cafeína',
        'dopamina digital',
        'likes do Instagram',
        'notificações do WhatsApp',
        'séries da Netflix',
        'compras online',
        'whey protein',
        'suplemento pré-treino',
        'cigarro eletrônico',
        'vape de morango',
        'pílula de emagrecimento',
        'remédio para dormir',
        'remédio para acordar',
    ]

    // Injected or default data
    private readonly baseText: string[]
    private readonly predicates: string[]
    private readonly subjects: NounWithGender[]
    private readonly objects: ObjectWithArticle[]
    private readonly establishments: EstablishmentWithArticle[]
    private readonly personActions: Action[]
    private readonly establishmentActions: Action[]
    private readonly resources: string[]
    private readonly problems: string[]
    private readonly diseases: string[]
    private readonly drugs: string[]

    constructor(injectedData?: LawsData) {
        this.baseText = injectedData?.baseText ?? this.defaultBaseText
        this.predicates = injectedData?.predicates ?? this.defaultPredicates
        this.subjects = injectedData?.subjects ?? this.defaultSubjects
        this.objects = injectedData?.objects ?? this.defaultObjects
        this.establishments = injectedData?.establishments ?? this.defaultEstablishments
        this.personActions = injectedData?.personActions ?? this.defaultPersonActions
        this.establishmentActions = injectedData?.establishmentActions ?? this.defaultEstablishmentActions
        this.resources = injectedData?.resources ?? this.defaultResources
        this.problems = injectedData?.problems ?? this.defaultProblems
        this.diseases = injectedData?.diseases ?? this.defaultDiseases
        this.drugs = injectedData?.drugs ?? this.defaultDrugs
    }

    // Gerar nova lei aleatória
    generateNewLaw() {
        console.log('Nova lei gerada:')

        const newLaw = this.fillPlaceholders(this.getRandom(this.baseText))

        console.log(newLaw)

        return newLaw
    }

    private fillPlaceholders(text: string) {
        let newText = text

        newText = newText.replace(/\{(.*?)\}/g, placeholder => this.parse(placeholder))

        return newText
    }

    // Renderizar imagem com o conteúdo
    render() {
    
    }

    // Obter texto para preencher {placeholder}
    private parse(comando: string) {
        // console.log('parse', comando)
        comando = comando.replace('{', '').replace('}', '')

        const options = comando.split('|')

        const option = this.getRandom(options)

        const parameters = option.split(',')

        // Check for concordancy specification (e.g., "subject:plural")
        const mainParam = parameters[0]
        const [paramType, concordancy] = mainParam.includes(':') ? mainParam.split(':') : [mainParam, 'default']

        let text = ''

        switch (paramType) {
            case 'predicate':
                text = this.getRandom(this.predicates)
                break
            case 'number':
                text = this.getNumber(parseFloat(parameters[1]), parseFloat(parameters[2]), parseFloat(parameters[3]))
                break
            case 'subject':
                const subject = this.getRandom(this.subjects)
                text = this.getTextWithConcordancy(subject, concordancy)
                break
            case 'establishment':
                const establishment = this.getRandom(this.establishments)
                text = this.getTextWithConcordancy(establishment, concordancy)
                break
            case 'action':
                const actionType = parameters[1]
                if (actionType === 'person') {
                    const action = this.getRandom(this.personActions)
                    text = this.getActionWithConcordancy(action, concordancy)
                } else {
                    const action = this.getRandom(this.establishmentActions)
                    text = this.getActionWithConcordancy(action, concordancy)
                }
                break
            case 'object':
                const object = this.getRandom(this.objects)
                text = this.getTextWithConcordancy(object, concordancy)
                break
            case 'disease':
                text = this.getRandom(this.diseases)
                break
            case 'resource':
                text = this.getRandom(this.resources)
                break
            case 'problem':
                text = this.getRandom(this.problems)
                break
            case 'drug':
                text = this.getRandom(this.drugs)
                break
            default: 
                throw new Error('Unknown part type')
        }

        const finalText = this.fillPlaceholders(text)

        return finalText
    }

    // Helper methods for concordancy
    private getTextWithConcordancy(item: NounWithGender | ObjectWithArticle | EstablishmentWithArticle | string, concordancy: string): string {
        if (typeof item === 'string') {
            return item // Fallback for simple strings
        }

        switch (concordancy) {
            case 'singular':
                return item.singular
            case 'plural':
                return item.plural
            case 'default':
            default:
                return item.plural
        }
    }

    private getActionWithConcordancy(action: Action | string, concordancy: string): string {
        if (typeof action === 'string') {
            return action // Fallback for simple strings
        }

        switch (concordancy) {
            case 'infinitive':
                return action.infinitive
            case 'thirdPerson':
                return action.thirdPerson
            case 'plural':
                return action.plural
            case 'default':
            default:
                return action.infinitive
        }
    }

    // Helper functions
    private getNumber(limitBottom = 0, limitTop = 1, precision = 0) {
        const range = limitTop - limitBottom
        const number = Math.random() * range + limitBottom

        return number.toFixed(precision)
    }

    private getRandom<T>(array: T[]): T {
        return new List(array).random()
    }
}

export default Laws

// Export interfaces and types for testing
export { 
    NounWithGender, 
    ObjectWithArticle, 
    EstablishmentWithArticle, 
    Action, 
    LawsData 
}
