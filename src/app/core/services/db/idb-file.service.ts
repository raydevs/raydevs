import { Injectable } from '@angular/core';

/**
 * https://gist.github.com/eight04/c432b082c4134420bc008b53b3720f6f 
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class IdbFileService {

    tableName = 'chunk';

    constructor() { }

    async getChunk(name: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {
        const db = await this.open();
        const trans = db.transaction(this.tableName, 'readonly');
        const store = trans.objectStore(this.tableName);
        let file = await this.success(store.get(name));
        await this.complete(trans);
        db.close();
        return file;
    }

    async saveChunk(blob: Blob, name: IDBValidKey) {
        const db = await this.open();
        const trans = db.transaction(this.tableName, 'readwrite');
        const store = trans.objectStore(this.tableName);
        store.put(new Blob([blob]), name);
        await this.complete(trans);
        db.close();
    }

    open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('file-chunks', 1);
            request.onupgradeneeded = e => {
                request.result.createObjectStore(this.tableName);
            };
            request.onsuccess = e => {
                resolve(request.result);
            };
            request.onerror = reject;
        });
    }

    success(r: any) {
        return new Promise((resolve, reject) => {
            r.onsuccess = () => resolve(r.result);
            r.onerror = reject;
        });
    }

    complete(r: IDBTransaction) {
        return new Promise((resolve, reject) => {
            r.oncomplete = resolve;
            r.onerror = reject;
        });
    }

    deleteDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase('file-chunks');
            request.onsuccess = e => {
                console.log('The database has been deleted.');
                resolve(request.result);
            };
            request.onerror = e => {
                console.log('deleteRequest.onerror fired in deleteDB()');
                reject();
            }
        });
    }
}
