import comp from "comp";
import configData from "./components/config-data";
import demo from "./components/demo";

function app() {
	comp.create("configData", configData.actions, configData.view, configData.model);
	comp.create("demo", demo.actions, demo.view, demo.model);
}

app();