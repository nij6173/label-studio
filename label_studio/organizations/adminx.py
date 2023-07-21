import xadmin
from .models import OrganizationMember, Organization


xadmin.sites.site.register(OrganizationMember)
xadmin.sites.site.register(Organization)
