from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import subprocess

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS

members_data = []

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/schedule')
def serve_schedule():
    return send_from_directory(app.static_folder, 'schedule.html')

@app.route('/structure')
def serve_structure():
    return send_from_directory(app.static_folder, 'structure.html')

@app.route('/gallery')
def serve_gallery():
    return send_from_directory(app.static_folder, 'gallery.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

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