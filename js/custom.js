jQuery(document).ready(function($) {
    $(".btn-signup").click(function() {
        $("html").addClass("no-scroll");
    });

    $(".close, .modal").click(function() {
        $("html").removeClass("no-scroll");
    })
});