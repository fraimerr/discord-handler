import { PrismaClient } from "@prisma/client";
import {
	ActivityType,
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} from "discord.js";
import { readdirSync } from "fs";
import { resolve } from "path";
import { IEvent } from "./types";

import dotenv from "dotenv";
dotenv.config();

export const botClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel, Partials.Message, Partials.User],
	presence: {
		status: "dnd",
		activities: [
			{
				name: "Hello World!",
				type: ActivityType.Custom,
			},
		],
	},
});

export const commands = new Collection<string, any>();
export const prisma = new PrismaClient();

async function main() {
	// Handle Commands
	const commandsPath = resolve(__dirname, "commands");
	const commandFolders = readdirSync(commandsPath);

	for (const folder of commandFolders) {
		const folderPath = resolve(commandsPath, folder);
		const commandFiles = readdirSync(folderPath).filter((file) =>
			file.endsWith(".ts")
		);

		for (const file of commandFiles) {
			const filePath = resolve(folderPath, file);
			try {
				const command = require(filePath);
				
				if (!command.data || typeof command.data !== "object") {
					console.warn(`Command '${file}' is missing a valid 'data' property.`);
					continue;
				}
				
				commands.set(command.data.name, command);
			} catch (error) {
				console.error(`Failed to load command '${file}':`, error);
			}
		}
	}
	// Handle Events
	const eventsPath = resolve(__dirname, "events");
	const eventFiles = readdirSync(eventsPath).filter((file) =>
		file.endsWith(".ts")
	);

	for (const file of eventFiles) {
		const filePath = resolve(eventsPath, file);
		const event = require(filePath) as IEvent;
		botClient.on(event.name, event.execute);
	}

	await prisma.$connect().then(() => console.log("Connected to the database."));
	await botClient.login(process.env.BOT_TOKEN);
}

main()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		prisma.$disconnect();
	});
