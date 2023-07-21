import xadmin
from .models import FileUpload


xadmin.sites.site.register(FileUpload)
