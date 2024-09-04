import discord
from discord.ext import commands
import asyncio
import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the bot token and base URL from environment variables
TOKEN = os.getenv('DISCORD_BOT_TOKEN')
GUILD_ID = 645305502548492289
BASE_URL = os.getenv('BASE_URL')

# Construct the full URL for the update_members endpoint
WEB_SERVER_URL = f"{BASE_URL}/update_members"

intents = discord.Intents.default()
intents.members = True
intents.presences = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    guild = bot.get_guild(GUILD_ID)
    
    if guild is None:
        print("Guild not found!")
        await bot.close()
        return

    members = []
    try:
        for member in guild.members:
            if (member.desktop_status != discord.Status.offline or
                member.mobile_status != discord.Status.offline or
                member.web_status != discord.Status.offline):
                
                # Determine the status
                if member.desktop_status != discord.Status.offline:
                    status = member.desktop_status.name
                elif member.mobile_status != discord.Status.offline:
                    status = member.mobile_status.name
                else:
                    status = member.web_status.name
                
                member_info = {
                    'id': member.id,
                    'name': member.nick,
                    'status': status,
                    'avatar': member.avatar.url if member.avatar is not None else "images/discord-logo.png"
                }
                
                members.append(member_info)
    except Exception as e:
        print(f"An error occurred: {e}")
    
    # Prepare data for web server
    try:
        response = requests.post(WEB_SERVER_URL, json={'members': members})
        print(f'Server response: {response.status_code} - {response.text}')
    except requests.exceptions.RequestException as e:
        print(f'Failed to send data to the web server: {e}')

    await bot.close()

bot.run(TOKEN)