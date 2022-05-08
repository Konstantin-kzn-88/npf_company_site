from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('head_page.urls')),
    path('calculate/', include('calculate.urls')),
    # path('reports/', include('reports.urls')),
]
