var container = document.createElement("div");
container.setAttribute("class", "container");
var table = document.createElement("table");
table.setAttribute("class", "table table-striped");
var thead = document.createElement("thead");
thead.setAttribute("class", "thead-dark");
var tr = document.createElement("tr");
var th1 = createTrTd("td", "id");
var th2 = createTrTd("td", "name");
var th3 = createTrTd("td", "email");

tr.append(th1, th2, th3);
thead.append(tr);
table.append(thead);
container.append(table);
document.body.append(container);

var tbody = document.createElement("tbody");
tbody.setAttribute("id", "body");

table.append(tbody);
document.body.append(table);

function createTrTd(elem, value = "", classname = "", id = "") {
    var td = document.createElement(elem);
    td.innerHTML = value;
    td.setAttribute("class", classname);
    return td;
}

fetch('https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json')
    .then((res) => res.json())
    .then((data) => {
        console.log(data)

        data.forEach((user) => {
            $("#body").append(`
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
            </tr>
            `)
        });

        $(".table").table({
            vocabulary: {
                voc_show_rows: "Rows Per page",
            },
            pagination: true,
            showrows: [10],
        })
    });

(function ($) {
    $.fn.table = function (options = null) {
        var Table = $(this),
            Heads = $(this).find("thead th"),
            tbody = $(this).find("tbody"),
            rows = $(this).find("tbody tr"),
            rlen = rows.length,
            arr = [],
            cells,
            clen;

        var pagination = false;
        pagination =
            options !== null && options.pagination == true ? true : false;
        // default pagination variables
        var currentPage = 0;
        var numPerPage =
            pagination !== true && showrows_option !== true ? rows.length : 5;
        var numOfPages = options.numOfPages !== undefined && options.numOfPages > 0 ? options.numOfPages : 10;

        var showrows = [10];
        showrows =
            options !== null &&
                options.showrows != "" &&
                typeof options.showrows !== undefined &&
                options.showrows !== undefined
                ? options.showrows
                : showrows;

        var availableOptions = new Array();
        availableOptions = [
            "pagination",
            "showrows",
            "vocabulary",
            "numOfPages"
        ];

        /**
        Get options if set
        **/
        if (options !== null) {

            if (
                options.vocabulary != "" &&
                typeof options.vocabulary !== undefined &&
                options.vocabulary !== undefined
            ) {

                voc_show_rows =
                    options.vocabulary.voc_show_rows != "" &&
                        options.vocabulary.voc_show_rows !== undefined
                        ? options.vocabulary.voc_show_rows
                        : voc_show_rows;
            }

            var showrows_option = false;
            if (
                options.showrows != "" &&
                typeof options.showrows !== undefined &&
                options.showrows !== undefined
            ) {
                showrows_option = true;

                var numrowsDiv =
                    '<div id="for_numrows" class="for_numrows" style="display: inline;"><label for="numrows">' +
                    translate(voc_show_rows) +
                    ': </label><select id="numrows"></select></div>';
                // append div to choose num rows to show
                Table.before(numrowsDiv);
                // get show rows options and append select to its div
                for (i = 0; i < showrows.length; i++) {
                    $("select#numrows").append(
                        $("<option>", {
                            value: showrows[i],
                            text: showrows[i],
                        })
                    );
                }
                var selectNumRowsVal = $("select#numrows").val();
                numPerPage = selectNumRowsVal;
                // on select num rows change get value and call function
                $("select#numrows").on("change", function () {
                    selectNumRowsVal = $(this).val();
                    // reset current page to show always first page if select change
                    currentPage = 0;
                    generatePaginationValues();
                });
            }
            /**
            Pagination
            **/
            if (pagination === true || Table.hasClass("tablePagination")) {
                var numPages = Math.ceil(rows.length / numPerPage);

                var pagesDiv =
                    '<div id="pagesControllers" class="pagesControllers"></div>';
                Table.after(pagesDiv);

                if (showrows_option !== true) {
                    var selectNumRowsVal = numPerPage;
                }
                generatePaginationValues();
            }
        }

        function generatePaginationValues() {
            numPerPage = selectNumRowsVal;
            numPages = Math.ceil(rows.length / numPerPage);
            appendPageControllers(numPages);
            // Give currentPage class to first page number
            $(".pagecontroller-num").eq(0).addClass("currentPage");
            paginate(currentPage, numPerPage);
            pagecontrollersClick();
        }

        function paginate(curPage = null, perPage = null) {
            var curPage = curPage === null ? currentPage : curPage;
            var perPage = perPage === null ? numPerPage : perPage;
            Table.on("paginating", function () {
                $(this)
                    .find("tbody tr")
                    .hide()
                    .slice(curPage * perPage, (curPage + 1) * perPage)
                    .show();
            });
            Table.trigger("paginating");
        }

        function appendPageControllers(nPages) {
            $("#pagesControllers").html("");
            $("#pagesControllers").append(
                $("<button>", {
                    value: "prev",
                    text: "Previous",
                    class: "pagecontroller pagecontroller-p btn btn-primary",
                })
            );
            for (i = 1; i <= nPages; i++) {
                $("#pagesControllers").append(
                    $("<button>", {
                        value: i,
                        text: i,
                        class: "pagecontroller pagecontroller-num btn btn-primary",
                    })
                );
            }
            $("#pagesControllers").append(
                $("<button>", {
                    value: "next",
                    text: "Next",
                    class: "pagecontroller pagecontroller-n btn btn-primary",
                })
            );
        }
        function pagecontrollersClick() {
            $(".pagecontroller").on("click", function () {
                if ($(this).val() == "first") {
                    currentPage = 0;
                    paginate(currentPage, numPerPage);
                } else if ($(this).val() == "last") {
                    currentPage = numPages - 1;
                    paginate(currentPage, numPerPage);
                } else if ($(this).val() == "prev") {
                    if (currentPage != 0) {
                        currentPage = currentPage - 1;
                        paginate(currentPage, numPerPage);
                    }
                } else if ($(this).val() == "next") {
                    if (currentPage != numPages - 1) {
                        currentPage = currentPage + 1;
                        paginate(currentPage, numPerPage);
                    }
                } else {
                    currentPage = $(this).val() - 1;
                    paginate(currentPage, numPerPage);
                }
            });
        }
        function translate(string) {
            return string;
        }
    };
})(jQuery);