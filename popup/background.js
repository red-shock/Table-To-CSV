const btn = document.getElementById('transfer');
const input = document.getElementById('tablenum');

btn.addEventListener('click', async function onClick() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  chrome.storage.local.set({ tableIndex: input.value });
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
            console.log(tableIndex);
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
