import k from "./kaboom";
import loadSprites from "./sprites";
import main from "./scenes/main";

loadSprites();

k.scene("main", main);

k.start("main");
