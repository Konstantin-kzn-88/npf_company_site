ymaps.ready(init);
var myMap;



function alpha(density_init = 6, Vc=1, u_ref = 4) {
	g0 = (9.81 * (density_init - 1.21))/1.21;
	alpha_aprox = (1/2) * Math.log10(g0*Math.pow(Vc,1/3)/Math.pow(u_ref,2))
	return alpha_aprox
}

function beta(alpha_aprox = -0.55, concentration_ratio=0.1) {

	if (concentration_ratio == 0.1) {
		if (alpha_aprox <= -0.44){
			beta_aprox = 0.7;
		} else if (alpha_aprox > -0.44 && alpha_aprox <= 0.43) {
			beta_aprox = 0.26 * alpha_aprox + 0.81;
		} else if (alpha_aprox > 0.43 && alpha_aprox <= 1) {
			beta_aprox = 0.93;
		}
	}

	if (concentration_ratio == 0.05) {
		if (alpha_aprox <= -0.56){
			beta_aprox = 0.85;
		} else if (alpha_aprox > -0.56 && alpha_aprox <= 0.31) {
			beta_aprox = 0.26 * alpha_aprox + 1;
		}  else if (alpha_aprox > 0.31 && alpha_aprox <= 1) {
			beta_aprox = -0.12 * alpha_aprox + 1.12;
		}
	}

	if (concentration_ratio == 0.02) {
		if (alpha_aprox <= -0.66){
			beta_aprox = 0.95;
		} else if (alpha_aprox > -0.66 && alpha_aprox <= 0.32) {
			beta_aprox = 0.36 * alpha_aprox + 1.19;
		}  else if (alpha_aprox > -0.32 && alpha_aprox <= 1) {
			beta_aprox = -0.26 * alpha_aprox + 1.38;
		}
	}

	if (concentration_ratio == 0.01) {
		if (alpha_aprox <= -0.71){
			beta_aprox = 1.15;
		} else if (alpha_aprox > -0.71 && alpha_aprox <= 0.37) {
			beta_aprox = 0.34 * alpha_aprox + 1.39;
		}  else if (alpha_aprox > 0.37 && alpha_aprox <= 1) {
			beta_aprox = -0.38 * alpha_aprox + 1.66;
		}
	}

	if (concentration_ratio == 0.005) {
		if (alpha_aprox <= -0.52){
			beta_aprox = 1.48;
		} else if (alpha_aprox > -0.52 && alpha_aprox <= 0.24) {
			beta_aprox = 0.26 * alpha_aprox + 1.62;
		} else if (alpha_aprox > 0.24 && alpha_aprox <= 1) {
			beta_aprox = -0.30 * alpha_aprox + 1.75;
		}
	}

	if (concentration_ratio == 0.002) {
		if (alpha_aprox <= 0.27){
			beta_aprox = 1.83;
		} else if (alpha_aprox > 0.27 && alpha_aprox <= 1) {
			beta_aprox = -0.32 * alpha_aprox + 1.92;
		}
	}

	if (concentration_ratio == 0.001) {
		if (alpha_aprox <= -0.10){
			beta_aprox = 2.075;
		} else if (alpha_aprox > 0.10 && alpha_aprox <= 1) {
			beta_aprox = -0.27 * alpha_aprox + 2.05;
		}
	}

	return beta_aprox
}

function find_distance(beta_aprox = 1) {
	var u_ref = document.getElementById('u_ref').value;
	var Vc = document.getElementById('Vc').value;
	x_dist = Math.pow(10,beta_aprox) * Math.pow(Vc,1/3);
	return x_dist
}

function find_time(x_dist = 15) {
	var Vc = document.getElementById('Vc').value;
	var density_init = document.getElementById('density_init').value;
	var ds = document.getElementById('ds').value;
	var u_ref = document.getElementById('u_ref').value;
	var time_cloud = 0
	g0 = (9.81 * (density_init - 1.21))/1.21;


	for (time_cloud = 0; time_cloud < 10000; time_cloud = time_cloud+0.01) {
		b_first_eq = Math.sqrt(ds*ds + 1.2*time_cloud * Math.sqrt(g0*Vc));
		b_second_eq = x_dist - 0.4*u_ref*time_cloud;
		err_time = Math.abs(b_first_eq - b_second_eq);
		if (err_time<0.1) {
			b_eq = b_second_eq;
			break;
		}
	}

	return [time_cloud, b_eq]
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
	var time_Data = [];

	var point_concentration = [0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001];
	point_concentration.forEach(function(conc_ratio) {
		g0 = (9.81 * (density_init - 1.21))/1.21;
		alpha_aprox = alpha(density_init, Vc, u_ref);
		beta_aprox = beta(alpha_aprox, conc_ratio);
		x_dist = find_distance(beta_aprox);
		conc_in_dist = density_init*conc_ratio;

		time_arr = find_time(x_dist);
		time_cloud = time_arr[0];
		b_eq = time_arr[1];


		conc_Data.push(conc_in_dist);
		radius_Data.push(x_dist);
		b_param.push(b_eq);
		time_Data.push(time_cloud);

	});

	return [conc_Data, radius_Data, b_param, time_Data];

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
        strokeColor: "#4169E1",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var c_0_001 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1][6]
    ], {
			balloonContent: "Радиус круга - " + (Data[1][6]).toFixed(2) + "м. ",
			hintContent: "0.001 * Сmax = " + (Data[0][6]).toFixed(2) + "кг/м3",
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });


// Добавление объектов на карту ЛКМ
	myMap.geoObjects.add(c_0_001);
	myMap.geoObjects.add(c_0_002);
	myMap.geoObjects.add(c_0_005);
	myMap.geoObjects.add(c_0_01);
	myMap.geoObjects.add(c_0_02);
	myMap.geoObjects.add(c_0_05);
	myMap.geoObjects.add(c_0_1);

// Удаление объектов с карты ПКМ
	myMap.events.add('contextmenu', function (e) {
		myMap.geoObjects.remove(c_0_001);
		myMap.geoObjects.remove(c_0_002);
		myMap.geoObjects.remove(c_0_005);
		myMap.geoObjects.remove(c_0_01);
		myMap.geoObjects.remove(c_0_02);
		myMap.geoObjects.remove(c_0_05);
		myMap.geoObjects.remove(c_0_1);
    });

    });
}
//

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
		dateAxis.title.text = "Расстояние, м. (объем выброса: " + String(Vc) +
														" м3, начальный диаметр облака: " + String(ds) +
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
	b_param = draw_graph_b_param();
	time_cloud = draw_graph_time_cloud();
}


// Функция основного графика (Дисперсия  газа из продолжительного источника)
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
		dateAxis.title.text = "Расстояние, м. (объем выброса: " + String(Vc) +
														" м3, начальный диаметр облака: " + String(ds) +
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
			console.log("b_param"  + b_param);


			b_param.forEach(function(item, i, b_param) {

				chartData.push({
						radius: dist[i],
						b_param: item
				});
			});

			return chartData;
	}
}


function draw_graph_time_cloud() {

	var Vc = document.getElementById('Vc').value;
	var density_init = document.getElementById('density_init').value;
	var ds = document.getElementById('ds').value;
	var u_ref = document.getElementById('u_ref').value;

	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv_time_cloud", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (объем выброса: " + String(Vc) +
														" м3, начальный диаметр облака: " + String(ds) +
														" м)";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Время прохождения облака, с";

		// Указываем данные для графика по осям
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "time_Data";
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
			var time_Data = Data[3];

			time_Data.forEach(function(item, i, time_Data) {

				chartData.push({
						radius: dist[i],
						time_Data: item
				});
			});

			return chartData;
	}
}
