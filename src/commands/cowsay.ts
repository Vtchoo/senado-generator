import { EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js'
import { CommandHandlerParams, ICommand } from '../types'
import cowsay from 'cowsay'
import AppError from '../core/error'

class Cowsay implements ICommand {
    definition = new SlashCommandBuilder()
        .setName('cowsay')
        .addStringOption(new SlashCommandStringOption()
            .setName('text')
            .setDescription('text')
            .setRequired(true)
        )
        .setDescription('cow say')
    
    async execute({ client, interaction }: CommandHandlerParams) {
        if (!interaction.deferred)
            await interaction.deferReply({
                ephemeral: true
            })

        const text = interaction.options.getString('text', true)
        
        const result = cowsay.say({
            text,
        })

        await interaction.editReply({
            content: `\`\`\`${result}\`\`\`\n*esta vaca não está registrada no Cadastro Nacional de Rebanho Bovino e, portanto, será sacrificada para evitar riscos sanitários`
        })
        return
    }
    
}

const cowsayCommand = new Cowsay()

export default cowsayCommand
