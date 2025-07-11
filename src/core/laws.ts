import { List } from '../utils/List'

class Laws {

    // String padrão
    private readonly baseText = [
        'Projeto de lei {predicado}',
        'Senado vota projeto de lei que {predicado}',
        'AGORA É LEI! Senado aprova PL{numero,1000,99999,0}, que {predicado}',
    ]

    private readonly predicado = [
        'obriga {sujeito} a {ação,pessoa}',
        'proibe {sujeito} de {ação,pessoa}',
        'obriga {estabelecimento} a {ação,estabelecimento}',
        'proibe {estabelecimento} de {ação,estabelecimento}',
        'proíbe venda de {objeto} em {estabelecimento}',
        'determina que {sujeito} devem {ação,pessoa}',
        'determina que {estabelecimento} devem {ação,estabelecimento}',
        'estabelece multa de R${numero,0,1000,2} para {sujeito} que {ação,pessoa}',
        'estabelece multa de R${numero,0,1000,2} para {estabelecimento} que {ação,estabelecimento}',
        'prevê o pagamento de auxílio de R${numero,0,1000,2} mensais a {sujeito}',
        'destina {numero,1,105,0}% do {recurso} para o combate a {problema}',
        'garante a {sujeito} o direito de {ação,pessoa}',
        'prevê novo imposto sobre {estabelecimento} que será usado no combate a {problema}',
        'estabelece cota mínima de {numero,0.5,55}% para {sujeito} em concursos públicos',
        'isenta {sujeito} do imposto de renda',
    ]

    private readonly subjects = [
        'pessoas',
        'homens',
        'mulheres',
        'transexuais',
        'idosos',
        'crianças',
        'adultos',
        'pessoas com mais de {numero,2,100,0} anos',
        'pessoas com menos de {numero,2,100,0} anos',
        'pessoas com renda maior que R${numero,1000,50000,2}',
        'pessoas com renda menor que R${numero,1000,50000,2}',
        'portadores de deficiência',
        'servidores públicos',
        'empregadores',
        'empresários',
        'empregados',
        'motoristas de aplicativo',
        'entregadores de aplicativo',
        'donas de casa',
        'prostitutas',
        'pessoas que realizaram cirurgia de redução bariátrica',
        'pessoas que se infectaram com {doença}',
        'milionários',
        'bilionários',
        'traficantes',
        'mineradores de Bitcoin',
        'investidores',
        'usuários de drogas',
        'usuários de {droga}',
        'anarcocapitalistas',
        'nazistas',
        'senadores',
        'grávidas',
        'moradores de rua',
        'vítimas de {problema}',
        'estudantes',
        'funcionários públicos',
        'professores',
    ]

    private readonly objetos = [
        'álcool em gel',
        'máscara de proteção',
        'telefone celular',
        'água',
        'comida',
        'cópia do Código de Defesa do Consumidor',
        'armas',
        'medicamentos',
        'ingressos',
        'absorvente',
    ]

    private readonly estabelecimentos = [
        'restaurantes',
        'farmácias',
        'postos de gasolina',
        'puteiros',
        'supermercados',
        'casas de show',
        'bares',
        'estacionamentos',
        'bancos',
        'cinemas',
        'motéis',
        'estabelecimentos com áreas fechadas',
        'lanchonetes',
        'hospitais',
        'casas de massagem',
        'igrejas',
        'hotéis',
    ]

    private readonly açõesPessoas = [
        'utilizar {objeto} dentro de {estabelecimento} em horário comercial',
        'agredir {sujeito}',
        'praticar tentativa de homicídio',
        'criar leis',
        'fumar',
        'fumar em {estabelecimento}',
        'dirigir sob efeito de {droga}',
        'praticar atividades ao ar livre',
    ]

    private readonly açõesEstabelecimentos = [
        'disponibilizar {objeto} grátis para {sujeito}',
        'oferecer desconto de {numero,0,100,0}% para {sujeito}',
        'oferecer desconto de {numero,0,100,0}% em {objeto} para {sujeito}',
    ]

    private readonly recursos = [
        'PIB',
        'valor arrecadado com impostos'
    ]

    private readonly problemas = [
        'pandemia de {doença}',
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
        'violência contra {sujeito}',
        'aquecimento global'
    ]

    private readonly doenças = [
        'COVID-19',
        'coronavirus',
        'dengue',
        'zika',
        'chikunginya',
        'malária',
        'peste negra',
        'AIDS',
        'HIV',
        'Síndrome de Estocolmo',
        'estatismo'
    ]

    private readonly drogas = [
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

        let text = ''

        switch (parameters[0]) {
            case 'predicado':
                text = this.getRandom(this.predicado)
                break
            case 'numero':
                text = this.getNumber(parseFloat(parameters[1]), parseFloat(parameters[2]), parseFloat(parameters[3]))
                break
            case 'sujeito':
                text = this.getRandom(this.subjects)
                break
            case 'estabelecimento':
                text = this.getRandom(this.estabelecimentos)
                break
            case 'ação':
                if (parameters[1] === 'pessoa')
                    text = this.getRandom(this.açõesPessoas)
                else
                    text = this.getRandom(this.açõesEstabelecimentos)
                break
            case 'objeto':
                text = this.getRandom(this.objetos)
                break
            case 'doença':
                text = this.getRandom(this.doenças)
                break
            case 'recurso':
                text = this.getRandom(this.recursos)
                break
            case 'problema':
                text = this.getRandom(this.problemas)
                break
            case 'droga':
                text = this.getRandom(this.drogas)
                break
            default: 
                throw new Error('Unknown part type')
        }

        const finalText = this.fillPlaceholders(text)

        return finalText
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
