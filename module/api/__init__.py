from flask import Blueprint

apiRouter = Blueprint('apiRouter', __name__)

from module.api.video import router as videoRouter
apiRouter.register_blueprint(videoRouter, url_prefix='/video')