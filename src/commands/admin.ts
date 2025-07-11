import { SlashCommandBuilder } from 'discord.js'
import { CommandHandlerParams, ICommand } from '../types'

class AdminCommand implements ICommand {
    definition = new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Bot managing commands')
    
    execute(params: CommandHandlerParams): Promise<void> {
        throw new Error('Method not implemented.')
    }

}

const adminCommand = new AdminCommand()

export default adminCommand
