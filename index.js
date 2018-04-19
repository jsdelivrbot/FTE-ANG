const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = require('express')();
var http = require('http').Server(app);
var mqtt = require('mqtt');


var comandosPendientes = [];

var options = {
    port: 10246,
    host: 'm14.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'xxjpxcmq',
    password: new Buffer('Bp48RyeHOmBc'),
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

/*var optiones = {

	port: 1883,
	host: "192.168.1.65",
	clientID: 'node_master',
	keepalive:60,
	reconnectPeriod:1000,
	protocolId: 'MQIsdp',
	protocolVersion:3,
	clean:true,
	encoding: 'utf8'
};*/

console.log("INTENTANDO CONECTAR");
//var client = mqtt.connect('http://m14.cloudmqtt.com',options);
var client = mqtt.connect('http://10.42.0.1');
//console.log(client);

var io = require('socket.io')(http);

var socketOn = false;

client.on('connect',function(){
	client.subscribe('presence');
	client.subscribe('node/register')
	client.publish('presence','Hello mqtt');
	client.subscribe('tugger');
	console.log("CONECCION MQTT REALIZADA**********")
	socketOn = true;

});

// client.on('message',function(topic,message){
// 	//console.log(message.toString());
// 	if(socketOn)
// 	{
// 		if(topic === "tugger")
// 		{
// 			//HACER PARSE A OBJETO JSON
// 			var registro = JSON.parse(message);
// 			console.log("Objeto creado con exito: ",registro.chipid);

// 		}
// 		io.emit('chat message',message.toString());
// 	}
// 	console.log(topic,message);
// });

mqttCallback = function(topic,message)
{

	var MongoClient = require('mongodb').MongoClient;

	//var url = 'mongodb+srv://b08walls:53285329@cluster0-oo4wz.mongodb.net/test'

	var url = 'mongodb://localhost:27017/';

	var registroNode = function(m)
	{
		var registerBeacon = function(chipid, mode, x, y, marj, mino)
		{
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				//var dbo = db.db("Tugger");
				var dbo = db.db("mydb");
				//var myobj = {"_id":"5ab194b0c38a9d343cc61ad7","marj":"123","mino":"456","x":2,"y":2,"mode":false,"chipid":"123456789"};

				var objeto = {};

				if(chipid != undefined)
				{
					objeto.chipid = chipid;
				}

				if(mode!= undefined)
				{
					objeto.mode = mode;
				}

				if(x!=undefined)
				{
					objeto.x = x;
				}

				if(y != undefined)
				{
					objeto.y = y;
				}

				if(marj!= undefined)
				{
					objeto.marj = marj;
				}

				if(mino != undefined)
				{
					objeto.mino = mino;
				}


				var query = {chipid:objeto.chipid};

				dbo.collection("BeaconsInPlay").find(query).toArray(function(err,result){
					if(err) throw err;
					//console.log(result);


					if(result.length<=0){
						dbo.collection("BeaconsInPlay").insertOne(objeto, function(err, res) {
							if (err) throw err;
							console.log("BEACON REGISTRADO CON EXITO");
							db.close();
						});
					}
					else
					{
						console.log("EL OBJETO QUE SE VA A ACOMODAR COMO $SET ES:",objeto);
						var newValues = {$set:objeto};
						dbo.collection("BeaconsInPlay").updateOne(query,newValues,function(err,res){
							if(err) throw err;
							console.log("BEACON ACTUALIZADO CON EXITO!");
							if(result[0].mode === "scanner" && objeto.mode === "programmer"){
								console.log("ACTUALIZANDO MARJ Y MINO");
								client.publish('nodeCode/'+objeto.chipid,'{"command":1,"load":"manager.sendAtCommand(\'MARJ\')"}')
								setTimeout(function(){
									client.publish('nodeCode/'+objeto.chipid,'{"command":1,"load":"manager.sendAtCommand(\'MINO\')"}')
								},1000);
							}
							db.close();
						});
						console.log("BEACON ACTUALIZADO");
					}
				});




			});
		}


		var o;
		try
		{

			var str = ""+m;

			//console.log("STRING ORIGINAL",str);

			str = str.replace(/'/g,"\"");
			var correcciones = str.match(/:[^"]*.?[,}]/g,str)

			correcciones.forEach(function(x){
				var __temp = x.replace(/:/g,':"');
				__temp = __temp.replace(/}/g,'"}');
				__temp = __temp.replace(/,/g,'",');
				str = str.replace(x,__temp);
				// console.log(x,__temp);
			})
			//console.log("STRING CORREGIDO: ",str);
			o = JSON.parse(str);
			//console.log("REGISTRO");
		}catch(e)
		{
			console.log("error: pero haha lo cacche",e.toString());
		}

		if(o!= undefined)
		{
			registerBeacon(o.chipid, o.mode, o.x, o.y, o.MARJ, o.MINO);
		}
	}


	var tuggerTracking = function(m)
	{
		var o;
		try
		{
			//console.log(typeof(m));
			var str = ""+m;

			//console.log("STRING ORIGINAL",str);

			str = str.replace(/'/g,"\"");
			//str = str.replace(/:[^"]/,":\"");
			//str = str.replace("}","\"}");
			var correcciones = str.match(/:[^"]*.?[,}]/g,str)

			correcciones.forEach(function(x){
				var __temp = x.replace(/:/g,':"');
				__temp = __temp.replace(/}/g,'"}');
				__temp = __temp.replace(/,/g,'",');
				str = str.replace(x,__temp);
				// console.log(x,__temp);
			})
			//console.log("STRING CORREGIDO: ",str);
			o = JSON.parse(str);
			//console.log("REGISTRO");
		}catch(e)
		{
			console.log("error: pero haha lo cacche",e.toString());
		}

		if(o!= undefined)
		{

			// if(parseInt(o.minLoad,16) == parseInt("CACA",16) && parseInt(o.maxLoad,16) == parseInt("BEBE",16)){
			if(parseInt(o.minLoad,16) == 6081 && parseInt(o.maxLoad,16) == 15){
				io.emit('updates',o);
				//console.log(o);
			}

		}
	}


	if(socketOn)
	{
		switch(topic)
		{
			case "tugger":

				//--AQUI DEBE SER COLOCADO EL CODIGO PARA LOS MENSAJES DEL TUGGER
				tuggerTracking(message);
			break;
			case "node/register":
				registroNode(message);
				break;
			case "presence":
			break;
			default:
			break;
		}
	}
}

client.on('message',mqttCallback);

client.on('error', function(err) {
    console.log(err);
});

app.get('/',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/index.html');
});

app.get('/jquery.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/node_modules/jquery/dist/jquery.js');
});

app.get('/d3.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/d3.v3.min.js');
});

app.get('/script.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/script.js');
});

app.get('/demoMongo',function(req,res)
{

	var MongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017/';

	MongoClient.connect(url,function(err,db){
		if(err){
			console.log("error en conexion");
			throw err;
		}

		var dbo = db.db("mydb");
		dbo.collection("BeaconsInPlay").find({}).toArray(function(err,result){
			if(err){
				console.log("error en query");
				throw err;
			}

			console.log(result);
			cargarDatos(result);
			db.close();
		});
	})


	var cargarDatos = function(valores)
	{
		if(valores != undefined){
			//console.log("el resultado esta definido");

			var respuesta = "";

			valores.forEach(function(item){
				respuesta += JSON.stringify(item);
			})

			res.send(respuesta);
		}
		else{
			//console.log("el resultado no esta definido");
		}	
	}
	//res.sendFile(__dirname+'/app.js');
});


app.get('/updateBeacon',function(req,res){

	if(req.query.nuevosValores)
	{

		//console.log("LOS VALORES RESIVIDOS EN EL GET: "+req.query.nuevosValores);
		var MongoClient = require('mongodb').MongoClient;

		var url = "mongodb://127.0.0.1:27017";

		var nuevosValoresObjeto = JSON.parse(req.query.nuevosValores);
		//console.log("LOS NUEVOS VALORES EN EL OBJETO SON: ",nuevosValoresObjeto);
		var viejosValores = [];

		MongoClient.connect(url, function(err,db){
			if (err) throw err;

			var dbo = db.db("mydb");
			dbo.collection("BeaconsInPlay").find({chipid:nuevosValoresObjeto.chipid}).toArray(function(err,res){
				if (err) throw err;

				viejosValores = res;

				var cambios = Object.keys(nuevosValoresObjeto);

				cambios.forEach(function(item){

					if(nuevosValoresObjeto[item] != viejosValores[0][item]){
						console.log("LOS VALORES A ANALIZAR SI SON DIFERENTES FUERON: ",nuevosValoresObjeto[item],viejosValores[0][item]);
						switch(item){
							case 'mode':
								if(nuevosValoresObjeto.mode == "scanner"){

									console.log("^^^^^^^^^^ SE MANDA A CONFIGURAR BT COMO SCANNER");
									client.publish('nodeCode/'+nuevosValoresObjeto.chipid,'{"command":1,"load":"manager.setMode(SCANNER)"}');

									setTimeout(function(){
										client.publish('nodeCode/'+nuevosValoresObjeto.chipid,'{"command":0,"load":1}');
									},1500);

								}
								else{
									client.publish('nodeCode/'+nuevosValoresObjeto.chipid,'{"command":0,"load":0}');

									setTimeout(function(){

										client.publish('nodeCode/'+nuevosValoresObjeto.chipid,'{"command":1,"load":"manager.setMode(BEACON"}')

									},5000);
								}
							break;

							case 'marj':
								if(viejosValores.mode != "scanner"){
									client.publish('nodeCode/'+nuevosValoresObjeto.chipid,'{"command":1,"load":"manager.sendAtCommand(\'MARJ\',\'0x'+nuevosValoresObjeto.marj+'\')"}');
								}
								else{
									setTimeout(function(){
										client.publish('nodeCode/'+nuevosValoresObjeto.chipid,'{"command":1,"load":"manager.sendAtCommand(\'MARJ\',\'0x'+nuevosValoresObjeto.marj+'\')"}');
									},1000);
								}
							break;

							case 'mino':
								if(viejosValores.mode != "scanner"){
									client.publish('nodeCode/'+nuevosValoresObjeto.chipid,'{"command":1,"load":"manager.sendAtCommand(\'MINO\',\'0x'+nuevosValoresObjeto.mino+'\')"}');
								}
								else{
									setTimeout(function(){
										client.publish('nodeCode/'+nuevosValoresObjeto.chipid,'{"command":1,"load":"manager.sendAtCommand(\'MARJ\',\'0x'+nuevosValoresObjeto.marj+'\')"}');
									},1000);	
								}
							break;

						}

					}

				});
			});
		});



		MongoClient.connect(url,function(err,db){
			if(err)throw err;
			var dbo = db.db("mydb");
			console.log("LOS NUEVOS VALORES EN EL OBJETO DENTRO DE LA PETICION SON: ",nuevosValoresObjeto)
			var myquery = {chipid:nuevosValoresObjeto.chipid}
			var newvalues = {$set: nuevosValoresObjeto};
			dbo.collection("BeaconsInPlay").update(myquery, newvalues, function(err,res){
				if(err) throw err;
				console.log("archivo actualizado");
				db.close();
			});
		});

		



		console.log("X",req.query.x,"Y", req.query.y);
	}
	else{
		console.log("error, x and/or y are not defined");
	}

	res.send("<h1>All Good</h1>");
	//console.log("res",res);
});

app.get('/removeBeaconMap',function(req,res){
	if(req.query.x && req.query.y){
		
		var MongoClient = require('mongodb').MongoClient;
		var url = "mongodb://127.0.0.1:27017";

		MongoClient.connect(url,function(err,db){
			if(err) throw err;

			var dbo = db.db("mydb");

			var myquery = {x:parseInt(req.query.x),y:parseInt(req.query.y)};
			console.log(myquery);

			var newValues = {$unset: {x:undefined,y:undefined}};

			dbo.collection("BeaconsInPlay").update(myquery,newValues,function(err,res){
				if(err) throw err;
				console.log("BEACON ELIMINADO DEL MAPA<----------------------");
				db.close();
			});
		});
	}
});

app.get('/app.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/app.js');
});

app.get('/sideBar.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/sideBar.js');
});

app.get('/bcwContent2.html',function(req,res)
{
	res.sendFile(__dirname+'/bcwContent2.html');
});

app.get('/socket',function(req,res)
{
	res.sendFile(__dirname+'/node_modules/socket.io-client/dist/socket.io.js');
});

app.use(express.static(__dirname+'/public'))

io.on('connection',function(socket)
{
	console.log('a user connected');
	io.on('connection',function(socket){
		socket.broadcast.emit("hi");
	});

	socket.on('disconnect',function(){
		console.log('user disconnected')
	});

	socket.on('chat message',function(msg){
		console.log('message: '+msg);
		io.emit('chat message',msg);
		socketOn = true;
	});
});

http.listen(PORT,function(){console.log("INIT OK!")})




