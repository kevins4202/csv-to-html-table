import { parse } from './csvparse.js';

function table(options) {
    options = options || {};
    var csvPath = options.csvPath || '';
    var csvElement = options.csvElement || '';
    var processor = options.processor || ((element, val, colIdx, rowIdx) => element.textContent = val);

    var table = document.createElement('table');
    table.className = 'table table-striped table-condensed';
    table.id = csvElement + '-table';

    var containerElement = document.getElementById(csvElement);

    containerElement.innerHTML = '';
    containerElement.appendChild(table);

    fetch(csvPath)
        .then(response => response.text())
        .then(data => {
            var csvData = parse(data);

            var tableHead = document.createElement('thead')
            var csvHeaderRow = csvData[0];
            var tableHeadRow = document.createElement('tr')

            csvHeaderRow.forEach(header => {
                var th = document.createElement('th');
                th.textContent = header;
                tableHeadRow.appendChild(th);
            });

            tableHead.appendChild(tableHeadRow);

            table.append(tableHead);

            var tableBody = document.createElement('tbody');

            for (var rowIdx = 1; rowIdx < csvData.length; rowIdx++) {
                var tableBodyRow = document.createElement('tr');
                for (var colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
                    var tableBodyRowTd = processor(document.createElement('td'), csvData[rowIdx][colIdx], rowIdx, colIdx);
                    tableBodyRow.appendChild(tableBodyRowTd);
                }
                tableBody.appendChild(tableBodyRow);
            }

            table.append(tableBody);

            $(table).DataTable({ 'paging': false });

            var downloadLink = document.createElement('a');
            downloadLink.className = 'btn btn-info';
            downloadLink.href = `csv/${metric}_ranking.csv`;
            downloadLink.innerHTML = '<i class="glyphicon glyphicon-download"></i> Download this data as CSV';
            containerElement.appendChild(downloadLink);
        })
        .catch(error => console.error('Parse error', error));
}

export { table };