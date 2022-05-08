ymaps.ready(init);
var myMap;


function func_a_d(stability_class="F") {
	if (stability_class == "A") {
		a = 0.18;
		b = 0.92;
		c = 0.72;
		d = 0.76;
	} else if (stability_class == "B") {
		a = 0.14;
		b = 0.92;
		c = 0.53;
		d = 0.73;
	} else if (stability_class == "C") {
		a = 0.10;
		b = 0.92;
		c = 0.34;
		d = 0.72;
	} else if (stability_class == "D") {
		a = 0.06;
		b = 0.92;
		c = 0.15;
		d = 0.70;
	} else if (stability_class == "E") {
		a = 0.045;
		b = 0.91;
		c = 0.12;
		d = 0.67;
	} else if (stability_class == "F") {
		a = 0.030;
		b = 0.90;
		c = 0.08;
		d = 0.64;
	}
	return [a,b,c,d]
};


function he_func(x_dist=50, stability_class = "F", us=3, f_bi=500) {
	var c_const = 0.64; //m p.245 Konstantinos
	var mass_gas = Number(document.getElementById('mass_gas').value);
	var po_gas = document.getElementById('po_gas').value;
	var hs = Number(document.getElementById('hs').value);
	var Ta = document.getElementById('Ta').value;
	Ta = Number(Ta) + 273
	var r_cloud_init = Math.pow(3*mass_gas/(4*3.14*po_gas),1/3);

	//Gradual and Final Puff Rise Equations

	if (stability_class == "A" || stability_class == "B" || stability_class == "C" || stability_class == "D") {
		he_gradual = hs + (2*f_bi * x_dist * x_dist/(Math.pow(c_const,3)* Math.pow(us,2))) ** (1 /4);
	} else if (stability_class == "E" || stability_class == "F") {
		if (stability_class == "E") {
			s = (9.81/Ta) * 0.02;
		} else if (stability_class == "F") {
			s = (9.81/Ta) * 0.035;
		}
		first_add = 4*f_bi/(Math.pow(c_const,3)*s);
		second_add = 1-Math.cos(x_dist*Math.sqrt(s)/us);
		he_gradual = hs + Math.pow(first_add*second_add + Math.pow(r_cloud_init/c_const,4),1/4) - (r_cloud_init/c_const);

	}

	if (stability_class == "A" || stability_class == "B" || stability_class == "C" || stability_class == "D") {
		he_final = hs + (2*f_bi * x_max * x_max/(Math.pow(c_const,3)* Math.pow(us,2))) ** (1 /4);
	} else if (stability_class == "E" || stability_class == "F") {
		if (stability_class == "E") {
			s = (9.81/Ta) * 0.02;
		} else if (stability_class == "F") {
			s = (9.81/Ta) * 0.035;
		}
		first_add_final = 8*f_bi/(Math.pow(c_const,3)*s);
		he_final = hs + Math.pow(first_add_final + Math.pow(r_cloud_init/c_const,4),1/4) - (r_cloud_init/c_const);

	}

	if (x_dist > x_max) {
		he = he_final;
	} else {
		he = he_gradual;
	}

	return he
}



function plume_raise(x_dist=50) {
	// возьмем значения из полей html
	var po_gas = document.getElementById('po_gas').value;
	var u_ref = document.getElementById('u_ref').value;
	var Ta = document.getElementById('Ta').value;
	Ta = Number(Ta) + 273
	var Ts = document.getElementById('Ts').value;
	Ts = Number(Ts) + 273
	var mass_gas = Number(document.getElementById('mass_gas').value);
	var hs = Number(document.getElementById('hs').value);
	var z_ref = 10 //m
	var times_of_day = 0
	var c_const = 0.64 //m p.245 Konstantinos
	var r_cloud_init = Math.pow(3*mass_gas/(4*3.14*po_gas),1/3)



	var rad=document.getElementsByName('times_of_day');
	for (var i=0;i<rad.length; i++) {
			if (rad[i].checked) {
				if (i == 0) {
					times_of_day = 1;//day
				} else {
					times_of_day = 0;//night
				}
			}
	};

	var rad2=document.getElementsByName('type_area');
	var type_area = 0

	for (var i=0;i<rad2.length; i++) {
			if (rad2[i].checked) {
				if (i == 0) {
					type_area = 1;//urban
				} else {
					type_area = 0;//rural
				}
			}
	};

	var cloud_coverage = document.getElementById('cloud_coverage').value;


	var stability_class = "F"
	// Table C5.2. Pasquill Atmospheric Stability Classes.
	// Day 0/8-2/8
	if (u_ref < 2 && times_of_day == 1 && cloud_coverage <= 2) {
		stability_class = "A";
	} else if (2 >= u_ref && u_ref < 3 && times_of_day == 1 && cloud_coverage <= 2) {
		stability_class = "B";
	} else if (3 >= u_ref && u_ref < 4 && times_of_day == 1 && cloud_coverage <= 2) {
		stability_class = "B";
	} else if (4 >= u_ref && u_ref < 5 && times_of_day == 1 && cloud_coverage <= 2) {
		stability_class = "B";
	} else if (5 >= u_ref && u_ref < 6 && times_of_day == 1 && cloud_coverage <= 2) {
		stability_class = "C";
	} else if (6 >= u_ref && times_of_day == 1 && cloud_coverage <= 2) {
		stability_class = "C";
	}
	// Day 3/8-5/8
	if (u_ref < 2 && times_of_day == 1 && cloud_coverage >= 3 && cloud_coverage < 5) {
		stability_class = "B";
	} else if (2 >= u_ref && u_ref < 3 && times_of_day == 1 && cloud_coverage >= 3 && cloud_coverage < 5) {
		stability_class = "B";
	} else if (3 >= u_ref && u_ref < 4 && times_of_day == 1 && cloud_coverage >= 3 && cloud_coverage < 5) {
		stability_class = "C";
	} else if (4 >= u_ref && u_ref < 5 && times_of_day == 1 && cloud_coverage >= 3 && cloud_coverage < 5) {
		stability_class = "C";
	} else if (5 >= u_ref && u_ref < 6 && times_of_day == 1 && cloud_coverage >= 3 && cloud_coverage < 5) {
		stability_class = "D";
	} else if (6 >= u_ref && times_of_day == 1 && cloud_coverage >= 3 && cloud_coverage < 5) {
		stability_class = "D";
	}

	// Day 6/8-8/8
	if (u_ref < 2 && times_of_day == 1 && cloud_coverage >= 6) {
		stability_class = "B";
	} else if (2 >= u_ref && u_ref < 3 && times_of_day == 1 && cloud_coverage >= 6) {
		stability_class = "C";
	} else if (3 >= u_ref && u_ref < 4 && times_of_day == 1 && cloud_coverage >= 6) {
		stability_class = "D";
	} else if (4 >= u_ref && u_ref < 5 && times_of_day == 1 && cloud_coverage >= 6) {
		stability_class = "D";
	} else if (5 >= u_ref && u_ref < 6 && times_of_day == 1 && cloud_coverage >= 6) {
		stability_class = "D";
	} else if (6 >= u_ref && times_of_day == 1 && cloud_coverage >= 6) {
		stability_class = "D";
	}

	// Night <3/8
	if (u_ref < 2 && times_of_day == 0 && cloud_coverage <= 3) {
		stability_class = "F";
	} else if (2 >= u_ref && u_ref < 3 && times_of_day == 0 && cloud_coverage <= 3) {
		stability_class = "E";
	} else if (3 >= u_ref && u_ref < 4 && times_of_day == 0 && cloud_coverage <= 3) {
		stability_class = "D";
	} else if (4 >= u_ref && u_ref < 5 && times_of_day == 0 && cloud_coverage <= 3) {
		stability_class = "D";
	} else if (5 >= u_ref && u_ref < 6 && times_of_day == 0 && cloud_coverage <= 3) {
		stability_class = "D";
	} else if (6 >= u_ref && times_of_day == 0 && cloud_coverage <= 3) {
		stability_class = "D";
	}

	// Night > 4/8
	if (u_ref < 2 && times_of_day == 0 && cloud_coverage >= 4) {
		stability_class = "F";
	} else if (2 >= u_ref && u_ref < 3 && times_of_day == 0 && cloud_coverage >= 4) {
		stability_class = "F";
	} else if (3 >= u_ref && u_ref < 4 && times_of_day == 0 && cloud_coverage >= 4) {
		stability_class = "E";
	} else if (4 >= u_ref && u_ref < 5 && times_of_day == 0 && cloud_coverage >= 4) {
		stability_class = "E";
	} else if (5 >= u_ref && u_ref < 6 && times_of_day == 0 && cloud_coverage >= 4) {
		stability_class = "D";
	} else if (6 >= u_ref && times_of_day == 0 && cloud_coverage >= 4) {
		stability_class = "D";
	}


	var profile_exponent = 0.55
	// Table C5.3. Wind Profile Exponent p, Eq. (C5.1).
	//rural
	if (stability_class == "A" && type_area == 0) {
		profile_exponent = 0.07;
	} else if (stability_class == "B" && type_area == 0) {
		profile_exponent = 0.07;
	} else if (stability_class == "C" && type_area == 0) {
		profile_exponent = 0.1;
	} else if (stability_class == "D" && type_area == 0) {
		profile_exponent = 0.15;
	} else if (stability_class == "E" && type_area == 0) {
		profile_exponent = 0.35;
	} else if (stability_class == "F" && type_area == 0) {
		profile_exponent = 0.55;
	}
	//urban
	if (stability_class == "A" && type_area == 1) {
		profile_exponent = 0.15;
	} else if (stability_class == "B" && type_area == 1) {
		profile_exponent = 0.15;
	} else if (stability_class == "C" && type_area == 1) {
		profile_exponent = 0.20;
	} else if (stability_class == "D" && type_area == 1) {
		profile_exponent = 0.25;
	} else if (stability_class == "E" && type_area == 1) {
		profile_exponent = 0.30;
	} else if (stability_class == "F" && type_area == 1) {
		profile_exponent = 0.30;
	}

	us = u_ref*((hs/z_ref) ** profile_exponent)
	// console.log("us  " + us);
	f_bi = (9.81*mass_gas/(Math.PI * 1.21)) * ((Ts-Ta)/Ta)
	// console.log("f_bi  " + f_bi);

	//Calculation of maximum distance xmax
	if (stability_class == "A" || stability_class == "B" || stability_class == "C" || stability_class == "D") {
		if (f_bi <= 300*Math.pow(us,2/3)) {

			x_max = 12 * Math.sqrt(f_bi) * Math.pow(us,1/3)
		} else {
			x_max = 50 * Math.pow(f_bi,1/4) * Math.pow(us,1/2);
		}
	} else if (stability_class == "E" || stability_class == "F") {
		if (stability_class == "E") {
			s = (9.81/Ta) * 0.02;
			x_max = (Math.PI*us)/Math.sqrt(s);
		} else if (stability_class == "F") {
			s = (9.81/Ta) * 0.035;
			x_max = (Math.PI*us)/Math.sqrt(s);
		}
	}
	//Gradual and Final Puff Rise Equations
	var he = he_func(x_dist, stability_class, us, f_bi);
	var he_max = he_func(x_max, stability_class, us, f_bi);
	// console.log("he "+he)

	//b) Dispersion Coefficients
	data_a_d = func_a_d(stability_class);
	a = data_a_d[0];
	b = data_a_d[1];
	c = data_a_d[2];
	d = data_a_d[3];

	sigma_x = a * Math.pow(x_dist/1,b);
	sigma_y = sigma_x;
	sigma_z = c * Math.pow(x_dist/1,d);

	//c) Mean Wind Speed
	if (he-2.15*sigma_z > 2) {
		z_b = he - 2.15*sigma_z;
	} else {
		z_b = 2;
	}

	if (he+2.15*sigma_z < he_max) {
		z_t = he + 2.15*sigma_z;
	} else {
		z_t = he_max;
	}

	first_add_ws = u_ref/((z_t-z_b)*Math.pow(z_ref,profile_exponent)*(1+profile_exponent))
	second_add_ws  = Math.pow(z_t,1+profile_exponent)-Math.pow(z_b,1+profile_exponent)
	u_mean_speed = first_add_ws *second_add_ws


	t_in = (x_dist - 2.45*sigma_x)/u_mean_speed;
	t_out = (x_dist + 2.45*sigma_x)/u_mean_speed;
	t_peak = (x_dist)/u_mean_speed;

	return [he, sigma_x, sigma_y, sigma_z, u_mean_speed, t_peak]
}


function concentration_x_peak(x_dist=100, y=0, z=2) {
	var mass_gas = Number(document.getElementById('mass_gas').value);
	var data_set_var = plume_raise(x_dist);

	he= data_set_var[0];
	sigma_x= data_set_var[1];
	sigma_y= data_set_var[2];
	sigma_z= data_set_var[3];
	u_mean_speed= data_set_var[4];
	t_peak=data_set_var[5];
	t = t_peak;

	first_add = 2*mass_gas*Math.pow(10,9);
	second_add = Math.pow(2*Math.PI,3/2) * sigma_x * sigma_y * sigma_z;
	third_add = Math.exp(-(Math.pow(x_dist-u_mean_speed*t,2))/(2*Math.pow(sigma_x,2)));
	fourth_add = Math.exp(-(Math.pow(y, 2)) / (2 * Math.pow(sigma_y, 2)));
	fifth_add = Math.exp(-(Math.pow(he-z, 2)) / (2 * Math.pow(sigma_z, 2)));
	six_add = Math.exp(-(Math.pow(he+z, 2)) / (2 * Math.pow(sigma_z, 2)));

	conc = (first_add / second_add) * third_add * fourth_add * (fifth_add + six_add);
	return conc

}

function concentration_x_control(y=0, z=2, t = 30) {
	var mass_gas = Number(document.getElementById('mass_gas').value);
	var x_dist = Number(document.getElementById('x_control').value);
	var data_set_var = plume_raise(x_dist);

	he= data_set_var[0];
	sigma_x= data_set_var[1];
	sigma_y= data_set_var[2];
	sigma_z= data_set_var[3];
	u_mean_speed= data_set_var[4];

	first_add = 2*mass_gas*Math.pow(10,9);
	second_add = Math.pow(2*Math.PI,3/2) * sigma_x * sigma_y * sigma_z;
	third_add = Math.exp(-(Math.pow(x_dist-u_mean_speed*t,2))/(2*Math.pow(sigma_x,2)));
	fourth_add = Math.exp(-(Math.pow(y, 2)) / (2 * Math.pow(sigma_y, 2)));
	fifth_add = Math.exp(-(Math.pow(he-z, 2)) / (2 * Math.pow(sigma_z, 2)));
	six_add = Math.exp(-(Math.pow(he+z, 2)) / (2 * Math.pow(sigma_z, 2)));

	conc = (first_add / second_add) * third_add * fourth_add * (fifth_add + six_add);
	return conc
}


function concentration_time_control(x_dist=100, y=0, z=2, t = 30) {
	var mass_gas = Number(document.getElementById('mass_gas').value);
	var data_set_var = plume_raise(x_dist);

	he= data_set_var[0];
	sigma_x= data_set_var[1];
	sigma_y= data_set_var[2];
	sigma_z= data_set_var[3];
	u_mean_speed= data_set_var[4];

	first_add = 2*mass_gas*Math.pow(10,9);
	second_add = Math.pow(2*Math.PI,3/2) * sigma_x * sigma_y * sigma_z;
	third_add = Math.exp(-(Math.pow(x_dist-u_mean_speed*t,2))/(2*Math.pow(sigma_x,2)));
	fourth_add = Math.exp(-(Math.pow(y, 2)) / (2 * Math.pow(sigma_y, 2)));
	fifth_add = Math.exp(-(Math.pow(he-z, 2)) / (2 * Math.pow(sigma_z, 2)));
	six_add = Math.exp(-(Math.pow(he+z, 2)) / (2 * Math.pow(sigma_z, 2)));

	conc = (first_add / second_add) * third_add * fourth_add * (fifth_add + six_add);
	return conc
}


// Функция генерации данных для отрисовке на карте
function generateData() {
	var conc_mark = 0//Концентрация дважды проходит отдно и то же значение
	var Data = [0,0,0,0,0];//5 пустой пустой массив для возврата
	var conc_Data = [];
	var radius_Data = []


	for (var radius = 1; radius < 10000; radius++) {
		// Вызываем функцию расчета дисперсии
		var conc = Number(concentration_x_peak(radius, y=0, z=2))/1000;

		if (conc<conc_mark) {
			if (conc < 5) break; //Что бы не строить огромные графики
		}

		var conc_mark = conc;
		conc_Data.push(conc);
		radius_Data.push(radius);
	}

	var maxValconc = Math.max.apply(null,conc_Data);
	var conc_maxVal_index = conc_Data.indexOf(maxValconc);

	conc_Data.forEach(function(item, i, conc_Data) {
		if (maxValconc > item && conc_maxVal_index < i) {
			if (item > maxValconc * 0.99 && i > conc_maxVal_index * 0.9) {
				conc_index = conc_Data.indexOf(item);
				Data[0] = radius_Data[conc_index];
			}
			if (item > maxValconc * 0.75 && i > conc_maxVal_index * 0.69) {
				conc_index = conc_Data.indexOf(item);
				Data[1] = radius_Data[conc_index];
			}
			if (item > maxValconc * 0.55 && i > conc_maxVal_index * 0.49) {
				conc_index = conc_Data.indexOf(item);
				Data[2] = radius_Data[conc_index];
			}
			if (item > maxValconc * 0.25 && i > conc_maxVal_index * 0.19) {
				conc_index = conc_Data.indexOf(item);
				Data[3] = radius_Data[conc_index];

			}
		}
	});
	Data[4] = maxValconc;
	console.log(Data)
	return Data;

};


//
// Функция для работы с картой
function init () {
    myMap = new ymaps.Map("map", {
        center: [55.7887400, 49.1221400], // Kazan
        zoom: 10
    }, {
        balloonMaxWidth: 200,
        searchControlProvider: 'yandex#search'
    });

    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    // При возникновении такого события откроем балун.
    myMap.events.add('click', function (e) {
		var coords = e.get('coords');
		var Data = generateData();



		var c_100 = new ymaps.Circle([
        // Координаты центра круга.
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        // Радиус круга в метрах.
        Data[0]
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: "Радиус круга - " + Data[0] + "м. ",
        // Содержимое хинта.
        hintContent: "Максимальная концентрация Сmax:" + (Data[4]).toFixed(2) + "мг/м3",
    }, {
        // Задаем опции круга.
        // Включаем возможность перетаскивания круга.
        draggable: false,
        // Цвет заливки.
        // Последний байт (77) определяет прозрачность.
        // Прозрачность заливки также можно задать используя опцию "fillOpacity".
        fillColor: "#DB709300",//полностью прозрачный круг
        // Цвет обводки - красный.
        strokeColor: "#ee2c2c",
        // Прозрачность обводки.
        strokeOpacity: 0.8,
        // Ширина обводки в пикселях.
        strokeWidth: 5
    });

		var c_75 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1]
    ], {
        balloonContent: "Радиус круга - " + Data[1] + "м. ",
        hintContent: "0.75*Cmax: " + (0.75*Data[4]).toFixed(2) + " мг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг рыжий
        strokeColor: "#ff8f43",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var c_50 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[2]
    ], {
        balloonContent: "Радиус круга - " + Data[2] + "м. ",
        hintContent: "0.5*Cmax: " + (0.5*Data[4]).toFixed(2) + " мг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг желтый
        strokeColor: "#ffd700",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });


		var c_25 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[3]
    ], {
        balloonContent: "Радиус круга - " + Data[3] + "м. ",
        hintContent: "0.25*Cmax: " + (0.25*Data[4]).toFixed(2) + " мг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#00ffab",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });
// Добавление объектов на карту ЛКМ
	myMap.geoObjects.add(c_25);
	myMap.geoObjects.add(c_50);
	myMap.geoObjects.add(c_75);
	myMap.geoObjects.add(c_100);

// Удаление объектов с карты ПКМ
	myMap.events.add('contextmenu', function (e) {
		myMap.geoObjects.remove(c_25);
		myMap.geoObjects.remove(c_50);
		myMap.geoObjects.remove(c_75);
		myMap.geoObjects.remove(c_100);
    });

    });
}
//
//
// Функция основного графика (Дисперсия легкого газа из продолжительного источника)
function draw_graph() {

	var Ts = document.getElementById('Ts').value;
	var mass_gas = Number(document.getElementById('mass_gas').value);

	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(mass_gas) +
														" кг, тем-ра вещества: " + String(Ts) +
														" град.С, высота измерения: " + String(2) +
														" м" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Распределение максимальной концентрации, мг/м3";

		// Указываем данные для графика по осям
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "conc";
		series.dataFields.valueX = "radius";
		series.tooltipText = "{valueY}";//подсказка при hover
		series.tooltip.pointerOrientation = "vertical";
		series.tooltip.background.cornerRadius = 20;
		series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12,12,12,12)
		series.strokeWidth = 3;//толщина линии
		series.stroke = am4core.color("blue");

		// Создаем курсор
		chart.cursor = new am4charts.XYCursor();
		chart.cursor.xAxis = dateAxis;
		chart.cursor.snapToSeries = series;

		// Добавляем сохранине графика
		chart.exporting.menu = new am4core.ExportMenu();

	});
	// Функция генерации данных с графика
	function generateChartData() {
			var chartData = [];
			var conc_mark = 0//Концентрация дважды проходит отдно и то же значение
			for (var radius = 1; radius < 10000; radius= radius+13) {

					// Вызываем функцию расчета дисперсии
					var conc = Number(concentration_x_peak(radius, y=0, z=2))/1000;

					if (conc<conc_mark) {
						if (conc < 5) break; //Что бы не строить огромные графики
					}

					var conc_mark = conc;


					chartData.push({
							radius: radius,
							conc: conc.toFixed(3)
					});

			}
			return chartData;
	}

	// вызов дополнительных графиков (в конце чтобы не тормозили основной график)
	draw_x_control = draw_graph_x_control();
	draw_time_control = draw_graph_time_control();
}

//
function draw_graph_x_control() {
	// возьмем значения из полей html
	var Ts = document.getElementById('Ts').value;
	var mass_gas = Number(document.getElementById('mass_gas').value);
	var x_control = Number(document.getElementById('x_control').value);

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_x_control", am4charts.XYChart);
		chart.data = generateChartData();
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Время, с. (масса: " + String(mass_gas) +
														" кг, тем-ра вещества: " + String(Ts) +
														" град.С, на контролируемом растоянии: " + String(x_control) +
														" м" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Распределение максимальной концентрации, мг/м3";

		// Create series
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "conc";
		series.dataFields.valueX = "time";
		series.tooltipText = "{valueY}";
		series.tooltip.pointerOrientation = "vertical";
		series.tooltip.background.cornerRadius = 20;
		series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12,12,12,12)
		series.strokeWidth = 3;//толщина линии
		series.stroke = am4core.color("red");
		// Add cursor
		chart.cursor = new am4charts.XYCursor();
		chart.cursor.xAxis = dateAxis;
		chart.cursor.snapToSeries = series;
		// Add save
		chart.exporting.menu = new am4core.ExportMenu();

	}); // end am4core.ready()

	// Функция генерации данных с графика
	function generateChartData() {
			var chartData = [];
			var conc_mark = 0//Концентрация дважды проходит отдно и то же значение
			for (var time = 1; time < 3600; time= time+1) {

					// Вызываем функцию расчета дисперсии
					var conc = Number(concentration_x_control(y=0, z=2, t = time))/1000;

					if (conc<conc_mark) {
						if (conc < 1) break; //Что бы не строить огромные графики
					}

					var conc_mark = conc;


					chartData.push({
							time: time,
							conc: conc.toFixed(3)
					});

			}
			return chartData;
	}

}
//

function draw_graph_time_control() {
	// возьмем значения из полей html
	var Ts = document.getElementById('Ts').value;
	var mass_gas = Number(document.getElementById('mass_gas').value);
	var time_control = Number(document.getElementById('time_control').value);

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_time_control", am4charts.XYChart);
		chart.data = generateChartData();
		// Create axes
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(mass_gas) +
														" кг, тем-ра вещества: " + String(Ts) +
														" град.С, при контролируемом времени: " + String(time_control) +
														" с" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Распределение максимальной концентрации, мг/м3";
		// Create series
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "conc";
		series.dataFields.valueX = "radius";
		series.tooltipText = "{valueY}";
		series.tooltip.pointerOrientation = "vertical";
		series.tooltip.background.cornerRadius = 20;
		series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12,12,12,12)
		series.strokeWidth = 3;//толщина линии
		series.stroke = am4core.color("green");
		// Add cursor
		chart.cursor = new am4charts.XYCursor();
		chart.cursor.xAxis = dateAxis;
		chart.cursor.snapToSeries = series;
		// Add save
		chart.exporting.menu = new am4core.ExportMenu();

	}); // end am4core.ready()

	function generateChartData() {
			var chartData = [];
			var conc_mark = 0//Концентрация дважды проходит отдно и то же значение
			for (var radius = 1; radius < 10000; radius= radius+13) {

					// Вызываем функцию расчета дисперсии
					var conc = Number(concentration_time_control(x_dist=radius, y=0, z=2, t = time_control))/1000;


					if (conc<conc_mark) {
						if (conc < 5) break; //Что бы не строить огромные графики
					}

					var conc_mark = conc;


					chartData.push({
							radius: radius,
							conc: conc.toFixed(3)
					});

			}
			return chartData;
	}

}

// // }
