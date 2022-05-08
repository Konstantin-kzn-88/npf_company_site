ymaps.ready(init);
var myMap;

// функция одиночного расчета взрыва
// принимает один параметр в виде радиуса (в метрах)

function liquid_fire_calc(radius=1) {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var m_sg = document.getElementById('m_sg').value;
	var S_spill = document.getElementById('S_spill').value;
	var D_eff = (4 * S_spill / 3.14) ** (1/2);



	// Расчет пожара-пролива
	if (radius < (D_eff/2+0.1)) {

		H_eff = 42 * D_eff * ((m_sg / (1.2 * ((9.81 * D_eff)) ** (1/2)))) ** 0.61;
		h= (2 * H_eff) / D_eff;
		S1 = (2 * (D_eff/2+0.1)) / D_eff;
		A =(h ** 2 + S1 ** 2+1)/(2 * S1);
		B =(1+S1 ** 2)/(2 * S1);
		Fv = (1 / 3.14)*((1 / S1) * Math.atan(h /(((S1 ** 2)-1) ** (1 / 2))) + (h / S1) *
										(Math.atan(((S1 - 1) / (S1 + 1)) ** (1 / 2)) - (A /((A**2 - 1) **
										(1 / 2))) * Math.atan((((A + 1)*(S1 - 1))/((A - 1)*(S1 + 1))) ** (1 / 2))))
		Fh = (1/3.14) * (((B - 1 / S1)/(((B ** 2 - 1)) ** (1 / 2))) *
										Math.atan((((B + 1) * (S1 - 1))/((B - 1)*(S1 + 1))) ** (1 / 2)) -
										((A - 1 / S1)/(((A ** 2) -1) ** (1/2))) *
										Math.atan((((A + 1)*(S1 - 1))/((A - 1) * (S1 + 1))) ** (1/2)));
		Fq=(((Fv ** 2) + (Fh ** 2)) ** (1/2));
		tay = Math.exp(-7.0 * (10 ** (-4)) * ((D_eff/2+0.1) - 0.5 * D_eff));
		q_term = Fq * tay * E_f;
		q_term = q_term.toFixed(2);
		// probit - пробит функция (-)
		// probability - вероятость поражения на основе probit
		probit = 8.09;
		probability = 1;

	} else {

		H_eff = 42 * D_eff * ((m_sg / (1.2 * ((9.81 * D_eff)) ** (1/2)))) ** 0.61;
		h= (2 * H_eff) / D_eff;
		S1 = (2 * radius) / D_eff;
		A =(h ** 2 + S1 ** 2+1)/(2 * S1);
		B =(1+S1 ** 2)/(2 * S1);
		Fv = (1 / 3.14)*((1 / S1) * Math.atan(h /(((S1 ** 2)-1) ** (1 / 2))) + (h / S1) *
										(Math.atan(((S1 - 1) / (S1 + 1)) ** (1 / 2)) - (A /((A**2 - 1) **
										(1 / 2))) * Math.atan((((A + 1)*(S1 - 1))/((A - 1)*(S1 + 1))) ** (1 / 2))))

		Fh = (1/3.14) * (((B - 1 / S1)/(((B ** 2 - 1)) ** (1 / 2))) *
										Math.atan((((B + 1) * (S1 - 1))/((B - 1)*(S1 + 1))) ** (1 / 2)) -
										((A - 1 / S1)/(((A ** 2) -1) ** (1/2))) *
										Math.atan((((A + 1)*(S1 - 1))/((A - 1) * (S1 + 1))) ** (1/2)))

		Fq=(((Fv ** 2) + (Fh ** 2)) ** (1/2))
		tay = Math.exp(-7.0 * (10 ** (-4)) * (radius - 0.5 * D_eff))
		q_term = Fq * tay * E_f
		q_term = q_term.toFixed(2);
		t_s = 60;//время неадекватного поведения
		probit = -12.8 + 2.56*Math.log(t_s*Math.pow(q_term,1.33));
		if (probit > 8.09) {
			probit = 8.09;
			}
		probability = -0.00064545*(probit**6)+0.02327*(probit**5)-0.33495*(probit**4)+2.4406*(probit**3)-9.41*(probit**2)+18.31*(probit**1)-14.156
		if (probability > 1) {
			probability = 1;
			}
	}

	return [q_term, probit, probability];
};

// Функция генерации данных для отрисовке на карте
function generateData() {
	var Data = [0,0,0,0,0,0];//6-ти значный пустой пустой массив


	for (var radius = 1; radius < 10000; radius += 0.5) {
		// Вызываем функцию расчета
		var lf_calc = liquid_fire_calc(radius);
		// liquid_fire_calc[0] - q_term

			if (lf_calc[0] > 16 && lf_calc[0] < 18) {
			  Data[0] = radius;
			  }
		  if (lf_calc[0] > 12.8 && lf_calc[0] < 13.5) {
			  Data[1] = radius;
			  }
			if (lf_calc[0] > 10.3 && lf_calc[0] < 11.5) {
				Data[2] = radius;
				}
			if (lf_calc[0] > 6.9 && lf_calc[0] < 8) {
				Data[3] = radius;
				}
			if (lf_calc[0] > 4.0 && lf_calc[0] < 5) {
				Data[4] = radius;
				}
			if (lf_calc[0] > 1.4 && lf_calc[0] < 2.0) {
				Data[5] = radius;
				}
			if (lf_calc[0] < 1.3) break; // (*)
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



		var q_17 = new ymaps.Circle([
        // Координаты центра круга.
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        // Радиус круга в метрах.
        Data[0]
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: "Радиус круга - " + Data[0] + "м. ",
        // Содержимое хинта.
        hintContent: "Воспламенение древесины (17 кВт/м2)"
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

		var q_12 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[1]
    ], {
        balloonContent: "Радиус круга - " + Data[1] + "м. ",
        hintContent: "Воспламенение ГЖ (tвсп=300-350 град.С) (12.9 кВт/м2)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг рыжий
        strokeColor: "#ff8f43",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var q_10 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[2]
    ], {
        balloonContent: "Радиус круга - " + Data[2] + "м. ",
        hintContent: "Ожог 2 степени через 12-16 сек. (10.5 кВт/м2)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг желтый
        strokeColor: "#ffd700",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });


		var q_7 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[3]
    ], {
        balloonContent: "Радиус круга - " + Data[3] + "м. ",
        hintContent: "Ожог 2 степени через 30-40 сек. (7.0 кВт/м2)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#00ffab",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var q_4 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[4]
    ], {
        balloonContent: "Радиус круга - " + Data[4] + "м. ",
        hintContent: "Безопасно для человека в брезентовой одежде (4.2 кВт/м2)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#0000CD",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

		var q_1 = new ymaps.Circle([
        [coords[0].toPrecision(6),  coords[1].toPrecision(6)],
        Data[5]
    ], {
        balloonContent: "Радиус круга - " + Data[5] + "м. ",
        hintContent: "Без негативных последствий в течение длительного времен (1.4 кВт/м2)"
    }, {
        draggable: false,
        fillColor: "#DB709300",//полностью прозрачный круг
        strokeColor: "#FF00FF",
        strokeOpacity: 0.8,
        strokeWidth: 5
    });

// Добавление объектов на карту ЛКМ
	myMap.geoObjects.add(q_1);
	myMap.geoObjects.add(q_4);
	myMap.geoObjects.add(q_7);
	myMap.geoObjects.add(q_10);
	myMap.geoObjects.add(q_12);
	myMap.geoObjects.add(q_17);

// Удаление объектов с карты ПКМ
	myMap.events.add('contextmenu', function (e) {
		myMap.geoObjects.remove(q_1);
		myMap.geoObjects.remove(q_4);
		myMap.geoObjects.remove(q_7);
		myMap.geoObjects.remove(q_10);
		myMap.geoObjects.remove(q_12);
		myMap.geoObjects.remove(q_17);
    });

    });
}


// Функция основного графика (Доза теплового излучения)
function draw_graph() {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var m_sg = document.getElementById('m_sg').value;
	var S_spill = document.getElementById('S_spill').value;


	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (площадь: " + String(S_spill) +
														" м2, Ef: " + String(E_f) +
														" кВт/м2" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Интенсивность теплового излучения, кВт/м2";

		// Указываем данные для графика по осям
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "q_term";
		series.dataFields.valueX = "radius";
		series.tooltipText = "{valueY}";//подсказка при hover
		series.tooltip.pointerOrientation = "vertical";
		series.tooltip.background.cornerRadius = 20;
		series.tooltip.background.fillOpacity = 0.5;
		series.tooltip.label.padding(12,12,12,12)
		series.strokeWidth = 3;//толщина линии
		series.stroke = am4core.color("blue");

		// Создаем линии границы перехода зон ПФ
		let q_17kW = valueAxis.axisRanges.create();
		q_17kW.value = 17;
		q_17kW.grid.stroke = am4core.color("red");
		q_17kW.grid.strokeWidth = 1;
		q_17kW.grid.strokeOpacity = 0.5;
		q_17kW.label.inside = true;
		q_17kW.label.text = "Воспламенение древесины, 17 кВт/м2";
		q_17kW.label.paddingBottom = "1px"
		q_17kW.label.fill = q_17kW.grid.stroke;
		q_17kW.label.align = "right";
		q_17kW.label.verticalCenter = "bottom";
		//
		let q_12kW = valueAxis.axisRanges.create();
		q_12kW.value = 12.9;
		q_12kW.grid.stroke = am4core.color("#E69138");
		q_12kW.grid.strokeWidth = 1;
		q_12kW.grid.strokeOpacity = 0.5;
		q_12kW.label.inside = true;
		q_12kW.label.text = "Воспламенение древесины (через 15 мин.), 12.9 кВт/м2";
		q_12kW.label.paddingBottom = "1px"
		q_12kW.label.fill = q_12kW.grid.stroke;
		q_12kW.label.align = "right";
		q_12kW.label.verticalCenter = "bottom";
		//
		let q_10kW = valueAxis.axisRanges.create();
		q_10kW.value = 10.5;
		q_10kW.grid.stroke = am4core.color("#00FFFF");
		q_10kW.grid.strokeWidth = 1;
		q_10kW.grid.strokeOpacity = 0.5;
		q_10kW.label.inside = true;
		q_10kW.label.text = "Ожог 2-й степени через 12-16с, 10.5кВт/м2";
		q_10kW.label.paddingBottom = "1px"
		q_10kW.label.fill = q_10kW.grid.stroke;
		q_10kW.label.align = "right";
		q_10kW.label.verticalCenter = "bottom";
		//
		let q_7kW = valueAxis.axisRanges.create();
		q_7kW.value = 7.0;
		q_7kW.grid.stroke = am4core.color("#00FF00");
		q_7kW.grid.strokeWidth = 1;
		q_7kW.grid.strokeOpacity = 0.5;
		q_7kW.label.inside = true;
		q_7kW.label.text = "Ожог 2-й степени через 30-40с, 7.0кВт/м2";
		q_7kW.label.paddingBottom = "1px"
		q_7kW.label.fill = q_7kW.grid.stroke;
		q_7kW.label.align = "right";
		q_7kW.label.verticalCenter = "bottom";
		//
		let q_4kW = valueAxis.axisRanges.create();
		q_4kW.value = 4.2;
		q_4kW.grid.stroke = am4core.color("#808000");
		q_4kW.grid.strokeWidth = 1;
		q_4kW.grid.strokeOpacity = 0.5;
		q_4kW.label.inside = true;
		q_4kW.label.text = "Безопасно в брезентовой одежде, 4.2кВт/м2";
		q_4kW.label.paddingBottom = "1px"
		q_4kW.label.fill = q_4kW.grid.stroke;
		q_4kW.label.align = "left";
		q_4kW.label.verticalCenter = "bottom";
		//
		let q_1kW = valueAxis.axisRanges.create();
		q_1kW.value = 1.4;
		q_1kW.grid.stroke = am4core.color("#FF8C00");
		q_1kW.grid.strokeWidth = 1;
		q_1kW.grid.strokeOpacity = 0.5;
		q_1kW.label.inside = true;
		q_1kW.label.text = "Без негативных последствий, 1.4кВт/м2";
		q_1kW.label.paddingBottom = "1px"
		q_1kW.label.fill = q_1kW.grid.stroke;
		q_1kW.label.align = "left";
		q_1kW.label.verticalCenter = "bottom";
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
			for (var radius = 1; radius < 10000; radius += 0.5) {
				// Вызываем функцию расчета
				var lf_calc = liquid_fire_calc(radius);
				// liquid_fire_calc[0] - q_term

					chartData.push({
							radius: radius,
							q_term: lf_calc[0]
					});
					if (lf_calc[0] < 1.2) break; // (*)
			}
			return chartData;
	}

	// вызов дополнительных графиков (в конце чтобы не тормозили основной график)
	draw_probit = draw_graph_probit();
	draw_probability = draw_graph_probability();
}



function draw_graph_probit() {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var m_sg = document.getElementById('m_sg').value;
	var S_spill = document.getElementById('S_spill').value;

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_probit", am4charts.XYChart);
		chart.data = generateChartData();
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (площадь: " + String(S_spill) +
														" м2, Ef: " + String(E_f) +
														" кВт/м2" + ")";

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
			for (var radius = 1; radius < 10000; radius += 0.5) {
				// Вызываем функцию расчета
				var lf_calc = liquid_fire_calc(radius);
				// lf_calc[1] - probit

					chartData.push({
							radius: radius,
							probit: lf_calc[1]
					});
					if (lf_calc[1]  < 0.15) break; // (*)
			}
			return chartData;
	}

}


function draw_graph_probability() {
	// возьмем значения из полей html
	var E_f = document.getElementById('E_f').value;
	var m_sg = document.getElementById('m_sg').value;
	var S_spill = document.getElementById('S_spill').value;

	am4core.ready(function() {

		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv_probability", am4charts.XYChart);
		chart.data = generateChartData();
		// Create axes
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (площадь: " + String(S_spill) +
														" м2, Ef: " + String(E_f) +
														" кВт/м2" + ")";

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

			for (var radius = 1; radius < 10000; radius += 0.5) {
				// Вызываем функцию расчета
				var lf_calc = liquid_fire_calc(radius);
				// lf_calc[2] - probability
					chartData.push({
							radius: radius,
							probability: lf_calc[2]
					});
					if (lf_calc[2] < 0.05) break; // (*)
			}
			return chartData;
	}

}
