import { Client } from "discord.js";
import { commands } from "../bot";

export const name = "ready";

export async function execute(client: Client) {
	client.application?.commands
		.set(commands.map((command) => command.data))
		.then(() => {
			console.log("Successfully registered commands.");
		});

	console.log(`Logged in as ${client.user?.tag}`);
}
