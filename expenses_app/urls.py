from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from expenses_app.views import ExpensesViewSet, UserViewSet, api_root
from rest_framework import renderers
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'expenses', ExpensesViewSet, base_name='expenses')
router.register(r'users', UserViewSet, base_name='users')

urlpatterns = [
    url('^', include(router.urls))
]
