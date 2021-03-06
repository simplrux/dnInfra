import { createAction, props } from '@ngrx/store';

const UPDATE_TABLE = 'Update table';
export const updateTable = createAction(UPDATE_TABLE, props<{ data: { tableId: string, tableData: any[] } }>());

const DELETE_ROW = 'Delete row';
export const deleteRow = createAction(DELETE_ROW, props<{ data: { tableId: string, rowIndex: number } }>());

const ADD_ROW = 'Add row';
export const addRow = createAction(ADD_ROW, props<{ data: { tableId: string, rowToAdd: object } }>());

const UPDATE_ROW = 'Update row';
export const updateRow = createAction(UPDATE_ROW, props<{  row: any, rowIndex: number, tableId: string }>());

