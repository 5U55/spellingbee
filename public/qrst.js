var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200){
    
    for(var i=0;i<JSON.parse(xhttp.responseText).length;i++){
      if(JSON.parse(xhttp.responseText)[i].date !=null){
        var dateString = Number(JSON.parse(xhttp.responseText)[i].date);
      var date = new Date(dateString).toISOString();
      }
       document.getElementById("IPs").innerHTML += ", <br>"+ JSON.parse(xhttp.responseText)[i].addresses+"&nbsp;&nbsp;&nbsp;&nbsp;"+date;
    }
    console.log(xhttp.responseText);
    
  }
  // }
};
xhttp.open("GET", "./getIP", true);
xhttp.send();