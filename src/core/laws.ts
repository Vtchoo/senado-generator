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

class Laws {

    // String padrão
    private readonly baseText = [
        'Projeto de lei {predicate}',
        'Senado vota projeto de lei que {predicate}',
        'AGORA É LEI! Senado aprova PL{number,1000,99999,0}, que {predicate}',
    ]

    private readonly predicates = [
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
    ]

    private readonly subjects: NounWithGender[] = [
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
        { singular: 'anarcocapitalista', plural: 'anarcocapitalistas', gender: 'm' },
        { singular: 'nazista', plural: 'nazistas', gender: 'm' },
        { singular: 'senador', plural: 'senadores', gender: 'm' },
        { singular: 'grávida', plural: 'grávidas', gender: 'f' },
        { singular: 'morador de rua', plural: 'moradores de rua', gender: 'm' },
        { singular: 'vítima de {problem}', plural: 'vítimas de {problem}', gender: 'f' },
        { singular: 'estudante', plural: 'estudantes', gender: 'm' },
        { singular: 'funcionário público', plural: 'funcionários públicos', gender: 'm' },
        { singular: 'professor', plural: 'professores', gender: 'm' },
    ]

    private readonly objects: ObjectWithArticle[] = [
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
    ]

    private readonly establishments: EstablishmentWithArticle[] = [
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
    ]

    private readonly personActions: Action[] = [
        { infinitive: 'utilizar {object} dentro de {establishment} em horário comercial', thirdPerson: 'utilize {object} dentro de {establishment} em horário comercial', plural: 'utilizem {object} dentro de {establishment} em horário comercial' },
        { infinitive: 'agredir {subject}', thirdPerson: 'agrida {subject}', plural: 'agridam {subject}' },
        { infinitive: 'praticar tentativa de homicídio', thirdPerson: 'pratique tentativa de homicídio', plural: 'pratiquem tentativa de homicídio' },
        { infinitive: 'criar leis', thirdPerson: 'crie leis', plural: 'criem leis' },
        { infinitive: 'fumar', thirdPerson: 'fume', plural: 'fumem' },
        { infinitive: 'fumar em {establishment}', thirdPerson: 'fume em {establishment}', plural: 'fumem em {establishment}' },
        { infinitive: 'dirigir sob efeito de {drug}', thirdPerson: 'dirija sob efeito de {drug}', plural: 'dirijam sob efeito de {drug}' },
        { infinitive: 'praticar atividades ao ar livre', thirdPerson: 'pratique atividades ao ar livre', plural: 'pratiquem atividades ao ar livre' },
    ]

    private readonly establishmentActions: Action[] = [
        { infinitive: 'disponibilizar {object} grátis para {subject}', thirdPerson: 'disponibilize {object} grátis para {subject}', plural: 'disponibilizem {object} grátis para {subject}' },
        { infinitive: 'oferecer desconto de {number,0,100,0}% para {subject}', thirdPerson: 'ofereça desconto de {number,0,100,0}% para {subject}', plural: 'ofereçam desconto de {number,0,100,0}% para {subject}' },
        { infinitive: 'oferecer desconto de {number,0,100,0}% em {object} para {subject}', thirdPerson: 'ofereça desconto de {number,0,100,0}% em {object} para {subject}', plural: 'ofereçam desconto de {number,0,100,0}% em {object} para {subject}' },
    ]

    private readonly resources = [
        'PIB',
        'valor arrecadado com impostos'
    ]

    private readonly problems = [
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
        'violência contra {subject}',
        'aquecimento global'
    ]

    private readonly diseases = [
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
        'estatismo'
    ]

    private readonly drugs = [
        'maconha',
        'crack',
        'heroína',
        'cocaína',
        'anarcocapitalismo',
        'cerveja',
        'álcool',
    ]

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
