import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class PaginatorInt extends MatPaginatorIntl {
    itemsPerPageLabel = 'MB por página:';
    nextPageLabel = 'Siguiente';
    previousPageLabel = 'Anterior';
}