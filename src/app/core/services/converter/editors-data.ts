export class EditorsData {
    private _hexData: string;
    private _ebcdicEditorData: string;

    private _data!: string[];

    constructor(hexData_: string, principalEditorData_: string) {
        this._hexData = hexData_;
        this._ebcdicEditorData = principalEditorData_;
    }

    get hexData(): string {
        return this._hexData;
    }

    set hexData(data: string) {
        this._hexData = data;
    }

    get ebcdicEditorData(): string {
        return this._ebcdicEditorData;
    }

    set ebcdicEditorData(editorData: string) {
        this._ebcdicEditorData = editorData;
    }

    get data(){
        return this._data;
    }

    set data(data: string[]){
        this._data = data;
    }
}