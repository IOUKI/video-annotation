from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.get('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)