

// ======= ======= ======= CSV FILES ======= ======= =======
// ======= ======= ======= CSV FILES ======= ======= =======
// ======= ======= ======= CSV FILES ======= ======= =======


// ======= ======= ======= DCPS_Master_114 ======= ======= =======
// Agency, School, SCHOOLCODE, Address, maxOccupancy, Enroll.Cap, ProjectPhase, YrComplete, Level, totalSQFT, ProjectType, MajorExp9815, TotalAllotandPlan1621, LifetimeBudget, LON, LAT, WARD, FeederMS, FeederHS, Total.Enrolled, Limited.English.Proficient, At_Risk, AtRiskPer, SPEDPer, ESLPer, SqFtPerEnroll, SpentPerEnroll, SpentPerSqFt

// ======= ======= ======= DCPS_Master_114_dev ======= ======= =======
// Agency, School, SCHOOLCODE, Address, Level, WARD, FeederMS, FeederHS, LON, LAT, totalSQFT, maxOccupancy, Enroll_Cap, Total_Enrolled, Limited_English, At_Risk, ProjectPhase, YrComplete, ProjectType, MajorExp9815, TotalAllotandPlan1621, LifetimeBudget ... AtRiskPer, SPEDPer, ESLPer, SqFtPerEnroll, SpentPerEnroll, SpentPerSqFt




// ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======

// ======= ======= ======= getZoneUrl ======= ======= =======
function getZoneUrl(whichLevel) {
    console.log("getZoneUrl");
    console.log("  whichLevel: ", whichLevel);

    var url;

    switch(whichLevel) {
        case "Ward":
            url = "Data_Geo/Ward__2012.geojson";
            break;
        case "HS":
            url = "Data_Geo/School_Attendance_Zones_Senior_High__New.geojson";
            break;
        case "MS":
            url = "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
            break;
        case "ES":
            url = "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
            break;
        default:
            url = "Data_Geo/DC_Quadrants.geojson";
            break;
    }
    return url;
}

// ======= ======= ======= removeAbbreviations ======= ======= =======
function removeAbbreviations(longName) {
    console.log("removeAbbreviations");
    var nameNoiseIndex = longName.indexOf(", ");
    if (nameNoiseIndex > -1) {
        splitZoneName = longName.split(", ");
        shortName = splitZoneName[0];
        return shortName;
    } else {
        return longName;
    }
}

// ======= ======= ======= processSchoolName ======= ======= =======
function processSchoolName(schoolName) {
    // console.log("processSchoolName");

    var shortName;

    shortName = schoolName.replace("Elementary School", "");
    shortName = shortName.replace("High School", "");
    shortName = shortName.replace("Middle School", "");
    shortName = shortName.replace("Education Campus", "");
    shortName = shortName.replace("ES", "");

    checkName1 = shortName.indexOf(", ");
    if (checkName1 > -1) {
        splitZoneName = shortName.split(", ");
        shortName = splitZoneName[0];
    }
    checkName2 = shortName.indexOf(". ");
    if (checkName2 > -1) {
        splitZoneName = shortName.split(". ");
        shortName = splitZoneName[1];
    }
    checkName3 = shortName.indexOf(" ");
    if (checkName3 > -1) {
        splitZoneName = shortName.split(" ");
        shortName = splitZoneName[0];
        // if (checkName3 == (shortName.length - 1)) {
        //     shortName = shortName.substring(0, (shortName.length - 1));
        // }
    }
    return shortName;
}

// ======= ======= ======= makeZoneAggregator ======= ======= =======
function makeZoneAggregator(zonesCollectionObj) {
    console.log("makeZoneAggregator");

    zonesCollectionObj.aggregatorArray = [];
    if (zonesCollectionObj.zoneGeojson) {
        var nextZoneName, splitZoneName, nextZoneObject;
        for (var i = 0; i < zonesCollectionObj.zoneGeojson.features.length; i++) {
            nextZoneName = processSchoolName(zonesCollectionObj.zoneGeojson.features[i].properties.NAME)
            nextZoneObject = { schoolName: nextZoneName, schoolValue: 0 }
            zonesCollectionObj.aggregatorArray.push(nextZoneObject);
        }
    } else {
        console.log("ERROR: no geojson data");
    }
    // console.log("  aggregator.length", zonesCollectionObj.aggregatorArray.length);
    console.dir(zonesCollectionObj.aggregatorArray);
}

// ======= ======= ======= makeSchoolsAggregator ======= ======= =======
function makeSchoolsAggregator(schoolsCollectionObj) {
    console.log("makeSchoolsAggregator");

    schoolsCollectionObj.selectedNamesArray = [];
    schoolsCollectionObj.selectedDataArray = [];
    if (schoolsCollectionObj.selectedSchoolsArray) {
        for (var i = 0; i < schoolsCollectionObj.selectedSchoolsArray.length; i++) {
            nextSchoolName = schoolsCollectionObj.selectedSchoolsArray[i].schoolName;
            splitSchoolName = nextSchoolName.split(", ");
            nextSchoolName = splitSchoolName[0];
            schoolsCollectionObj.selectedNamesArray.push(nextSchoolName);
            schoolsCollectionObj.selectedDataArray.push(0);
        }
    } else {
        console.log("ERROR: no json data");
    }
}

// ======= ======= ======= clearZoneAggregator ======= ======= =======
function clearZoneAggregator(zonesCollectionObj) {
    console.log("clearZoneAggregator");

    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        zonesCollectionObj.aggregatorArray[i].schoolValue = 0;
    }
}

// ======= ======= ======= aggregateSchoolData ======= ======= =======
function aggregateSchoolData(schoolsCollectionObj, displayObj, schoolData, schoolIndex) {
    console.log("aggregateSchoolData");

    // == identify column holding selected expend data
    nextSchoolName = schoolData.schoolName;
    nextSchoolExpend = parseInt(schoolData[displayObj.dataFilters.expend]);
    if (Number.isInteger(nextSchoolExpend)) {
        currentExpend = schoolsCollectionObj.selectedDataArray[schoolIndex];
        aggregatedExpend = currentExpend + nextSchoolExpend;
        schoolsCollectionObj.selectedNamesArray[schoolIndex] = nextSchoolName;
        schoolsCollectionObj.selectedDataArray[schoolIndex] = aggregatedExpend;
    }
}

// ======= ======= ======= captureSchoolData ======= ======= =======
function captureSchoolData(zonesCollectionObj, displayObj, schoolData) {
    console.log("captureSchoolData");

    // == match school name from geojson file with school name from csv file
    var nextSchoolZone, zoneSuffix;
    var zoneGeojson = zonesCollectionObj.zoneGeojson;
    var zoneAggregator = zonesCollectionObj.aggregatorArray;

    if (displayObj.dataFilters.levels) {
        var nextZoneName, splitZoneName, nextZoneObject;
        checkSchoolName = processSchoolName(schoolData.schoolName)
        // console.log("** checkSchoolName: ", checkSchoolName);
        for (var i = 0; i < zoneAggregator.length; i++) {
            nextDataObject = zoneAggregator[i];
            nextSchoolName = nextDataObject.schoolName;
            // console.log("  nextSchoolName: ", nextSchoolName);
            if (nextSchoolName == checkSchoolName) {
                nextSchoolExpend = parseInt(schoolData[displayObj.dataFilters.expend]);
                if (Number.isInteger(nextSchoolExpend)) {
                    currentExpendValue = nextDataObject.schoolValue;
                    if (currentExpendValue == 0) {
                        aggregatedExpend = currentExpendValue + nextSchoolExpend;
                        nextDataObject.schoolValue = aggregatedExpend;
                    } else {
                        console.log("ERROR: data already captured for " + nextSchoolName);
                        break;
                    }
                } else {
                    console.log("ERROR: non-integer number for " + nextSchoolName);
                }
                break;
            }
        }
    }
}

// ======= ======= ======= setZoneColor ======= ======= =======
function setZoneColor(zonesCollectionObj, displayObj, featureIndex, colorIndex) {
    console.log("setZoneColor");
    console.log("**  featureIndex: ", featureIndex);

    // == get color if expend filter selected
    if (displayObj.dataFilters.levels) {
        if (displayObj.dataFilters.expend) {
            colorIndex = assignDataColors(zonesCollectionObj, featureIndex);
            itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
        } else {
            itemColor = "white";
        }
    } else {
        itemColor = "white";
    }
    return itemColor;
}

// ======= ======= ======= assignDataColors ======= ======= =======
function assignDataColors(zonesCollectionObj, featureIndex) {
    console.log("assignDataColors");

    var nextExpendValue = zonesCollectionObj.aggregatorArray[featureIndex - 1].schoolValue;
    console.log("  nextExpendValue: ", nextExpendValue);
    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        binMin = (zonesCollectionObj.dataIncrement * i);
        binMax = (zonesCollectionObj.dataIncrement * (i + 1));
        // console.log("  binMax: ", binMax);
        if ((binMin <= nextExpendValue) && (nextExpendValue <= binMax)) {
            colorIndex = i;
            break;
        }
    }
    return colorIndex;
}

// ======= ======= ======= makeMapLegend ======= ======= =======
function makeMapLegend(zonesCollectionObj) {
    console.log("makeMapLegend");

    var zoneValuesArray = [];
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZoneValue = zonesCollectionObj.aggregatorArray[i].schoolValue;
        zoneValuesArray.push(nextZoneValue);
    }

    var dataMax = Math.max.apply(Math, zoneValuesArray);
    var dataMin = Math.min.apply(Math, zoneValuesArray);
    // console.log("  .zoneValuesArray: ", zoneValuesArray);
    // console.log("  dataMax: ", dataMax);
    // console.log("  dataMin: ", dataMin);
    var scaleLabels = getScaleFactor(dataMax)
    var scaleFactor = scaleLabels[0];
    var scaleLabel = scaleLabels[1];
    var nextMin = 0;
    var nextMax = 0;
    var nextColor;

    // == remove previous legend html if any
    $("#mapLegend").remove();
    // $("#mouseover-text").children("h2").empty();

    // == make legend html for color chips
    var tableString = "";
    tableString += "<table id='mapLegend'>";
    tableString += "<tr><th class='amount'>data</th><th class='values'>color</th></tr>";
    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        nextMin = nextMax;
        nextMax += parseInt(zonesCollectionObj.dataIncrement);
        var minString = scaleLabel + (nextMin/scaleFactor).toFixed(1).toString();
        var maxString = (nextMax/scaleFactor).toFixed(1).toString();
        tableString += "<tr><td class='minMaxCol'><p class='minMax'>" + minString + " - " + maxString + "</p></td>";
        tableString += "<td class='colorChipCol'><div id='colorChip" + i + "' class='colorChip'>&nbsp;</div></td></tr>";
    }
    tableString += "</table>";

    // $("#mouseover-text").children("h2").children("table").remove();
    $("#mouseover-text").append(tableString);
    // $("#legend").css("display", "block");

    // == set colors on color chips
    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        nextChip = $("#colorChip" + i);
        nextColor = zonesCollectionObj.dataColorsArray[i];
        $("#colorChip" + i).css("background-color", nextColor);
    }
}

// ======= ======= ======= getScaleFactor ======= ======= =======
function getScaleFactor(dataMax) {
    console.log("getScaleFactor");
    if (dataMax > 1000000) {
        scaleFactor = 1000000;
        scaleLabel = "$M ";
    } else if ((dataMax < 1000000) && (dataMax > 1000)) {
        scaleFactor = 1000;
        scaleLabel = "$K ";
    } else {
        scaleFactor = 1;
        scaleLabel = "$";
    }
    return [scaleFactor, scaleLabel];
}

// ======= ======= ======= calcDataIncrement ======= ======= =======
function calcDataIncrement(zonesCollectionObj, displayObj) {
    console.log("calcDataIncrement");

    var zoneValuesArray = [];
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZoneValue = zonesCollectionObj.aggregatorArray[i].schoolValue;
        zoneValuesArray.push(nextZoneValue);
    }

    var fillOpacity = 1;
    var maxValue = Math.max.apply(Math, zoneValuesArray);
    var minValue = Math.min.apply(Math, zoneValuesArray);
    var dataIncrement = (maxValue - minValue)/zonesCollectionObj.dataBins;
    return dataIncrement;
}

// ======= ======= ======= removeMarkers ======= ======= =======
function removeMarkers(schoolsCollectionObj) {
    console.log("removeMarkers");

    // console.log("  markers_before: ", mapDataObject.schoolMarkersArray.length);
    var schoolMarkersArray = schoolsCollectionObj.schoolMarkersArray;
    if (schoolMarkersArray) {
        for(i = 0; i < schoolMarkersArray.length; i++){
            schoolMarkersArray[i].setMap(null);
            schoolMarkersArray[i] = null;
        }
    }
    schoolsCollectionObj.schoolMarkersArray = [];
    // console.log("  markers_after: ", mapDataObject.schoolMarkersArray.length);
}

// ======= ======= ======= de_activateZoneListeners ======= ======= =======
function de_activateZoneListeners(zonesCollectionObj) {
    console.log("de_activateZoneListeners");

    google.maps.event.clearListeners(map, 'mouseover');
    google.maps.event.clearListeners(map, 'mouseout');
    google.maps.event.clearListeners(map, 'click');

    // console.log("  listeners_before: ", mapDataObject.mapListenersArray.length);
    var mapListenersArray = zonesCollectionObj.mapListenersArray;
    if (zonesCollectionObj.mapListenersArray.length > 0) {
        for (var i = 0; i < zonesCollectionObj.mapListenersArray.length; i++) {
            google.maps.event.removeListener(zonesCollectionObj.mapListenersArray[i]);
        }
    }
    zonesCollectionObj.mapListenersArray = [];
    // console.log("  listeners_after: ", mapDataObject.mapListenersArray.length);
}

// ======= ======= ======= makeZoneGeometry ======= ======= =======
function makeZoneGeometry(feature) {
    // console.log("makeZoneGeometry");

    var polyCount = 0;
    var multiPolyCount = 0;
    var polygonArray = [];

    // ======= traverse geometry paths for each feature =======
    feature.getGeometry().getArray().forEach(function(path) {
        featureType = feature.getGeometry().getType();
        featureBounds = new google.maps.LatLngBounds();
        if (featureType == "Polygon") {
            polyCount++;
            polygonArray.push(path);

            path.getArray().forEach(function(latLng) {
                featureBounds.extend(latLng);
            });
        } else {
            multiPolyCount++;
            polygonArray.push(path.j[0]);

            path.j[0].getArray().forEach(function(latLng) {
                featureBounds.extend(latLng);
            });
        }
    });

    // == get center of each feature
    centerLat = featureBounds.getCenter().lat();
    centerLng = featureBounds.getCenter().lng();
    centerLatLng = new google.maps.LatLng({lat: centerLat, lng: centerLng});
    return centerLatLng;
}

// ======= ======= ======= makeChartDisplay ======= ======= =======
function makeChartDisplay() {
    console.log("makeChartDisplay");

    var chartHtml = "<div id='chart-container'>";
    chartHtml += "<div id='chart-title' class='title_bar'><p>data chart</p></div>";
    chartHtml += "<div id='chart'></div></div>";

    // == remove previous profile or chart html if any
    if ($('#mouseover-text').find('table').length) {
        $("#profile").remove();
    }
    if ($('#mouseover-text').find('#chart-container').length) {
        $("#chart-container").remove();
    }
    $("#mouseover-text").append(chartHtml);
    $("#chart-container").fadeIn( "fast", function() {
        console.log("*** FADEIN ***");
    });
}



// ======= ======= ======= checkFilterSelection ======= ======= =======
function checkFilterSelection(displayObj, zonesCollectionObj) {
    console.log("checkFilterSelection");
    console.log("  levels: ", displayObj.dataFilters.levels);
    console.log("  expend: ", displayObj.dataFilters.expend);
}

// ======= ======= ======= updateHoverText ======= ======= =======
function updateHoverText(itemName, schoolType) {
    // console.log("updateHoverText");

    var filterTitleContainer = $("#mouseover-text").children("h2");
    // console.log("  $(filterTitleContainer).css(): ", $(filterTitleContainer).css());
    var filterText = $(filterTitleContainer).text();
    if (itemName) {
        if (itemName.length > 35) {
            var checkName = itemName.indexOf(", ");
            if (checkName > -1) {
                splitZoneName = itemName.split(", ");
                if (splitZoneName.length > 2) {
                    itemName = splitZoneName[0] + ", " + splitZoneName[1] + "...";
                } else {
                    itemName = splitZoneName[0];
                }
            }
            if (itemName.length > 35) {
                itemName = itemName.substring(0, 35);
            }
        }
            $("#mouseover-text").children("h2").css("visibility", "visible");
            if (schoolType == "DCPS") {
                $("#mouseover-text").children("h2").css("color", "red");
            } else if (schoolType == "PCS") {
                $("#mouseover-text").children("h2").css("color", "orange");
            }
            $(filterTitleContainer).text(itemName);
    } else {
        $("#mouseover-text").children("h2").css("visibility", "hidden");
        $(filterTitleContainer).text("&nbsp;");
    }
}

// ======= ======= ======= updateFilterTitles ======= ======= =======
function updateFilterTitles(displayObj, whichFilter, addRemove) {
    // console.log("updateFilterTitles");

    var filterTitleContainer = $("#filters-title").children("h2");
    var filterText = $(filterTitleContainer).html();

    if (typeof displayObj == "string") {
        filterText = "<span class='filterLabel'>Message: </span>";
        filterText += displayObj;
        $(filterTitleContainer).addClass("filterList");
    } else {
        if ((displayObj.dataFilters.selectedZone != null) && (addRemove == "add")) {
            displayObj.filterTitlesArray = [];
            displayObj.filterTitlesArray.push(whichFilter);
            filterText = "<span class='filterLabel'>Selected Zone: </span>" + whichFilter;
            $(filterTitleContainer).addClass("filterList");
        } else {
            if (addRemove == "add") {
                // == build list of selected filters
                displayObj.filterTitlesArray.push(whichFilter);
                if (displayObj.filterTitlesArray.length == 1){
                    filterText = "<span class='filterLabel'>Filters: </span>" + whichFilter;
                } else {
                    filterText = "<span class='filterLabel'>Filters: </span>";
                    for (var i = 0; i < displayObj.filterTitlesArray.length; i++) {
                        nextFilter = displayObj.filterTitlesArray[i];
                        if (i == (displayObj.filterTitlesArray.length - 1)) {
                            filterText += whichFilter;
                        } else {
                            filterText += nextFilter + ", ";
                        }
                    }
                }
                $(filterTitleContainer).addClass("filterList");
            } else {
                for (var i = 0; i < displayObj.filterTitlesArray.length; i++) {
                    checkFilter = displayObj.filterTitlesArray[i];
                    if (checkFilter == whichFilter) {
                        displayObj.filterTitlesArray.splice(i, 1);
                        break;
                    }
                }
                if (displayObj.filterTitlesArray.length == 0) {
                    filterText = "your filters";
                    $(filterTitleContainer).removeClass("filterList");
                } else {
                    filterText = "<span class='filterLabel'>Filters: </span>";
                    for (var i = 0; i < displayObj.filterTitlesArray.length; i++) {
                        nextFilter = displayObj.filterTitlesArray[i];
                        if (i == (displayObj.filterTitlesArray.length - 1)) {
                            filterText += nextFilter;
                        } else {
                            filterText += nextFilter + ", ";
                        }
                    }
                    $(filterTitleContainer).addClass("filterList");
                }
            }
        }
    }
    $(filterTitleContainer).html(filterText);
}

// ======= ======= ======= makeAggregator ======= ======= =======
function makeAggregator(displayObject) {
    console.log("makeAggregator");

    // == make aggregator arrays for aggregated zone data
    zoneGeojson = displayObject.zoneGeojson ;
    displayObject.zoneNameArray = [];
    displayObject.zoneDataArray = [];

    // == data files have different property keys for zone name
    for (var i = 0; i < zoneGeojson.features.length; i++) {
        nextZoneName = zoneGeojson.features[i].properties.NAME;

        // == remove abbreviations in zone names (e.g. Cooke, H.D.) if any
        var checkName = nextZoneName.indexOf(", ");
        if (checkName > -1) {
            splitZoneName = nextZoneName.split(", ");
            nextZoneName = splitZoneName[0];
        }
        displayObject.zoneNameArray.push(nextZoneName);

        // == build zone data aggregator place-holders
        displayObject.zoneDataArray.push(0);
    }
    console.log("  displayObject.zoneDataArray.length: ", displayObject.zoneDataArray.length);
}

// ======= ======= ======= geoJsonToPolygon ======= ======= =======
function geoJsonToPolygon(geoCoordinates) {
    console.log("geoJsonToPolygon");
    console.log("  geoCoordinates.length: " + geoCoordinates.length);

    var opts = {};
    var paths = [];
    var exteriorDirection;
    var interiorDirection;

    // == check if each path isCCW (T/F)?
    var _ccw = function(path) {
        var isCCW;
        var a = 0;
        for (var i = 0; i < path.length-2; i++) {
            a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
        }
        if (a > 0) {
            isCCW = true;
        } else {
            isCCW = false;
        }
        return isCCW;
    };

    // == loop through LatLng coodinate pairs to define paths between pair
    for (var i = 0; i < geoCoordinates.length; i++){
        var path = [];
        for (var j = 0; j < geoCoordinates[i].length; j++) {
            var ll = new google.maps.LatLng(geoCoordinates[i][j], geoCoordinates[i][j]);
            // console.log("  ll: " + ll);
            path.push(ll);
        }
        if (!i) {
            exteriorDirection = _ccw(path);
            paths.push(path);
        } else if (i == 1) {
            interiorDirection = _ccw(path);
            if (exteriorDirection == interiorDirection) {
                paths.push(path.reverse());
            } else {
                paths.push(path);
            }
        } else {
            if (exteriorDirection == interiorDirection) {
                paths.push(path.reverse());
            } else {
                paths.push(path);
            }
        }
    }
    opts.paths = paths;
    googleObj = new google.maps.Polygon(opts);
    return googleObj;
}

// ======= ======= ======= CSVToArray ======= ======= =======
function CSVToArray(strData, strDelimiter) {
    console.log("CSVToArray");
    // Check to see if the delimiter is defined. If not, then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data with default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern matching groups.
    var arrMatches = null;
    // Loop over regular expression matches until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since new row of data, add empty row to data array.
            arrData.push([]);
        }
        // Check kind of value captured (quoted or unquoted).
        if (arrMatches[2]) {
            // Quoted value: unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // Non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Add value string to the data array.
        // console.log("  strMatchedValue: " + strMatchedValue);
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}

// ======= ======= ======= CSV2JSON ======= ======= =======
function CSV2JSON(csv) {
    console.log("CSV2JSON");
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }

    var json = JSON.stringify(objArray);
    var json2 = JSON.parse(json)
    return json2;
}

// ======= ======= ======= getDataDetails ======= ======= =======
function getDataDetails(nextSchool) {
    // console.log("getDataDetails");

    // schoolCode, schoolName, schoolWard, schoolFeederMS, schoolFeederHS, schoolAddress, schoolLAT, schoolLON, schoolLevel:, schoolAgency
    // building data: schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll
    // student population data: schoolEnroll, studentEng, studentAtRisk, studentSpecEd, studentESLPer, studentAtRiskPer, studentSPEDPer
    // spending data: spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll

    var schoolData = {
        // school identity data
        "schoolCode": nextSchool.SCHOOLCODE,
        "schoolName": nextSchool.School,
        "schoolWard": nextSchool.WARD,
        "schoolFeederMS": nextSchool.FeederMS,
        "schoolFeederHS": nextSchool.FeederHS,
        "schoolAddress": nextSchool.Address,
        "schoolLAT": nextSchool.LAT,
        "schoolLON": nextSchool.LON,
        "schoolLevel": nextSchool.Level,
        "schoolAgency": nextSchool.Agency,

        // school building data
        "schoolSqft": nextSchool.totalSQFT,
        "schoolMaxOccupancy": nextSchool.maxOccupancy,
        "schoolSqFtPerEnroll": nextSchool.SqFtPerEnroll,

        // student population data
        "schoolEnroll": nextSchool.Total_Enrolled,
        "studentEng": nextSchool.Limited_English,
        "studentAtRisk": nextSchool.At_Risk,
        "studentSpecEd": nextSchool.SpecEd_fake,
        "studentESLPer": nextSchool.ESLPer,
        "studentAtRiskPer": nextSchool.AtRiskPer,
        "studentSPEDPer": nextSchool.SPEDPer,

        // spending data
        "spendPast": nextSchool.MajorExp9815,
        "spendLifetime": nextSchool.LifetimeBudget,
        "spendPlanned": nextSchool.TotalAllotandPlan1621,
        "spendSqFt": nextSchool.SpentPerSqFt,           // Sqft
        "spendLTsqft": nextSchool.LTBudgetPerSqFt,
        "spendEnroll": nextSchool.SpentPerEnroll,       // Student
        "spendLTenroll": nextSchool.LTBudgetPerEnroll
    }
   return schoolData;
}

// ======= ======= ======= makeSchoolProfile ======= ======= =======
function makeSchoolProfile(collectionOrSchool, schoolIndex) {
    console.log("makeSchoolProfile");
    console.log("  schoolIndex: ", schoolIndex);
    console.log("  (typeof schoolIndex === 'undefined'): ", (typeof schoolIndex === 'undefined'));

    if ($('#mouseover-text').find('table').length) {
        $("#mapLegend").remove();
    };

    if (typeof schoolIndex === 'undefined') {
        console.log("*** TRUE ***");
        var processdSchoolData = getDataDetails(collectionOrSchool);
        var cleanedSchoolData = validateSchoolData(processdSchoolData);
    } else {
        var selectedSchoolData = collectionOrSchool.selectedSchoolsArray[schoolIndex];
        var cleanedSchoolData = validateSchoolData(selectedSchoolData);
    }

    // school data: schoolCode, schoolName, schoolWard, schoolFeederMS, schoolFeederHS, schoolAddress, schoolLAT, schoolLON, schoolLevel:, schoolAgency
    // building data: schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll
    // student data: schoolEnroll, studentEng, studentAtRisk, studentSpecEd, studentESLPer, studentAtRiskPer, studentSPEDPer
    // spending data: spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll

    var htmlString = "<table id='profile'>";
    htmlString += "<tr><td class='schoolname' colspan=2><p class='value-text'>" + cleanedSchoolData.schoolName + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>address</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolAddress + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>type</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolLevel + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>Ward</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolWard + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>MS Feeder</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolFeederMS + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>HS Feeder</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolFeederHS + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>capacity</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolMaxOccupancy + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>school Sqft</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolSqft + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>Lifetime Spending</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.spendLifetime + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>capacity</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolMaxOccupancy + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>enrolled</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolEnroll + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>sqft/enrolled</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolSqFtPerEnroll + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>spending/enrolled</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.spendEnroll + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>spending/sqft</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.spendSqFt + "</p></td></tr>";
    htmlString += "</table>";

    // == remove previous profile html if any
    if ($('#mouseover-text').find('#chart-container').length) {
        $("#chart-container").remove();
    }
    if ($('#mouseover-text').find('table').length) {
        console.log("*** TABLE PRESENT ***");
        $("#profile").remove();
        $("#mouseover-text").append(htmlString);
    } else {
        $("#mouseover-text").append(htmlString);
        $("#profile").fadeIn( "fast", function() {
            console.log("*** FADEIN ***");
        });
    }
}

// ======= ======= ======= validateSchoolData ======= ======= =======
function validateSchoolData(selectedSchoolData) {
    console.log("validateSchoolData");
    console.log("  selectedSchoolData: ", selectedSchoolData);

    // school data: schoolCode, schoolName, schoolWard, schoolFeederMS, schoolFeederHS, schoolAddress, schoolLAT, schoolLON, schoolLevel:, schoolAgency
    // building data: schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll
    // student data: schoolEnroll, studentEng, studentAtRisk, studentSpecEd, studentESLPer, studentAtRiskPer, studentSPEDPer
    // spending data: spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll
    if (selectedSchoolData.schoolLevel == "ES") {
        selectedSchoolData.schoolLevel = "elementary";
    }
    if (selectedSchoolData.schoolLevel == "MS") {
        selectedSchoolData.schoolLevel = "middle school";
    }
    if (selectedSchoolData.schoolLevel == "HS") {
        selectedSchoolData.schoolLevel = "high school";
    }

    var spendEnroll = isNumber(selectedSchoolData.spendEnroll);
    if (spendEnroll == true) {
        spendEnroll = Math.round(selectedSchoolData.spendEnroll * 100)/100;
        spendEnrollStr = "$" + spendEnroll;
        selectedSchoolData.spendEnroll = spendEnrollStr;
    } else {
        selectedSchoolData.spendEnroll = "";
    }

    var spendSqFt = isNumber(selectedSchoolData.spendSqFt);
    if (spendSqFt == true) {
        spendSqFt = Math.round(selectedSchoolData.spendSqFt * 100)/100;
        spendSqFtStr = "$" + spendSqFt;
        selectedSchoolData.spendSqFt = spendSqFtStr;
    } else {
        selectedSchoolData.spendSqFt = "";
    }

    var spendLifetime = isNumber(selectedSchoolData.spendLifetime);
    if (spendLifetime == true) {
        spendLifetime = numberWithCommas(selectedSchoolData.spendLifetime)
        selectedSchoolData.spendLifetime = "$" + spendLifetime;
    } else {
        selectedSchoolData.spendLifetime = "";
    }

    // == validation and formatting functions
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    }

    return selectedSchoolData;
}

// ======= ======= ======= initMap ======= ======= =======
function initMap(zonesCollectionObj) {
    console.log('initMap');

    // ======= map styles =======
    var styleArray = [
        { featureType: "all",
            stylers: [
                { saturation: -100 },
                { lightness: 40 }
            ]
        },
        { featureType: "road",
            elementType: "geometry",
            stylers: [
                { hue: "#00ffee" },
                { saturation: -50 }
            ]
        },
        { featureType: "road",
            elementType: 'labels',
            stylers: [
                { saturation: -100 },
                { invert_lightness: false },
                { visibility: "off" }
            ]
        },
        { featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    // ======= map object =======
    var href = window.location.href; // Returns path only
    var pathname = window.location.pathname; // Returns path only

    // ======= index map =======
    var zoom = 12;
    var mapContainer = document.getElementById('map');

    map = new google.maps.Map(mapContainer, {
        center: {lat: 38.89, lng: -77.00},
        disableDefaultUI: false,
        disableDoubleClickZoom: true,
        zoomControl: true,
        zoomControlOpt: {
            style: 'SMALL',
            position: 'TOP_LEFT'
        },
        draggable: true,
        scrollwheel: false,
        styles: styleArray,     // styles for map tiles
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        zoom: zoom
    });

    google.maps.event.addListener(map, 'tilesloaded', function() {
        console.log("tilesloaded.addListener");
        if (!zonesCollectionObj.mapBounds) {
            zonesCollectionObj.mapBounds = map.getBounds();
            // console.log("  zonesCollectionObj.mapBounds: ",zonesCollectionObj.mapBounds);
            // makeOverlay();
        }
    });
}


// ======= ======= ======= floating windows ======= ======= =======
(function(){
    console.log("initFloatingWindows");

    var popup = document.getElementById("popup");
    var drag_bar = document.getElementById("drag_bar");
    var offset = { x: 0, y: 0 };

    drag_bar.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseDown(e){
        offset.x = e.clientX - popup.offsetLeft;
        offset.y = e.clientY - popup.offsetTop;
        window.addEventListener('mousemove', popupMove, true);
    }
    function popupMove(e){
        popup.style.position = 'absolute';
        var top = e.clientY - offset.y;
        var left = e.clientX - offset.x;
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }
    function mouseUp() {
        window.removeEventListener('mousemove', popupMove, true);
    }
}());