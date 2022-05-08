ymaps.ready(init);
var myMap;


function alpha(density_init = 6, Vc=1, u_ref = 4) {
	g0 = (9.81 * (density_init - 1.21))/1.21;
	alpha_aprox = (1/5) * Math.log10(g0*g0*Vc/Math.pow(u_ref,5))
	return alpha_aprox
}

function beta(alpha_aprox = -0.55, concentration_ratio=0.1) {

	if (concentration_ratio == 0.1) {
		if (alpha_aprox <= -0.55){
			beta_aprox = 1.75;
		} else if (alpha_aprox > -0.55 && alpha_aprox <= -0.14) {
			beta_aprox = 0.24 * alpha_aprox + 1.88;
		} else if (alpha_aprox > -0.14 && alpha_aprox <= 1) {
			beta_aprox = 0.5 * alpha_aprox + 1.78;
		}
	}

	if (concentration_ratio == 0.05) {
		if (alpha_aprox <= -0.68){
			beta_aprox = 1.92;
		} else if (alpha_aprox > -0.68 && alpha_aprox <= -0.29) {
			beta_aprox = 0.36 * alpha_aprox + 2.16;
		} else if (alpha_aprox > -0.29 && alpha_aprox <= -0.18) {
			beta_aprox = 2.06;
		} else if (alpha_aprox > -0.18 && alpha_aprox <= 1) {
			beta_aprox = 0.56 * alpha_aprox + 1.96;
		}
	}

	if (concentration_ratio == 0.02) {
		if (alpha_aprox <= -0.69){
			beta_aprox = 2.08;
		} else if (alpha_aprox > -0.69 && alpha_aprox <= -0.31) {
			beta_aprox = 0.45 * alpha_aprox + 2.39;
		} else if (alpha_aprox > -0.31 && alpha_aprox <= -0.16) {
			beta_aprox = 2.25;
		} else if (alpha_aprox > -0.16 && alpha_aprox <= 1) {
			beta_aprox = 0.54 * alpha_aprox + 2.16;
		}
	}

	if (concentration_ratio == 0.01) {
		if (alpha_aprox <= -0.70){
			beta_aprox = 2.25;
		} else if (alpha_aprox > -0.70 && alpha_aprox <= -0.29) {
			beta_aprox = 0.49 * alpha_aprox + 2.59;
		} else if (alpha_aprox > -0.29 && alpha_aprox <= -0.20) {
			beta_aprox = 2.45;
		} else if (alpha_aprox > -0.20 && alpha_aprox <= 1) {
			beta_aprox = 0.52 * alpha_aprox + 2.35;
		}
	}

	if (concentration_ratio == 0.005) {
		if (alpha_aprox <= -0.67){
			beta_aprox = 2.40;
		} else if (alpha_aprox > -0.67 && alpha_aprox <= -0.28) {
			beta_aprox = 0.59 * alpha_aprox + 2.80;
		} else if (alpha_aprox > -0.28 && alpha_aprox <= -0.15) {
			beta_aprox = 2.63;
		} else if (alpha_aprox > -0.15 && alpha_aprox <= 1) {
			beta_aprox = 0.49 * alpha_aprox + 2.56;
		}
	}

	if (concentration_ratio == 0.002) {
		if (alpha_aprox <= -0.69){
			beta_aprox = 2.60;
		} else if (alpha_aprox > -0.69 && alpha_aprox <= -0.25) {
			beta_aprox = 0.39 * alpha_aprox + 2.87;
		} else if (alpha_aprox > -0.25 && alpha_aprox <= -0.13) {
			beta_aprox = 2.77;
		} else if (alpha_aprox > -0.13 && alpha_aprox <= 1) {
			beta_aprox = 0.50 * alpha_aprox + 2.71;
		}
	}

	return beta_aprox
}

function find_distance(beta_aprox = 1) {
	var u_ref = document.getElementById('u_ref').value;
	var Vc = document.getElementById('Vc').value;
	x_dist = Math.pow(10,beta_aprox) * Math.pow(Vc/u_ref,0.5);
	return x_dist
}

function draw_graph() {
	var Vc = document.getElementById('Vc').value;
	var density_init = document.getElementById('density_init').value;
	var ds = document.getElementById('ds').value;
	var u_ref = document.getElementById('u_ref').value;

	g0 = (9.81 * (density_init - 1.21))/1.21;
	eq_for_diagramm = Math.pow(Math.pow(g0,2)*Vc/Math.pow(u_ref,5),1/5)

	alpha_aprox = alpha(density_init, Vc, u_ref);
	beta_aprox = beta(alpha_aprox, 0.1);
	x = find_distance(beta_aprox);
}

// Функция генерации данных для отрисовке на карте
function generateData() {
	var Vc = document.getElementById('Vc').value;
	var density_init = document.getElementById('density_init').value;
	var ds = document.getElementById('ds').value;
	var u_ref = document.getElementById('u_ref').value;
	var conc_Data = [];
	var radius_Data = [];
	var b_param = [];

	var point_concentration = [0.1, 0.05, 0.02, 0.01, 0.005, 0.002];
	point_concentration.forEach(function(conc_ratio) {
		g0 = (9.81 * (density_init - 1.21))/1.21;
		alpha_aprox = alpha(density_init, Vc, u_ref);
		beta_aprox = beta(alpha_aprox, conc_ratio);
		x_dist = find_distance(beta_aprox);
		conc_in_dist = density_init*conc_ratio;
		l_b = g0*Vc/Math.pow(u_ref,3)
		widht_plume = 2 * ds + 8 * l_b + 2.5 * Math.pow(l_b,1/3) * Math.pow(x_dist,2/3);
		conc_Data.push(conc_in_dist);
		radius_Data.push(x_dist);
		b_param.push(widht_plume);
	});

	return [conc_Data, radius_Data, b_param];

};


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

		var c_0_1 = new ymaps.Circle([
        // Координаты центра круга.
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        // Радиус круга в метрах.
        Data[1][0]
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: "Радиус круга - " + (Data[1][0]).toFixed(2) + "м. ",
        // Содержимое хинта.
        hintContent: "0.1 * Сmax = " + (Data[0][0]).toFixed(2) + "кг/м3",
    }, {
        // Задаем опции круга.
        // Включаем возможность перетаскивания круга.
        draggable: false,
        // Цвет заливки.
        // Последний байт (77) определяет прозрачность.
        // Прозрачность заливки также можно задать используя опцию "fillOpacity".
        fillColor: "#DB709300",//полностью прозрачный круг
        // Цвет обводки - красный.
        strokeColor: "#FF0000",
        // Прозрачность обводки.
        strokeOpacity: 0.8,
        // Ширина обводки в пикселях.
        strokeWidth: 5
    });

		var c_0_05 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1][1]
    ], {
        balloonContent: "Радиус круга - " + (Data[1][1]).toFixed(2) + "м. ",
        hintContent: "0.05 * Сmax = " + (Data[0][1]).toFixed(2) + "кг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг рыжий
        strokeColor: "#FA8072",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var c_0_02 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1][2]
    ], {
        balloonContent: "Радиус круга - " + (Data[1][2]).toFixed(2) + "м. ",
        hintContent: "0.02 * Сmax = " + (Data[0][2]).toFixed(2) + "кг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг желтый
        strokeColor: "#FFA500",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });


		var c_0_01 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1][3]
    ], {
			balloonContent: "Радиус круга - " + (Data[1][3]).toFixed(2) + "м. ",
			hintContent: "0.01 * Сmax = " + (Data[0][3]).toFixed(2) + "кг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#FFFF00",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var c_0_005 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1][4]
    ], {
			balloonContent: "Радиус круга - " + (Data[1][4]).toFixed(2) + "м. ",
			hintContent: "0.005 * Сmax = " + (Data[0][4]).toFixed(2) + "кг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#00FFFF",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var c_0_002 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1][5]
    ], {
			balloonContent: "Радиус круга - " + (Data[1][5]).toFixed(2) + "м. ",
			hintContent: "0.002 * Сmax = " + (Data[0][5]).toFixed(2) + "кг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

// Добавление объектов на карту ЛКМ
	myMap.geoObjects.add(c_0_002);
	myMap.geoObjects.add(c_0_005);
	myMap.geoObjects.add(c_0_01);
	myMap.geoObjects.add(c_0_02);
	myMap.geoObjects.add(c_0_05);
	myMap.geoObjects.add(c_0_1);

// Удаление объектов с карты ПКМ
	myMap.events.add('contextmenu', function (e) {
		myMap.geoObjects.remove(c_0_002);
		myMap.geoObjects.remove(c_0_005);
		myMap.geoObjects.remove(c_0_01);
		myMap.geoObjects.remove(c_0_02);
		myMap.geoObjects.remove(c_0_05);
		myMap.geoObjects.remove(c_0_1);
    });

    });
}


// Функция основного графика (Дисперсия легкого газа из продолжительного источника)
function draw_graph() {

	var Vc = document.getElementById('Vc').value;
	var density_init = document.getElementById('density_init').value;
	var ds = document.getElementById('ds').value;
	var u_ref = document.getElementById('u_ref').value;

	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (расход: " + String(Vc) +
														" кг/с, диаметр выброса: " + String(ds) +
														" м)";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Распределение максимальной концентрации, кг/м3";

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
		series.tensionX = 0.8;
		series.tensionY = 0.8;

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
			var Data = generateData();

			var dist = Data[1];
			var conc = Data[0];


			conc.forEach(function(item, i, conc) {
				chartData.push({
						radius: dist[i],
						conc: item
				});
			});

			return chartData;
	}

	// вызов дополнительных графиков (в конце чтобы не тормозили основной график)
	draw_probit = draw_graph_b_param();
	// draw_probability = draw_graph_probability();
	// draw_q = draw_graph_q();
}


// Функция основного графика (Дисперсия легкого газа из продолжительного источника)
function draw_graph_b_param() {

	var Vc = document.getElementById('Vc').value;
	var density_init = document.getElementById('density_init').value;
	var ds = document.getElementById('ds').value;
	var u_ref = document.getElementById('u_ref').value;

	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv_b_param", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (расход: " + String(Vc) +
														" кг/с, диаметр выброса: " + String(ds) +
														" м)";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Ширина выброса, м";

		// Указываем данные для графика по осям
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "b_param";
		series.dataFields.valueX = "radius";
		series.tooltipText = "{valueY}";//подсказка при hover
		series.tooltip.pointerOrientation = "vertical";
		series.tooltip.background.cornerRadius = 20;
		series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12,12,12,12)
		series.strokeWidth = 3;//толщина линии
		series.stroke = am4core.color("blue");
		series.tensionX = 0.8;//плавный график
		series.tensionY = 0.8;

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
			var Data = generateData();

			var dist = Data[1];
			var b_param = Data[2];


			b_param.forEach(function(item, i, b_param) {

				chartData.push({
						radius: dist[i],
						b_param: item
				});
			});

			return chartData;
	}
}

// // }
