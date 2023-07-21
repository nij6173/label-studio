import xadmin
# from .models import AzureBlobImportStorage, AzureBlobImportStorageLink, AzureBlobExportStorage, AzureBlobExportStorageLink
# from .models import S3ImportStorage, S3ImportStorageLink, S3ExportStorage, S3ExportStorageLink
# from .models import GCSImportStorage, GCSImportStorageLink, GCSExportStorage, GCSExportStorageLink
from .models import RedisImportStorage, RedisImportStorageLink, RedisExportStorage, RedisExportStorageLink


# xadmin.sites.site.register(AzureBlobImportStorage)
# xadmin.sites.site.register(AzureBlobImportStorageLink)
# xadmin.sites.site.register(AzureBlobExportStorage)
# xadmin.sites.site.register(AzureBlobExportStorageLink)

# xadmin.sites.site.register(S3ImportStorage)
# xadmin.sites.site.register(S3ImportStorageLink)
# xadmin.sites.site.register(S3ExportStorage)
# xadmin.sites.site.register(S3ExportStorageLink)

# xadmin.sites.site.register(GCSImportStorage)
# xadmin.sites.site.register(GCSImportStorageLink)
# xadmin.sites.site.register(GCSExportStorage)
# xadmin.sites.site.register(GCSExportStorageLink)

xadmin.sites.site.register(RedisImportStorage)
xadmin.sites.site.register(RedisImportStorageLink)
xadmin.sites.site.register(RedisExportStorage)
xadmin.sites.site.register(RedisExportStorageLink)
