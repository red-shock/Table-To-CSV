var keySubmit = document.getElementById('keysubmit');
var download = document.getElementById('download');

chrome.storage.local.get(['tbvalue'], function (item) {
  var keys = Object.keys(item.tbvalue[0]);
  var header = document.createElement('tr');
  for (x = 0; x < keys.length; x++) {
    var column = document.createElement('td');
    column.innerHTML = keys[x];
    column.className = 'key';
    header.append(column);
  }
  document.getElementById('table').appendChild(header);
  for (i = 0; i < item.tbvalue.length; i++) {
    var row = document.createElement('tr');
    for (j = 0; j < keys.length; j++) {
      var col = document.createElement('td');
      console.log(item.tbvalue[i][keys[j]]);
      col.innerHTML = item.tbvalue[i][keys[j]].toString();
      row.appendChild(col);
    }
    document.getElementById('table').appendChild(row);
  }
  for (k = 0; k < keys.length; k++) {
    var row = document.createElement('tr');
    var col = document.createElement('td');
    var col2 = document.createElement('td');
    col.innerHTML = keys[k];
    var input = document.createElement('input');
    input.type = 'text';
    input.name = 'input-' + keys[k];
    input.value = keys[k];
    input.className = 'input';
    col2.appendChild(input);
    row.appendChild(col);
    row.appendChild(col2);
    document.getElementById('keyTable').appendChild(row);
  }
});

keySubmit.addEventListener('click', async function onClick() {
  var keyClass = document.getElementsByClassName('key');
  var inputClass = document.getElementsByClassName('input');
  for (i = 0; i < keyClass.length; i++) {
    keyClass[i].innerHTML = inputClass[i].value;
  }
});

download.addEventListener('click', async function onClick() {
  chrome.storage.local.get(['tbvalue'], function (item) {
    var text = item.tbvalue;
    var createdText = [];
    var csv = [];
    var newkeys = [];
    var headers = document.getElementsByClassName('key');
    for (y = 0; y < headers.length; y++) {
      newkeys.push(headers[y].innerHTML);
    }
    var keys = Object.keys(item.tbvalue[0]);
    for (i = 0; i < text.length; i++) {
      tempDict = {};
      for (j = 0; j < keys.length; j++) {
        tempDict[newkeys[j]] = text[i][keys[j]].toString();
        csv.push(text[i][keys[j]].toString());
      }
      createdText.push(tempDict);
    }
    var element = document.createElement('a');
    var exportValue = document.getElementById('export').value;
    if (exportValue == 'csv') {
      element.href = 'data:text/plain;charset=utf8,' + encodeURIComponent(csv);
      element.download = 'data.csv';
    } else if (exportValue == 'json') {
      element.href =
        'data:text/plain;charset=utf8,' +
        encodeURIComponent(JSON.stringify(createdText));
      element.download = 'data.json';
    }
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  });
});
