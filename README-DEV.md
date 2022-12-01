# 开发记录
## 项目在本地打包/启动和容器停止/镜像删除指令
$ docker-compose -f docker-compose.prod.yml down -v
$ docker-compose -f docker-compose.prod.yml up -d --build
$ docker-compose -f docker-compose.dev.yml exec app python manage.py migrate --noinput
$ docker-compose -f docker-compose.dev.yml exec app python /label-studio/label_studio/manage.py createsuperuser