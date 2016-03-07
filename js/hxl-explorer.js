
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

    var sectionNode = $('<section id="card-view">')
    var cardsNode = $('<div id="hxl-cards" class="hxl-cards carousel slide">');
    var innerNode = $('<div class="carousel-inner" role="listbox">');
    var isFirst = true;
    var slider;

    function setupSlider () {
        slider = new Slider('#slider', {
            min: 1,
            max: hxlData.rows.length - 1,
            value: 1
        });

        // Update the carousel
        $('#slider').on('slideStop', function () {
            $('#hxl-cards').carousel(slider.getValue()-1);
        });
    }

    function getActiveIndex () {
        return $('.active', $('#hxl-cards')).index();
    }

    function updateHeader() {
        var index = $(innerNode).find('.active').index();
        $(sectionNode).find('h2').text('Record ' + (index + 1) + " of " + hxlData.rows.length);
    }

    function formatCard(row) {
        var cardNode = $('<table class="table hxl-card item">');
        for (var i = 0; i < hxlData.columns.length && i < row.values.length; i++) {
            var tableRowNode = $('<tr>');
            tableRowNode.append($('<th>').text(hxlData.columns[i].header || hxlData.columns[i].displayTag));
            tableRowNode.append($('<td>').text(row.values[i]));
            cardNode.append(tableRowNode);
        }
        return cardNode;
    }

    hxlData.forEach(function (row) {
        var cardNode = formatCard(row);
        if (isFirst) {
            isFirst = false;
            cardNode.addClass('active');
        }
        innerNode.append(cardNode);
    });
    cardsNode.append(innerNode);

    // example for detecting slide changes
    $(cardsNode).on('slid.bs.carousel', function () {
        updateHeader();
        slider.setValue(getActiveIndex() + 1);
    });

    $(cardsNode).on('swipeleft', function (e) {
        $(this).carousel('next');
    });

    $(cardsNode).on('swiperight', function (e) {
        $(this).carousel('prev');
    });

    setupSlider();
    
    sectionNode.append($('<h2>'));
    sectionNode.append(cardsNode);
    updateHeader();
    return sectionNode;
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
