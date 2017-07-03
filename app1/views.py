from django.shortcuts import render
from django.contrib.auth.models import User, Group
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.reverse import reverse
from rest_framework.exceptions import NotAcceptable
from rest_framework.response import Response
from rest_framework.decorators import api_view
from app1.serializers import ExpensesSerializer, UserSerializer
from app1.models import Expenses
from app1.permissions import ExpensesPermission, CRUDUserPermission
from app1.filters import ExpensesFilter
from app1.exceptions import PartialContent


class ExpensesViewSet(viewsets.ModelViewSet):
    filter_backends = (DjangoFilterBackend,)
    queryset = Expenses.objects.all()
    serializer_class = ExpensesSerializer
    permission_classes = (permissions.IsAuthenticated, ExpensesPermission)
    filter_class = ExpensesFilter

    def get_queryset(self):
        if self.request.user.groups.filter(name='Admin').exists() or self.request.user.is_superuser:
            return Expenses.objects.all()
        else:
            return Expenses.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        QSET = serializer.validated_data['owner'].groups.all()
        if (Group.objects.get(name='Manager') in QSET) and (len(QSET) == 1) \
                and (self.request.user.groups.filter(name='Admin').exists() or self.request.user.is_superuser):
            raise NotAcceptable("You can't add expenses for Manager!")
        elif self.request.user.groups.filter(name='Admin') or self.request.user.is_superuser:
            serializer.save()
        else:
            if self.request.user != serializer.validated_data['owner']:
                raise PartialContent()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (CRUDUserPermission,)

    def get_queryset(self):
        QSET = self.request.user.groups.all()
        if self.request.user.groups.filter(name='Admin').exists() or self.request.user.is_superuser:
            native_users = Group.objects.get(name='Native User').user_set.all()
            this_user = User.objects.filter(pk=self.request.user.pk)
            managers = Group.objects.get(name='Manager').user_set.all()
            return (native_users | this_user | managers).distinct('email')
        elif Group.objects.get(name='Manager') in QSET:
            native_users = Group.objects.get(name='Native User').user_set.all()
            manager = User.objects.filter(pk=self.request.user.pk)
            return (native_users | manager).distinct('email').exclude(groups__name__contains='Admin')
        elif (Group.objects.get(name='Native User') in QSET) and (len(QSET) == 1):
            return User.objects.filter(pk=self.request.user.pk)

    def perform_update(self, serializer):
        if not self.request.user.groups.filter(name='Admin').exists() and \
                not self.request.user.groups.filter(name='Manager').exists():
            serializer.save(groups=['{0}'.format(Group.objects.get(name='Native User').pk)])
        else:
            serializer.save()


@api_view(['GET'])
def api_root(request, format=None):
    return Response({'expenses': reverse('expenses-list', request=request,
                                         format=format)})
