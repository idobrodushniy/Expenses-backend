from django.conf.urls import url, include
from app1 import views
from django.contrib import admin
# Create a router and register our viewsets with it.


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('app1.urls'))
]
