import type { betModel } from '../types';
export const array = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/* it generates a matrix ([ROWSx2-1]x[COLSx2]) that represents the ROWSxCOLS numbers and their in between bets */
export function generateBetNumbers(ROWS = 12, COLS = 3): betModel[][] {
	const rows = array(ROWS);
	return rows
		.map((_, rowNumber) => {
			const cols = array(COLS);

			return cols.reduce((acc: betModel[], colNumber) => {
				const id = colNumber + COLS * rowNumber;
				/* if true then is a street bet */
				if ((id - 1) % COLS === 0) {
					acc.push({
						id: `${id}-${colNumber + 1 + COLS * rowNumber}-${colNumber + 2 + COLS * rowNumber}`,
						text: `${id}-${colNumber + 1 + COLS * rowNumber}-${colNumber + 2 + COLS * rowNumber}`,
						type: 'STREET',
						bet: 0
					});
				}

				/* straight bet */
				acc.push({
					id,
					text: String(id),
					type: 'STRAIGHT',
					bet: 0
				});

				/* if true then is a split bet */
				if (id < COLS * (rowNumber + 1)) {
					acc.push({
						id: `${id}-${colNumber + 1 + COLS * rowNumber}`,
						text: `${id}-${colNumber + 1 + COLS * rowNumber}`,
						type: 'SPLIT',
						bet: 0
					});
				}
				return acc;
			}, []);
		})
		.reduce((acc: betModel[][], row, rowIndex, rows) => {
			acc.push(row);
			/* if true then it can bee six line, corner or split bet */
			if (rows[rowIndex + 1]) {
				acc.push(
					row.map((colNumber, j) => ({
						id: `${colNumber.id}-${rows[rowIndex + 1][j].id}`,
						text: `${colNumber.id}-${rows[rowIndex + 1][j].id}`,
						type: j === 0 ? 'SIXLINE' : j % 2 === 0 ? 'CORNER' : 'SPLIT',
						bet: 0
					}))
				);
			}
			return acc;
		}, []);
}

export const getNumberCol = (n: number) => ((n - 1) % 3) + 1;
export const getNumberRow = (n: number) => (n <= 12 ? 1 : n <= 24 ? 2 : 3);
