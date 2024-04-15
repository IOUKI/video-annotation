from flask import Flask, render_template
from module.api import apiRouter

app = Flask(__name__)

app.register_blueprint(apiRouter, url_prefix='/api')

@app.get('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)