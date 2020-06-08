var tabledata;
var incomedata;
var companyDataRequest;
var incomeRequest;
var idnr;
var labels = ['id','name', 'city','income'];
var ind=0;
var whole_income=0;
var incometable=[];

// Create Table

function htmlTable(selector, data, columns) {
	var sel = document.querySelector(selector);
	if(!sel) {
		throw new Error('Selected HTML element is not found');
  };	
  
  //Form for calculate
  var sel_02 = document.querySelector("#daterange");
  var form_01 = document.createElement('form')
  form_01.setAttribute('method','post');
  form_01.setAttribute('action', '/action_page.php');
  form_01.setAttribute('style','border: 1px solid grey; display: inline-block; margin-left: 35%; margin-top: 10px')
  sel_02.appendChild(form_01);

  var div_00=document.createElement('div')
  var p_00=document.createElement('p')
  p_00.textContent='Calculate total and average income for selected date range'
  p_00.setAttribute('style','font-weight: 600')
  form_01.appendChild(p_00)
  div_00.textContent ='\r\n Company ID: ';
  div_00.setAttribute('style','margin-left: 10px;')
  form_01.appendChild(div_00);

  var input_00 = document.createElement('input')
  input_00.setAttribute('type','number')
  input_00.setAttribute('name','companyID')
  input_00.setAttribute('value','')
  input_00.setAttribute('style','margin-top: 20px; margin-left: 10px;')
  div_00.appendChild(input_00);

  var div_01=document.createElement('div')
  div_01.textContent ='\r\n Start date:  ';
  div_01.setAttribute('style','margin-left: 10px;')
  form_01.appendChild(div_01);

  var input_01 = document.createElement('input')
  input_01.setAttribute('type','date')
  input_01.setAttribute('name','startDate')
  input_01.setAttribute('value','')
  input_01.setAttribute('style','margin-top: 20px; margin-left: 10px;')
  div_01.appendChild(input_01);


  var div_02=document.createElement('div')
  div_02.textContent ='\r\n End date:  ';
  div_02.setAttribute('style','margin-left: 10px;')
  form_01.appendChild(div_02);

  var input_02 = document.createElement('input')
  input_02.setAttribute('type','date')
  input_02.setAttribute('name','endDate')
  input_02.setAttribute('value','')
  input_02.setAttribute('style','margin-top: 20px;')
  div_02.appendChild(input_02);
  
  var div_03=document.createElement('div')
  form_01.appendChild(div_03);

  var button_01 = document.createElement('button')
  button_01.setAttribute('type','button')
  button_01.setAttribute('id','subm')
  button_01.setAttribute('onclick','calc();')
  button_01.textContent='Calc'
  button_01.setAttribute('style','margin-top: 20px; margin-left: 10px;')
  button_01.setAttribute('class','btn btn-primary')
  button_01.setAttribute('data-toggle','modal')
  button_01.setAttribute('data-target','#exampleModal')
  div_03.appendChild(button_01);

	if((!columns) || columns.length == 0) {
        columns = Object.keys(data[0]);
  }

// Main table
    var tbe = document.createElement('table');
    tbe.setAttribute("class", "table table-striped table-bordered");
    tbe.setAttribute("style","width: 100%");
    tbe.setAttribute("id","res0");
	var thead = document.createElement('thead');
	tbe.appendChild(thead);
  var tre = document.createElement('tr');
  for(var i=0;i<columns.length;i++){
    var the = document.createElement('th');
    the.textContent = columns[i];
    tre.appendChild(the);
  }
  thead.appendChild(tre);

	var tbody = document.createElement('tbody');
	tbe.appendChild(tbody);
	for(var j=0;j<data.length;j++){
		var tre = document.createElement('tr');
		for(var i=0;i<columns.length;i++){
            var the = document.createElement('td');
            the.textContent = data[j][columns[i]];
            tre.appendChild(the);
            if(i==1)
            {
              //Company details
                var dets = document.createElement('details');
                var last_month_income=0;
                dets.setAttribute("style","float: right;");
                dets.textContent = "Id: " + data[j].id + "\r\nName: " + data[j].name + "\r\nCity: " + data[j].city + "\r\nTotal income: " + data[j].income + "\r\nAverage income: " + data[j].average
                for(k=0;k<incometable.length;k++)
                {
                  if(incometable[k].id==data[j].id)
                  {
                    var last_year=0;
                    var last_month=0;
                    for(l=0;l<incometable[k].incomes.length;l++)
                    {
                      var mydate = new Date(incometable[k].incomes[l].date);
                      var year = mydate.getFullYear();
                      if(year>last_year)
                      {
                        last_year=year;
                      }
                    }
                    for(m=0;m<incometable[k].incomes.length;m++)
                    {
                      var mydate2 = new Date(incometable[k].incomes[m].date);
                      var year = mydate2.getFullYear();
                      if(year==last_year)
                      {
                        var month = mydate2.getMonth()+1;
                        if(month>last_month)
                        {
                          last_month=month;
                        }
                      }
                    }
                    for(n=0;n<incometable[k].incomes.length;n++)
                    {
                      var mydate3 = new Date(incometable[k].incomes[n].date);
                      var year = mydate3.getFullYear();
                      var month = mydate3.getMonth()+1;
                      if((year==last_year)&&(month==last_month))
                      {
                        last_month_income = last_month_income + parseFloat(incometable[k].incomes[n].value);
                      }
                    }
                    dets.textContent += "\r\nLast month(" + last_month + "/" + last_year + ") income: " + last_month_income.toFixed(2); + "\r\n"
                  }
                };

                the.appendChild(dets);

                var trew = document.createElement('summary');
                trew.textContent = 'Details'
                dets.appendChild(trew);
                trew.setAttribute("style","float: right;");
                trew.setAttribute("id",data[j].id);    
            }
		}
		tbody.appendChild(tre);
	};
	emptyDOMChildren(sel);
  sel.appendChild(tbe);
  //Hide loader
  document.getElementById("loader").style.display = "none";
};

function emptyDOMChildren (container){
  var len = container.childNodes.length;
  while (len--) {
    container.removeChild(container.lastChild);
  };
};

//Company data request
function makeRequest() {
    companyDataRequest = new XMLHttpRequest();
    if (!companyDataRequest) {
      alert('Cannot finish request');
      return false;
    }
    companyDataRequest.onreadystatechange = alertContents;
    companyDataRequest.open('GET', 'https://recruitment.hal.skygate.io/companies');
    companyDataRequest.send();
  }

function alertContents() {
    if (companyDataRequest.readyState === XMLHttpRequest.DONE) {
      if (companyDataRequest.status === 200) {
        var company_data=companyDataRequest.responseText;
        tabledata = JSON.parse(company_data);
        for(i=0;i<tabledata.length;i++){
            ind=tabledata[i].id;
            makeincomeRequest(ind);
            tabledata[i]["income"]=whole_income.toFixed(2);
            tabledata[i]["average"]=(whole_income/incomedata['incomes'].length).toFixed(2);
        }
        htmlTable("#nowe",tabledata, labels);
      } else {
        alert('There was a problem with the request.');
      }
    }
  };

//Company ID data request
function makeincomeRequest(idnr) {
    incomeRequest = new XMLHttpRequest();
    var stringadrr='https://recruitment.hal.skygate.io/incomes/'+idnr
    if (!incomeRequest) {
      alert('Cannot finish request');
      return false;
    }
    incomeRequest.onreadystatechange = alertIncome;
    incomeRequest.open('GET', stringadrr,false);
    incomeRequest.send();
}  

function alertIncome() {
    if (incomeRequest.readyState === XMLHttpRequest.DONE) {
      if (incomeRequest.status === 200) {
        var income=incomeRequest.responseText;
        incomedata = JSON.parse(income);
        incometable.push(incomedata);
        whole_income=0;
        for (indx=0;indx<incomedata['incomes'].length;indx++)
        {
            whole_income=whole_income+parseFloat(incomedata.incomes[indx].value)
        }
      } else {
        alert('There was a problem with the request.');
      }
    }
  };

makeRequest();

//Calcualte data for selected range
function calc(){
  var id_comp = document.getElementsByName("companyID")[0].value
  var enddate = new Date(document.getElementsByName("endDate")[0].value);
  var startdate = new Date(document.getElementsByName("startDate")[0].value);
  var indx=0;

  for(k=0;k<incometable.length;k++)
  {
    if(incometable[k].id==id_comp)
    {
    indx=k  
    }
  }
  var calc_income=0;
  var calc_nr=0;
 
  for(l=0;l<incometable[indx].incomes.length;l++)
  {
    var currentdate = new Date(incometable[indx].incomes[l].date);
    if(incometable[indx].id==id_comp)
    {
      if((currentdate>=startdate)&&(enddate>=currentdate))
      {
        calc_income=calc_income+parseFloat(incometable[indx].incomes[l].value);
        calc_nr=calc_nr+1;
      }
    }
  }

var avr = (calc_income/calc_nr).toFixed(2);
var i_00 = document.getElementById("companyIDs");
var a_00 = document.getElementById("companyAverage");
var t_00 = document.getElementById("companyTotal");

i_00.textContent = "Selected company ID:  " + id_comp;
t_00.textContent = "Calculated total income:  " + calc_income.toFixed(2)
a_00.textContent = "Calculated average:  " + avr
};
