from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# ui = FlaskUI(app, width=1000, height=1000)

@app.get('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)