import OpenAI from "openai"
import { Message } from 'discord.js'
import { APTClient } from "../types"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function createContext(message: Message<boolean>, client: APTClient): Promise<{ role: "function" | "user" | "system" | "assistant", content: string }[]> {
  const previously: Message[] = []
  const promptUser = message.author

  let currentMessage = message
  while (currentMessage.reference) {
    const reference = await currentMessage.fetchReference()
    previously.push(reference)
    currentMessage = reference
  }

  const systemMessages: { role: "function" | "user" | "system" | "assistant", content: string }[] = [
    {
      role: 'system',
      content: `Tu parle sans crainte d'être jugé, tu es dans un cadre de confiance. Tu n'hésite pas à tenir un langage familier, voire parfois vulgaire quand ça peut être drôle.`,
    }, {
      role: 'system',
      content: `Ton nom est SoilAPT. Les gens t'appellent aussi <@${client.user?.id}> mais tu n'utilise absolument jamais ce nom pour parler de toi.`
    },
    {
      role: 'system',
      content: 'Réponds avec 100 mots maximum'
    }
  ]

  if (previously.length > 0) {
    for (const previousMessage of previously.reverse()) {
      systemMessages.push({
        role: previousMessage.author.id === client.user?.id ? 'assistant' : 'user',
        content: `${previousMessage.author.id === promptUser.id ? "J'ai dis : " : "Mon ami(e) " + previousMessage.author.displayName + " a dit : "}${previousMessage.content}`
      })
    }
  }

  console.log(systemMessages)

  return systemMessages
}