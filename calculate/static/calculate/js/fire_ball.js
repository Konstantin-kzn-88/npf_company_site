ymaps.ready(init);
var myMap;


// function test(rad="start") {
// 	alert(rad);
// 	alert("test");
// 	var end = "end";
// 	return end
//
// }

// функция одиночного расчета огненного шара
// принимает один параметр в виде радиуса (в метрах)

function fire_ball_calc(radius=1) {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var mass_substanse = document.getElementById('mass_substanse').value;

	// Расчет диаметра, высоты и времени существования огненного шара
	D_eff = 5.33 * (mass_substanse ** 0.327);
	H_eff = D_eff / 2;
	t_s = 0.92 * (mass_substanse ** 0.303);

	// Расчет углового коэф.облученности
	Fq = (H_eff/D_eff + 0.5)/(4 * ((((H_eff/D_eff + 0.5) ** 2) + ((radius / D_eff) ** 2)) ** 1.5));
	tay = Math.exp(-7 * (10 **(-4) * (((radius ** 2 + H_eff ** 2) ** (1/2)) - D_eff / 2)));

	// q - интенсивность теплового излучения, кВт/м2
	// Q - доза теплового излучения
	q_ball = E_f * Fq * tay;
	q_ball = q_ball.toFixed(2);
	Q_ball = q_ball * t_s;
	Q_ball = Q_ball.toFixed(2);

	// probit - пробит функция (-)
	// probability - вероятость поражения на основе probit
	probit = -12.8 + 2.56*Math.log(t_s*Math.pow(q_ball,1.33));
	if (probit > 8.09) {
		probit = 8.09;
		}
	probability = -0.00064545*(probit**6)+0.02327*(probit**5)-0.33495*(probit**4)+2.4406*(probit**3)-9.41*(probit**2)+18.31*(probit**1)-14.156
	if (probability > 1) {
		probability = 1;
		}

	return [q_ball, Q_ball, probit, probability];
};

// Функция генерации данных для отрисовке на карте
function generateData() {
	var Data = [0,0,0,0];//четырехзначный пустой пустой массив


	for (var radius = 1; radius < 10000; radius++) {
			// Вызываем функцию расчета отненного шара
			var fb_calc = fire_ball_calc(radius);
			// fb_calc[1] - Q_ball

			if (fb_calc[1] > 595 && fb_calc[1] < 620) {
			  Data[0] = radius;
			  }
		  if (fb_calc[1] > 315 && fb_calc[1] < 330) {
			  Data[1] = radius;
			  }
			if (fb_calc[1] > 215 && fb_calc[1] < 230) {
				Data[2] = radius;
				}
			if (fb_calc[1] > 115 && fb_calc[1] < 130) {
				Data[3] = radius;
				}
			if (fb_calc[1] < 20) break; // (*)
	}

	return Data;

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



		var Q_600 = new ymaps.Circle([
        // Координаты центра круга.
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        // Радиус круга в метрах.
        Data[0]
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: "Радиус круга - " + Data[0] + "м. ",
        // Содержимое хинта.
        hintContent: "Зона смертельного поражения (600 кДж/м2)"
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

		var Q_320 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1]
    ], {
        balloonContent: "Радиус круга - " + Data[1] + "м. ",
        hintContent: "Ожог 3-й степени (320 кДж/кг)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг рыжий
        strokeColor: "#ff8f43",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var Q_220 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[2]
    ], {
        balloonContent: "Радиус круга - " + Data[2] + "м. ",
        hintContent: "Ожог 2-й степени (220 кДж/кг)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг желтый
        strokeColor: "#ffd700",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });


		var Q_120 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[3]
    ], {
        balloonContent: "Радиус круга - " + Data[3] + "м. ",
        hintContent: "Ожог 1-й степени (120 кДж/кг)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#00ffab",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });
// Добавление объектов на карту ЛКМ
	myMap.geoObjects.add(Q_120);
	myMap.geoObjects.add(Q_220);
	myMap.geoObjects.add(Q_320);
	myMap.geoObjects.add(Q_600);

// Удаление объектов с карты ПКМ
	myMap.events.add('contextmenu', function (e) {
		myMap.geoObjects.remove(Q_120);
		myMap.geoObjects.remove(Q_220);
		myMap.geoObjects.remove(Q_320);
		myMap.geoObjects.remove(Q_600);
    });

    });
}


// Функция основного графика (Доза теплового излучения)
function draw_graph() {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var mass_substanse = document.getElementById('mass_substanse').value;


	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(mass_substanse) +
														" кг, Ef: " + String(E_f) +
														" кДж/кг" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Доза теплового излечения, кДж/м2";

		// Указываем данные для графика по осям
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "Q_ball";
		series.dataFields.valueX = "radius";
		series.tooltipText = "{valueY}";//подсказка при hover
		series.tooltip.pointerOrientation = "vertical";
		series.tooltip.background.cornerRadius = 20;
		series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12,12,12,12)
		series.strokeWidth = 3;//толщина линии
		series.stroke = am4core.color("blue");

		// Создаем линии границы перехода зон ПФ
		let dead_fire = valueAxis.axisRanges.create();
		dead_fire.value = 600;
		dead_fire.grid.stroke = am4core.color("red");
		dead_fire.grid.strokeWidth = 1;
		dead_fire.grid.strokeOpacity = 0.5;
		dead_fire.label.inside = true;
		dead_fire.label.text = "Смертельное поражение";
		dead_fire.label.paddingBottom = "1px"
		dead_fire.label.fill = dead_fire.grid.stroke;
		dead_fire.label.align = "right";
		dead_fire.label.verticalCenter = "bottom";

		let third_burn = valueAxis.axisRanges.create();
		third_burn.value = 320;
		third_burn.grid.stroke = am4core.color("#E69138");
		third_burn.grid.strokeWidth = 1;
		third_burn.grid.strokeOpacity = 0.5;
		third_burn.label.inside = true;
		third_burn.label.text = "Ожоги 3-ей степени";
		third_burn.label.paddingBottom = "1px"
		third_burn.label.fill = third_burn.grid.stroke;
		third_burn.label.align = "right";
		third_burn.label.verticalCenter = "bottom";

		let second_burn = valueAxis.axisRanges.create();
		second_burn.value = 220;
		second_burn.grid.stroke = am4core.color("#00FFFF");
		second_burn.grid.strokeWidth = 1;
		second_burn.grid.strokeOpacity = 0.5;
		second_burn.label.inside = true;
		second_burn.label.text = "Ожоги 2-ой степени";
		second_burn.label.paddingBottom = "1px"
		second_burn.label.fill = second_burn.grid.stroke;
		second_burn.label.align = "right";
		second_burn.label.verticalCenter = "bottom";

		let first_burn = valueAxis.axisRanges.create();
		first_burn.value = 120;
		first_burn.grid.stroke = am4core.color("#00FF00");
		first_burn.grid.strokeWidth = 1;
		first_burn.grid.strokeOpacity = 0.5;
		first_burn.label.inside = true;
		first_burn.label.text = "Ожоги 1-ой степени";
		first_burn.label.paddingBottom = "1px"
		first_burn.label.fill = first_burn.grid.stroke;
		first_burn.label.align = "right";
		first_burn.label.verticalCenter = "bottom";
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
			for (var radius = 1; radius < 10000; radius++) {
					// Вызываем функцию расчета отненного шара
					var fb_calc = fire_ball_calc(radius);
					// fb_calc[1] - Q_ball
					chartData.push({
							radius: radius,
							Q_ball: fb_calc[1]
					});
					if (fb_calc[1] < 20) break; // (*)
			}
			return chartData;
	}

	// вызов дополнительных графиков (в конце чтобы не тормозили основной график)
	draw_probit = draw_graph_probit();
	draw_probability = draw_graph_probability();
	draw_q = draw_graph_q();
}



function draw_graph_probit() {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var mass_substanse = document.getElementById('mass_substanse').value;

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_probit", am4charts.XYChart);
		chart.data = generateChartData();
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(mass_substanse) +
														" кг, Ef: " + String(E_f) +
														" кДж/кг" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Пробит-функция, - ";

		// Create series
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "probit";
		series.dataFields.valueX = "radius";
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

	function generateChartData() {
			var chartData = [];
			for (var radius = 1; radius < 10000; radius++) {
					// Вызываем функцию расчета отненного шара
					var fb_calc = fire_ball_calc(radius);
					// fb_calc[2] - probit

					chartData.push({
							radius: radius,
							probit: fb_calc[2]
					});
					if (fb_calc[2]  < 0.1) break; // (*)
			}
			return chartData;
	}

}


function draw_graph_probability() {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var mass_substanse = document.getElementById('mass_substanse').value;

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_probability", am4charts.XYChart);
		chart.data = generateChartData();
		// Create axes
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(mass_substanse) +
														" кг, Ef: " + String(E_f) +
														" кДж/кг" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Вероятность поражения, - ";
		// Create series
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "probability";
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

			for (var radius = 1; radius < 10000; radius++) {
					// Вызываем функцию расчета отненного шара
					var fb_calc = fire_ball_calc(radius);
					// fb_calc[3] - probability
					chartData.push({
							radius: radius,
							probability: fb_calc[3]
					});
					if (fb_calc[3] < 0.05) break; // (*)
			}
			return chartData;
	}

}

function draw_graph_q() {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var mass_substanse = document.getElementById('mass_substanse').value;

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_q", am4charts.XYChart);
		chart.data = generateChartData();
		// Create axes
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(mass_substanse) +
														" кг, Ef: " + String(E_f) +
														" кДж/кг" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Интенсивность излучнеия, кВт/м2";
		// Create series
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "q";
		series.dataFields.valueX = "radius";
		series.tooltipText = "{valueY}";
		series.tooltip.pointerOrientation = "vertical";
		series.tooltip.background.cornerRadius = 20;
		series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12,12,12,12)
		series.strokeWidth = 3;//толщина линии
		series.stroke = am4core.color("#FF4500");
		// Add cursor
		chart.cursor = new am4charts.XYCursor();
		chart.cursor.xAxis = dateAxis;
		chart.cursor.snapToSeries = series;
		// Add save
		chart.exporting.menu = new am4core.ExportMenu();

	}); // end am4core.ready()

	function generateChartData() {

			var chartData = [];

			for (var radius = 1; radius < 10000; radius++) {
					// Вызываем функцию расчета отненного шара
					var fb_calc = fire_ball_calc(radius);
					// fb_calc[3] - probability
					chartData.push({
							radius: radius,
							q: fb_calc[0]
					});
					if (fb_calc[0] < 1) break; // (*)
			}
			return chartData;
	}

}
