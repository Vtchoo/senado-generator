import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandNumberOption, SlashCommandSubcommandBuilder, TextChannel } from 'discord.js'
import { CommandHandlerParams, ICommand } from '../types'
import { getFeedChannelsRepository } from '../repositories/FeedChannelsRepository'
import dataSource from '../../dataSource'
import AppError from '../core/error'

interface SendMessageOptions {
    title?: string
    description?: string
    thumbnail?: string
}

class LawDiaryCommand implements ICommand {
    definition = new SlashCommandBuilder()
        .setName('diary')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('set')
            .setDescription('Sets the channel for the law diary feed')
            .addChannelOption(new SlashCommandChannelOption()
                .setName('channel')
                .setDescription('The channel where new laws will be posted')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('interval')
            .setDescription('Sets the interval for generating new laws')
            .addNumberOption(new SlashCommandNumberOption()
                .setName('days')
                .setDescription('The number of days between each law generation')
            )
            .addNumberOption(new SlashCommandNumberOption()
                .setName('hours')
                .setDescription('The number of hours between each law generation')
            )
            .addNumberOption(new SlashCommandNumberOption()
                .setName('minutes')
                .setDescription('The number of minutes between each law generation')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('unset')
            .setDescription('Unsets the current channel for the law diary')
        )
        .setDescription('Manages the automatic law generation diary feed')
    
    async execute({ client, interaction }: CommandHandlerParams) {

        if (!interaction.deferred)
            await interaction.deferReply({ ephemeral: true })
        
        const subCommand = interaction.options.getSubcommand(true)

        const guildId = interaction.guildId

        switch (subCommand) {
            case 'set': {

                const channel = interaction.options.getChannel('channel')

                if (!(channel instanceof TextChannel)) {
                    this.sendMessage(interaction, {
                        title: '**Error: Incompatible channel**',
                        description: 'The channel must be a text channel for law diary posts'
                    })
                    return
                }

                const queryRunner = dataSource.createQueryRunner()
                
                const feedChannelsRepository = getFeedChannelsRepository(queryRunner.manager)

                try {
                    
                    await queryRunner.startTransaction()

                    const existingFeedChannel = await feedChannelsRepository.findOne({ where: { guildId } })
                    if (existingFeedChannel)
                        await feedChannelsRepository.delete(existingFeedChannel.id)

                    const newFeedChannel = feedChannelsRepository.create({
                        id: channel.id,
                        guildId,
                        interval: 24 * 60 * 60 * 1000 // Default: 1 day
                    })
                    
                    const result = await feedChannelsRepository.save(newFeedChannel)

                    await queryRunner.commitTransaction()

                    // TODO: Initialize law generator scheduler for this channel

                    const url = channel.url

                    const embed = new EmbedBuilder()
                        .setTitle('Law diary channel set successfully!')
                        .setDescription(`Your server will now receive fresh randomly generated Brazilian laws directly at the channel ${url}`)
                        .setColor(0x56dca2)

                    await interaction.editReply({ embeds: [embed] })

                } catch (error) {
                    if (queryRunner.isTransactionActive)
                        await queryRunner.rollbackTransaction()
                    throw error
                } finally {
                    await queryRunner.release()
                }
                return
            }
            case 'interval': {

                const days = interaction.options.getNumber('days') || 0
                const hours = interaction.options.getNumber('hours') || 0
                const minutes = interaction.options.getNumber('minutes') || 0

                const MINUTE = 1000 * 60
                const HOUR = MINUTE * 60
                const DAY = HOUR * 24

                const interval = days * DAY + hours * HOUR + minutes * MINUTE

                const maxInterval = 2147483647

                if (interval > maxInterval)
                    throw new AppError(`The interval must not be greater than ${maxInterval} milliseconds (approximately 24.8 days)`)

                // TODO: Update law generator interval for this channel

                const embed = new EmbedBuilder()
                    .setTitle('New law generation interval set!')
                    .setDescription(`New laws will be generated every ${this.formatInterval(interval)}`)
                    .setColor(0x56dca2)

                await interaction.editReply({ embeds: [embed] })

                return
            }
            case 'unset': {
                
                const feedChannelsRepository = getFeedChannelsRepository()

                const existingFeedChannel = await feedChannelsRepository.findOne({ where: { guildId } })
                if (!existingFeedChannel)
                    throw new AppError('Channel not found for your guild')
                
                await feedChannelsRepository.delete(existingFeedChannel.id)

                const embed = new EmbedBuilder()
                    .setTitle('Law diary channel removed')
                    .setDescription(`Automatic law generation has been disabled for this server`)
                    .setColor(0x56dca2)

                await interaction.editReply({ embeds: [embed] })
                return
            }
            default: {
                throw new Error('Command not recognized')
            }
        }

    }

    private formatInterval(milliseconds: number): string {
        const seconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        const parts: string[] = []
        
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`)
        if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 > 1 ? 's' : ''}`)
        if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''}`)
        
        if (parts.length === 0) return 'less than a minute'
        if (parts.length === 1) return parts[0]
        if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
        
        return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`
    }

    async sendMessage(interaction: ChatInputCommandInteraction<"cached">, { title, description, thumbnail }: SendMessageOptions) {
        const embed = new EmbedBuilder()
            .setTitle(title || null)
            .setDescription(description || null)
            .setThumbnail(thumbnail || null)
            .setColor(0xf9b773)

        await interaction.editReply({ embeds: [embed] })
    }
}

const lawDiaryCommand = new LawDiaryCommand()

export default lawDiaryCommand
