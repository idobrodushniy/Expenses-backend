from django.shortcuts import render
from rest_framework import status
from django.contrib.auth.models import User, Group
from app1.models import Expenses
from app1.serializers import ExpensesSerializer, UserSerializer
from django.core.exceptions import PermissionDenied
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.reverse import reverse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import api_view
from app1.permissions import (has_permission_for_expenses,
                              has_not_safe_permission_for_expenses,
                              has_permission_for_users)
from app1.filters import ExpensesFilter

class ExpensesViewSet(viewsets.ModelViewSet):
    filter_backends = (DjangoFilterBackend,)
    queryset = Expenses.objects.all()
    serializer_class = ExpensesSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_class = ExpensesFilter

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Expenses.objects.all()
        elif has_permission_for_expenses(self):
            return Expenses.objects.filter(owner=self.request.user)
        else:
            raise PermissionDenied()

    def create(self, request, *args, **kwargs):
        if has_not_safe_permission_for_expenses(self) or self.request.user.is_superuser:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            raise PermissionDenied()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        queryset = has_permission_for_users(self)
        return queryset

    


@api_view(['GET'])
def api_root(request, format=None):
    return Response({'expenses': reverse('expenses-list', request=request,
                                         format=format)})
