from django.urls import path
from . import views #импорт модуля проекта


urlpatterns = [

    path('flow_rate/', views.flow_rate, name="flow_rate"),
    path('evaporaited_liguid/', views.evaporaited_liguid, name="evaporaited_liguid"),
    path('evaporaited_lpg/', views.evaporaited_lpg, name="evaporaited_lpg"),
    path('liguid_fire/', views.liguid_fire, name="liguid_fire"),
    path('fire_ball/', views.fire_ball, name="fire_ball"),
    path('explosion/', views.explosion, name="explosion"),
    path('explosion_deflag/', views.explosion_deflag, name="explosion_deflag"),
    path('light_gas_dispersion_continuous_source/', views.light_gas_dispersion_continuous_source, name="light_gas_dispersion_continuous_source"),
    path('light_gas_dispersion_inst_source/', views.light_gas_dispersion_inst_source, name="light_gas_dispersion_inst_source"),
    path('heavy_gas_dispersion_continuous_source/', views.heavy_gas_dispersion_continuous_source, name="heavy_gas_dispersion_continuous_source"),
    path('heavy_gas_dispersion_inst_source/', views.heavy_gas_dispersion_inst_source, name="heavy_gas_dispersion_inst_source"),

]
