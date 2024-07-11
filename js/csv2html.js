import { parse } from './csvparse.js';

function table(options) {
    options = options || {};
    var csv_path = options.csv_path || "";

    var table = document.createElement('table');
    table.className = 'table table-striped table-condensed';
    table.id = 'tableElement-table';

    var containerElement = document.getElementById('tableElement');

    containerElement.innerHTML = '';
    containerElement.appendChild(table);

    fetch(csv_path)
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
                    var tableBodyRowTd = document.createElement('td');
                    tableBodyRowTd.textContent = csvData[rowIdx][colIdx];
                    tableBodyRow.appendChild(tableBodyRowTd);
                }
                tableBody.appendChild(tableBodyRow);
            }

            table.append(tableBody);

            $(table).DataTable({ "paging": false });

            var downloadLink = document.createElement('a');
            downloadLink.className = 'btn btn-info';
            downloadLink.href = csv_path;
            downloadLink.innerHTML = "<i class='glyphicon glyphicon-download'></i> Download this data as CSV";
            containerElement.appendChild(downloadLink);
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}

export { table };