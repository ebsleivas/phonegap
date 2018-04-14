/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        */
        checkOnline('http://192.168.1.5');
        //login();
    }
};

function checkOnline(server) {
  var xhr = new XMLHttpRequest();
  //method = "POST",
  //url = "http://192.168.1.5/cx/funcoes.php";
  xhr.open('POST', server + "/cx/funcoes.php", true);
  //xhr.open(method, url, true);
  xhr.onreadystatechange = function () {
      if(xhr.status === 200) {
        document.getElementById('servidor').innerHTML = server;
        login(server);
      }else{
        document.getElementById('servidor').innerHTML = server;
        login(server);
      }
    };
  xhr.send("acao=checkOnline");
};

function numero2moeda(num) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num))
		num = "0";
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num*100+0.50000000001);
		cents = num%100;
		num = Math.floor(num/100).toString();
	if(cents<10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		num = num.substring(0,num.length-(4*i+3))+'.'+
		num.substring(num.length-(4*i+3));
	return (((sign)?'':'-') + num + ',' + cents);
};

function nr_virg(e) {
	var tecla = ( window.event ) ? e.keyCode : e.which;
	if ( tecla == 8 || tecla == 0 )
		return true;
	if ( tecla != 44 && tecla < 48 || tecla > 57 )
		return false;
};

var login = function(server){
    //alert('login');
    //document.getElementById('conteudo').setAttribute('style', 'display:none;');
    localStorage.setItem("server", server);
    document.getElementById('login').setAttribute('style', 'display:block;');
};

var logar = function(){
  server = localStorage.getItem("server");
  var nome = document.getElementById('hnome').value;
  var senha = document.getElementById('hsenha').value;
  xhr = new XMLHttpRequest();
  xhr.open('POST', server + "/cx/funcoes.php");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
   if (xhr.status === 200) {
     if(xhr.responseText != 'erro'){
       var json = JSON.parse(xhr.responseText);
       localStorage.setItem("user", json[0].usuario);
       localStorage.setItem("logado", '1');
       inicializar();
    }else{
      msg('Senha ou usuário inválido!');
    }
    }else if (xhr.status !== 200) {
      msg('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=logar&hnome=' + nome + '&hsenha=' + senha));
};

var inicializar = function(){
  document.getElementById('conteudo').setAttribute('style', 'display:block;');
  document.getElementById('inicializar').setAttribute('style', 'display:block;');
  document.getElementById('login').setAttribute('style', 'display:none;');
  document.getElementById('footer').setAttribute('style', 'display:none;');
  document.getElementById('categorias').setAttribute('style', 'display:none;');
  monName = new Array ("Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho","Agosto", "Setembro","Outubro", "Novembro", "Dezembro");
	now = new Date;
	mes = now.getMonth();
	ano = now.getFullYear();
	document.getElementById('anomes').innerHTML = monName[now.getMonth()] + " de " + now.getFullYear();

	xhr = new XMLHttpRequest();
	xhr.open('POST', localStorage.getItem("server") + "/cx/funcoes.php");
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
	  if (xhr.status === 200) {
		var arr =  JSON.parse(xhr.responseText);
		var str = "";
		  for(var i = 0; i < arr.length; i++) {
      str += "<tr style='height:30px;'><td onclick='deletar(" + arr[i].id +",\"" + arr[i].descricao  + "\")'><i class='fas fa-trash-alt fa-lg'></i></td>";
			str += "<td align='center'>" + arr[i].dia + "</td>";
      str += "<td>" + arr[i].nome + " - " + arr[i].descricao  +"</td>";
      str += "<td>" + arr[i].sinal + " R$ " + numero2moeda(arr[i].valor) + "</td></tr>";
		   }
		document.getElementById('conteudoMov').innerHTML = str;
	  }
	  else if (xhr.status !== 200) {
		  msg('Request failed.  Returned status of ' + xhr.status);
	  }
	}
	xhr.send(encodeURI('acao=inicializar&mes=' + mes + '&ano=' + ano));
};

var categorias = function(){
  localStorage.setItem("id_cat", "");
  document.getElementById('categorias').setAttribute('style', 'display:block;');
  document.getElementById('inicializar').setAttribute('style', 'display:none;');

  document.getElementById('footer').setAttribute('style', 'display:block;');
  document.getElementById('adicionar').setAttribute('style', 'display:none;');
  xhr = new XMLHttpRequest();
  xhr.open('POST', localStorage.getItem("server") + "/cx/funcoes.php");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var arr =  JSON.parse(xhr.responseText);
      var str = "";
      for(var i = 0; i < arr.length; i++) {
        str += "<a class='w3-bar-item w3-button' href='javascript:void(0)' onclick='selecionarCat(" + arr[i].id + ")'>" + arr[i].nome + "</a>";
       }
      document.getElementById('categorias').innerHTML = str;
      voltar('block','inicializar');
    }
    else if (xhr.status !== 200) {
      msg('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=categorias'));
};

var selecionarCat = function(cat){
	now = new Date;
  document.getElementById('dia').value = now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear();
  localStorage.setItem("id_cat", cat);
  document.getElementById('categorias').setAttribute('style', 'display:none;');
  document.getElementById('adicionar').setAttribute('style', 'display:block;');
  document.getElementById('descricao').value = "";
  document.getElementById('valor').value = "";
  voltar('block','categorias');
};

var voltar = function(d,div){
  document.getElementById('footer').setAttribute('style', 'display:' + d);
  switch(div) {
    case 'inicializar':
      document.getElementById("btn_voltar").onclick = function() {
        inicializar();
      };
    break;
    case 'categorias':
    document.getElementById("btn_voltar").onclick = function() {
      categorias();
    };

    break;
    case 'adicionar':
    document.getElementById('adicionar').setAttribute('style', 'display:none;');
    document.getElementById("btn_voltar").onclick = function() {
      categorias();
    };
    break;
  }
};

var salvar = function(){
  var opt = document.forms[0];
  var tipo = "";
  var i;
  for (i = 0; i < opt.length; i++) {
      if (opt[i].checked) {
          tipo = tipo + opt[i].value + " ";
      }
  }
  var dia = document.getElementById('dia').value;
  var descricao = document.getElementById('descricao').value;
  var valor = document.getElementById('valor').value;
  var categoria = localStorage.getItem("id_cat");
  if(valor == ''){
    alert("Informe o valor!");
    return;
  }
  xhr = new XMLHttpRequest();
	xhr.open('POST', localStorage.getItem("server") + "/cx/funcoes.php");
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
	  if (xhr.status === 200) {
		   if(xhr.responseText == 'Ok') {
         inicializar();
       }
	  }
	  else if (xhr.status !== 200) {
		  msg('Request failed.  Returned status of ' + xhr.status);
	  }
	}
	xhr.send(encodeURI('acao=salvar&dia=' + dia + '&descricao=' + descricao + '&categoria=' + categoria + '&valor=' + valor + '&tipo=' + tipo));
};

var deletar = function(id, item){
  localStorage.setItem("id", id);
  var message = "Confirma deletar " + item;
  var title = "CONFIRMAR";
  var buttonLabels = "SIM,NAO";
  navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

  function confirmCallback(buttonIndex) {
    if(buttonIndex == 1){
      deletou();
    }
  }
};

var deletou = function(){
  xhr = new XMLHttpRequest();
	xhr.open('POST', localStorage.getItem("server") + "/cx/funcoes.php");
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
	  if (xhr.status === 200) {
		   if(xhr.responseText == 'Ok') {
         inicializar();
       }
	  }
	  else if (xhr.status !== 200) {
		  msg('Request failed.  Returned status of ' + xhr.status);
	  }
	}
	xhr.send(encodeURI('acao=deletar&id=' + localStorage.getItem("id")));
};

var msg = function(amsg){
  var message = amsg;
   var title = "ALERTA";
   var buttonName = "OK";
   navigator.notification.alert(message, alertCallback, title, buttonName);

   function alertCallback() {
      //console.log("Alert is Dismissed!");
   }
}
