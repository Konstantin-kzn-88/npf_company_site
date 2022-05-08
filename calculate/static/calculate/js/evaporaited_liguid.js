
// функция расчета испарения ненагретых веществ
// принимает один параметр в виде времени (в секундах)

function evaporation_liquid_calc(time=900) {
	// возьмем значения из полей html
	var Pn = document.getElementById('Pn').value;
	var mol_massa = document.getElementById('mol_massa').value;
	var S_spil = document.getElementById('S_spil').value;


	// Расчет массы испарившегося вещества
	intensity = Math.pow(10,-6) * Pn * Math.pow(mol_massa, 1/2);//кг/(с*м2)
	massa_evaporation = intensity * S_spil * time //кг
	massa_evaporation = massa_evaporation.toFixed(2)
	return massa_evaporation;
};

// Функция основного графика (Доза теплового излучения)
function draw_graph() {
	// возьмем значения из полей html
	var Pn = document.getElementById('Pn').value;
	var mol_massa = document.getElementById('mol_massa').value;
	var S_spil = document.getElementById('S_spil').value;


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
														" м2, давление пара: " + String(Pn) + ", кПа)";

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
					var massa_evaporation = Number(evaporation_liquid_calc(time));
          massa_evaporation = massa_evaporation.toFixed(2);
					chartData.push({
							time: time,
							massa_evaporation: massa_evaporation
					});
			}
			return chartData;
	}
}
