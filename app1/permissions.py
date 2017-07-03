from rest_framework import permissions
from app1.models import Expenses
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import User, Group


 



def has_permission_for_expenses(self):
    QSET = self.request.user.groups.all()
    if Group.objects.get(name='Native User') in QSET:
        return True
    else:
        return False


def has_not_safe_permission_for_expenses(self):
    QSET = self.request.user.groups.all()
    if Group.objects.get(name='Native User') in QSET:
        return True
    else:
        return False


def has_permission_for_users(self):
    QSET = self.request.user.groups.all()
    if Group.objects.get(name='Manager') in QSET:
        return User.objects.all()
    elif (Group.objects.get(name='Native User') in QSET) and (len(QSET) == 1):
        return User.objects.filter(pk=self.request.user.pk)
    else:
        raise PermissionDenied()

