import os

from rest_framework.permissions import BasePermission


class HasObjectPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.has_permission(request.user)


class EmailWhiteListPermission(BasePermission):
    def has_permission(self, request, view):
        user_email = request.user.email

        try:
            user_email_white_list =eval(os.environ.get('EXPORT_USER_EMAIL', '[]'))
        except Exception as e:
            user_email_white_list = []

        if user_email in user_email_white_list:
            return True

        return False
