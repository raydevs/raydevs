export interface EditorConfig {
    minLines: number,
    maxLines: number,
    fontSize: number,
    displayIndentGuides: boolean,
    showInvisibles: boolean,
    scrollPastEnd: boolean,
    showPrintMargin: boolean,
    wrapBehavioursEnabled: boolean,
    wrap: boolean
}

export class UserConfig {

    editorConfig: EditorConfig;

    constructor() {
        this.initDefault();
    }

    initDefault() {
        this.editorConfig = {
            minLines: 20,
            maxLines: 200,
            fontSize: 16,
            displayIndentGuides: false,
            showInvisibles: true,
            scrollPastEnd: true,
            showPrintMargin: false,
            wrapBehavioursEnabled: true,
            wrap: true
        };
    }

}