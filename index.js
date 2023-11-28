const container = document.getElementById('root');
const BASE_URL = 'https://dpg.gg/test/calendar.json';
let startMonth;
const monthsContainer = document.getElementById('months');
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getResponse = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error);
    }
};

const formattDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().slice(0, 10);
    return formattedDate;
};

const getCell = () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    return cell;
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
            day.setAttribute('title', getToolTipTitle(date, value));
        }
    }
};

const getToolTipTitle = (date, contributionValue) => {
    const formatDate = (date) => {
        const currentDay = new Date(date);
        const dayOfWeek = daysOfWeek[currentDay.getDay()];
        const month = months[currentDay.getMonth()];
        const dayOfMonth = currentDay.getDate();
        const year = currentDay.getFullYear();
        const formattedDate = `${dayOfWeek} ${month} ${dayOfMonth}, ${year}`;
        return formattedDate;
    };

    if (!contributionValue) {
        return `${formatDate(date)} No contribution`;
    }

    return `${formatDate(date)} ${contributionValue} contributions`;

};

const run = async () => {
    const contribution = await getResponse();
    const today = new Date();
    const daysInPast = 357;
    const weeks = [];
    let oneWeek = [];

    for (let i = 1; i <= daysInPast; i++) {
        const day = getCell();
        day.setAttribute('data-bs-toggle', 'tooltip');
        day.setAttribute('data-bs-trigger', 'click');
        const current = new Date(today);
        current.setDate(today.getDate() - (daysInPast - i));
        const currentDay = current.getDay();
        const dateDay = formattDate(current);
        day.setAttribute('title', getToolTipTitle(dateDay, 0))
        setContribution(contribution, dateDay, day);

        if (i === 1) {
            if (currentDay > 1) {
                for (let j = 1; j < currentDay; j++) {
                    const emptyDay = getCell();
                    emptyDay.className = 'empty';
                    oneWeek.push(emptyDay);
                }
            }
           startMonth = months[current.getMonth()];
        }

        oneWeek.push(day)
        if (oneWeek.length === 7) {
            weeks.push(oneWeek);
            oneWeek = []
        } else if (i === daysInPast) {
            weeks.push(oneWeek);
        }
    }
    weeks.forEach((week) => {
        const weekWrapper = document.createElement('div');
        weekWrapper.classList.add('week');
        week.forEach(day => {
            weekWrapper.append(day);
        })
        container.append(weekWrapper);
    })
    let startIndex = months.findIndex((element)=> element === startMonth);
    for( let i = 0; i < 12; i++) {
        const span = document.createElement('span');
        span.innerHTML = months[startIndex + i];
        if (startIndex + 1 === months.length) {
            startIndex = -1;
        }
        monthsContainer.append(span);
    }
}

run();