import { IResponse } from './common/models';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Injectable({
    providedIn: 'root'
  })
export class FileService {

    constructor(private fileOpener: FileOpener, private file: File, private platform: Platform) { }

    exportFile(opts: {
        fileName: string,
        text: any,
        type: string
    }): Promise<IResponse<any>> {
        return new Promise((resolve, reject) => {
            if (this.platform.is('ios')) {
                this.writeToIOS(opts)
                    .then(response => resolve(response))
                    .catch(error => reject(error));
            }
            if (this.platform.is('android')) {
                this.writeToAndroid(opts)
                    .then(response => resolve(response))
                    .catch(error => reject(error));
            }

        });
    }

    writeToAndroid(opts: { fileName: string, text: any, type: string }): Promise<IResponse<any>> {
        const options: IWriteOptions = {
            replace: true
        };
        const path = this.file.externalRootDirectory;
        const directory = 'Attendance Log';
        return new Promise((resolve, reject) => {
            this.file.checkDir(path, directory)
                .then(_ => {
                    this.file.writeFile(path + directory, opts.fileName, opts.text, options)
                        // tslint:disable-next-line:no-shadowed-variable
                        .then(_ => {
                            this.toFileOpener({
                                ...opts,
                                path: path,
                                directory: directory
                            })
                                .then(data => resolve(data))
                                .catch(error => reject(error));
                        })
                        // tslint:disable-next-line:no-shadowed-variable
                        .catch(_ => reject('There was an error reading the directory, please try again!'));
                })
                .catch(() => {
                    this.file.createDir(path, directory, true)
                        // tslint:disable-next-line:no-shadowed-variable
                        .then(directory => {
                            this.file.writeFile(path + directory.name, opts.fileName, opts.text, options)
                                .then(_ => {
                                    this.toFileOpener({
                                        ...opts,
                                        path: path,
                                        directory: directory.name
                                    })
                                        .then(data => resolve(data))
                                        .catch(error => reject(error));
                                })
                                .catch(_ => reject('There was an error when the file was created, please try again!'));
                        })
                        .catch(_ => reject('There was an error creating the directory, please try again!'));
                });
        });
    }

    writeToIOS(opts: { fileName: string, text: any, type: string }): Promise<IResponse<any>> {
        const options: IWriteOptions = {
            replace: true
        };
        const path = this.file.dataDirectory;
        const directory = 'Attendance Log';
        return new Promise((resolve, reject) => {
            this.file.checkDir(path, directory)
                .then(res => {
                    this.file.writeFile(path + directory, opts.fileName, opts.text, options)
                        .then(_ => {
                            this.toFileOpener({
                                ...opts,
                                path: path,
                                directory: directory
                            })
                                .then(data => resolve(data))
                                .catch(error => reject(error));
                        })
                        .catch(_ => reject('There was an error reading the directory, please try again!'));
                })
                .catch(() => {
                    this.file.createDir(path, directory, true)
                        // tslint:disable-next-line:no-shadowed-variable
                        .then(directory => {
                            this.file.writeFile(path + directory.name, opts.fileName, opts.text, options)
                                .then(res => {
                                    this.toFileOpener({
                                        ...opts,
                                        path: path,
                                        directory: directory.name
                                    })
                                        .then(data => resolve(data))
                                        .catch(error => reject(error));
                                })
                                .catch(_ => reject('There was an error when the file was created, please try again!'));
                        })
                        .catch(_ => reject('There was an error creating the directory, please try again!'));
                });
        });
    }

    toFileOpener(opts: { fileName: string, text: any, type: string, path, directory }): Promise<IResponse<any>> {
        return new Promise((resolve, reject) => {
            let response: IResponse<string> = {
                success: false,
                error: '',
                data: '',
                dateStamp: new Date().toString()
            };
            if (opts.type === 'xlsx') {
                response = {
                    ...response,
                    success: true,
                    data: `${opts.fileName} was exported successfully to the folder ${opts.path}${opts.directory} in your device!`
                };
                this.fileOpener.open(
                    `${opts.path}${opts.directory}/${opts.fileName}`,
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                    .then(() => resolve(response))
                    .catch(error => reject('There was an error opening the file, please try again!'));
            }
            if (opts.type === 'txt') {
                response = {
                    ...response,
                    success: true,
                    data: `${opts.fileName} was exported successfully to the folder ${opts.path}${opts.directory} in your device!`
                };
                this.fileOpener.open(`${opts.path}${opts.directory}/${opts.fileName}`, 'text/plain')
                    .then(() => resolve(response))
                    .catch(_ => reject('There was an error opening the file, please try again!'));
            }
            if (opts.type === 'csv') {
                response = {
                    ...response,
                    success: true,
                    data: `${opts.fileName} was exported successfully to the folder ${opts.path}${opts.directory} in your device!`
                };
                this.fileOpener.open(`${opts.path}${opts.directory}/${opts.fileName}`, 'text/csv')
                    .then(() => resolve(response))
                    .catch(_ => reject('There was an error opening the file, please try again!'));
            }
        });
    }
}
