from django.contrib.auth.models import User, Group
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.reverse import reverse
from rest_framework.exceptions import NotAcceptable, PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import api_view
from expenses_app.serializers import ExpensesSerializer, UserSerializer
from expenses_app.models import Expenses
from expenses_app.permissions import ExpensesPermission, CRUDUserPermission, CRUDuserPermissionforAnonymous
from expenses_app.filters import ExpensesFilter
from rest_framework.exceptions import PermissionDenied


class ExpensesViewSet(viewsets.ModelViewSet):
    filter_backends = (DjangoFilterBackend,)
    serializer_class = ExpensesSerializer
    permission_classes = (permissions.IsAuthenticated, ExpensesPermission)
    filter_class = ExpensesFilter

    def get_queryset(self):
        if self.request.user.groups.filter(name='Admin').exists() or self.request.user.is_superuser:
            return Expenses.objects.all()
        else:
            return Expenses.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        groups = serializer.validated_data['owner'].groups.all()
        if (Group.objects.get(name='Manager') in groups) and (len(groups) == 1) \
                and (self.request.user.groups.filter(name='Admin').exists() or self.request.user.is_superuser):
            raise NotAcceptable("You can't add expenses for Manager!")
        elif self.request.user.groups.filter(name='Admin') or self.request.user.is_superuser:
            serializer.save()
        else:
            if self.request.user != serializer.validated_data['owner']:
                serializer.save(owner=self.request.user)
                raise PermissionDenied(
                    "You can't create expenses for other users. By default it was set your username for 'owner' field!")


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (CRUDUserPermission,)

    def get_queryset(self):
        groups = self.request.user.groups.all()
        if self.request.user.groups.filter(name='Admin').exists() or self.request.user.is_superuser:
            return (Group.objects.get(name='Native User').user_set.all() | \
                    User.objects.filter(pk=self.request.user.pk) | \
                    Group.objects.get(name='Manager').user_set.all()).distinct('email')
        elif Group.objects.get(name='Manager') in groups:
            return (Group.objects.get(name='Native User').user_set.all() | \
                    User.objects.filter(pk=self.request.user.pk)). \
                distinct('email').exclude(groups__name__contains='Admin')
        elif (Group.objects.get(name='Native User') in groups) and (len(groups) == 1):
            return User.objects.filter(pk=self.request.user.pk)

    def perform_update(self, serializer):
        if not self.request.user.groups.filter(name='Admin').exists() and \
                not self.request.user.groups.filter(name='Manager').exists() and \
                not self.request.user.is_superuser:
            serializer.save(groups=['{0}'.format(Group.objects.get(name='Native User').pk)])
        elif str(Group.objects.get(name='Admin').id) in [self.request.data.get('groups')] and not \
                (self.request.user.groups.filter(name='Admin').exists() or self.request.user.is_superuser):
            raise PermissionDenied("You can't make someone Admin!")
        else:
            serializer.save()


@api_view(['GET'])
def api_root(request, format=None):
    return Response({'expenses': reverse('expenses-list', request=request,
                                         format=format)})
