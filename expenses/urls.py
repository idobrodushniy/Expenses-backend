from django.conf.urls import url, include
from expenses_app import views
from django.contrib import admin

# Create a router and register our viewsets with it.


urlpatterns = [
    url(r'^auth/', include('rest_auth.urls',
                           namespace='rest_auth')),
    url(r'^admin/', admin.site.urls),
    url(r'^', include('expenses_app.urls'))
]
