
var hxlExplorer = {
    views: {}
};

hxlExplorer.load = function (url, nodeId) {

    $.get(url, function (data) {
        var hxlData = hxl.wrap($.csv.toArrays(data));
        $(nodeId).append(hxlExplorer.views.cards(hxlData));
    }).fail(function () {
        alert("Cannot read from " + url);
    });
};

hxlExplorer.views.cards = function (hxlData) {

    function formatIndicators(hxlData) {
        var indicatorsNode = $('<ol class="carousel-indicators">');
        for (var i = 0; i < hxlData.rows.length; i++) {
            var indicatorNode = $('<li data-target="#hxl-cards">').attr('data-slide-to', i);
            if (i == 0) {
                indicatorNode = indicatorNode.addClass('active');
            }
            indicatorsNode.append(indicatorNode);
        }
        console.log("Done indicators");
        return indicatorsNode;
    }

    function formatCard(hxlData, row) {
        var cardNode = $('<dl class="hxl-card dl-horizontal item">');
        for (var i = 0; i < hxlData.columns.length && i < row.values.length; i++) {
            cardNode.append($('<dt>').text(hxlData.columns[i].header || hxlData.columns[i].displayTag));
            cardNode.append($('<dd>').text(row.values[i]));
        }
        return cardNode;
    }

    var cardsNode = $('<div id="hxl-cards" class="hxl-cards carousel slide">');
    var innerNode = $('<div class="carousel-inner" role="listbox">');
    var isFirst = true;
    hxlData.forEach(function (row) {
        var cardNode = formatCard(hxlData, row);
        if (isFirst) {
            isFirst = false;
            cardNode.addClass('active');
        }
        innerNode.append(cardNode);
    });
    //cardsNode.append(formatIndicators(hxlData));
    cardsNode.append(innerNode);
    cardsNode.append($('<a class="left carousel-control" href="#hxl-cards" role="button" data-slide="prev"> <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> <span class="sr-only">Previous</span> </a> <a class="right carousel-control" href="#hxl-cards" role="button" data-slide="next"> <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> <span class="sr-only">Next</span> </a>'));
    return cardsNode;
}

hxlExplorer.views.table = function (hxlData) {

    function formatTableHead (hxlData) {
        var theadNode = $('<thead>');
        var headersRow = $('<tr class="hxl-headers">');
        var tagsRow = $('<tr class="hxl-tags">');
        hxlData.columns.forEach(function (column) {
            headersRow.append($('<th>').text(column.header));
            tagsRow.append($('<th>').text(column.displayTag));
        });
        theadNode.append(headersRow);
        theadNode.append(tagsRow);
        return theadNode;
    }

    function formatTableBody (hxlData) {
        var tbodyNode = $('<tbody>');
        hxlData.forEach(function (row) {
            var rowNode = $('<tr>');
            row.values.forEach(function (value) {
                rowNode.append($('<td>').text(value));
            });
            tbodyNode.append(rowNode);
        });
        return tbodyNode;
    }

    var tableNode = $('<table class="hxl-table">');
    tableNode.append(formatTableHead(hxlData));
    tableNode.append(formatTableBody(hxlData));
    return tableNode;

};
