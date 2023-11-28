const container = document.getElementById('root');
const BASE_URL = 'https://dpg.gg/test/calendar.json';

const getResponse = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (response.ok) {
            const data = await response.json();
            return data
        }
    } catch (error) {
        console.log(error);
    }
};



const getCell = () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    container.appendChild(cell);
};

