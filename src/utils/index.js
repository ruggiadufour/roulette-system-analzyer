export const array = (n) => Array.from({ length: n }, (_, i) => i + 1);

/* it generates a matrix ([ROWSx2-1]x[COLSx2]) that represents the ROWSxCOLS numbers and their in between bets */
export function generateBetNumbers(ROWS = 12, COLS = 3) {
  const rows = array(ROWS);
  return rows
    .map((_, rowNumber) => {
      let cols = array(COLS);

      return cols.reduce((acc, colNumber) => {
        const id = colNumber + COLS * rowNumber;
        /* if true then is a street bet */
        if ((id - 1) % COLS === 0) {
          acc.push({
            id: `${id}-${colNumber + 1 + COLS * rowNumber}-${
              colNumber + 2 + COLS * rowNumber
            }`,
            text: `${id}-${colNumber + 1 + COLS * rowNumber}-${
              colNumber + 2 + COLS * rowNumber
            }`,
            type: 'street',
          });
        }

        /* straight bet */
        acc.push({
          id,
          text: id,
          type: 'straight',
        });

        /* if true then is a split bet */
        if (id < COLS * (rowNumber + 1)) {
          acc.push({
            id: `${id}-${colNumber + 1 + COLS * rowNumber}`,
            text: `${id}-${colNumber + 1 + COLS * rowNumber}`,
            type: 'split',
          });
        }
        return acc;
      }, []);
    })
    .reduce((acc, row, rowIndex, rows) => {
      acc.push(row);
      /* if true then it can bee six line, corner or split bet */
      if (rows[rowIndex + 1]) {
        acc.push(
          row.map((colNumber, j) => ({
            id: `${colNumber.id}-${rows[rowIndex + 1][j].id}`,
            text: `${colNumber.id}-${rows[rowIndex + 1][j].id}`,
            type: j === 0 ? 'six-line' : j % 2 === 0 ? 'corner' : 'split',
          }))
        );
      }
      return acc;
    }, []);
}

export const getNumberCol = (n) => ((n - 1) % 3) + 1;
export const getNumberRow = (n) => (n <= 12 ? 1 : n <= 24 ? 2 : 3);
