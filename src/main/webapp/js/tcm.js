$(function() {
    $(".person-id-autocomplete").autocomplete({
        source : function(request, response) {
            $.ajax({
                url : "ajax/ids",
                dataType : "json",
                data : {
                    match : request.term,
                    action : "ids"
                },
                success : function(data) {
                    response($.map(data.ids, function(item) {
                        return {
                            label : item,
                    value : item
                        };
                    }));
                }
            });
        },
        minLength : 1,
        search : function() {
            console.log(arguments);
        },
        open : function() {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close : function() {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
});

$(function() {
    $(".cancerlists-autocomplete").autocomplete({
        source : function(request, response) {
            $.ajax({
                url : "ajax/cancerlists",
                dataType : "json",
                data : {
                    match : request.term,
                    action : "cancerlists"
                },
                success : function(data) {
                    response($.map(data.cancerlists, function(item) {
                        return {
                            label : item,
                    value : item
                        };
                    }));
                }
            });
        },
        minLength : 1,
        search : function() {
            console.log(arguments);
        },
        open : function() {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close : function() {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
});
(function () {
	var userAgent = window.navigator.userAgent;
	if (userAgent.match(/MSIE \d+\.\d/) != null && parseFloat(userAgent.match(/MSIE \d+\.\d/)[0].match(/\d+\.\d/)[0]) < 9) {
		window.alert("??????????????????Internet Expolorer??????" + parseFloat(userAgent.match(/MSIE \d+\.\d/)[0].match(/\d+\.\d/)[0])+ "??????????????????????????????????????????????????????????????????????????????Internet Explorer????????????9?????????????????????Firefox??????Google Chrome??????????????? ");
	}
})();
