import 'reflect-metadata'
import fs from 'fs'
import env from '../env'
import Discord, { AuditLogEvent, Client, EmbedBuilder, Events, GatewayIntentBits, GuildAuditLogs, GuildAuditLogsEntry } from 'discord.js'
import { ICommand } from './types'
import createConnection from './database'
import { format } from 'date-fns'
import { senadoGenerator } from './core/SenadoGenerator'

async function startClient() {

    console.log('Initializing Senado Generator')

    await createConnection()
    
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
        ]
    })
    
    const slashCommands: Discord.Collection<string, ICommand> = new Discord.Collection()
    
    console.log('Importing commands')
    
    const slashFiles = fs
        .readdirSync('./src/commands')
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'))
        
    for (const file of slashFiles) {
        const cmdData = require(`./commands/${file}`)
        const slashcmd = cmdData.default || cmdData

        slashCommands.set(slashcmd.definition.name, slashcmd)
    }
 
    client.on(Events.ClientReady, (client) => {
        console.log(`Logged in as ${client.user.tag}`)

        // burgerBot.setupFeedIntervals(client)
    })
    
    client.on(Events.InteractionCreate, async (interaction) => {

        if (interaction.isChatInputCommand()) {

            try {
                if (!interaction.inCachedGuild()) {
                    await interaction.reply('Invalid guild (?)')
                    return
                }
    
                const slashcmd = slashCommands.get(interaction.commandName)
                if (!slashcmd) {
                    await interaction.reply('Invalid command')
                    return
                }

                const user = interaction.member.displayName || interaction.member.nickname
                const subCommand = interaction.options.getSubcommand(false) || ''
                console.log(`[${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}] ${user} - /${interaction.commandName} ${subCommand} [Guild: ${interaction.guild.name}]`)
                    
                // await interaction.deferReply()
                await slashcmd.execute({ client, interaction })
                return
                    
            } catch (error) {

                if (!interaction.deferred)
                    await interaction.deferReply({ ephemeral: true })

                const embed = new EmbedBuilder()
                    .setTitle(`**Desculpe o transtorno:tm:**`)
                    .setDescription(error.message)
                    .setColor(0xc4393c)
                    // .setThumbnail('https://media.discordapp.net/attachments/1172639774104891444/1172675188710715505/error.png?ex=65612de0&is=654eb8e0&hm=930e03a3af3bbd5fae0f47c6df525111b0feaba8eecd7b21a52b1b55db68871f&=&width=671&height=671')

                await interaction.editReply({
                    embeds: [embed]
                })
            }
        }
    })
    
    client.on(Events.GuildCreate, async guild => {
        console.log(`Bot added to guild ${guild.name} [id: ${guild.id}]`)

        await senadoGenerator.registerGuild(guild)

        const owner = await guild.fetchOwner()

        await senadoGenerator.saveUserData(owner, { role: 'guildAdmin' })
    })

    client.on(Events.GuildDelete, async guild => {
        console.log(`Bot removed from guild ${guild.name} [id: ${guild.id}]`)

        await senadoGenerator.removeGuild(guild.id)
    })
    
    client.login(env.TOKEN)
}

startClient()
