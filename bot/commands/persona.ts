import { SlashCommandBuilder } from "discord.js"

import { BotCommand } from '../types'
import fetchApi from "../helpers/fetch-api"
import { Persona } from "../../api/data/persona"

const moodCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('persona')
    .setDescription('Get persona of the day'),
  async execute(interaction) {
    const persona = await fetchApi<Persona>('/api/personas/today')
    if (!persona) return

    await interaction.reply(`Ma personnalité du jour est ${persona.title} (ajouté par ${persona.author}).`)
  }
}

export default moodCommand