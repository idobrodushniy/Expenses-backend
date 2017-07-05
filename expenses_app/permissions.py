from rest_framework import permissions


class CRUDUserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            if request.method == 'POST':
                return True
            else:
                return False
        else:
            return True

    def has_object_permission(self, request, view, obj):
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
        if request.user.groups.filter(name='Admin').exists() or \
                request.user.groups.filter(name='Native User').exists() or \
                request.user.is_superuser:
            return True
        else:
            return False


class CRUDuserPermissionforAnonymous(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            if request.method == 'POST':
                return True
            else:
                return False
        return True
