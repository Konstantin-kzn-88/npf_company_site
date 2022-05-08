
function Selected(a) {
  var label = a.value;
    if (label=="gas") {
       document.getElementById("gamma_div").style.display='block';
   } else {
       document.getElementById("gamma_div").style.display='none';
   }
}


// функция одиночного расчета расхода
// принимает один параметр в виде отверстия (в миллиметрах)

function flow_rate_calc(diametr_hole=10) {
  var gravity = 9.81 //ускорение свободного падения  9.81м/с2
  var P_atm = 0.101325 //атмосферное давление
	// возьмем значения из полей html
	var pressure = document.getElementById('pressure').value;
	var density = document.getElementById('density').value;

	var rad=document.getElementsByName('type_phase');//rad - radiobutton
	var type_phase = null;
	for (var i=0;i<rad.length; i++) {
			if (rad[i].checked) {
				if (i == 0) {
					var type_phase = 0;//liguid
				} else {
					var type_phase = 1;//gas
          var gamma_gas = Number(document.getElementById('gamma_gas').value);
				}
			}
	}

  if (type_phase == 0) { //true - calc liguid

    Ahol = (1/4)*3.14 * ((diametr_hole/1000)**2);
    flow_rate = 0.6 * density * Ahol * ((((2*pressure*(10**6))/density)+(2*gravity*0))**(1/2))
  } else {// - calc gas

    A_hol = (1/4)*3.14 * ((diametr_hole/1000)**2);
    if (P_atm/pressure >= ((2/(gamma_gas+1))**(gamma_gas/(gamma_gas-1)))) {
      //('Докритическое истечение')
      pressure = pressure * (Math.pow(10,6))// MPa -> Pa
      P_atm = P_atm * (Math.pow(10,6))
      flow_rate = Number(0.8 * A_hol * (pressure * density * (2*gamma_gas/(gamma_gas-1)) *
                                                          ((P_atm/pressure)**(2/gamma_gas)) *
                                                          (1-(P_atm/pressure)**((gamma_gas-1)/gamma_gas)))**(1/2))
    } else {
      //('Сверхкритическое истечение')
      pressure = pressure * (Math.pow(10,6))// MPa -> Pa
      P_atm = P_atm * (Math.pow(10,6))
      flow_rate = Number(0.8 * A_hol *
                             ((pressure*density*gamma_gas *
                               ((2/(gamma_gas+1))**((gamma_gas+1)/(gamma_gas-1))))**(1/2)))
    }
  }


  return flow_rate;

};


// Функция основного графика (Расход)
function draw_graph() {
  // возьмем значения из полей html
	var pressure = document.getElementById('pressure').value;
	var density = document.getElementById('density').value;
  var diametr_hole = document.getElementById('diametr_hole').value;

	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData(diametr_hole);
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Диаметр, мм. (P= " + String(pressure) +
														" МПа, плотность=: " + String(density) +
														" кг/м3)";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Расход кг/с";

		// Указываем данные для графика по осям
		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "flow_rate";
		series.dataFields.valueX = "diametr_hole";
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
	function generateChartData(diametr_hole=10) {
			var chartData = [];
      range_diametr = Number(diametr_hole)+(0.5*diametr_hole);
			for (var d_hole = 5; d_hole < (range_diametr); d_hole++) {
					// Вызываем функцию расчета
					var fr_calc = Number(flow_rate_calc(d_hole));
          fr_calc = fr_calc.toFixed(2);
					chartData.push({
							diametr_hole: d_hole,
							flow_rate: fr_calc
					});
			}
			return chartData;
	}
}
