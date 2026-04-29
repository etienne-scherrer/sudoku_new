import React, {useState, useEffect} from 'react';
import './main.css'; // Ensure this path is correct
import Modal from './components/Modal'; // Import the Modal component

function SudokuGrid() {
    const initialGrid = () => Array.from({length: 9}, () =>
        Array.from({length: 9}, () => ({
            value: '',
            readOnly: false
        }))
    );

    const [grid, setGrid] = useState(initialGrid());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedGrid = localStorage.getItem('sudokuGrid');
        let gridJSON = JSON.parse(savedGrid);
        if (gridJSON && gridJSON.length) {
            setGrid(gridJSON);
        } else {
            fetchGrid();
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('sudokuGrid', JSON.stringify(grid));
    }, [grid]);


    async function fetchGrid() {
        setLoading(true);
        try {
            const response = await fetch(`/${process.env.REACT_APP_API_BASE_URL}sudoku/generate.php`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const formattedData = data.map(row =>
                row.map(cell => ({
                    value: cell.value ? cell.value.toString() : '',
                    readOnly: cell.value !== 0  // Assuming '0' means empty
                }))
            );
            setGrid(formattedData);
            setError('');
        } catch (error) {
            console.error('Failed to fetch grid:', error);
            setError('Failed to load the grid. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const clearGrid = () => {
        const clearedGrid = grid.map(row =>
            row.map(cell => ({
                ...cell,
                value: cell.readOnly ? cell.value : ''  // Clear value if not read-only
            }))
        );
        setGrid(clearedGrid);
    };


    const handleInputChange = (value, rowIndex, colIndex) => {
        if (!grid[rowIndex][colIndex].readOnly && /^[1-9]?$/.test(value)) {
            const newGrid = [...grid];
            newGrid[rowIndex][colIndex].value = value;
            setGrid(newGrid);
        }
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        let newRowIndex = rowIndex;
        let newColIndex = colIndex;
        const startRowIndex = rowIndex;
        const startColIndex = colIndex;

        switch (e.key) {
            case 'Escape':
                e.target.blur();
                break;
            case 'ArrowRight':
            case 'Tab':
                e.preventDefault();
                do {
                    newColIndex++;
                    if (newColIndex > 8) {
                        newColIndex = 0;
                        newRowIndex++;
                        if (newRowIndex > 8) newRowIndex = 0; // Wrap around to the start of the grid
                    }
                } while (grid[newRowIndex][newColIndex].readOnly && !(newRowIndex === startRowIndex && newColIndex === startColIndex));
                break;

            case 'ArrowLeft':
                do {
                    newColIndex--;
                    if (newColIndex < 0) {
                        newColIndex = 8;
                        newRowIndex--;
                        if (newRowIndex < 0) newRowIndex = 8; // Wrap around to the end of the grid
                    }
                } while (grid[newRowIndex][newColIndex].readOnly && !(newRowIndex === startRowIndex && newColIndex === startColIndex));
                break;

            case 'ArrowUp':
                do {
                    newRowIndex--;
                    if (newRowIndex < 0) {
                        newRowIndex = 8;
                        newColIndex--;
                        if (newColIndex < 0) newColIndex = 8; // Wrap vertically and horizontally
                    }
                } while (grid[newRowIndex][newColIndex].readOnly && !(newRowIndex === startRowIndex && newColIndex === startColIndex));
                break;

            case 'ArrowDown':
                do {
                    newRowIndex++;
                    if (newRowIndex > 8) {
                        newRowIndex = 0;
                        newColIndex++;
                        if (newColIndex > 8) newColIndex = 0; // Wrap vertically and horizontally
                    }
                } while (grid[newRowIndex][newColIndex].readOnly && !(newRowIndex === startRowIndex && newColIndex === startColIndex));
                break;
            default:
                break;
        }

        // Set focus on the next editable input if it's different from the current
        if (newRowIndex !== rowIndex || newColIndex !== colIndex) {
            const nextInput = document.querySelector(`input[data-row="${newRowIndex}"][data-col="${newColIndex}"]`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    async function solveSudoku() {
        setLoading(true);
        try {
            const response = await fetch(`/${process.env.REACT_APP_API_BASE_URL}sudoku/solve.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({grid})
            });

            if (!response.ok) {
                // Log the HTTP error status if the response is not OK
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const solvedData = await response.json(); // Attempt to parse the JSON response

            // Log the entire JSON response from the server
            console.log('Response from solve.php:', solvedData);

            if (solvedData.error) {
                // Check if the backend sent any error message and log it
                console.error('Error from solve.php:', solvedData.error);
                setError(solvedData.error);
            } else {
                // If no error, set the solved grid
                setGrid(solvedData.result);
                setError('');
            }

        } catch (error) {
            // This will catch any network error or status code not okay
            console.error('Failed to solve grid:', error);
            setError('Failed to solve the grid. Please try again.');
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (loading || error) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
        }
    }, [loading, error]);

    // Modal content based on state
    const modalContent = () => {
        if (loading) {
            return <p>Loading...</p>;
        }
        if (error) {
            return <p>{error}</p>;
        }
    };

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalContent()}
            </Modal>
            <table id="sudoku-grid" className="sudoku-table">
                <tbody>
                {grid.map((row, rowIndex) => (
                    <tr key={rowIndex} className="sudoku-row">
                        {row.map((cell, colIndex) => (
                            <td key={colIndex} className="sudoku-cell">
                                <input
                                    type="text"
                                    className="sudoku-input"
                                    value={cell.value}
                                    onChange={e => handleInputChange(e.target.value, rowIndex, colIndex)}
                                    onKeyDown={e => handleKeyDown(e, rowIndex, colIndex)}
                                    readOnly={cell.readOnly}
                                    maxLength="1"
                                    aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}`}
                                    data-row={rowIndex}
                                    data-col={colIndex}
                                />
                            </td>
                        ))}
                    </tr>


                ))}
                </tbody>
            </table>
            <div className="button-container">
                <button className="clear-button" onClick={clearGrid}>Clear</button>
                <button className="clear-button" onClick={fetchGrid}>Generate</button>
                <button className="solve-button" onClick={solveSudoku}>Solve</button>
            </div>

        </div>
    );
}

export default SudokuGrid;