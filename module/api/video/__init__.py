from flask import Blueprint, jsonify
import os

router = Blueprint('videoRouter', __name__)

@router.get('/list')
def getVideoList():
    videoList = os.listdir('./static/videos')
    videoList.remove('放置影片')
    return jsonify(videoList), 200