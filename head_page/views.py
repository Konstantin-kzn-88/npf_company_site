from django.shortcuts import render

title_head_page = 'Главная'
title_about = 'О нас'
title_works = 'Выполняемые работы'
title_contacts = 'Контакты'
title_about_calculate = 'О методиках расчета'

def head_page(request):
    return render(request, 'head_page/head_page.html',  {'title_page': title_head_page})

def about(request):
    return render(request, 'head_page/about.html',  {'title_page': title_about})

def works(request):
    return render(request, 'head_page/works.html',  {'title_page': title_works})

def contacts(request):
    return render(request, 'head_page/contacts.html',  {'title_page': title_contacts})

def about_calculate(request):
    return render(request, 'head_page/about_calculate.html',  {'title_page': title_about_calculate})