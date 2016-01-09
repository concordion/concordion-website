// Benefit options
// These are the 4 "classes" of people who benefit from Concordion
var benefitOne = "developers";
var benefitTwo = "testers";
var benefitThree = "business-analysts";
var benefitFour = "project-stakeholders";


var currentBenefit = benefitOne;
var previousBenefit = benefitTwo;

$(document).ready(function() {

    // MOBILE NAVIGATION
    $(".button-collapse").sideNav({
        edge: 'right'
    });

    // BENEFITS BUTTON
    $('#benefits .btn').click(function() {

        var textToType = $(this).attr("id");

        console.log("button clicked " + textToType);

        $("#typed-text").typed({
            strings: [textToType, textToType],
            startDelay: 500,
            typeSpeed: 80,
            backSpeed: 30,
            backDelay: 3000,
            loop: false});
    });
});


$(window).load(function() {

    $("#typed-text").typed({
        strings: [
            printBenefit(benefitOne), 
            printBenefit(benefitTwo), 
            printBenefit(benefitThree), 
            printBenefit(benefitFour)
        ],
        startDelay: 500,
        typeSpeed: 80,
        backSpeed: 30,
        backDelay: 3000,
        loop: true,
        preStringTyped: function(){selectNextBenefitButton();}
    });

});

$(window).scroll(function() {
    
    if ($(document).scrollTop() + $('#main-nav').height() >= $('#homepage-hero').offset().top + $('#homepage-hero').height()) {
        $('nav').addClass("static");
    } else {
        $('#main-nav').removeClass("static");
    }
});

function selectNextBenefitButton() {
    console.log(currentBenefit + ", " + previousBenefit);
    // Select the button
    $('#btn-' + currentBenefit).addClass("active");
    // Remove from the previous button
    $('#btn-' + previousBenefit).removeClass("active");

    // Set next buttons
    previousBenefit = currentBenefit;

    if (currentBenefit === benefitOne) {
        currentBenefit = benefitTwo;
    } else if (currentBenefit === benefitTwo) {
        currentBenefit = benefitThree;
    } else if (currentBenefit === benefitThree) {
        currentBenefit = benefitFour;
    } else {
        currentBenefit = benefitOne;
    }
}

function printBenefit(benefit) {
    benefit = benefit + ".";
    benefit = benefit.replace("-", " ");
    return benefit;
}