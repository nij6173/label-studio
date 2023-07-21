import xadmin
from .models import Task, Annotation, TaskLock, AnnotationDraft, Prediction

xadmin.sites.site.register(Task)
xadmin.sites.site.register(Annotation)
xadmin.sites.site.register(TaskLock)
xadmin.sites.site.register(AnnotationDraft)
xadmin.sites.site.register(Prediction)
