from flask import Blueprint

apiRouter = Blueprint('apiRouter', __name__)

from module.api.video import router as videoRouter
from module.api.chart import router as chartRouter
from module.api.data import router as dataRouter
apiRouter.register_blueprint(videoRouter, url_prefix='/video')
apiRouter.register_blueprint(chartRouter, url_prefix='/chart')
apiRouter.register_blueprint(dataRouter, url_prefix='/data')