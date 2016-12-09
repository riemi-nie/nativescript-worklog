import application = require("application");

// Remove this in the AppBuilder templates
application.cssFile = "./app.css";

application.start({
    moduleName: "views/main/main-page"
});