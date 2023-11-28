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

const run = async () => {
    const contribution = await getResponse();
    const today = new Date();
    const daysInPast = 357;
    console.log(container)
    for (let i = 0; i < daysInPast; i++) {
        const day = getCell();
        const currentDay = new Date(today);
        currentDay.setDate(today.getDate() - (daysInPast - i));
    }
}

run()