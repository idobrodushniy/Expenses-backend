from django.conf.urls import url, include
from expenses_app import views
from django.contrib import admin

# Create a router and register our viewsets with it.


urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url(r'^admin/', admin.site.urls),
    url(r'^', include('expenses_app.urls'))
]
