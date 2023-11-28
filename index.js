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

const setContribution = (contribution, date, day) => {
    for (let data in contribution) {
        if (data === date) {
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
};

const run = async () => {
    const contribution = await getResponse();
    const today = new Date();
    const daysInPast = 357;
    
    const weeks = [];
    let test = [];

    for (let i = 0; i < daysInPast; i++) {
        const day = getCell();
        day.setAttribute('data-bs-toggle', 'tooltip');
        day.setAttribute('data-bs-placement', 'top');
        day.setAttribute('data-bs-trigger', 'click');
        const currentDay = new Date(today);
        currentDay.setDate(today.getDate() - (daysInPast - i));
        const dateDay = formattDate(currentDay);
        day.setAttribute('title', currentDay);
        setContribution(contribution, dateDay, day);
        test.push(day)
        if (test.length === 7) {
            weeks.push(test);
            test = []
        }
    }
    weeks.forEach((week) => {
        const weekWrapper = document.createElement('div');
        week.forEach(day => {
            weekWrapper.append(day)
        })
        container.append(weekWrapper);
    })
}

run()