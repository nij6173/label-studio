import xadmin
from .models import Export, ConvertedFormat


xadmin.sites.site.register(Export)
xadmin.sites.site.register(ConvertedFormat)
