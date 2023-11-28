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

const formattDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().slice(0, 10);
    return formattedDate
};

const getCell = () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    return cell
};

const run = async () => {
    const contribution = await getResponse();
    const today = new Date();
    const daysInPast = 357;
    for (let i = 0; i < daysInPast; i++) {
        const day = getCell();
        const currentDay = new Date(today);
        currentDay.setDate(today.getDate() - (daysInPast - i));
        const dateDay = formattDate(currentDay);
        for (let data in contribution) {
            if (data === dateDay) {
                const value = contribution[data];
                if (value > 0 && value <= 9) {
                    day.classList.add('low');
                } else if (value >= 10 && value <= 19) {
                    day.classList.add('moreThenLow');
                } else if (value >= 20 && value <= 29) {
                    day.classList.add('hight');
                } else if (value > 30) {
                    day.classList.add('extraHight');
                }
            }
        }
        container.appendChild(day);
    }
}

run()