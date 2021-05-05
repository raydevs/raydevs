import { ChangeDetectorRef, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { EditorConfig, UserConfig } from "./model/user-config";

@Injectable({
    providedIn: 'root'
})
export class EditorService {

    userConfigSubject: BehaviorSubject<UserConfig>;
    castUserConfig: Observable<UserConfig>;
    private userConfig: UserConfig;

    constructor() {
        this.userConfig = new UserConfig();
        // this.userConfigSubject = new BehaviorSubject(this.userConfig);
        // this.castUserConfig = this.userConfigSubject.asObservable();
    }

    /*
    updateConfig(conf: EditorConfig) {
        this.userConfig.editorConfig = conf;
        this.userConfigSubject.next(this.userConfig);
    }
    */
}