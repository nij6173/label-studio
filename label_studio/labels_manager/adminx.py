import xadmin
from .models import Label, LabelLink


xadmin.sites.site.register(Label)
xadmin.sites.site.register(LabelLink)
