from flask import Flask, render_template, send_from_directory, send_file
from module.api import apiRouter
import os

app = Flask(__name__)

app.register_blueprint(apiRouter, url_prefix='/api')

@app.get('/')
def index():
    return render_template('index.html')

@app.get('/video/<path:filename>')
def getVideo(filename):
    path = os.getcwd() + '/videos'
    return send_from_directory(path, filename)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)