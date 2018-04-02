const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = require('express')();
var http = require('http').Server(app);
var mqtt = require('mqtt');

/*var options = {
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
};*/

var optiones = {

	port: 1883,
	host: "192.168.1.65",
	clientID: 'node_master',
	keepalive:60,
	reconnectPeriod:1000,
	protocolId: 'MQIsdp',
	protocolVersion:3,
	clean:true,
	encoding: 'utf8'
};

console.log("INTENTANDO CONECTAR");
//var client = mqtt.connect('http://m14.cloudmqtt.com',options);
var client = mqtt.connect('http://192.168.1.65');
//console.log(client);

var io = require('socket.io')(http);

var socketOn = false;

client.on('connect',function(){
	client.subscribe('presence');
	client.subscribe('node/register')
	client.publish('presence','Hello mqtt');
	client.subscribe('tugger');
	socketOn = true;
	
});

client.on('message',function(topic,message){
	//console.log(message.toString());
	if(socketOn)
	{
		if(topic === "tugger")
		{
			//HACER PARSE A OBJETO JSON
			var registro = JSON.parse(message);
			console.log("Objeto creado con exito: ",registro.chipid);

		}
		//io.emit('chat message',message.toString());
	}
});

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

app.get('/app.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/app.js');
});

app.get('/bcwContent2.html',function(req,res)
{
	res.sendFile(__dirname+'/bcwContent2.html');
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
/*
http.listen(3000,function()
{
	console.log('listening on *:3000');
});*/

http.listen(PORT,function(){console.log("INIT OK!")})


// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))




