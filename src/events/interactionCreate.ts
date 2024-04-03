import { ChatInputCommandInteraction } from "discord.js";
import { commands } from "../bot";

export const name = "interactionCreate";

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command! Try again later.",
      ephemeral: true,
    });
  }
}
