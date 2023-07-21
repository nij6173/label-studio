from __future__ import absolute_import
import xadmin
# from xadmin import views
# from xadmin.layout import Main, TabHolder, Tab, Fieldset, Row, Col, AppendedText, Side
# from xadmin.plugins.inline import Inline
# from xadmin.plugins.batch import BatchChangeAction
from xadmin.plugins.actions import BaseActionView
from xadmin.views import BaseAdminView, CommAdminView
from .models import AsyncMigrationStatus

# 主题
class ThemeSetting(object):
    enable_themes = True
    use_bootswatch = True


# 绑定到xadmin的views.BaseAdminView
xadmin.site.register(BaseAdminView, ThemeSetting)


class CustomView(object):
    site_title = 'Nebula后台'   # 网页头部导航
    site_footer = 'Nebula'      # 底部版权内容
    # menu_style = 'accordion'  # 左侧导航折叠框


xadmin.site.register(CommAdminView, CustomView)

xadmin.sites.site.register(AsyncMigrationStatus)
