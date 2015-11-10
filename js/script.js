$(document).ready(function() {

    // MOBILE NAVIGATION
    $(".button-collapse").sideNav();

});

$(window).load(function() {

    $("#typed-text").typed({
        stringsElement: $('#typed-strings'),
        startDelay: 500,
        typeSpeed: 80,
        backDelay: 3000,
        loop: true
    });

});