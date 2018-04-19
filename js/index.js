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
        //localStorage.setItem("server", "");
        //checkOnline('http://192.168.1.51');
        login();
    }
};
function checkOnline(server) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', server + "/cx/funcoes.php", true);
  xhr.timeout = 2000;
  xhr.onreadystatechange = function () {
      if(xhr.status === 200) {
        //document.getElementById('servidor').innerHTML = server;
        //localStorage.setItem("server", "http://192.168.1.51");
        localStorage.setItem("server", "http://localhost");
        login();
      }else{
        localStorage.setItem("server", "http://localhost");
        login();
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

var login = function(){
  document.getElementById('loading').setAttribute('style', 'display:none;');
  document.getElementById('login').setAttribute('style', 'display:block;');
  var mes = new Array("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez");
  mLen = mes.length;
  for (i = 0; i < mLen; i++) {
    var option = document.createElement("option");
    option.text = mes[i];
    option.value = i;
    document.getElementById('mes').appendChild(option);
  }

  var ano = new Array("2014", "2015", "2016", "2017", "2018", "2019", "2020");
  aLen = ano.length;
  for (i = 0; i < aLen; i++) {
    var option = document.createElement("option");
    option.text = ano[i];
    option.value = ano[i];
    document.getElementById('ano').appendChild(option);
  }
  now = new Date;
  document.getElementById('mes').value= now.getMonth();
  document.getElementById('ano').value= now.getFullYear();

  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var arr =  JSON.parse(xhr.responseText);
      for(var i = 0; i < arr.length; i++) {
        var option = document.createElement("option");
        option.text = arr[i].nome;
        option.value = arr[i].id;
        document.getElementById('categoria').appendChild(option);

        var option2 = document.createElement("option");
        option2.text = arr[i].nome;
        option2.value = arr[i].id;
        document.getElementById('alt_cat').appendChild(option2);
       }
      //inicializar();
    }
    else if (xhr.status !== 200) {
      msg('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=categorias'));
};

var logar = function(){
  //msg(localStorage.getItem("server"));
  var nome = document.getElementById('hnome').value;
  var senha = document.getElementById('hsenha').value;
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php", true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
   if (xhr.status === 200) {
     if(xhr.responseText != 'erro'){
       var json = JSON.parse(xhr.responseText);
       localStorage.setItem("user", json[0].usuario);
       localStorage.setItem("logado", '1');
       //esconde('inicializar');
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

var resumo = function(){
  document.getElementById('footer').setAttribute('style', 'display:none;');
  var mes = document.getElementById('mes').value;
  var ano = document.getElementById('ano').value;
  esconde('resumo');
  //document.getElementById('resumo').setAttribute('style', 'display:block;');
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php", true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
   if (xhr.status === 200) {
     if(xhr.responseText != 'erro'){
       var json = JSON.parse(xhr.responseText);
       //alert(json[0].entradas);
       document.getElementById('entradas').innerHTML = numero2moeda(json[0].entradas);
       document.getElementById('saidas').innerHTML = numero2moeda(json[0].saidas);
       var total = json[0].entradas - json[0].saidas;
       if(total < 0){
         document.getElementById("resultado").classList.add("w3-text-red");
       }else{
         document.getElementById("resultado").classList.remove("w3-text-red");
       }
       document.getElementById('total').innerHTML = numero2moeda(total);
    }else{
      msg('erro!');
    }
    }else if (xhr.status !== 200) {
      alert('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=resumo&ano=' + ano + '&mes=' + mes));

}

var inicializar = function(){
  var mes = document.getElementById('mes').value;
  var ano = document.getElementById('ano').value;
  var categoria = document.getElementById('categoria').value;
  esconde("inicializar");
  document.getElementById('footer').setAttribute('style', 'display:none;');
  /*document.getElementById('conteudo').setAttribute('style', 'display:block;');
  document.getElementById('inicializar').setAttribute('style', 'display:block;');
  document.getElementById('login').setAttribute('style', 'display:none;');
  document.getElementById('footer').setAttribute('style', 'display:none;');
  document.getElementById('categorias').setAttribute('style', 'display:none;');
  document.getElementById('adicionar').setAttribute('style', 'display:none;');
  document.getElementById('resumo').setAttribute('style', 'display:none;');
  document.getElementById('editar').setAttribute('style', 'display:none;');*/
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200) {
    var arr =  JSON.parse(xhr.responseText);
    var total = 0;
    var str = "";
      for(var i = 0; i < arr.length; i++) {
      str += "<tr style='height:32px;'><td style='text-align:center;'><i class='fas fa-edit fa-2x' style='color:DodgerBlue' onclick='editar(" + arr[i].id +")'></i></td>";
      str += "<td style='text-align:center;'>" + arr[i].dia + "</td>";
      str += "<td>" + arr[i].nome + " - " + arr[i].descricao  +"</td>";
      str += "<td style='text-align:right;'>" + arr[i].sinal + " " + numero2moeda(arr[i].valor) + "</td></tr>";
        if(arr[i].tipo == '0'){
          total = total +  parseFloat(arr[i].valor);
        }else{
          total = total - parseFloat(arr[i].valor);
        }
       }
    document.getElementById('conteudoMov').innerHTML = str;
    document.getElementById('soma').innerHTML = "R$: " + numero2moeda(total);
    }
    else if (xhr.status !== 200) {
      msg('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=inicializar&mes=' + mes + '&ano=' + ano + '&categoria=' + categoria));
};

var categorias = function(){
  localStorage.setItem("id_cat", "");
  esconde("categorias");
  document.getElementById('footer').setAttribute('style', 'display:none;');
  //document.getElementById('categorias').setAttribute('style', 'display:block;');
  //document.getElementById('inicializar').setAttribute('style', 'display:none;');
  //document.getElementById('adicionar').setAttribute('style', 'display:none;');
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
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

    case 'editar':
    document.getElementById("btn_voltar").onclick = function() {
      inicializar();
    };
  }
};

var salvar = function(){
  var opt = document.forms[0];
  //var x = document.getElementById("myForm").elements.length;
  var tipo = "";
  var i;
  for (i = 0; i < opt.length; i++) {
      if (opt[i].checked) {
          tipo = opt[i].value + " ";
      }
  }
  var dia = document.getElementById('dia').value;
  var descricao = document.getElementById('descricao').value;
  var valor = document.getElementById('valor').value;
  var categoria = localStorage.getItem("id_cat");
  if(valor == ''){
    msg("Informe o valor!");
    return;
  }
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
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

var deletar = function(){
  var id = document.getElementById('alt_id').value;
  var message = "Confirma deletar " + item;
  var title = "CONFIRMAR";
  var buttonLabels = "SIM,NAO";
  navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

  function confirmCallback(buttonIndex) {
    if(buttonIndex == 1){
      deletou(id);
    }
  }
};

var deletou = function(id){
  //var id = document.getElementById('alt_id').value;
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
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
  xhr.send(encodeURI('acao=deletar&id=' + id));
};

var editar = function(id){
  //document.getElementById("inicializar").style.display = 'none';
  //document.getElementById("editar").style.display = 'block';
  esconde("editar");
  voltar('block','inicializar');
  var tipo = document.forms[1];
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php", true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
   if (xhr.status === 200) {
     if(xhr.responseText != 'erro'){
       var json = JSON.parse(xhr.responseText);
       document.getElementById('alt_id').value = id;
       document.getElementById('alt_dia').value = json[0].dia;
       document.getElementById('alt_cat').value = json[0].cat;
       if(json[0].tipo == '0'){
         tipo[0].checked = true;
       }else{
         tipo[1].checked = true;
       }
       document.getElementById('alt_descricao').value = json[0].descricao;
       document.getElementById('alt_valor').value = numero2moeda(json[0].valor);
    }else{
      msg('erro!');
    }
    }else if (xhr.status !== 200) {
      msg('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=editar&id=' + id));
};

var salva_alteracoes = function(){
  id = document.getElementById('alt_id').value;
  dia = document.getElementById('alt_dia').value;
  categoria = document.getElementById('alt_cat').value;
  descricao = document.getElementById('alt_descricao').value;
  valor = document.getElementById('alt_valor').value;
  var opt = document.forms[1];
  var tipo = "";
  for (i = 0; i < opt.length; i++) {
      if (opt[i].checked) {
          tipo = opt[i].value + " ";
      }
  }

  if(valor == ''){
    msg("Informe o valor!");
    return;
  }
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
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
  xhr.send(encodeURI('acao=salvar&dia=' + dia + '&descricao=' + descricao + '&categoria=' + categoria + '&valor=' + valor + '&tipo=' + tipo + '&id=' + id));
};

var adm_categorias = function(){
  //document.getElementById('adm_categorias').style.display = 'block';
  document.getElementById('footer').setAttribute('style', 'display:none;');
  esconde("adm_categorias");
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var arr =  JSON.parse(xhr.responseText);
      var str = "";
      for(var i = 0; i < arr.length; i++) {
        str += "<tr style='height:32px;'><td style='text-align:center;'><i class='fas fa-edit fa-2x' style='color:DodgerBlue' onclick='editarCat(" + arr[i].id +",\"" + arr[i].nome  + "\")'></i></td>";
        str += "<td style='text-align:center;'><i class='fas fa-trash-alt fa-2x' style='color:red' onclick='excluirCat(" + arr[i].id +",\"" + arr[i].nome  + "\")'></i></td>";
        str += "<td>" + arr[i].nome  + "</td></tr>";
      }
    document.getElementById('conteudoCat').innerHTML = str;
    }
    else if (xhr.status !== 200) {
      msg('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=categorias'));
};

var esconde = function(div){
  document.getElementById('login').setAttribute('style', 'display:none;');
  document.getElementById('conteudo').setAttribute('style', 'display:block;');
  document.getElementById('resumo').setAttribute('style', 'display:none;');
  document.getElementById('inicializar').setAttribute('style', 'display:none;');
  document.getElementById('categorias').setAttribute('style', 'display:none;');
  document.getElementById('adm_categorias').setAttribute('style', 'display:none;');
  document.getElementById('editar_categorias').setAttribute('style', 'display:none;');
  document.getElementById('adicionar').setAttribute('style', 'display:none;');
  document.getElementById('editar').setAttribute('style', 'display:none;');
  document.getElementById(div).setAttribute('style', 'display:block;');
};

var excluirCat = function(id, item){
  var message = "Confirma deletar a categoria " + item;
  var title = "CONFIRMAR";
  var buttonLabels = "SIM,NAO";
  navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

  function confirmCallback(buttonIndex) {
    if(buttonIndex == 1){
      deletouCat(id);
    }
  }
};

var deletouCat = function(id){
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200) {
       if(xhr.responseText == 'Ok') {
         adm_categorias();
       }
    }
    else if (xhr.status !== 200) {
      msg('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=deletarCat&id=' + id));
};

var editarCat = function(id, cat){
  esconde('editar_categorias');
  document.getElementById('alt_categoria').value = cat;
  document.getElementById('alt_idCat').value = id;
};

var salvar_Cat = function(){
  var categoria = document.getElementById('alt_categoria').value;
  var id = document.getElementById('alt_idCat').value;
  xhr = new XMLHttpRequest();
  xhr.open('POST', "http://ebsleivas.sytes.net/cx/funcoes.php");
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200) {
       if(xhr.responseText == 'Ok') {
         adm_categorias();
       }
    }
    else if (xhr.status !== 200) {
      msg('Request failed.  Returned status of ' + xhr.status);
    }
  }
  xhr.send(encodeURI('acao=salvarCat&id=' + id + '&categoria=' + categoria));
};

var adicionar_categoria = function(){
  esconde('editar_categorias');
  document.getElementById('alt_categoria').value = "";
  document.getElementById('alt_idCat').value = "";
};

var msg = function(amsg){
  var message = amsg;
   var title = "ALERTA";
   var buttonName = "OK";
   navigator.notification.alert(message, alertCallback, title, buttonName);

   function alertCallback() {
      //console.log("Alert is Dismissed!");
   }

};
