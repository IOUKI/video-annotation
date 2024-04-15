from flask import Blueprint, jsonify, send_from_directory
import os

router = Blueprint('videoRouter', __name__)

@router.get('/list')
def getVideoList():
    path = os.getcwd() + '/videos'
    videoList = os.listdir(path)
    videoList.remove('放置影片')
    return jsonify(videoList), 200