import { Subject } from 'rxjs/Subject';
export declare class TerminatorService {
    onDestroy: Subject<boolean>;
    constructor();
    destroy(): void;
}
