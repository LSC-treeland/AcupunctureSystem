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
		window.alert("你目前使用的Internet Expolorer為第" + parseFloat(userAgent.match(/MSIE \d+\.\d/)[0].match(/\d+\.\d/)[0])+ "版。為了確保整個網站能夠正常使用，我們建議您將微軟的Internet Explorer升級到第9版以上或是使用Firefox或是Google Chrome等瀏覽器。 ");
	}
})();
