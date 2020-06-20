
var price = {
    airportRoundTrip: 100,
    groceryPerDay: 50,
    tier: {
        deluxe: {
            perNight: {
                under3: 70,
                under21: 60,
                over21: 45
            },
            extraPerson: {
                under3: 15,
                under21: 10,
                over21: 8
            }
        },
        standard: {
            perNight: {
                under3: 60,
                under21: 50,
                over21: 35
            },
            extraPerson: {
                under3: 15,
                under21: 10,
                over21: 8
            }
        },
        economy: {
            perNight: {
                under3: 50,
                under21: 40,
                over21: 25
            },
            extraPerson: {
                under3: 15,
                under21: 10,
                over21: 8
            }
        }
    }
}

var calcState = {
    cottageTier: null,
    startDate: null,
    endDate: null,
    totalDays: null,
    extraPersons: null,
    airportTransOneWay: null,
    airportTransRoundTrip: null,
    groceryShopping: null,
    estimatedCost: null,
    yourName: null,
    yourEmail: null,
    yourMessage: null
};

function getTotalDays(){
    // Based on mplungjan answer from stack overflow: https://stackoverflow.com/questions/11771400/how-to-get-the-number-of-days-between-two-dates
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(`${calcState.startDate}`);
    var secondDate = new Date(`${calcState.endDate}`);

    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    
    return diffDays;
}

function getEstimatedCost(){

    var totalCost = 0;
    var totalDays = calcState.totalDays;
    var tier = calcState.cottageTier;
    var dateCategory = null;

    if(totalDays < 3) {
        dateCategory = 'under3';
    } else if (totalDays < 21) {
        dateCategory = 'under21';
    } else {
        dateCategory = 'over21';
    }

    totalCost += price.tier[tier].perNight[dateCategory] * totalDays;
    if(calcState.extraPersons) totalCost += price.tier[tier].extraPerson[dateCategory] * totalDays;

    if(calcState.airportTransRoundTrip) totalCost += price.airportRoundTrip;
    else if(calcState.airportTransOneWay) totalCost += price.airportRoundTrip/2;


    if(calcState.groceryShopping) totalCost += totalDays * price.groceryPerDay;

    return totalCost;

}

function getCottageTier(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tier = urlParams.get('t');
    return tier;
}

function setCalcState(){

    // console.log('set calc state');

    calcState = {
        startDate: jQuery("input[name=date-start]").val(),
        endDate:jQuery("input[name=date-end]").val(),
        extraPersons:parseInt(jQuery("select[name=extra-persons]").val()),
        airportTransOneWay:jQuery("input[value='One Way']").is(':checked'),
        airportTransRoundTrip:jQuery("input[value='Round Trip']").is(':checked'),
        groceryShopping:jQuery("input[name='grocery-shopping[]']").is(':checked'),
        yourName:jQuery("input[name=your-name]").val(),
        yourEmail:jQuery("input[name=your-email]").val(),
        yourMessage:jQuery("input[name=your-message]").val()
    };

    calcState.cottageTier = getCottageTier();
    calcState.totalDays = getTotalDays();
    calcState.estimatedCost = getEstimatedCost();

    displayPrice();

};

function displayPrice(){
    var element = jQuery('input[name=quoted-price]');
    
    if(!isNaN(calcState.estimatedCost)) {
        element.show();
        element.val(calcState.estimatedCost);
    } else {
        element.val('');
    }
    
}

// function getData(){
//     var url = "https://spreadsheets.google.com/feeds/cells/1b_fh2wT6bCPVhXvXnZJm_V203KSwA-chXHl1BP4seQI/od6/public/basic?alt=json";

//     jQuery.ajax({
//         url:url,
//         dataType:"jsonp",
//         success:function(data) {
//             console.log(data.feed.entry);
//             data = data.feed.entry;
//             // data.feed.entry is an array of objects that represent each cell
//             price.perNight = data[14].content.$t
//             // return data.feed.entry;
//         },
//     });
// }

function setHandlers(){
    setCalcState();
    
    jQuery("input,select").change(function(){
        setCalcState();
    });
}


document.addEventListener("DOMContentLoaded", setHandlers);
setHandlers();
