/***************************  MQTT     ************************************/
/*******************************************************************************/
var mqtt    = require('mqtt');
var mqtthost = 'm13.cloudmqtt.com';
var options = {
	host: mqtthost,
	port: 11249,
	protocolId: 'MQIsdp',
	secureProtocol: 'TLSv1_method',
	protocolId: 'MQIsdp',
	protocolVersion: 3,
	username: 'username',
  	password: 'password'
};
/***************************  FIM MQTT      ************************************/
/*******************************************************************************/
var app = require('express')();
var http = require('http').Server(app);
var httpCrawler = require('http');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
/***************************  Socket.io     ************************************/
/*******************************************************************************/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket)
{
  socket.on('chat message', function(etapaAtual)
  {	
      	mediador(etapaAtual);	       
  });
});

http.listen(port, function(){
  console.log('listening on *:'+ port);
});

function comunicaAoCliente(msg)
{
      io.emit('chat message', msg);
} 
/********************** Funções HTTP *************************************/
function requisicaoServidor(url,listaAnalise,callback)
{
	httpCrawler.get(url, function(res)
	{
		var data = "";
		res.on('data', function (chunk)
		{
			data += chunk;			
		});
		res.on("end", function()
		{			
			callback(data);
		});
	}).on("error", function()
	{        
			callback(null);
	});
}
/*****************************/
var cheerio = require("cheerio");
function iniciaMQTT()
{
	var client= mqtt.connect(options);
	client.on('connect', function ()
	{
	  	client.subscribe('/seu_topico_publico')
  		client.publish('/seu_topico_publico', 'Hello mqtt')
	});

	client.on('message', function (topic, message)
	{  
	   console.log("Mensagem recebida: "+ message.toString());
           comunicaAoCliente("Mensagem recebida: "+ message.toString());	   
	});
} 
function mediador(etapa)
{
    console.log(etapa); 
    if(etapa == "etapa0")
    {
	      iniciaMQTT();	
    }	
} 