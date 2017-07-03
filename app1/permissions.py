from rest_framework import permissions
from app1.models import Expenses
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import User, Group

class CRUDUserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
        else:
            return True


class ExpensesPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.groups.filter(name='Admin').exists() or \
                request.user.groups.filter(name='Native User').exists() or \
                request.user.is_superuser:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        QSET = request.user.groups.all()
        if request.user.groups.filter(name='Admin').exists() or \
                request.user.groups.filter(name='Native User').exists() or \
                request.user.is_superuser:
            return True
        else:
            return False

