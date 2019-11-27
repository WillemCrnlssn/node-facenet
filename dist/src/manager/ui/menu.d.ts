import * as blessed from 'blessed';
export declare class Menu {
    screen: blessed.Widgets.Screen;
    menuList: string[];
    constructor(screen: blessed.Widgets.Screen, menuList: string[]);
    start(wait?: boolean): Promise<number>;
    private backgroundElement;
    private logoElement;
    private textElement;
    private versionElement;
    private pressElement;
    private menuElement;
}
export default Menu;
