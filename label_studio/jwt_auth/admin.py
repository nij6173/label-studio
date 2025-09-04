from django.contrib import admin

# don't allow token management from admin console
try:
    from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
    admin.site.unregister(BlacklistedToken)
    admin.site.unregister(OutstandingToken)
except:
    # Models may not be registered yet or blacklist app may not be installed
    pass
