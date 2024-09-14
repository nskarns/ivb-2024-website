import discord
import os
import logging
from dotenv import load_dotenv
import aiofiles
import asyncio

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

TOKEN = os.getenv('DISCORD_BOT_TOKEN')

if not TOKEN:
    logging.error("DISCORD_BOT_TOKEN is not set. Please check your .env file.")
    exit(1)

class MyClient(discord.Client):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def on_ready(self):
        logging.info(f'Logged in as {self.user} (ID: {self.user.id})')
        logging.info('------')

        # Read user IDs and other details from the text file
        user_details = []
        logging.info("Reading user details from file...")
        async with aiofiles.open('static/member-grabber/officer_ids.txt', 'r') as file:
            async for line in file:
                parts = line.strip().split()
                company = parts[0]  
                pos = parts[1]  
                user_id = parts[-1] 
                logging.info(f'Reading user ID: {user_id}, Company: {company}, Position: {pos}')
                user_details.append((company, pos, int(user_id)))

        # Open the output file
        async with aiofiles.open('static/member-grabber/officer_info.txt', 'w') as output_file:
            for company, pos, user_id in user_details:
                user = await self.find_user_by_id(user_id)
                if user:
                    avatar_url = user.avatar.url if user.avatar else 'NoAvatar'
                    await output_file.write(f'{company} {pos} {avatar_url} {user.nick}\n')
                else:
                    await output_file.write(f'{company} {pos} User with ID {user_id} not found.\n')

        await self.close()

    async def find_user_by_id(self, user_id):
        try:
            guild = self.guilds[0]
            logging.info(f'Accessing guild: {guild.name} (ID: {guild.id})')
            member = guild.get_member(user_id)
            if member:
                logging.info(f'Found user: {member.name} (ID: {member.id})')
                return member
            else:
                logging.info(f'User with ID {user_id} not found.')
                return None
        except Exception as e:
            logging.error(f'Error finding user by ID {user_id}: {e}')
            return None

async def main():
    logging.info("Starting main function...")
    intents = discord.Intents.default()
    logging.info("Enabling members intent...")
    intents.members = True
    logging.info("Creating client...")

    client = MyClient(intents=intents)
    logging.info("Starting client...")
    await client.start(TOKEN)
    logging.info("Client started.")

if __name__ == "__main__":
    logging.info("Running main function...")
    asyncio.run(main())