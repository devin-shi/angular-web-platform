import { ElementRef, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { NzUpdateHostClassService } from '../core/services/update-host-class.service';
import { NzI18nService } from '../i18n/nz-i18n.service';
import { ShowUploadListInterface, UploadFile, UploadListType } from './interface';
export declare class NzUploadListComponent implements OnInit, OnChanges {
    private el;
    private updateHostClassService;
    private i18n;
    listType: UploadListType;
    items: UploadFile[];
    icons: ShowUploadListInterface;
    onPreview: (file: UploadFile) => void;
    onRemove: (file: UploadFile) => void;
    private prefixCls;
    setClassMap(): void;
    private locale;
    handlePreview(file: UploadFile, e: Event): void;
    handleRemove(file: UploadFile, e: Event): void;
    constructor(el: ElementRef, updateHostClassService: NzUpdateHostClassService, i18n: NzI18nService);
    ngOnInit(): void;
    ngOnChanges(changes: {
        [P in keyof this]?: SimpleChange;
    } & SimpleChanges): void;
}
