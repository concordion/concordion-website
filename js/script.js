// Benefit options
// These are the 4 "classes" of people who benefit from Concordion
var benefitOne = "developers";
var benefitTwo = "testers";
var benefitThree = "business-analysts";
var benefitFour = "project-stakeholders";

var typedStrings = [
    printBenefit(benefitOne), 
    printBenefit(benefitTwo), 
    printBenefit(benefitThree), 
    printBenefit(benefitFour)
];

var initialSettings = {
    strings: typedStrings,
    startDelay: 500,
    typeSpeed: 80,
    backSpeed: 30,
    backDelay: 3000,
    loop: true,
    preStringTyped: function(){
        if(noButtonClicked) {
            selectNextBenefitButton();
        }
    }
};

var postClickSettings = {
    strings: typedStrings,
    startDelay: 0,
    typeSpeed: 80,
    backSpeed: 30,
    backDelay: 0,
    loop: false,
    preStringTyped: function(){
        if(noButtonClicked) {
            selectNextBenefitButton();
        }
    }
};

var noButtonClicked = true;

var currentBenefit = benefitOne;
var previousBenefit = benefitTwo;

$(document).ready(function() {

    // MOBILE NAVIGATION
    $(".button-collapse").sideNav({
        edge: 'right'
    });

    // BENEFITS BUTTON
    $('#benefits .btn').click(function() {

        var typedObject = window.typedObject;

        noButtonClicked = false;
        
        var id = $(this).attr("id");
        // remove 'btn-' prefix
        var section = id.substring(4, id.length)

        $('#benefits .btn').removeClass("active");
        $('.benefit-section').removeClass("active");
        $(this).addClass("active");
        $('#' + section).addClass("active");

        
        textToType = printBenefit(section);
        backspaceAndType(typedObject, textToType);
    });
});


$(window).load(function() {
    $("#typed-text").typed(initialSettings);
});

$(window).scroll(function() {

    if ($(document).scrollTop() + $('#main-nav').height() >= $('#homepage-hero').offset().top + $('#homepage-hero').height()) {
        $('nav').addClass("static");
    } else {
        $('#main-nav').removeClass("static");
    }
});

function backspaceAndType(typedObject, nextString) {
    typedObject.stop = true;

    var currentText = $('#typed-text').text();
    typedObject.strings = [nextString];
    typedObject.backspace(currentText, currentText.length);

    setTimeout(function(){
        type(typedObject, nextString)}, 500);
}

function type(typedObject, nextString) {
    if($('#typed-text').text().length > 0) {
        setTimeout(function(){type(typedObject, nextString)}, 500);
    } else {
        typedObject.reset();
        $('#typed-text').typed({
            strings: [nextString],
            startDelay: 0,
            typeSpeed: 80,
            backSpeed: 30,
            backDelay: 0,
            loop: false
        });
        //typedObject.stop = false;
        //typedObject.typewrite(typedObject.strings[0], typedObject.strPos);
    }
}

function selectNextBenefitButton() {
    //console.log(currentBenefit + ", " + previousBenefit);
    // Select the button + section
    $('#btn-' + currentBenefit).addClass("active");
    $('#' + currentBenefit).addClass("active");
    // Remove from the previous button + section
    $('#btn-' + previousBenefit).removeClass("active");
    $('#' + previousBenefit).removeClass("active");

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