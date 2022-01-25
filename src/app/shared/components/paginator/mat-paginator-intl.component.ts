import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Injectable()
export class MatPaginatorKohesio extends MatPaginatorIntl {

    constructor(public number: DecimalPipe){
        super();
    }

    getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
            return '0 od ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;

        length = this.number.transform(length, '1.0-3','fr');

        return startIndex + 1 + ' - ' + endIndex + ' of ' + length;
    };

}
