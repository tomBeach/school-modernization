
// ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======

// ======= ======= ======= checkFilterSelection ======= ======= =======
function checkFilterSelection(displayObj, zonesCollectionObj, whichCategory) {
    console.log("##### checkFilterSelection");

    console.log("  whichCategory: ", whichCategory);
    console.log("  zoneA: ", zonesCollectionObj.zoneA);
    console.log("  * agency: ", displayObj.dataFilters.agency);
    console.log("  * levels: ", displayObj.dataFilters.levels);
    console.log("  * expend: ", displayObj.dataFilters.expend);
    console.log("  * zones: ", displayObj.dataFilters.zones);
    console.log("  * math: ", displayObj.dataFilters.math);
}

// ======= ======= ======= updateFilterItem ======= ======= =======
function updateFilterItem(displayObj, whichCategory, whichFilter, onOrOff) {
    console.log("updateFilterItem");

    var nextMenu, nextCategory;

    for (var i = 0; i < displayObj.filterMenusArray.length; i++) {
        nextMenu = displayObj.filterMenusArray[i];
        nextCategory = nextMenu[0];
        if (nextCategory == whichCategory) {
            for (var j = 1; j < nextMenu.length; j++) {
                nextFilterObject = nextMenu[j];
                if ((nextFilterObject.id == whichFilter) && (onOrOff == undefined)) {
                    $("#" + nextFilterObject.id).addClass("selected");
                } else if ((nextFilterObject.id == whichFilter) && (onOrOff == "off")) {
                    $("#" + nextFilterObject.id).addClass("deactivated");
                } else if ((nextFilterObject.id == whichFilter) && (onOrOff == "on")) {
                    $("#" + nextFilterObject.id).removeClass("deactivated");
                } else {
                    $("#" + nextFilterObject.id).removeClass("selected");
                }
            }
            break;
        }
    }
}

// ======= ======= ======= setMenuState ======= ======= =======
function setMenuState(displayObj, whichMenu, whichStates) {
    console.log("setMenuState");

    var nextState, nextFilter, nextFilterText, nextElement, checkIndex, selectedFilterText;

    // == loop through states for each filter on menu
    for (var i = 0; i < whichStates.length; i++) {
        nextState = whichStates[i];
        nextFilter = whichMenu[i+1];

        // == avoid duplicate "schools" descriptior in filter list
        if (whichMenu[0] == "agency") {
            if (displayObj.filterTitlesObject.levels) {
                nextFilterText = nextFilter.id;
                if (nextFilterText == "All") {
                    (nextFilterText = "District and Charter");
                }
            } else {
                nextFilterText = nextFilter.text;
            }
        } else if (whichMenu[0] == "levels") {
            var checkIndex = displayObj.filterTitlesObject.agency.indexOf("Schools");
            if (checkIndex > -1) {
                displayObj.filterTitlesObject.agency = displayObj.filterTitlesObject.agency.substring(0, checkIndex);
            }
            nextFilterText = nextFilter.text;
        } else {
            nextFilterText = nextFilter.text;
        }

        // == see if filter is in filter list
        nextElement = $("#" + nextFilter.id);
        checkIndex = $.inArray(nextFilterText, displayObj.filterTitlesArray);

        // == set filter menu state; leave only selected filters in filterTitlesArray
        if (nextState == "A") {
            $(nextElement).addClass("active");
            $(nextElement).removeClass("selected");
            $(nextElement).removeClass("deactivated");
            activateFilterLink(nextFilter);
        } else if (nextState == "D") {
            $(nextElement).removeClass("active");
            $(nextElement).removeClass("selected");
            $(nextElement).addClass("deactivated");
            $(nextElement).off("click");

        } else if (nextState == "S") {
            selectedFilterText = nextFilterText;
            displayObj.filterTitlesObject[whichMenu[0]] = selectedFilterText;
            $(nextElement).removeClass("deactivated");
            $(nextElement).addClass("active");
            $(nextElement).addClass("selected");
        }
    }
    updateFilterSelections(displayObj, whichMenu, selectedFilterText);
}

// ======= ======= ======= updateFilterSelections ======= ======= =======
function updateFilterSelections(displayObj, whichMenu, filterText) {
    console.log("updateFilterSelections");

    // == displays current user filter selections as string in #filters-selections div
    var selectedFilterContainer = $("#filters-selections").children("h2");
    var nextFilter, checkNextFilter;

    var selectedFilterText = "<span class='filterLabel'>Data for: </span>";
    if (displayObj.filterTitlesObject.expend) {
        selectedFilterText += displayObj.filterTitlesObject.expend + " for";
    }
    if (displayObj.filterTitlesObject.agency) {
        selectedFilterText += " " + displayObj.filterTitlesObject.agency;
    }
    if (displayObj.filterTitlesObject.levels) {
        selectedFilterText += " " + displayObj.filterTitlesObject.levels;
    }
    if (displayObj.filterTitlesObject.zones) {
        selectedFilterText += " by " + displayObj.filterTitlesObject.zones;
    }

    $(selectedFilterContainer).addClass("filterList");
    $(selectedFilterContainer).html(selectedFilterText);
}

// ======= ======= ======= activateFilterLink ======= ======= =======
function activateFilterLink(displayObj, zonesCollectionObj, nextItem) {
    console.log("activateFilterLink");

    // == id ties DOM element to menu object
    var self = displayObj;
    if (nextItem) {
        var nextId = nextItem.id;
        var nextElement = $("#" + nextId);
    }

    // ======= ======= ======= mouseover ======= ======= =======
    $(nextElement).off("mouseover").on("mouseover", function(event){
        // console.log("\n======= mouseover ======= ");
        var whichFilter = this.id;
        var menuObject = filterMenu[whichFilter];
        var whichText = menuObject.text;
        updateHoverText(whichText);
    });

    // ======= ======= ======= mouseout ======= ======= =======
    $(nextElement).off("mouseout").on("mouseout", function(event){
        // console.log("\n======= mouseout ======= ");
        updateHoverText("");
    });

    // ======= ======= ======= selectFilter ======= ======= =======
    $(nextElement).off("click").on("click", function(event){
        console.log("\n======= selectFilter ======= ");

        // var filterState = ["A", "A", "A"];
        // var menuItems = ["menuItem1", "menuItem2", "menuItem3"];
        // var menuCategories = ["agency", "level", "zone", "expend"];
        // console.log("======= filterState: "; filterState);

        var classList = $(this).attr('class').split(/\s+/);
        var whichCategory = classList[1];
        var whichFilter = this.id;
        var menuObject = filterMenu[whichFilter];
        var whichValue = menuObject.value;
        var whichText = menuObject.text;
        var htmlString;
        checkFilterSelection(self, zonesCollectionObj, whichCategory);
        event.stopImmediatePropagation();

        // == store selected filter value  (agency, levels, expend, zone) on display object
        switch(whichCategory) {

            // == agency filter (all, district, charter)
            case "agency":
                self.dataFilters.agency = whichFilter;
                zonesCollectionObj.aggregatorArray = [];
                // clearZoneAggregator(zonesCollectionObj);
                if (whichFilter == "All") {
                    setMenuState(displayObj, self.agencyMenu, ["A", "A", "S"]);
                    resetMenuState(displayObj, "zones");
                } else if (whichFilter == "District") {
                    setMenuState(displayObj, self.agencyMenu, ["S", "A", "A"]);
                    resetMenuState(displayObj, "zones");
                } else if (whichFilter == "Charter") {
                    self.dataFilters.zones = "Ward";
                    zonesCollectionObj.zoneA = "Ward";
                    zonesCollectionObj.zoneGeojson_AB = null;
                    zonesCollectionObj.aggregatorArray = [];
                    if (self.dataFilters.levels == "HS") {
                        setMenuState(displayObj, self.levelsMenu, ["S", "A", "A"]);
                    } else if (self.dataFilters.levels == "MS") {
                        setMenuState(displayObj, self.levelsMenu, ["A", "S", "A"]);
                    } else if (self.dataFilters.levels == "ES") {
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "S"]);
                    }
                    setMenuState(displayObj, self.agencyMenu, ["A", "S", "A"]);
                    setMenuState(displayObj, self.zonesMenu, ["S", "D", "D"]);
                }
                break;

            // == levels filter (ES, MS, HS)
            case "levels":
                self.dataFilters.levels = whichValue;
                zonesCollectionObj.aggregatorArray = [];
                if (whichValue == "HS") {
                    setMenuState(displayObj, self.levelsMenu, ["S", "A", "A"]);
                    zonesCollectionObj.zoneA = "FeederHS";
                    // resetMenuState(displayObj, "levels");
                } else if (whichValue == "MS") {
                    setMenuState(displayObj, self.levelsMenu, ["A", "S", "A"]);
                    zonesCollectionObj.zoneA = "FeederMS";
                    // resetMenuState(displayObj, "levels");
                } else if (whichValue == "ES") {
                    setMenuState(displayObj, self.levelsMenu, ["A", "A", "S"]);
                    zonesCollectionObj.zoneA = "Elementary";
                    // resetMenuState(displayObj, "levels");
                } else {
                    zonesCollectionObj.zoneA = "Ward";
                }
                break;

            // == expenditures filter (past, present, planed, etc.)
            case "expend":
                self.dataFilters.expend = whichFilter;
                console.log("  whichFilter: ", whichFilter);
                if (whichFilter == "spendLifetime") {
                    setMenuState(displayObj, self.expendMenu, ["S", "A", "A"]);
                } else if (whichFilter == "MajorExp9815") {
                    setMenuState(displayObj, self.expendMenu, ["A", "S", "A"]);
                } else if (whichFilter == "spendPlanned") {
                    setMenuState(displayObj, self.expendMenu, ["A", "A", "S"]);
                }
                zonesCollectionObj.aggregatorArray = [];
                // clearZoneAggregator(zonesCollectionObj);
                break;

            // == wards or feeder zones for map
            case "zones":
                self.dataFilters.zones = whichFilter;
                zonesCollectionObj.zoneA = whichFilter;
                zonesCollectionObj.zoneGeojson_AB = null;
                zonesCollectionObj.aggregatorArray = [];
                var tempAgency = self.dataFilters.agency;
                var tempLevels = self.dataFilters.levels;
                console.log("  whichFilter: ", whichFilter);
                console.log("  tempAgency: ", tempAgency);
                console.log("  tempLevels: ", tempLevels);

                // == high school feeder zone selected
                if (whichFilter == "FeederHS") {
                    self.dataFilters.agency = "District";
                    setMenuState(displayObj, self.agencyMenu, ["S", "D", "D"]);
                    setMenuState(displayObj, self.zonesMenu, ["A", "S", "A"]);

                    // == high school feeder zones apply to middle or elem schools
                    if (tempLevels == "ES") {
                        self.dataFilters.levels = "ES";
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "S"]);
                        levelObject = filterMenu["Elem"];
                    } else if (tempLevels == "MS") {
                        self.dataFilters.levels = "MS";
                        setMenuState(displayObj, self.levelsMenu, ["A", "S", "A"]);
                        levelObject = filterMenu["Middle"];
                    } else if (tempLevels == "HS") {
                        self.dataFilters.levels = "HS";
                        setMenuState(displayObj, self.levelsMenu, ["S", "A", "A"]);
                        levelObject = filterMenu["High"];
                    } else if (tempLevels == null) {
                        self.dataFilters.levels = null;
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "A"]);
                        levelObject = filterMenu[null];
                    }

                // == middle school feeder zone selected
                } else if (whichFilter == "FeederMS") {
                    self.dataFilters.agency = "District";
                    setMenuState(displayObj, self.agencyMenu, ["S", "D", "D"]);
                    setMenuState(displayObj, self.zonesMenu, ["A", "A", "S"]);

                    // == high school feeder zones apply to middle or elem schools
                    if (tempLevels == "ES") {
                        self.dataFilters.levels = "ES";
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "S"]);
                        levelObject = filterMenu["Elem"];
                    } else if (tempLevels == "MS") {
                        self.dataFilters.levels = "MS";
                        setMenuState(displayObj, self.levelsMenu, ["A", "S", "A"]);
                        levelObject = filterMenu["Middle"];
                    } else if (tempLevels == "HS") {
                        self.dataFilters.levels = "HS";
                        setMenuState(displayObj, self.levelsMenu, ["S", "A", "A"]);
                        levelObject = filterMenu["High"];
                    } else if (tempLevels == null) {
                        self.dataFilters.levels = null;
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "A"]);
                        levelObject = filterMenu[null];
                    }

                    // == middle school feeder zones apply to elementary schools only
                    // self.dataFilters.levels = "ES";
                    // setMenuState(displayObj, self.zonesMenu, ["A", "A", "S"]);
                    // setMenuState(displayObj, self.levelsMenu, ["D", "D", "S"]);
                    // levelObject = filterMenu["Elem"];

                // == elementary zone selected
                } else if (whichFilter == "Elementary") {
                    self.dataFilters.levels = "ES";
                    setMenuState(displayObj, self.zonesMenu, ["A", "A", "A"]);
                    setMenuState(displayObj, self.levelsMenu, ["A", "A", "A"]);

                // == no zone or Ward selected
                } else {
                    if (displayObj.dataFilters.levels == "HS") {
                        setMenuState(displayObj, self.levelsMenu, ["S", "A", "A"]);
                    } else if (displayObj.dataFilters.levels == "MS") {
                        setMenuState(displayObj, self.levelsMenu, ["A", "S", "A"]);
                    } else if (displayObj.dataFilters.levels == "ES") {
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "S"]);
                    } else {
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "A"]);
                    }
                    if (displayObj.dataFilters.agency == "District") {
                        setMenuState(displayObj, self.agencyMenu, ["S", "A", "A"]);
                    } else if (displayObj.dataFilters.agency == "Charter") {
                        setMenuState(displayObj, self.agencyMenu, ["A", "S", "A"]);
                    } else if (displayObj.dataFilters.agency == "All") {
                        setMenuState(displayObj, self.agencyMenu, ["A", "A", "S"]);
                    } else {
                        setMenuState(displayObj, self.agencyMenu, ["A", "A", "A"]);
                    }
                    setMenuState(displayObj, self.zonesMenu, ["S", "A", "A"]);
                }
                break;
        }

        if (self.dataFilters.expend == null) {
            clearProfileChart();
        }

        updateHoverText(null);
        checkFilterSelection(self, zonesCollectionObj, whichCategory);
        zonesCollectionObj.importZoneDataA();
    });
}

// ======= ======= ======= resetMenuState ======= ======= =======
function resetMenuState(displayObj, whichMenu) {
    console.log("resetMenuState");
    console.log("  displayObj.dataFilters.zones: ", displayObj.dataFilters.zones);

    // == restore levels menu for new zones selection (e.g. deactivate HS for feeders)
    if (whichMenu == "zones") {
        if (displayObj.dataFilters.zones == "Ward") {
            setMenuState(displayObj, displayObj.zonesMenu, ["S", "A", "A"]);
        } else if (displayObj.dataFilters.zones == "FeederHS") {
            if ((displayObj.dataFilters.levels == "HS") || (displayObj.dataFilters.levels == "MS")) {
                // setMenuState(displayObj, displayObj.levelsMenu, ["D", "S", "A"]);
            } else if (displayObj.dataFilters.levels == "ES") {
                // setMenuState(displayObj, displayObj.levelsMenu, ["D", "A", "S"]);
            }
            setMenuState(displayObj, displayObj.zonesMenu, ["A", "S", "A"]);
        } else if (displayObj.dataFilters.zones == "FeederMS") {
            // setMenuState(displayObj, displayObj.levelsMenu, ["D", "D", "S"]);
            setMenuState(displayObj, displayObj.zonesMenu, ["A", "A", "S"]);
        } else {
            setMenuState(displayObj, displayObj.zonesMenu, ["A", "A", "A"]);
        }

    // == set levels menu according to zones selection (e.g. deactivate HS for feeders)
    } else if (whichMenu == "levels") {
        if (displayObj.dataFilters.levels == "HS") {
            if (displayObj.dataFilters.zones == "Ward") {
                setMenuState(displayObj, displayObj.levelsMenu, ["S", "A", "A"]);
            } else if ((displayObj.dataFilters.zones == "FeederHS") || (displayObj.dataFilters.zones == "FeederMS")) {
                setMenuState(displayObj, displayObj.levelsMenu, ["D", "S", "A"]);
            }
        } else if (displayObj.dataFilters.levels == "MS") {
            if (displayObj.dataFilters.zones == "Ward") {
                setMenuState(displayObj, displayObj.levelsMenu, ["A", "S", "A"]);
            } else if ((displayObj.dataFilters.zones == "FeederHS") || (displayObj.dataFilters.zones == "FeederMS")) {
                setMenuState(displayObj, displayObj.levelsMenu, ["D", "S", "A"]);
            }
        } else if (displayObj.dataFilters.levels == "ES") {
            if (displayObj.dataFilters.zones == "Ward") {
                setMenuState(displayObj, displayObj.levelsMenu, ["A", "A", "S"]);
            } else if (displayObj.dataFilters.zones == "FeederHS") {
                setMenuState(displayObj, displayObj.levelsMenu, ["D", "A", "S"]);
            } else if (displayObj.dataFilters.zones == "FeederMS") {
                setMenuState(displayObj, displayObj.levelsMenu, ["D", "D", "S"]);
            }
        }
    }
}

// ======= ======= ======= clearFilterSelctions ======= ======= =======
function clearFilterSelctions(displayObj, zonesCollectionObj) {
    console.log("clearFilterSelctions");

    setMenuState(displayObj, displayObj.agencyMenu, ["A", "A", "S"]);
    setMenuState(displayObj, displayObj.levelsMenu, ["A", "A", "A"]);
    setMenuState(displayObj, displayObj.zonesMenu, ["S", "A", "A"]);
    setMenuState(displayObj, displayObj.expendMenu, ["A", "A", "A"]);
    displayObj.filterTitlesArray = [];
    displayObj.dataFilters.agency = "All";
    displayObj.dataFilters.levels = null;
    displayObj.dataFilters.zones = "Ward";
    displayObj.dataFilters.expend = null;
    displayObj.dataFilters.math = "spendAmount";
    zonesCollectionObj.zoneGeojson_A = null;
    zonesCollectionObj.zoneGeojson_B = null;
    zonesCollectionObj.zoneGeojson_AB = null;
    zonesCollectionObj.aggregatorArray = [];
    zonesCollectionObj.zoneA = "Ward";
    displayObj.filterTitlesObject = { "agency":"District and Charter Schools", "levels":null, "expend":null, "zones": "Ward" };
    displayObj.filterTitlesArray = [displayObj.agencyMenu[1].text, displayObj.zonesMenu[1].text];
    console.log("  displayObj.filterTitlesArray: ", displayObj.filterTitlesArray);
    updateFilterSelections(displayObj);
}

// ======= ======= ======= filterExpendData ======= ======= =======
function filterExpendData(displayObj, zonesCollectionObj, zoneIndex) {
    // console.log("filterExpendData");
    var nextZoneValue;
    if (displayObj.dataFilters.expend == "spendLifetime") {
        if (displayObj.dataFilters.math == "spendAmount") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zoneAmount;
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zoneTotalPerSqft;
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zoneTotalPerEnroll;
        }
    } else if (displayObj.dataFilters.expend == "MajorExp9815") {
        if (displayObj.dataFilters.math == "spendAmount") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zoneAmount;
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zonePastPerSqft;
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zonePastPerEnroll;
        }
    } else if (displayObj.dataFilters.expend == "spendPlanned") {
        if (displayObj.dataFilters.math == "spendAmount") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zoneAmount;
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zoneFuturePerSqft;
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zoneFuturePerEnroll;
        }
    }
    return nextZoneValue;
}