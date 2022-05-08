
// функция расчета испарения ненагретых веществ
// принимает один параметр в виде времени (в секундах)

function evaporation_liquid_calc(time=3600) {
	// возьмем значения из полей html
	var mol_massa = document.getElementById('mol_massa').value;
	var S_spil = document.getElementById('S_spil').value;
	var T_surf = document.getElementById('T_surf').value;
	var T_lpg = document.getElementById('T_lpg').value;
	var wind_speed = document.getElementById('wind_speed').value;

	// Расчет массы испарившегося вещества
	diametr_spill = Math.pow((4*S_spil)/3.14,1/2)
	reinolds = (wind_speed * diametr_spill)/ 1.64e-5

	first_add = ((mol_massa/1000)/13509) * (T_surf-T_lpg)
	second_add = 2 * 1.3 * Math.pow((time/(3.14*7.74e-7)),1/2)
	third_add = 5.1*Math.pow(reinolds,1/2)*time*0.00155/diametr_spill
	intensity = first_add * (second_add + third_add);//кг/(м2)
	console.log(intensity);
	console.log("____________");
	massa_evaporation = intensity * S_spil//кг
	massa_evaporation = massa_evaporation.toFixed(2)
	return massa_evaporation;
};

// Функция основного графика (Доза теплового излучения)
function draw_graph() {
	// возьмем значения из полей html
	var mol_massa = document.getElementById('mol_massa').value;
	var S_spil = document.getElementById('S_spil').value;
	var wind_speed = document.getElementById('wind_speed').value;


	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Время, с. (мол.масса: " + String(mol_massa) +
														" кг/кмоль, площади испарения: " + String(S_spil) +
														" м2, скорость ветра: " + String(wind_speed) + ", м/с)";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Масса испарившегося вещества, кг";

		// Указываем данные для графика по осям
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "massa_evaporation";
		series.dataFields.valueX = "time";
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
			for (var time = 1; time < 3600; time = time + 5) {
					// Вызываем функцию расчета
					var massa_evaporation = evaporation_liquid_calc(time);
					chartData.push({
							time: time,
							massa_evaporation: massa_evaporation
					});
			}
			return chartData;
	}
}
