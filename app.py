from flask import Flask, render_template, send_from_directory
from module.api import apiRouter
import os
import socket
import webbrowser
import threading

app = Flask(__name__)

app.config.update(
    SECRET_KEY='lansan',
    MAX_CONTENT_LENGTH= 1024 * 1024 * 1024 # 1GB
)

app.register_blueprint(apiRouter, url_prefix='/api')

@app.route('/')
def index():
    return render_template('annotation.html')

@app.route('/chart')
def chart():
    return render_template('chart.html')

@app.route('/video/<path:filename>')
def getVideo(filename):
    path = os.getcwd() + '/videos'
    return send_from_directory(path, filename)

def find_free_port():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(("", 0))
    port = sock.getsockname()[1]
    sock.close()
    return port

def run_server(port):
    app.run(host='127.0.0.1', port=port, debug=False)

if __name__ == '__main__':
    port = find_free_port()

    # 使用線程啟動伺服器
    server_thread = threading.Thread(target=run_server, args=(port,))
    server_thread.start()

    # 打開瀏覽器
    webbrowser.open(f"http://127.0.0.1:{port}")

    # app.run(debug=True)