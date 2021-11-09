/**
 * globally reachable settings object  
 */
window.settings = {
    currentDateOffset: 0,
    selectedClass: "",
    selectedTeacher: "",
    is_teacher: false,
    darkmode: false,
    autoscroll: false
};


/**
 * default available accent colors
 */
const COLORS = ["#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5", "#00ACC1", "#00897B", "#43A047"];

settings.autoscroll = false;

/**
 * show settings menu
 */
window.showSettings = function() {
    document.getElementById("settings-overlay-container").style.visibility = "visible";
    document.getElementById("settings-overlay-container").style.opacity = 1;
}

/**
 * hide settings menu
 */
window.hideSettings = function() {
    document.getElementById("settings-overlay-container").style.visibility = "hidden";
    document.getElementById("settings-overlay-container").style.opacity = 0;
}

/**
 * applies url parameters to cookies
 */
window.applyUrlParameters = function() {
    var urlParams = new URLSearchParams(location.search);
    
    for(var pair of urlParams.entries()) {
        setCookie(pair[0].toLowerCase(), pair[1].toLowerCase().split(";")[0], 9999);
    }
}

/**
 * load and apply settings stored in cookies,
 * get darkmode preference from browser if no darkmode cookie available
 */
window.loadSettings = function loadSettings() {
    
    applyUrlParameters();

    if(getCookie("darkmode")) {
        settings.darkmode = getCookie("darkmode") == "true"; // get darkmode preference from cookie
    } else {
        settings.darkmode = matchMedia("screen and (prefers-color-scheme: dark)").matches; // get darkmode preference from browser
    }

    // apply darkmode setting
    if(darkmode) {
        document.querySelector('body').classList.add("dark"); // darkmode on
    } else {
        document.querySelector('body').classList.remove("dark"); // darkmode off
    }

    document.getElementById("dark-mode-switch").checked = darkmode; // set dark mode switch in settings menu


    // get autoscroll preference from cookie
    if(getCookie("autoscroll")) {
        settings.autoscroll = getCookie("autoscroll") == "true";
    } else {
        settings.autoscroll = false;
    }

    // apply autoscroll setting
    if(autoscroll) {
        document.getElementById("substitutions").classList.add("autoscroll");
        document.body.style.setProperty("--side-margin", "10%");
        document.body.style.fontSize = "smaller";
    } else {
        document.getElementById("substitutions").classList.remove("autoscroll");
        document.body.style.setProperty("--side-margin", "20%");
        document.body.style.fontSize = "medium";
    }

    document.getElementById("autoscroll-switch").checked = autoscroll;


    // add accent color selects to settings menu
    let c;
    for(c of COLORS){
        let colorSelector = document.createElement("div");
        colorSelector.setAttribute("style", "background: " + c);
        colorSelector.setAttribute("id", "color" + c);
        colorSelector.setAttribute("class", "colorSelector");
        colorSelector.setAttribute("onclick","colorClick(this);");
        document.getElementById("colors").appendChild(colorSelector);
    }

    // get accent color from cookie, generate dynamic dark accent color, pass colors to CSS
    if(getCookie("accent_color")) {
        let accent_color = getCookie("accent_color");
        let accent_dark = shadeColor(accent_color, -20);

        document.querySelector('body').style.setProperty('--accent', accent_color);
        document.querySelector('body').style.setProperty('--accent-dark', accent_dark);

        if(COLORS.includes(accent_color.toUpperCase()))
            document.getElementById("color" + accent_color.toUpperCase()).classList.add("selected");
    }


    // get teacher mode preference from cookie
    if(getCookie("is_teacher")) {
        settings.is_teacher = getCookie("is_teacher") == "true"    
    }

    if(is_teacher) {
        document.getElementById("substitutions").classList.add("teacher");
    } else {
        document.getElementById("substitutions").classList.remove("teacher");
    }

    document.getElementById("is-teacher").checked = is_teacher; // set teacher mode switch in settings menu
}

/**
 * handle onclick on teacher mode switch
 * 
 * @param {HTMLElement} obj clicked checkbox element
 */
window.setIsTeacher = function(obj) {
    settings.is_teacher = obj.checked;

    if(is_teacher) {
        settings.selectedClass = "";
    } else {
        settings.selectedTeacher = "";
    }

    if(is_teacher) {
        document.getElementById("substitutions").classList.add("teacher");
    } else {
        document.getElementById("substitutions").classList.remove("teacher");
    }

    setCookie("is_teacher", is_teacher, 9999);
    draw();
}


/**
 * handle onclick on darkmode switch
 * 
 * @param {HTMLElement} obj clicked checkbox element
 */
window.setDarkmode = function(obj) {
    settings.darkmode = obj.checked;

    setCookie("darkmode", darkmode, 9999);

    if(darkmode) {
        document.querySelector('body').classList.add("dark");
    } else {
        document.querySelector('body').classList.remove("dark");
    }
}

/**
 * handle onclick on autoscroll switch
 * 
 * @param {HTMLElement} obj clicked checkbox element
 */
window.setAutoscroll = function(obj) {
    settings.autoscroll = obj.checked;

    setCookie("autoscroll", autoscroll, 9999);

    if(settings.autoscroll) {
        document.getElementById("substitutions").classList.add("autoscroll");
        document.body.style.setProperty("--side-margin", "10%");
        document.body.style.fontSize = "smaller";
    } else {
        document.getElementById("substitutions").classList.remove("autoscroll");
        document.body.style.setProperty("--side-margin", "20%");
        document.body.style.fontSize = "medium";
    }
}

/**
 * handle onclick on accent color select element
 * 
 * @param {HTMLElement} obj clicked checkbox element
 */
window.colorClick = function(obj) {
    Array.from(document.getElementsByClassName("colorSelector")).forEach((el) => {
        el.classList.remove("selected");
    });
    obj.classList.add("selected");
    
    let accent_color = rgb2hex(obj.style.backgroundColor);
    let accent_dark = shadeColor(accent_color, -20); 

    document.body.style.setProperty('--accent', accent_color);
    document.body.style.setProperty('--accent-dark', accent_dark);
    
    setCookie("accent_color", accent_color, 9999);
}

/**
 * set or unset selected teacher / class
 * 
 * @param {HTMLElement} _selectedElement selectedElement HTMLElement
 * @param {*} data API data of the current day
 */
window.Day.setSelectedElement = function(_selectedElement) {
    if(is_teacher) {
        settings.selectedClass = "";
        
        if (selectedTeacher == _selectedElement) {
            settings.selectedTeacher = "";
        } else {
            settings.selectedTeacher = _selectedElement;
        }

    } else {
        settings.selectedTeacher = "";

        if (selectedClass == _selectedElement) {
            settings.selectedClass = "";
        } else {
            settings.selectedClass = _selectedElement;
        }
    }

    this.drawSubstitutions();
}