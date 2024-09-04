from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS

members_data = []

@app.route('/update_members', methods=['POST'])
def update_members():
    global members_data
    members_data = request.json.get('members', [])
    print(f'Received members data: {members_data}')
    return jsonify({'status': 'success'}), 200

@app.route('/run_discord_bot', methods=['POST'])
def run_discord_bot():
    try:
        subprocess.Popen(['python', 'static/member-grabber/discord-bot.py'])
        return jsonify({'status': 'bot started'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/get_members', methods=['GET'])
def get_members():
    global members_data
    
    return jsonify({'members': members_data}), 200

if __name__ == '__main__':
    app.run(debug=True)