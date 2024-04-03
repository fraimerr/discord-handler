import { Message } from "discord.js";

export const name = "messageCreate";

export async function execute(message: Message) {
	if (message.content.toLowerCase() === "hello") {
		await message.channel.send("Hello there!");
	}
}
