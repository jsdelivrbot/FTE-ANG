alert("WELCOME");
// MODULE
var tuggerTracker = angular.module('tuggerTracker',['ngAria','ngMaterial']);

tuggerTracker.controller("myController",["$scope","$timeout","$mdDialog",function($scope,$timeout,$mdDialog){

	$scope.clickMe = function()
	{
		alert("YOU CLICKED ME !!!");
	}

	$scope.showAdvanced2 = function(ev) {
	    $mdDialog.show({
	      	//controller: DialogController,
	      	templateUrl: 'bcwContent2.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
	    }, function() {
			$scope.status = 'You cancelled the dialog.';
	    });
	};

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
		         	.on("click",$scope.showAdvanced2)
		         	.on("mouseover",function(){d3.select(this).attr("class","mouseovered");})
		         	.on("mouseout",function(){d3.select(this).attr("class",cssClass)});
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


	function getNext2(map, newPos) 
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
		alert(window.innerWidth);

		$scope.$apply(function(){
			$scope.initEverything();
		});
  	});

 $(function (){
	var socket = io();
	socket.on('chat message',function(msg){
		try
		{
			var json = JSON.parse(msg);
			console.log(msg);
			var next = $scope.getNext2($scope.map,json)
			if(next !== null)
			{
				if(next.type === "grass")
				{
					start = next;
					$scope.drawMowerHistory2($scope.groups,$scope.scales,[start]);
				}
			}
			console.log("TODO OK!");
		}
		catch(e)
		{
			console.log("ERROR: ",e);
		}
		console.log("LLEGO UN MENSAJE")
	});

	return false;
});  


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


