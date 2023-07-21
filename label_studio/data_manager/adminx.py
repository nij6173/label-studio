import xadmin
from .models import FilterGroup, Filter


xadmin.sites.site.register(FilterGroup)
xadmin.sites.site.register(Filter)
