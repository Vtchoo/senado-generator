import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandHandlerParams, ICommand } from '../types'

class PingCommand implements ICommand {
    definition = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong, hopefully')
    
    async execute({ client, interaction }: CommandHandlerParams) {

        if (!interaction.deferred)
            await interaction.deferReply({ ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle('Pong')

        await interaction.editReply({
            embeds: [embed]
        })
    }  
}

const pingCommand = new PingCommand()

export default pingCommand
