from django.shortcuts import render

title_flow_rate = 'Аварийный расход'
title_evaporaited_liguid = 'Испарение жидкости'
title_evaporaited_lpg = 'Испарение сжиженных газов'
title_liguid_fire = 'Пожар пролива'
title_fire_ball = 'Огненный шар'
title_explosion = 'Взрыв (СП 12.13130-2009)'
title_explosion_deflag = 'Взрыв (Методика ТВС)'
title_light_gas_dispersion_continuous_source = 'Продолжительный выброс "легкого" газа'
title_light_gas_dispersion_inst_source = 'Мгновенный выброс "легкого" газа'
title_heavy_gas_dispersion_continuous_source = 'Продолжительный выброс "тяжелого" газа'
title_heavy_gas_dispersion_inst_source = 'Мгновенный выброс "тяжелого" газа'

def flow_rate(request):
    return render(request, 'calculate/flow_rate.html',  {'title_page': title_flow_rate})

def evaporaited_liguid(request):
    return render(request, 'calculate/evaporaited_liguid.html',  {'title_page': title_evaporaited_liguid})

def evaporaited_lpg(request):
    return render(request, 'calculate/evaporaited_lpg.html',  {'title_page': title_evaporaited_lpg})

def liguid_fire(request):
    return render(request, 'calculate/liguid_fire.html',  {'title_page': title_liguid_fire})

def fire_ball(request):
    return render(request, 'calculate/fire_ball.html',  {'title_page': title_fire_ball})

def explosion(request):
    return render(request, 'calculate/explosion.html',  {'title_page': title_explosion})

def explosion_deflag(request):
    return render(request, 'calculate/explosion_deflag.html',  {'title_page': title_explosion_deflag})


def light_gas_dispersion_continuous_source(request):
    return render(request, 'calculate/light_gas_dispersion_continuous_source.html',  {'title_page': title_light_gas_dispersion_continuous_source})

def light_gas_dispersion_inst_source(request):
    return render(request, 'calculate/light_gas_dispersion_inst_source.html',  {'title_page': title_light_gas_dispersion_inst_source})

def heavy_gas_dispersion_continuous_source(request):
    return render(request, 'calculate/heavy_gas_dispersion_continuous_source.html',  {'title_page': title_heavy_gas_dispersion_continuous_source})

def heavy_gas_dispersion_inst_source(request):
    return render(request, 'calculate/heavy_gas_dispersion_inst_source.html',  {'title_page': title_heavy_gas_dispersion_inst_source})
