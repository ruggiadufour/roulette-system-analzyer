export type multiplierTypes =
	| 'STRAIGHT'
	| 'SPLIT'
	| 'STREET'
	| 'CORNER'
	| 'BASKET'
	| 'SIXLINE'
	| 'SIMPLE'
	| 'DOUBLE';

export type betTypes =
	| '1_dozen'
	| '2_dozen'
	| '3_dozen'
	| '1_dozen_col'
	| '2_dozen_col'
	| '3_dozen_col'
	| '19_to_36'
	| '1_to_18'
	| 'odd'
	| 'even'
	| 'black'
	| 'red';

export enum multipliersEnum {
	STRAIGHT = 35,
	SPLIT = 15,
	STREET = 11,
	CORNER = 8,
	BASKET = 6,
	SIXLINE = 5,
	DOUBLE = 2,
	SIMPLE = 1
}

export interface betModel {
	id: number | string;
	text: string;
	type: multiplierTypes;
	bet: number;
}
