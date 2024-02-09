const btn = document.getElementById('transfer');
const dropdown = document.getElementById('tableselect');

btn.addEventListener('click', async function onClick() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  chrome.storage.local.set({ tableIndex: dropdown.value });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: async () => {
        var arr = await chrome.storage.local
          .get(['tableIndex'])
          .then((value) => {
            tableIndex = value.tableIndex;
            if (Number.isNaN(tableIndex)) {
              tableIndex = 0;
            } else {
              tableIndex = parseInt(tableIndex);
              if (Number.isNaN(tableIndex)) {
                tableIndex = 0;
              }
            }
            keyDict = [];
            var row =
              document.getElementsByTagName('tbody')[tableIndex].children;
            var column = row[0].children;
            arr = [];
            for (x = 0; x < column.length; x++) {
              keyDict.push(x);
            }
            for (i = 0; i < row.length; i++) {
              tempDict = {};
              for (j = 0; j < column.length; j++) {
                try {
                  tempDict[keyDict[j]] =
                    row[i].children[j].innerText ||
                    row[i].children[j].textContent;
                } catch {
                  tempDict[keyDict[j]] = '';
                }
              }
              arr.push(tempDict);
            }
            return arr;
          });
        return arr;
      },
    },
    (res) => {
      chrome.storage.local.set({ tbvalue: res[0].result });
      chrome.tabs.create({ url: '../scripts/page.html' });
    }
  );
});

async function loadTables(){
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  console.warn(tab);
  if (tab == undefined || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
    editDropdown(true);
    console.warn("No active tab found");
    return;
  }
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => {
        let tables = document.getElementsByTagName('tbody');
        return tables.length;
    },
  },
  (res) => {
    let tableCount = res[0].result;
    let select = document.getElementById("tableselect");
    if (tableCount == 0) {
      console.warn("No tables found");
      editDropdown(true);
      return;
    }
    editDropdown(false);
    for (let i = 0; i < res[0].result; i++){
      let option = document.createElement("option");
      option.value = i;
      option.text = "Table " + i;
      select.add(option);
    }
  }
  );
}

function editDropdown(hide){
  let select = document.getElementById("tableselect");
  if (hide) {
    select.style.display = "none"
    btn.textContent = "No tables to select"
    btn.setAttribute("disabled", "")
  } else {
    select.style.display = "block"
    btn.textContent = "Select Table"
    btn.removeAttribute("disabled");
  }
}

// run when the user clicks the browser action
(async() =>{
  await loadTables();
})();