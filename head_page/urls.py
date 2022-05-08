from django.urls import path
from . import views #импорт модуля проекта


urlpatterns = [
	path('', views.head_page, name="head_page"),
    path('about/', views.about, name="about"),
	path('works/', views.works, name="works"),
	path('contacts/', views.contacts, name="contacts"),
	path('about_calculate/', views.about_calculate, name="about_calculate"),
]
