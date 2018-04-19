// MODULE
var tuggerTracker = angular.module('tuggerTracker',['ngAria','ngMaterial']);

tuggerTracker.controller("myController",["$scope","$timeout","$mdDialog",function($scope,$timeout,$mdDialog){


	$scope.datos = {};

	$scope.xmlHttp = new XMLHttpRequest();

	$scope.xmlHttp.open("GET","http://localhost:5000/demoMongo",false);

	$scope.xmlHttp.send(null);

	console.log($scope.xmlHttp.responseText);

	$scope.arregloDemo = $scope.xmlHttp.responseText.match(/{.+?}/g);

	$scope.valoresDialogo = []

	$scope.arregloDeDatos = []

	console.log("arregloDemo: ",$scope.arregloDemo);

	$scope.arregloDemo.forEach(function(item){
		console.log("STRING JSON: ",item,"OBJETO JSON: ",JSON.parse(item));
		$scope.valoresDialogo.push(JSON.parse(item));
	});

	console.log("valoresDialogo: ", $scope.valoresDialogo);

	for(var i = 0;i<$scope.valoresDialogo.length;i++)
	{
		$scope.datos[$scope.valoresDialogo[i].chipid] = $scope.valoresDialogo[i];
		$scope.datos[$scope.valoresDialogo[i].chipid].distancia = 1000;
		$scope.datos[$scope.valoresDialogo[i].chipid].latency = 0;
		$scope.datos[$scope.valoresDialogo[i].chipid].past = 0;
		//$scope.datos[$scope.valoresDialogo[i].chipid].lugar = $scope.valoresDialogo[];
	}

	console.log("$scope.datos",$scope.datos);


	/*Esta funcion se encarga de crear el dialogo de configuración con el cual se cambian los parametros de cada uno
	de los smart beacons.*/

	$scope.createDialog = function(x,y)//La funcion espera dos parametros que son las coordenadas donde se asingara el beacon
	{
		var l = {x:x,y:y};//las coordenadas son guardadas en la variable local l que es un objeto
		
		/*Se crea un objeto xmlHttp el cual tiene la funcion de realizar peticiones GET al servidor y obtener valores de la 
		base de datos*/
		var xmlHttp = new XMLHttpRequest();

		/*Se abre una coneccion donde se solicita al servidor obtener todos los beacons registrados, esto ocurre de forma sincrona*/
		xmlHttp.open("GET","http://localhost:5000/demoMongo",false);
		xmlHttp.send(null);

		//Linea de debugging que permite ver el resultado obtenido durante la peticion, descomentar para reactivar
		//console.log(xmlHttp.responseText);

		/*Dentro de la variable arrglo demo se guarda la respuesta como un arreglo */
		var stringsValoresBeacons = xmlHttp.responseText.match(/{.+?}/g);

		/*Se crea un arreglo donde se guardaran los objetos creados a partir de los strings*/
		var valoresDialogo = []

		/*Por medio de la funcion forEach se recorre cada uno de los strings guardados, se convierten a objetos y se guardan*/
		stringsValoresBeacons.forEach(function(item){
			valoresDialogo.push(JSON.parse(item));
		});

		/*Una vez guardados los valores estos se recorren y se crea el atributo modeBool en cada uno de los objetos guardados
		esto con el fin de la interfaz grafica*/
		valoresDialogo.forEach(function(item){
			item.modeBool = item.mode === "programmer";
		});

		/*Esta es la funcion que sera retornada por el metodo y que se asignara a la funcion "onClick" de cada uno de los recuadros
		del mapa, esto es necesario para poder pasar las coordenadas de cada recuadro*/
		var funcion = function(ev){
			//Se crea el objeto del dialogo y se le solicita se muestre con los parametros asignados.
		    $mdDialog.show({
		      	//Variables locales utilizadas dentro del controlador particular del dialogo
		      	locals:{vars: l, todos:valoresDialogo},
		      	templateUrl: 'bcwContent2.html',//archivo html que va a mostrar dentro del dialogo
				parent: angular.element(document.body),//Se le indica al dialogo cual su elemento padre, en este caso la pagina principal
				targetEvent: ev,//se le dice cual sera el elemento de target
				clickOutsideToClose:true,//se especifica que un click fuera del recuadro permitira que este se cierre
				fullscreen: $scope.customFullscreen, // 
				/*Se declara y se crea el controlador correspondiente al dialogo, aqui se asignan las variables que espera*/
				controller: ['$scope','vars','todos',function($scope,vars,todos){
					$scope.x = vars.x;//dentro del scope del dialogo se guarda la variable x
					$scope.y = vars.y;//dentro del scope del dialogo se guarda la variable y
					$scope.todos = todos;//dentro del scope del dialgo se guarda la informacion de los beacons obtenida de la base de datos

					/*Metodo utilizado para responder a los clicks del checkbox de la lista*/
					$scope.checkBoxClick = function(estado,elemento){

						//aqui se deseleccionan todos los elementos
						$scope.todos.forEach(function(x){
							x.done  = false;
						})

						//Aqui se selecciona solo aquel elemento al que se le hizo click
						if(estado)
						{
							elemento.done = true;
						}
					}

					/*Este metodo es el encargado de llevar acabo las acciones necesarias cuando se selecciona el modo bajo el cual opera el beacon*/
					$scope.modeCheckBoxClick = function(item){
						/*Por medio de este if usando el atributo modeBool se cambia el valor en el objeto correspondiente y a su vez el texto en la interfaz*/
						if(item.modeBool){
							item.mode = "programmer";
						}
						else{
							item.mode = "scanner";
						}
					}

					/*Este es el metodo que se manda a llamar cuando el usuario cierra la ventana por medio de los botones "cancelar" o "guardar"*/
					$scope.answer = function(seleccion)
					{
						/*Si el boton precionado fue guardar*/
						if(seleccion){
							/*Entonces se verificaran todos los elementos dentro de la lista para registrar los cambios en la base de datos*/
							$scope.todos.forEach(function(item){
								
								var nuevosValores = {};
								var nuevosValoresJsonString = "";
								nuevosValores.chipid = item.chipid;

								console.log("VALOR DE LOS CHECKBOX: ",item.modeBool);

								if(item.done){
									console.log(item.chipid, "ha sido seleccionado");

									nuevosValores.x = $scope.x;
									nuevosValores.y = $scope.y;


									// xmlHttp.open("GET","http://localhost:5000/updateBeacon?x="+$scope.x+"&y="+$scope.y+"&chipid="+item.chipid,true);
									// xmlHttp.open("GET","http://localhost:5000/updateBeacon?nuevosValores="+nuevosValoresJsonString,true);


									//console.log(xmlHttp.responseText);
								}
								else
								{
									console.log(item.chipid, "esta deseleccionado");
								}

								if(item.marj == undefined){
									nuevosValores.marj = "CACA";
								}else{
									nuevosValores.marj = item.marj;
									console.log("marj en navegador: ",item.marj);
								}

								if(item.mino == undefined){
									nuevosValores.mino = "BEBE";
								}else{
									nuevosValores.mino = item.mino;
									console.log("mino en navegador: ",item.mino);
								}

								nuevosValores.mode = item.mode;

								nuevosValoresJsonString = JSON.stringify(nuevosValores);
								xmlHttp.open("GET","http://localhost:5000/updateBeacon?nuevosValores="+nuevosValoresJsonString,true);
								xmlHttp.send(null);

							})
						}
						$mdDialog.hide();
					}
				}]
		    });


		    var mdDialogCtrl = function ($scope, dataToPass) { 
			    $scope.mdDialogData = dataToPass  
			}
		};

		return funcion;
	}

	$scope.getBlocks = function ()
	{
		var bloques = [];

		bloques.push($scope.createBlock(0,0,14,34))
		bloques.push($scope.createBlock(17,3,31,6,"psg k2.jpg"))
		bloques.push($scope.createBlock(17,12,31,22,"psg linea princial.jpg"))
		bloques.push($scope.createBlock((51),3,5,31,"PSG FIFO.jpg"))
		bloques.push($scope.createBlock((59),3,30,31,"lineas.jpg"))
		bloques.push($scope.createBlock(0,0,5,70,"almacenes.jpg"))
		bloques.push($scope.createBlock((8),37,6,28))
		bloques.push($scope.createBlock(44,37,45,17,"war room.jpg"))
		bloques.push($scope.createBlock(17,37,24,8,"actuador.jpg"))
		bloques.push($scope.createBlock(17,47,24,8,"discos 3.jpg"))
		bloques.push($scope.createBlock(17,58,24,7,"discos 2.jpg"))
		bloques.push($scope.createBlock(44,58,36,6,"discos 1.jpg"))
		bloques.push($scope.createBlock(84,58,12,11,"oficinas 2.png"))
		bloques.push($scope.createBlock(8,69,87,9,"oficinas.png"))

		return bloques;
	}


	$scope.createBlock = function (x,y,width,height,path)
	{
		//Se inicializa el objeto
		var block = {};
		/*Comienzan a agregarse propiedades, ubicacion con coordenadas X y Y*/
		block.x = Math.floor(x);
		block.y = Math.floor(y);
		/*Altura y anchura*/
		block.height = Math.floor(height);
		block.width = Math.floor(width);

		/*Se comiuenzan a describir ciertas propiedades de la imagen que corresponde a 
		este bloque, que son: anchura, altura, ubicacion en pixeles en x y ubicacion en pixeles en y*/
		block.imageWidth = (block.width+1)*$scope.squareLength;
		block.imageHeight = (block.height+1)*$scope.squareLength;
		block.imageX = (block.x*$scope.squareLength)+5;
		block.imageY = (block.y*$scope.squareLength)+5;

		/*Se corrobora la existencia del path*/
		if(path!== undefined)
		{
			block.imagePath = path;
		}
		else
		{
			block.imagePath = undefined;
		}

		//Se retorna el objeto al usuario.
		return block;
	}

	$scope.getSvgSize = function(gridSize, squareLength) 
	{
		var width = gridSize.x * squareLength;
		var height = gridSize.y * squareLength;
		return { width:width, height:height };
	}

	$scope.isBorder = function (x, y, gridSize) 
	{
		return x==0 || y == 0 || x == (gridSize.x-1) || y == (gridSize.y-1);
	}

	$scope.buildMap2 = function (gridSize, ratios) 
	{
		/*map es un objeto que contiene cuatro arreglos los cuales guardan los valores 
		de la cuadricula en general, los cuadros que son pasto, los cuadros que son piedra
		y los cuadros que son border*/
		var map = { grid:[], grass:[], rock:[], border:[] };

		/*Este for recorre todos los valores del eje x de la cuadricula uno por uno*/
		for (x = 0; x < gridSize.x; x++) {
			/*crea en cada instancia del objeto map, en su atributo "grid" un arreglo vacio, haciendo entonces
			al atributo grid un arreglo bidimencional*/
			map.grid[x] = [];
			/*De forma anidada otro for recorre cada casilla del eje y de la cuadricula casilla por casilla(como ya sabes quien)*/
			for (y = 0; y < gridSize.y; y++) {
				/*Dentro de la variable local rock se guarda un valor boleano que depende de un numero random generado de
				0 a 1 el cual debera ser menor que el ratio indicado al momento de llamar al metodo para poder ser true
				y sera false si es mayor que dicho ratio*/
				//var rock = Math.random() < ratios.rock;
				/*Dentro de la variable local border se guarda otro booleano con la misma metodologia de la variable rock
				var border = Math.random() < ratios.border;*/
				/*Dentro de la variable type sera igual a rock si es un borde, caso contrario sera grass*/
				var type = $scope.isBorder(x, y, gridSize)?"border":"grass";

				/*En la variable cel, se guardara un objeto el cual tiene 3 atributos llamados x, y y type a los cuales se les asignan
				los valores de sus respectivas variables*/

				bloques = $scope.getBlocks();

				for(var i = 0;i<bloques.length;i++)
				{
					if(x>bloques[i].x && x<=bloques[i].x+bloques[i].width && y>bloques[i].y && y<=bloques[i].y+bloques[i].height)
					{

						type = "rock";

						if(bloques[i].x === x-1 && bloques[i].y === y-1 && bloques[i].imagePath!==undefined)
						{
							//alert("IMAGE PLACED");
							console.log("image width",bloques[i].imageWidth);
							console.log("width",bloques[i].width);
							console.log("image height",bloques[i].imageHeight);
							console.log("height",bloques[i].height);

							var nameDim = "";
							var valDim = 0;
							var valFixed = 0;
							var nameFixed = "";
							var valOffset = 0;
							var nameOffset = "";
							var trueImageWidth = 0;
							var trueImageHeight = 0;

							var img = new Image();
							img.onload = function(){
								console.log( this.width+' '+ this.height );
								trueImageHeight = this.height;
								trueImageWidth = this.width;
							};
							img.src = '/image/'+bloques[i].imagePath;

							console.log("VALORES: ",bloques[i].imageWidth,bloques[i].imageHeight,trueImageWidth,trueImageHeight)

							if(bloques[i].imageWidth>bloques[i].imageHeight)
							{
								valDim = bloques[i].imageWidth;
								nameDim = "width";
								nameOffset = "scale(1,"+valOffset+")";
								valOffset = (bloques[i].imageHeight/((bloques[i].imageWidth/trueImageWidth)*trueImageHeight));
								nameOffset = "scale("+valOffset+",1)";
							}
							else
							{
								valDim = bloques[i].imageHeight;
								nameDim = "height";
								valOffset = (bloques[i].imageWidth/((bloques[i].imageHeight/trueImageHeight)*trueImageWidth))
							}

							console.log("offset: ",valOffset)

							$scope.svgContainer.append('svg:image')
							.attr('xlink:href', '/image/'+bloques[i].imagePath)
							.attr(nameDim, valDim)
							.attr("x", bloques[i].imageX)
							.attr("y", bloques[i].imageY)
							//.attr("transform",nameOffset);
						}
					}
				}

				function blockOnClick(){
					console.log("rect");
				}

				var cell = { x:x, y:y , type:type ,onClick:blockOnClick};
				/*dentro del objeto map en el atributo grid que es un arreglo bidimencional se guardara el objeto cell correspondiente*/
				map.grid[x][y] = cell;
				/*De acuerdo al tipo de la celda, se guardara en el atributo correspondiente dentro del objeto map la celda por medio 
				de la llamada al metodo push*/
				map[type].push(cell);
			}
		}
		/*Al finalizar la insercion y generacion de todas las celdas se regresara el objeto mapa*/
		return map;
	}

	/*Esta funcion retorna un objeto con el valor de dos escalas por medio de algunos metodos de D3*/
	$scope.getScale = function (gridSize, svgSize) {
		/*En esta funcion se generan dos objetos scale, los cuales tienen como funcion 
		pasar de un valor a otro con base a cierta funcion, en este caso es un scale lineal.
		domain, es el rango en el cual se pueden mover los valores de enrada
		range, es el rango de valores de salida.

		P/E:
		  DOMAIN: 0 - 10
		  RANGE:  0 - 100

		 INPUT: 5 -> OUTPUT: 50
		*/

		var xScale = d3.scale.linear().domain([0,gridSize.x]).range([0,svgSize.width]);
		var yScale = d3.scale.linear().domain([0,gridSize.y]).range([0,svgSize.height]);
		return { x:xScale, y:yScale };
	}

	$scope.drawCells = function(svgContainer, scales, data, cssClass) 
	{
		console.log("creating new cell");
		var gridGroup = $scope.svgContainer.append("g");
		var cells = gridGroup.selectAll("rect")
		            .data(data)
		            .enter()
		            .append("rect");
		var cellAttributes = cells
		         	.attr("x", function (d) { return $scope.scales.x(d.x); })
		         	.attr("y", function (d) { return $scope.scales.y(d.y); })
		         	.attr("width", function (d) { return $scope.squareLength; })
		         	.attr("height", function (d) { return $scope.squareLength; })
		         	.attr("class", cssClass)
		         	// .on("click",function(){console.log("click",this);})
		         	.on("click",function(d) { 

		         		console.log(d);
		         		$scope.createDialog(d.x,d.y)();


		         	})
		         	.on("mouseover",function(){d3.select(this).attr("class","mouseovered");})
		         	.on("mouseout",function(){d3.select(this).attr("class",cssClass)});

     	console.log("LOS VALORES GUARDADOS FUERON: ",$scope.tempX,$scope.tempY);
	}	
	
	$scope.drawMowerHistory2 = function(groups, scales, path) 
	{
		groups.position.selectAll("circle")
		    .data(path)
		    .enter()
		    .append("circle")
		    .attr("cx",function(d){return console.log("d",d);scales.x(d.x+0.5)})
		    .attr("cy",function(d){return scales.y(d.y+0.5)})
		    .attr("r",function(d){return $scope.circleRadius})
		    .attr("class",function(d){return "position"});

		groups.position.selectAll("circle")
		    .data(path)
		    .attr("cx",function(d){return scales.x(d.x+0.5)})
		    .attr("cy",function(d){return scales.y(d.y+0.5)})
		    .attr("r",function(d){return $scope.circleRadius})
		    .attr("class",function(d){return "position"});
		    

		groups.position.selectAll("circle")
		    .data([path])
		    .exit().remove();
	}

	$scope.drawMowerHistory3 = function(groups, scales, path) 
	{

		groups.position.select("circle")
		    .data(path)
		    .enter()
		    .append("circle")
		    .attr("cx",function(d){return console.log("d",d);scales.x(d.x+0.5)})
		    .attr("cy",function(d){return scales.y(d.y+0.5)})
		    .attr("r",function(d){return $scope.circleRadius})
		    .attr("class",function(d){return "position"});

		groups.position.select("circle")
		    .data(path)
		    .transition()
		    .duration(1500)
		    // .attr("delay",function(d,i){return 5000})
		    // .attr("duration",function(d,i){return 2000})
		    .attr("cx",function(d){return scales.x(d.x+0.5)})
		    .transition()
		    // .attr("delay",function(d,i){return 5000})
		    // .attr("duration",function(d,i){return 2000})
		    .attr("cy",function(d){return scales.y(d.y+0.5)})
		    .attr("r",function(d){return $scope.circleRadius})
		    .attr("class",function(d){return "position"});
		    

		groups.position.select("circle")
		    .data([path])
		    .exit().remove();

	}


	$scope.getNext2 = function(map, newPos) 
	{
		if(newPos.x<map.grid.length && newPos.x>=0 && newPos.y <map.grid[0].length && newPos.y>=0)
		{
			return map.grid[newPos.x][newPos.y];
		}
		else
		{
			return null;
		}
	}

	$scope.path = null;

	function executeCommands2(e)
	{
		var content = $('#commands').val();
		content = content.toUpperCase().replace(/[^UDRL]/g, "");
		$('#commands').val("");

		var next = getNext(map,start,content[content.length-1]);

		if(next.type === "grass")
		{
			start = next;
			drawMowerHistory2(groups,scales,start)
		}
	}


	$scope.circleRadius = 15;
	$scope.squareLength = 15;
	$scope.ratios = { rock:0.05, border:0.05 };

	$scope.layoutSize = {x:94 ,y: 80};

	$scope.gridSize;
	$scope.windowSize;
	$scope.svgSize;
	$scope.map;
	$scope.start;
	$scope.actual;
	$scope.svgContainer;
	$scope.scales;
	$scope.groups;

	$scope.initEverything = function()
	{
		$scope.gridSize = { x:$scope.layoutSize.x, y:$scope.layoutSize.y};

		$scope.windowSize = {x:window.innerWidth ,y: window.innerHeight};

		$scope.squareLength = ($scope.gridSize.x/$scope.gridSize.y)>($scope.windowSize.x/$scope.windowSize.y) ? Math.floor($scope.windowSize.x*.95)/$scope.gridSize.x:Math.floor($scope.windowSize.y*.95)/$scope.gridSize.y;

		$scope.circleRadius = $scope.squareLength;

		$scope.svgSize = $scope.getSvgSize($scope.gridSize, $scope.squareLength);

		d3.select("svg").remove()

		$scope.svgContainer = d3.select(".display")
		                          .append("svg")
		                          .attr("width", $scope.svgSize.width)
		                          .attr("height", $scope.svgSize.height);
	
		$scope.scales = $scope.getScale($scope.gridSize, $scope.svgSize);


		$scope.map = $scope.buildMap2($scope.gridSize, $scope.ratios);

		$scope.start = $scope.map.grid[4][77]

		console.log("map = ",$scope.map);

		console.log("map.grid = ",$scope.map.grid);

		console.log($scope.start);
		/*svgContainer.append('svg:image')
		      .attr('xlink:href', '/image/layout.jpg')
		      .attr("width", 400)
		      .attr("height", 300)
		      .attr("x", 0)
		      .attr("y", 0);*/

		$scope.drawCells($scope.svgContainer, $scope.scales, $scope.map.grass, "grass");
		$scope.drawCells($scope.svgContainer, $scope.scales, $scope.map.rock, "rock");
		$scope.drawCells($scope.svgContainer, $scope.scales, $scope.map.border, "border");

		$scope.groups = { path:$scope.svgContainer.append("g"),
		                position:$scope.svgContainer.append("g") };

		$scope.drawMowerHistory2($scope.groups, $scope.scales, [$scope.start]);
	}

	$(window).on("resize.doResize", function (){
		//alert(window.innerWidth);

		$scope.$apply(function(){
			$scope.initEverything();
		});
  	});

	$(function (){
		var socket = io();
		// socket.on('chat message',function(msg){
		// 	try
		// 	{
		// 		var json = JSON.parse(msg);
		// 		console.log(msg);
		// 		var next = $scope.getNext2($scope.map,json)
		// 		if(next !== null)
		// 		{
		// 			if(next.type === "grass")
		// 			{
		// 				start = next;
		// 				$scope.drawMowerHistory2($scope.groups,$scope.scales,[start]);
		// 			}
		// 		}
		// 		console.log("TODO OK!");
		// 	}
		// 	catch(e)
		// 	{
		// 		console.log("ERROR: ",e);
		// 	}
		// 	console.log("LLEGO UN MENSAJE");
		// 	alert("LLEGO UN MENSAJE");
		// });
		

		var socket = io();
		socket.on('updates',function(msg){
			$scope.$apply(function(){

				if($scope.datos[msg.chipid].timer){
					$scope.datos[msg.chipid].timer.onOff = false;
				}

				$scope.datos[msg.chipid].distancia = parseFloat(msg.distancia);
				var lastTime = new Date();


				var dateTime = ""+ lastTime.getHours() + ":" + lastTime.getMinutes() + ":" + lastTime.getSeconds();
				$scope.datos[msg.chipid].time = dateTime;

				var newPast = Date.now()
				console.log("NOW: ",newPast);
				var actual = newPast - $scope.datos[msg.chipid].past;
				$scope.datos[msg.chipid].latency = actual;
				$scope.datos[msg.chipid].past = newPast;
				console.log("OBJETO DATOS: ",$scope.datos);
				$scope.arregloDeDatos = Object.keys($scope.datos).map(i => $scope.datos[i]);

				//console.log("arregloDeDatos",$scope.arregloDeDatos);
				$scope.arregloDeDatos.sort(function(a,b){
					return parseFloat(a.distancia)-parseFloat(b.distancia);
				});

				var nuevos = $scope.valoresDialogo.find(x => x.chipid == $scope.arregloDeDatos[0].chipid);

				console.log("LOS NUEVOS VALORES DEL TUGGER SON: X: ",nuevos.x, " Y: ",nuevos.y)
				//$scope.start = $scope.map.grid[4][77]
				$scope.drawMowerHistory3($scope.groups, $scope.scales, [$scope.map.grid[nuevos.x][nuevos.y]]);

				$scope.datos[msg.chipid].timer = $scope.createTimer(function(){
					$scope.datos[msg.chipid].distancia = 1000;
				},5000);
			});

			// alert("LLEGO UN MENSAJE");

			//console.log("DATOS: ",$scope.arregloDeDatos)
			//console.log("VALORES DIALOGO",$scope.valoresDialogo);
			//console.log("ARREGLO DEMO",$scope.arregloDemo);
			//console.log($scope.valoresDialogo);
		});

		return false;
	});  


	$scope.createTimer = function(funcion, tiempo){

		var timerObject = {};

		timerObject.f = funcion;
		timerObject.time = tiempo;

		timerObject.onOff = true;

		setTimeout(function(){
			if(timerObject.onOff){
				timerObject.f();
			}
		},timerObject.time);
	}

}]);




tuggerTracker.directive('tuggerMap', function ($parse) {
	var directiveDefinitionObject = {
		restrict: 'E',
		replace: false,
		link: function(scope, element, attrs){
			scope.initEverything();
		}
	};
	return directiveDefinitionObject;
});


