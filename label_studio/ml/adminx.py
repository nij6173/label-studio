import xadmin
from .models import MLBackend, MLBackendPredictionJob, MLBackendTrainJob


xadmin.sites.site.register(MLBackend)
xadmin.sites.site.register(MLBackendPredictionJob)
xadmin.sites.site.register(MLBackendTrainJob)
