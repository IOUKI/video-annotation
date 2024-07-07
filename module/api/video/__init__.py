from flask import Blueprint, jsonify, send_from_directory
import os

router = Blueprint('videoRouter', __name__)

@router.get('/list')
def getVideoList():
    path = os.getcwd() + '/videos'
    videoList = os.listdir(path)
    videoList.remove('README.md')
    return jsonify(videoList), 200