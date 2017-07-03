from django.conf.urls import url,include
from rest_framework.urlpatterns import format_suffix_patterns
from app1.views import ExpensesViewSet, UserViewSet, api_root
from rest_framework import renderers
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'expenses', ExpensesViewSet)
router.register(r'users', UserViewSet)


urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url('^',include(router.urls))
]