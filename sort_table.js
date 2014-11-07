(function ($) {
    $.fn.sort_table = function(options) {
        var cur_table = this;
        init_head_table(options);
        cur_table.parent().append("<div class='copy_sort_table' style='display:none;'></div>");
        cur_table.parent().find("div.copy_sort_table").append(cur_table.clone());
        function init_head_table(options) {
            thead = cur_table.find("thead");
            thead.find("tr th").each(function() {
                if($(this).hasClass("no-sort") == false) {
                    $(this).addClass("sort");
                    init_set_header_status($(this), "sortable");
                    init_header_click($(this));
                }
            });
        }
        function init_header_click(head_th) {
            head_th.children("a.clicksort").click(function(event) {
                //change header status
                var sort_status = head_th.attr("sort_status");
                head_th.parent().find("th").each(function() {
                    if($(this).hasClass("no-sort") == false) {
                        set_header_status($(this), "sortable");
                    }
                });
                var cur_status = 'sortable'; 
                if(sort_status == 'sortable') {
                    set_header_status(head_th, 'up');
                    cur_status = 'up';
                } else if(sort_status == 'up') {
                    set_header_status(head_th, 'down');
                    cur_status = 'down';
                } else if(sort_status == 'down') {
                    set_header_status(head_th, 'sortable');
                    cur_status = 'sortable';
                }
                var col_index = 0; 
                var need_sort_col_index = 0;
                head_th.parent().find("th").each(function() {
                    if($(this).attr("sort_status") == cur_status) {
                        need_sort_col_index = col_index;
                    } else {
                        col_index++;
                    }
                });
                var rows = cur_table.parent().find("div.copy_sort_table table tbody tr");
                var copy_table = cur_table.parent().find("div.copy_sort_table table");
                var need_sort_col_vals = [];
                var rows_map = {};
                var isAllNum = true;
                for(var i = 0; i < rows.length; i++) {
                    var cur_row = copy_table.find("tbody tr:eq(" + i + ")");
                    var need_sort_col_td = cur_row.children("td:eq(" + need_sort_col_index + ")");
                    var key = need_sort_col_td.html();
                    if($.isNumeric(key)) {
                        var trailing_i = (i + 1) / (rows.length + 1);
                        trailing_i = trailing_i.toString();
                        trailing_i = trailing_i.substr(2);
                        if(key.indexOf('.') == -1) {
                            key = key + '.' + trailing_i;
                        } else {
                            key = key + trailing_i; 
                        }
                    } else {
                        key = key + ":" + i;
                        isAllNum = false;
                    }
                    need_sort_col_vals.push(key);
                    rows_map[key] = cur_row.clone();
                }
                if(cur_status != 'sortable') {
                    if(isAllNum) {
                       need_sort_col_vals.sort(function(a, b){
                           return a - b;
                       }); 
                    } else {
                        need_sort_col_vals.sort();
                    }
                    if(cur_status == 'up') {
                        need_sort_col_vals.reverse();
                    }
                }
                var cur_tbody = cur_table.find("tbody");
                cur_tbody.html("");
                for(var i = 0; i < need_sort_col_vals.length; i++) {
                    cur_tbody.append(rows_map[need_sort_col_vals[i]]); 
                }
            });
        }

        function set_header_status(head_th, type) {
            head_th.attr("sort_status", type);
            var span = head_th.find("a span.glyphicon:first");
            var head_th_anchor = head_th.children("a:first");
            if(span != null) {
                span.remove();
            }
            if(type == 'sortable') {
                head_th_anchor.append('<span class="glyphicon glyphicon-sort"></span>');
            } else if(type == 'up') {
                head_th_anchor.append('<span class="glyphicon glyphicon-chevron-up"></span>');
            } else if(type == 'down') {
                head_th_anchor.append('<span class="glyphicon glyphicon-chevron-down"></span>');
            }
        }
        function init_set_header_status(head_th, type) {
            var val = head_th.html();
            head_th.attr("sort_status", type);
            head_th.html("<a href='javascript:void(0);' class='btn clicksort' style='width:100%;'>" + val + "</a>");
            var span = head_th.find("a span.glyphicon:first");
            var head_th_anchor = head_th.children("a:first");
            if(span != null) {
                span.remove();
            }
            if(type == 'sortable') {
                head_th_anchor.append('&nbsp;&nbsp;<span class="glyphicon glyphicon-sort"></span>');
            } else if(type == 'up') {
                head_th_anchor.append('&nbsp;&nbsp;<span class="glyphicon glyphicon-down"></span>');
            } else if(type == 'down') {
                head_th_anchor.append('&nbsp;&nbsp;<span class="glyphicon glyphicon-down"></span>');
            }
        }
        return this;
    };
}( jQuery ));
