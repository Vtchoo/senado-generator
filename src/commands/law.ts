import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { CommandHandlerParams, ICommand } from '../types'
import { senadoGenerator } from '../core/SenadoGenerator'

class LawCommand implements ICommand {
    definition = new SlashCommandBuilder()
        .setName('lei')
        .addNumberOption(option => option
            .setName('quantidade')
            .setDescription('Quantidade de leis a serem geradas')
            .setRequired(false)
        )
        .setDescription('Cria uma nova lei aleatória')
    
    async execute({ client, interaction }: CommandHandlerParams) {

        if (!interaction.deferred)
            await interaction.deferReply({ ephemeral: true })

        const quantity = interaction.options.getNumber('quantidade') || 1
        
        if (quantity > 10) {
            await interaction.editReply('Não é possível gerar mais de 10 leis de uma vez')
            return
        }

        // const newLaw = senadoGenerator.laws.generateNewLaw()
        const newLaws = Array.from({ length: quantity }, () => senadoGenerator.laws.generateNewLaw())
        const text = newLaws.join('\n\n')
        
        const embed = new EmbedBuilder()
            .setColor(0x56dca2)
        // .setTitle('Nova lei gerada:')
        // .setDescription(newLaw)
        // .setThumbnail('https://media.discordapp.net/attachments/1172639774104891444/1172721271293886495/success.png?ex=656158cb&is=654ee3cb&hm=a05acd20d8a2f602078fddba7174b71272f612bc80cd88ba3e0c79d0d0db71eb&=&width=671&height=671')
        
        if (quantity === 1)
            embed.setTitle(text)
        else
            embed.setDescription(text).setTitle('Novas leis geradas:')

        await interaction.editReply({ embeds: [embed] })
        return
    }
    
}

const lawCommand = new LawCommand()

export default lawCommand
