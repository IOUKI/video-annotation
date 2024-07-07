from flask import Blueprint, request, jsonify
from flask.views import MethodView
from module.jsonEditor import updateJsonFile, readJsonFile
import os

router = Blueprint('dataRouter', __name__)

tempDataPath = os.path.join(os.getcwd(), 'data', 'tempData.json')

class DataAPI(MethodView):

    def __init__(self) -> None:
        super().__init__()

    def get(self):
        if not os.path.exists(tempDataPath):
            updateJsonFile(tempDataPath, {})
        tempData = readJsonFile(tempDataPath)
        return jsonify(tempData), 200

    def post(self):
        params: dict = request.get_json()
        tempData = params.get('tempData', None)
        if tempData is None:
            return jsonify({'message': '未上傳資料'}), 400
        updateJsonFile(tempDataPath, tempData)
        return jsonify({'message': 'ok'}), 200

router.add_url_rule('/', view_func=DataAPI.as_view('dataAPI'))