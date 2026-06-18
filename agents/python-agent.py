#!/usr/bin/env python3
"""
Strongmoon Labs — VPS Monitoring Agent (Python)

Setup:
    pip install flask psutil
    AGENT_TOKEN=your_secret_token PORT=9000 python python-agent.py

Or with systemd / screen / nohup:
    AGENT_TOKEN=your_secret_token nohup python python-agent.py &
"""

import os
import subprocess
import json
import platform
from flask import Flask, jsonify, request
import psutil

TOKEN = os.environ.get('AGENT_TOKEN')
PORT = int(os.environ.get('PORT', 9000))

if not TOKEN:
    raise RuntimeError('AGENT_TOKEN environment variable is required')

app = Flask(__name__)


def get_disk():
    d = psutil.disk_usage('/')
    return {
        'total': d.total,
        'used': d.used,
        'free': d.free,
        'percent': d.percent,
    }


def get_pm2():
    try:
        out = subprocess.check_output(
            ['pm2', 'jlist'], stderr=subprocess.DEVNULL, timeout=3
        ).decode()
        procs = json.loads(out)
        return [
            {
                'name': p.get('name', ''),
                'status': p.get('pm2_env', {}).get('status', 'unknown'),
                'cpu': p.get('monit', {}).get('cpu', 0),
                'memory': p.get('monit', {}).get('memory', 0),
                'restarts': p.get('pm2_env', {}).get('restart_time', 0),
            }
            for p in procs
        ]
    except Exception:
        return []


@app.route('/metrics')
def metrics():
    auth = request.headers.get('Authorization', '')
    if auth != f'Bearer {TOKEN}':
        return jsonify({'error': 'Unauthorized'}), 401

    cpu_percent = psutil.cpu_percent(interval=0.5)
    load1, load5, load15 = os.getloadavg()
    mem = psutil.virtual_memory()

    return jsonify({
        'cpu': {
            'load1': round(load1, 2),
            'load5': round(load5, 2),
            'load15': round(load15, 2),
            'percent': round(cpu_percent, 1),
            'cores': psutil.cpu_count(),
        },
        'mem': {
            'total': mem.total,
            'used': mem.used,
            'free': mem.available,
            'percent': mem.percent,
        },
        'disk': get_disk(),
        'uptime': int(psutil.boot_time()),
        'os': f'{platform.system()} {platform.release()}',
        'pm2': get_pm2(),
    })


@app.route('/health')
def health():
    return jsonify({'ok': True})


if __name__ == '__main__':
    print(f'Monitor agent running on port {PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=False)
