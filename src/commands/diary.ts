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

class DiaryChannelCommand implements ICommand {
    definition = new SlashCommandBuilder()
        .setName('feed')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('set')
            .setDescription('Sets the channel for the feed')
            .addChannelOption(new SlashCommandChannelOption()
                .setName('channel')
                .setDescription('The channel for the feed')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('interval')
            .setDescription('Sets the interval for generating new burgers')
            .addNumberOption(new SlashCommandNumberOption()
                .setName('days')
                .setDescription('The number of days between each generation')
            )
            .addNumberOption(new SlashCommandNumberOption()
                .setName('hours')
                .setDescription('The number of hours between each generation')
            )
            .addNumberOption(new SlashCommandNumberOption()
                .setName('minutes')
                .setDescription('The number of minutes between each generation')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('unset')
            .setDescription('Unsets the current channel for the feed')
        )
        .setDescription('Sets or unsets the auto burger feed channel')
    
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
                        description: 'The channel must be a text channel'
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
                        interval: 24 * 60 * 60 * 1000
                    })
                    
                    const result = await feedChannelsRepository.save(newFeedChannel)

                    await queryRunner.commitTransaction()

                    // burgerBot.setFeedInterval(client, result)

                    const url = channel.url

                    const embed = new EmbedBuilder()
                        .setTitle('Feed channel set sucessfully!')
                        .setDescription(`Your server will now receive fresh randomly generated burgers directly at the channel ${url}`)
                        .setThumbnail('https://media.discordapp.net/attachments/1172639774104891444/1172721271293886495/success.png?ex=656158cb&is=654ee3cb&hm=a05acd20d8a2f602078fddba7174b71272f612bc80cd88ba3e0c79d0d0db71eb&=&width=671&height=671')
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
                    throw new AppError(`The interval must not be greater than ${maxInterval} milliseconds, whatever that time is`)

                // await burgerBot.setChannelInterval(client, interaction.guildId, interval)

                const embed = new EmbedBuilder()
                    .setTitle('New interval time set!')
                    .setDescription(`Your burgers will be served every ${interval} milliseconds`)
                    .setThumbnail('https://media.discordapp.net/attachments/1172639774104891444/1172721271293886495/success.png?ex=656158cb&is=654ee3cb&hm=a05acd20d8a2f602078fddba7174b71272f612bc80cd88ba3e0c79d0d0db71eb&=&width=671&height=671')
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
                    .setTitle('Channel removed successfully')
                    .setDescription(`Your burgers will no longer be served automatically :(`)
                    // .setThumbnail('https://media.discordapp.net/attachments/1172639774104891444/1172721271293886495/success.png?ex=656158cb&is=654ee3cb&hm=a05acd20d8a2f602078fddba7174b71272f612bc80cd88ba3e0c79d0d0db71eb&=&width=671&height=671')
                    .setColor(0x56dca2)

                await interaction.editReply({ embeds: [embed] })
                return
            }
            default: {
                throw new Error('Command not recognized')
            }
        }

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

const diaryChannelCommand = new DiaryChannelCommand()

export default diaryChannelCommand
