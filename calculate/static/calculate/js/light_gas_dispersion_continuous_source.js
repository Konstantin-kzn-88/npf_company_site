ymaps.ready(init);
var myMap;



function func_a_b(x_dist=10, stability_class="F") {
	if (stability_class == "A") {
		if (x_dist<100) {
		  a = 122.8;
			b = 0.94470;
		} else if (x_dist >= 100 && x_dist <= 150) {
			a = 158.08;
			b = 1.05420;
		} else if (x_dist >= 151 && x_dist <= 200) {
			a = 170.22;
			b = 1.09320;
		} else if (x_dist >= 201 && x_dist <= 250) {
			a = 179.52;
			b = 1.12620;
		} else if (x_dist >= 251 && x_dist <= 300) {
			a = 217.41;
			b = 1.26440;
		} else if (x_dist >= 301 && x_dist <= 400) {
			a = 258.89;
			b = 1.40940;
		} else if (x_dist >= 401 && x_dist <= 500) {
			a = 346.75;
			b = 1.7283;
		} else if (x_dist >= 501 && x_dist <= 3110) {
			a = 453.85;
			b = 2.11660;
		} else if (x_dist >= 3110) {
			a = 0;
			b = 0;
		}
	} else if (stability_class == "B") {
		if (x_dist<210) {
			a = 90.673;
			b = 0.93196;
		} else if (x_dist >= 211 && x_dist <= 400) {
			a = 98.483;
			b = 0.98332;
		} else if (x_dist >= 401) {
			a = 109.3;
			b = 1.09710;
		}

	} else if (stability_class == "C") {
		a = 61.141;
		b = 0.91465;
	} else if (stability_class == "D") {
		if (x_dist<310) {
		  a = 34.459;
			b = 0.86974;
		} else if (x_dist >= 310 && x_dist <= 1000) {
			a = 32.093;
			b = 0.81066;
		} else if (x_dist >= 1000 && x_dist <= 3000) {
			a = 32.093;
			b = 0.64403;
		} else if (x_dist >= 3001 && x_dist < 30000) {
			a = 36.650;
			b = 0.56589;
		} else if (x_dist >= 30001) {
			a = 44.053;
			b = 0.51179;
		}
	} else if (stability_class == "E") {
		if (x_dist<100) {
		  a = 24.260;
			b = 0.83660;
		} else if (x_dist >= 101 && x_dist <= 300) {
			a = 23.331;
			b = 0.81956;
		} else if (x_dist >= 301 && x_dist <= 1000) {
			a = 21.628;
			b = 0.75660;
		} else if (x_dist >= 1001 && x_dist < 2000) {
			a = 21.628;
			b = 0.63077;
		} else if (x_dist >= 2001 && x_dist < 4000) {
			a = 22.540;
			b = 0.57154;
		} else if (x_dist >= 4001 && x_dist < 10000) {
			a = 24.703;
			b = 0.50527;
		} else if (x_dist >= 10001 && x_dist < 20000) {
			a = 26.970;
			b = 0.46713;
		} else if (x_dist >= 20001 && x_dist < 40000) {
			a = 34.420;
			b = 0.37615;
		} else if (x_dist >= 40001) {
			a = 47.618;
			b = 0.29592;
		}
	} else if (stability_class == "F") {
		if (x_dist<200) {
		  a = 15.209;
			b = 0.81558;
		} else if (x_dist >= 201 && x_dist <= 700) {
			a = 14.457;
			b = 0.78407;
		} else if (x_dist >= 701 && x_dist <= 1000) {
			a = 13.953;
			b = 0.68465;
		} else if (x_dist >= 1001 && x_dist < 2000) {
			a = 13.953;
			b = 0.63227;
		} else if (x_dist >= 2001 && x_dist < 3000) {
			a = 14.823;
			b = 0.54503;
		} else if (x_dist >= 3001 && x_dist < 7000) {
			a = 16.187;
			b = 0.46490;
		} else if (x_dist >= 7001 && x_dist < 15000) {
			a = 17.836;
			b = 0.41507;
		} else if (x_dist >= 15001 && x_dist < 30000) {
			a = 22.651;
			b = 0.32681;
		} else if (x_dist >= 30001 && x_dist < 60000) {
			a = 27.074;
			b = 0.27436;
		} else if (x_dist >= 60001) {
			a = 34.219;
			b = 0.21716;
		}
	}

	return [a, b];
}

function func_c_h(stability_class="F") {
	if (stability_class == "A") {
		c = 24.1670;
		d = 2.5334;
		e = 0.32;
		f = 0.24;
		g = 0.001;
		h = 0.5;
	} else if (stability_class == "B") {
		c = 18.3330;
		d = 1.8096;
		e = 0.32;
		f = 0.24;
		g = 0.001;
		h = 0.5;
	} else if (stability_class == "C") {
		c = 12.5000;
		d = 1.0857;
		e = 0.22;
		f = 0.20;
		g = 0;
		h = 0;
	} else if (stability_class == "D") {
		c = 8.3330;
		d = 0.7238;
		e = 0.16;
		f = 0.14;
		g = 0.0003;
		h = -0.5;
	} else if (stability_class == "E") {
		c = 6.2500;
		d = 0.5428;
		e = 0.11;
		f = 0.08;
		g = 0.0015;
		h = -0.05;
	} else if (stability_class == "F") {
		c = 4.1667;
		d = 0.3619;
		e = 0.11;
		f = 0.08;
		g = 0.0015;
		h = -0.05;
	}
	return [c,d,e,f,g,h]
}

function plume_raise(x_dist=10) {
	// возьмем значения из полей html
	var u_ref = document.getElementById('u_ref').value;
	var Ta = document.getElementById('Ta').value;
	Ta = Number(Ta) + 273
	var Ts = document.getElementById('Ts').value;
	Ts = Number(Ts) + 273
	var ds = document.getElementById('ds').value;
	var hs = document.getElementById('hs').value;
	var vs = document.getElementById('vs').value;
	var rad=document.getElementsByName('times_of_day');
	var z_ref = 10 //m
	var times_of_day = 0

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
	// console.log(us)

	//effective stack height, m
	if (vs/us<1.5) {
		hs_eff = Number(hs) + 2*ds*((vs/us)-1.5)
	} else {
		hs_eff = Number(hs);
	}
	// console.log(hs_eff)
	// console.log(stability_class)

	//a) Plume Rise Because of Buoyancy or Momentum

	//Equations for Selecting Plume Rise Because of Buoyancy or Momentum
	if (stability_class == "A" || stability_class == "B" || stability_class == "C" || stability_class == "D") {
		// console.log("1")
		Fb = 9.81 * vs * Math.pow(ds,2) * ((Ts-Ta)/(4*Ts))
		if (Fb < 55) {
			delta_Ts = 0.0297*Ts * Math.pow(vs/Math.pow(ds,2),1/3)
		} else {
			delta_Ts = 0.00575*Ts * Math.pow(vs/Math.pow(ds,2),1/3);
		}
	} else if (stability_class == "E" || stability_class == "F") {
		if (stability_class == "E") {
			diff_tetta = 0.02*(9.81/Ta);
			delta_Ts = 0.019582*Ts*vs*Math.sqrt(diff_tetta);
		} else if (stability_class == "F") {
			// console.log("2")
			diff_tetta = 9.81*0.035/Ta;
			delta_Ts = 0.019582*Ts*vs*Math.sqrt(diff_tetta)

			// console.log(diff_tetta)
			// console.log(Ta)
		}
	}
	// console.log(delta_Ts)

	//b) Distance of Maximum Plume Rise
	//Equations for Calculating Distance, x f , of Maximum Plume Rise
	//Unstable (A,B,C) or Neutral (D) Conditions
	if (stability_class == "A" || stability_class == "B" || stability_class == "C" || stability_class == "D") {

		Fb = 9.81 * vs * Math.pow(ds,2) * ((Ts-Ta)/(4*Ts))
		if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates

			if (Fb < 55) {
				hf = 49 * Math.pow(Fb,5/8);
			} else {
				hf = 119 * Math.pow(Fb,2/5);
			}
		} else { //momentum dominates
			if (Fb == 0) {
				xf = 4 * ds * Math.pow(vs * 3 * us,2)/(vs*us);
			} else if (Fb < 55 && Fb != 0) {
				hf = 49 * Math.pow(Fb,5/8);
			} else if (Fb >= 55 && Fb != 0) {
				hf = 119 * Math.pow(Fb,2/5);
			}
		}
	} else if (stability_class == "E" || stability_class == "F") {
			if (stability_class == "E") {
				if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates
					diff_tetta = 0.02*(9.81/Ta);
					hf = 2.0715*us/Math.sqrt(diff_tetta);
				} else if ((Ts-Ta)<delta_Ts) {
					diff_tetta = 0.02*(9.81/Ta);
					hf = 0.5*3.14*us/Math.sqrt(diff_tetta);;
				}
			}
			if (stability_class == "F") {
				if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates
					diff_tetta = 9.81*0.035/Ta;
					hf = 2.0715*us/Math.sqrt(diff_tetta);
				} else if ((Ts-Ta)<delta_Ts) {
					diff_tetta = 9.81*0.035/Ta;
					hf = 0.5*3.14*us/Math.sqrt(diff_tetta);;
				}
			}
	}
	// console.log(hf)



	//Equations for Gradual and Final Plume Rise


	//Gradual or Final plume rise
	if (x_dist<hf) {
		//Gradual plume rise (rise until distance x f )
		if (stability_class == "A" || stability_class == "B" || stability_class == "C" || stability_class == "D") {


			if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates
				Fb = 9.81 * vs * Math.pow(ds,2) * ((Ts-Ta)/(4*Ts));
				he_dist = hs_eff + 1.6*((Fb*x_dist*x_dist)**(1/3))/us;

			} else { //momentum dominates
				beta_j = (1/3) + (us/vs)
				Fm = Math.pow(vs,2) * Math.pow(ds,2) * (Ta/(4*Ts));
				he_dist = hs_eff + 1.6*Math.pow(3*Fm*x_dist/(Math.pow(beta_j,2)*Math.pow(us,2)),1/3);
			}
		} else if (stability_class == "E" || stability_class == "F") {
				if (stability_class == "E") {
					if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates
						Fb = 9.81 * vs * Math.pow(ds,2) * ((Ts-Ta)/(4*Ts));
						he_dist = hs_eff + 1.6*((Fb*x_dist*x_dist)**(1/3))/us;
					} else if ((Ts-Ta)<delta_Ts) {
						beta_j = (1/3) + (us/vs);
						Fm = Math.pow(vs,2) * Math.pow(ds,2) * (Ta/(4*Ts));
						diff_tetta = 0.02*(9.81/Ta);
						he_dist = hs_eff + Math.pow(3*Fm*(Math.sin(x_dist*Math.sqrt(diff_tetta)/us)/(Math.pow(beta_j,2)*us*Math.sqrt(diff_tetta))),1/3);
					}
				}
				if (stability_class == "F") {
					if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates
						Fb = 9.81 * vs * Math.pow(ds,2) * ((Ts-Ta)/(4*Ts));
						he_dist = hs_eff + 1.6*((Fb*x_dist*x_dist)**(1/3))/us;
					} else if ((Ts-Ta)<delta_Ts) {
						beta_j = (1/3) + (us/vs);
						Fm = Math.pow(vs,2) * Math.pow(ds,2) * (Ta/(4*Ts));
						diff_tetta = 9.81*0.035/Ta;
						he_dist = hs_eff + Math.pow(3*Fm*(Math.sin(x_dist*Math.sqrt(diff_tetta)/us)/(Math.pow(beta_j,2)*us*Math.sqrt(diff_tetta))),1/3);
					}
				}
		}
	} else {
		// console.log("x_dist>hf")
		//Final plume rise (rise after distance x f )
		if (stability_class == "A" || stability_class == "B" || stability_class == "C" || stability_class == "D") {
			Fb = 9.81 * vs * Math.pow(ds,2) * ((Ts-Ta)/(4*Ts));


			if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates

				if (Fb<55) {
					he_dist = hs_eff + 21.425*((Fb)**(3/4))/us;
				} else if ((Ts-Ta)<delta_Ts) {
					he_dist = hs_eff + 38.710*((Fb)**(3/5))/us;
				}

			} else { //momentum dominates
				he_dist = hs_eff + 3*ds*vs/us;
			}
		} else if (stability_class == "E" || stability_class == "F") {
				if (stability_class == "E") {
					if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates
						Fb = 9.81 * vs * Math.pow(ds,2) * ((Ts-Ta)/(4*Ts));
						diff_tetta = 0.02*(9.81/Ta);
						he_dist = hs_eff + 2.6*((Fb/(us*diff_tetta))**(1/3))/us;
					} else if ((Ts-Ta)<delta_Ts) {
						Fm = Math.pow(vs,2) * Math.pow(ds,2) * (Ta/(4*Ts));
						diff_tetta = 0.02*(9.81/Ta);
						he_dist_1 = hs_eff + 3*ds*(vs/us);
						he_dist_2 = hs_eff + 1.5*((Fm/(us*Math.sqrt(diff_tetta)))**(1/3))/us;
						he_dist = Math.min(he_dist_1,he_dist_2);
					}
				}
				if (stability_class == "F") {
					if ((Ts-Ta)>=delta_Ts) { //buoyancy dominates
						Fb = 9.81 * vs * Math.pow(ds,2) * ((Ts-Ta)/(4*Ts));
						diff_tetta = 9.81*0.035/Ta;
						he_dist = hs_eff + 2.6*((Fb/(us * diff_tetta))**(1/3))
					} else if ((Ts-Ta)<delta_Ts) {
						Fm = Math.pow(vs,2) * Math.pow(ds,2) * (Ta/(4*Ts));
						diff_tetta = 9.81*0.035/Ta;
						he_dist_1 = hs_eff + 3*ds*(vs/us);
						he_dist_2 = hs_eff + 1.5*((Fm/(us*Math.sqrt(diff_tetta)))**(1/3))/us;
						he_dist = Math.min(he_dist_1,he_dist_2);
					}
				}
		}
	}


	return [he_dist,stability_class, us]
}

function sigma_y_z(x_dist=10, stability_class="F") {
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
	//EPA–454/B–95–003a 1995, Turner 1994]
	var c1 = 0.0004;
	var c2 = 0.4651;
	var c3 = 0.001;
	var c4 = 0.01745;

	arr_a_b = func_a_b(x_dist, stability_class);
	a = arr_a_b[0];
	b = arr_a_b[1];

	arr_c_h = func_c_h(stability_class);
	c = arr_c_h[0];
	d = arr_c_h[1];
	e = arr_c_h[2];
	f = arr_c_h[3];
	g = arr_c_h[4];
	h = arr_c_h[5];




	if (type_area == 1) {
		sigma_y = e * x_dist * Math.pow(1+c1*x_dist,(-1/2))
		sigma_z = f * x_dist * Math.pow(1+g*x_dist,h)
	} else {
		th = c4*(c-d*Math.log(c3*x_dist));
		sigma_y = c2 * x_dist * Math.tan(th);
		sigma_z = a * Math.pow(c3*x_dist,b)

	}

	return [sigma_y, sigma_z]

}


function concentration_x(x_dist=100, y=0, z=2) {
	var Qc = document.getElementById('Qc').value;
	arr_plume_raise = plume_raise(x_dist)
	he_dist = arr_plume_raise[0]
	stability_class = arr_plume_raise[1]
	us = arr_plume_raise[2]
	arr_sig = sigma_y_z(x_dist,stability_class=arr_plume_raise[1])
	sigma_y = arr_sig[0]
	sigma_z = arr_sig[1]

	first_add = (Qc/us) * (Math.pow(10, 9)/(2*Math.PI*sigma_y))
	second_add = Math.exp(-(y**2)/(2*(sigma_y**2)))
	third_add = 1/sigma_z
	fourth_add = Math.exp(-((he_dist-z)**2)/(2*sigma_z*sigma_z))
	fifth_add = Math.exp(-((he_dist+z)**2)/(2*sigma_z*sigma_z))
	conc = first_add * second_add * third_add * (fourth_add + fifth_add)

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
		var conc = (concentration_x(x_dist=radius, y=0, z=2)/1000);
		if (conc<conc_mark) {
			if (conc < 20/1000) break; //Что бы не строить огромные графики
		}
		var conc_mark = conc;
		conc_Data.push(conc);
		radius_Data.push(radius);
	}

	var maxValconc = Math.max.apply(null,conc_Data);
	console.log(maxValconc);

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


// Функция основного графика (Дисперсия легкого газа из продолжительного источника)
function draw_graph() {

	var Ts = document.getElementById('Ts').value;
	var Qc = document.getElementById('Qc').value;

	am4core.ready(function() {
		// Выбираем тему графика
		am4core.useTheme(am4themes_animated);
		// Создаем переменную графика
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		// Вызываем функцию данных
		chart.data = generateChartData();
		// Создаем оси
		var dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
		dateAxis.title.text = "Расстояние, м. (расход: " + String(Qc) +
														" кг/с, тем-ра вещества: " + String(Ts) +
														" град.С, высота измерения: " + String(2) +
														" м" + ")";

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Распределение максимальной концентрации, гр/м3";

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
					var conc = (concentration_x(x_dist=radius, y=0, z=2)/1000);

					if (conc<conc_mark) {
						if (conc < 0.2) break; //Что бы не строить огромные графики
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
