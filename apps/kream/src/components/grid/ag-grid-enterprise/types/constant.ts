export const colors = {
    aliceBlue: "aliceblue",              // #F0F8FF
    antiqueWhite: "antiquewhite",       // #FAEBD7
    aqua: "aqua",                       // #00FFFF
    aquamarine: "aquamarine",           // #7FFFD4
    azure: "azure",                     // #F0FFFF
    beige: "beige",                     // #F5F5DC
    bisque: "bisque",                   // #FFE4C4
    black: "black",                     // #000000
    blanchedAlmond: "blanchedalmond",   // #FFEBCD
    blue: "blue",                       // #0000FF
    blueViolet: "blueviolet",           // #8A2BE2
    brown: "brown",                     // #A52A2A
    burlyWood: "burlywood",             // #DEB887
    cadetBlue: "cadetblue",             // #5F9EA0
    chartreuse: "chartreuse",           // #7FFF00
    chocolate: "chocolate",             // #D2691E
    coral: "coral",                     // #FF7F50
    cornflowerBlue: "cornflowerblue",   // #6495ED
    cornsilk: "cornsilk",               // #FFF8DC
    crimson: "crimson",                 // #DC143C
    cyan: "cyan",                       // #00FFFF
    darkBlue: "darkblue",               // #00008B
    darkCyan: "darkcyan",               // #008B8B
    darkGoldenRod: "darkgoldenrod",     // #B8860B
    darkGray: "darkgray",               // #A9A9A9
    darkGreen: "darkgreen",             // #006400
    darkKhaki: "darkkhaki",             // #BDB76B
    darkMagenta: "darkmagenta",         // #8B008B
    darkOliveGreen: "darkolivegreen",   // #556B2F
    darkOrange: "darkorange",            // #FF8C00
    green: "green",
    lightblue: "lightblue",
    lightGreen: "lightgreen",
    lightRed: "lightcoral",
    lightskyblue: "lightskyblue",
    red: "red",
    steelBlue: "#4682B4",
    white: "white"
  };
  


export const bgColor : Record<string, { backgroundColor: string; color: string }> = {
    "bg-red": { backgroundColor: colors.red, color: colors.black },
    "bg-lightred": { backgroundColor: colors.lightRed, color: colors.black },
    "bg-green": { backgroundColor: colors.green, color: colors.black },
    "bg-ligthgreen": { backgroundColor: colors.lightGreen, color: colors.black },
    "bg-darkblue": { backgroundColor: colors.darkBlue, color: colors.black },
    "bg-lightblue": { backgroundColor: colors.lightblue, color: colors.black },
    "bg-lightskyblue": { backgroundColor: colors.lightskyblue, color: colors.black },
    "bg-beige": { backgroundColor: colors.beige, color: colors.black },    
    "bg-steelblue": { backgroundColor: colors.steelBlue, color: colors.white },
  };
  