import xadmin
from .models import Webhook, WebhookAction


xadmin.sites.site.register(Webhook)
xadmin.sites.site.register(WebhookAction)
