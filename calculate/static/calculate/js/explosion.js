ymaps.ready(init);
var myMap;

// функция одиночного расчета взрыва
// принимает один параметр в виде радиуса (в метрах)

function explosion_calc(radius=1) {
	// возьмем значения из полей html
	var Qsg = document.getElementById('Qsg').value;
	var massa = document.getElementById('massa').value;
	var z_uch = document.getElementById('z_uch').value;


	// Расчет избыточного давления
	M_pr = (Qsg / 4520) * massa * z_uch;
	d_P = 101.3 *((0.8 * (M_pr ** 0.33)/radius)+(3 * (M_pr **0.66))/(radius ** 2)+(5 * M_pr) / (radius ** 3));

	// Избыточное давление, кПа
	if (d_P > 200) {
		d_P = 200;
	}
	// alert(d_P);

	// impuls - импульс, Па*с
	impuls = (123 * Math.pow(M_pr,0.66))/radius

	// probit - пробит функция (-)
	// probability - вероятость поражения на основе probit
	V = Math.pow(17500/(d_P*1000),8.4)+Math.pow((290/impuls),9.3)
	probit = 5 - 0.26*Math.log(V);
	if (probit > 8.09) {
		probit = 8.09;
		}
	probability = -0.00064545*(probit**6)+0.02327*(probit**5)-0.33495*(probit**4)+2.4406*(probit**3)-9.41*(probit**2)+18.31*(probit**1)-14.156
	if (probability > 1) {
		probability = 1;
		}
	return [impuls, d_P, probit, probability];
};

// Функция генерации данных для отрисовке на карте
function generateData() {
	var Data = [0,0,0,0,0,0];//6-ти значный пустой пустой массив


	for (var radius = 1; radius < 10000; radius++) {
			// Вызываем функцию расчета отненного шара
			var exp_calc = explosion_calc(radius);
			// exp_calc[1] - d_P




			if (exp_calc[1] > 95 && exp_calc[1] < 110) {
			  Data[0] = radius;
			  }
		  if (exp_calc[1] > 52 && exp_calc[1] < 60) {
			  Data[1] = radius;
			  }
			if (exp_calc[1] > 28 && exp_calc[1] < 30) {
				Data[2] = radius;
				}
			if (exp_calc[1] > 12 && exp_calc[1] < 13) {
				Data[3] = radius;
				}
			if (exp_calc[1] > 5 && exp_calc[1] < 6) {
				Data[4] = radius;
				}
			if (exp_calc[1] > 3 && exp_calc[1] < 3.5) {
				Data[5] = radius;
				}
			if (exp_calc[1] < 2.9) break; // (*)
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



		var dP_100 = new ymaps.Circle([
        // Координаты центра круга.
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        // Радиус круга в метрах.
        Data[0]
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: "Радиус круга - " + Data[0] + "м. ",
        // Содержимое хинта.
        hintContent: "Зона полного разрушения зданий (100 кПа)"
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

		var dP_53 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1]
    ], {
        balloonContent: "Радиус круга - " + Data[1] + "м. ",
        hintContent: "50%-ное разрушение зданий (53 кПа)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг рыжий
        strokeColor: "#ff8f43",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var dP_28 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[2]
    ], {
        balloonContent: "Радиус круга - " + Data[2] + "м. ",
        hintContent: "Средние повреждения зданий (28 кПа)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг желтый
        strokeColor: "#ffd700",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });


		var dP_12 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[3]
    ], {
        balloonContent: "Радиус круга - " + Data[3] + "м. ",
        hintContent: "Умеренные повреждения зданий (12 кПа)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#00ffab",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var dP_5 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[4]
    ], {
        balloonContent: "Радиус круга - " + Data[4] + "м. ",
        hintContent: "Нижний порог повреждения человека волной давления (5 кПа)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#0000CD",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var dP_3 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[5]
    ], {
        balloonContent: "Радиус круга - " + Data[5] + "м. ",
        hintContent: "Разбита часть остекления (3 кПа)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#FF00FF",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

// Добавление объектов на карту ЛКМ
	myMap.geoObjects.add(dP_3);
	myMap.geoObjects.add(dP_5);
	myMap.geoObjects.add(dP_12);
	myMap.geoObjects.add(dP_28);
	myMap.geoObjects.add(dP_53);
	myMap.geoObjects.add(dP_100);

// Удаление объектов с карты ПКМ
	myMap.events.add('contextmenu', function (e) {
		myMap.geoObjects.remove(dP_3);
		myMap.geoObjects.remove(dP_5);
		myMap.geoObjects.remove(dP_12);
		myMap.geoObjects.remove(dP_28);
		myMap.geoObjects.remove(dP_53);
		myMap.geoObjects.remove(dP_100);
    });

    });
}


// Функция основного графика (Доза теплового излучения)
function draw_graph() {
	// возьмем значения из полей html
	var Qsg = document.getElementById('Qsg').value;
	var massa = document.getElementById('massa').value;
	var z_uch = document.getElementById('z_uch').value;


	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(massa) +
														" кг, теплота сгорания: " + String(Qsg) +
														" кДж/кг, коэф.участия: " + String(z_uch) + ", -)";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Избыточное давление, кПа";

		// Указываем данные для графика по осям
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "dP";
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
		dead_fire.value = 100;
		dead_fire.grid.stroke = am4core.color("red");
		dead_fire.grid.strokeWidth = 1;
		dead_fire.grid.strokeOpacity = 0.5;
		dead_fire.label.inside = true;
		dead_fire.label.text = "Полное разрушение зданий (100 кПа)";
		dead_fire.label.paddingBottom = "1px"
		dead_fire.label.fill = dead_fire.grid.stroke;
		dead_fire.label.align = "right";
		dead_fire.label.verticalCenter = "bottom";
		//
		let third_burn = valueAxis.axisRanges.create();
		third_burn.value = 53;
		third_burn.grid.stroke = am4core.color("#E69138");
		third_burn.grid.strokeWidth = 1;
		third_burn.grid.strokeOpacity = 0.5;
		third_burn.label.inside = true;
		third_burn.label.text = "50%-ное разрушение зданий (53 кПа)";
		third_burn.label.paddingBottom = "1px"
		third_burn.label.fill = third_burn.grid.stroke;
		third_burn.label.align = "right";
		third_burn.label.verticalCenter = "bottom";
		//
		let second_burn = valueAxis.axisRanges.create();
		second_burn.value = 28;
		second_burn.grid.stroke = am4core.color("#00FFFF");
		second_burn.grid.strokeWidth = 1;
		second_burn.grid.strokeOpacity = 0.5;
		second_burn.label.inside = true;
		second_burn.label.text = "Умеренные повреждения зданий (28 кПа)";
		second_burn.label.paddingBottom = "1px"
		second_burn.label.fill = second_burn.grid.stroke;
		second_burn.label.align = "right";
		second_burn.label.verticalCenter = "bottom";
		//
		let first_burn = valueAxis.axisRanges.create();
		first_burn.value = 5;
		first_burn.grid.stroke = am4core.color("#00FF00");
		first_burn.grid.strokeWidth = 1;
		first_burn.grid.strokeOpacity = 0.5;
		first_burn.label.inside = true;
		first_burn.label.text = "Нижний порог повреждения человека(5 кПа)";
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
					// Вызываем функцию расчета
					var exp_calc = explosion_calc(radius);
					// exp_calc[1] - d_P

					chartData.push({
							radius: radius,
							dP: exp_calc[1]
					});
					if (exp_calc[1] < 2) break; // (*)
			}
			return chartData;
	}

	// вызов дополнительных графиков (в конце чтобы не тормозили основной график)
	draw_probit = draw_graph_probit();
	draw_probability = draw_graph_probability();
}



function draw_graph_probit() {
	// возьмем значения из полей html
	var Qsg = document.getElementById('Qsg').value;
	var massa = document.getElementById('massa').value;
	var z_uch = document.getElementById('z_uch').value;

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_probit", am4charts.XYChart);
		chart.data = generateChartData();
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(massa) +
														" кг, теплота сгорания: " + String(Qsg) +
														" кДж/кг, коэф.участия: " + String(z_uch) + ", -)";

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
				// Вызываем функцию расчета
				var exp_calc = explosion_calc(radius);
				// exp_calc[2] - probit

					chartData.push({
							radius: radius,
							probit: exp_calc[2]
					});
					if (exp_calc[2]  < 0.1) break; // (*)
			}
			return chartData;
	}

}


function draw_graph_probability() {
	// возьмем значения из полей html
	var Qsg = document.getElementById('Qsg').value;
	var massa = document.getElementById('massa').value;
	var z_uch = document.getElementById('z_uch').value;

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_probability", am4charts.XYChart);
		chart.data = generateChartData();
		// Create axes
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (масса: " + String(massa) +
														" кг, теплота сгорания: " + String(Qsg) +
														" кДж/кг, коэф.участия: " + String(z_uch) + ", -)";

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
				// Вызываем функцию расчета
				var exp_calc = explosion_calc(radius);
				// exp_calc[3] - probability
					chartData.push({
							radius: radius,
							probability: exp_calc[3]
					});
					if (exp_calc[3] < 0.05) break; // (*)
			}
			return chartData;
	}

}
