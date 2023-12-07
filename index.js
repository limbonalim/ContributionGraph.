const container = document.getElementById('root');
const BASE_URL = 'https://dpg.gg/test/calendar.json';
let startMonth;
const monthsContainer = document.getElementById('months');
const months = new FormatDate().months;

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
                day.classList.add('height');
            } else if (value > 30) {
                day.classList.add('extraHeight');
            }
            getToolTip(day, date, value);
        }
    }
};

const getToolTipTitle = (date, contributionValue) => {
    const formatDate = new FormatDate(date).toStringFormatDate()
    if (!contributionValue) {
        return `${formatDate} No contribution`;
    }
    return `${formatDate} ${contributionValue} contributions`;
};

const getToolTip = (day, date, contributionValue) => {
    day.addEventListener('click', (event) => {
        const last = container.getElementsByClassName('tooltip');
        const days = container.getElementsByClassName('active');
        if (last.length) {
            days[0].classList.remove('active');
            container.removeChild(last[0]);
        }
        day.classList.add('active')
        const wrapper = document.createElement('div');
        wrapper.innerHTML = getToolTipTitle(date, contributionValue);
        wrapper.classList.add('tooltip')
        container.append(wrapper);
        wrapper.setAttribute('style', `left: ${event.target.offsetLeft}px; top: ${event.target.offsetTop-25}px;`)
    })
}

const run = async () => {
    const contribution = await getResponse();
    const today = new Date();
    const daysInPast = 357;
    const weeks = [];
    let oneWeek = [];

    for (let i = 1; i <= daysInPast; i++) {
        const day = getCell();

        const current = new Date(today);
        current.setDate(today.getDate() - (daysInPast - i));
        const currentDay = current.getDay();
        const dateDay = new FormatDate(current).apiFormatDate();
        getToolTip(day, dateDay, 0);
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
    getMounts();
}

const getMounts = () => {
    let startIndex = months.findIndex((element) => element === startMonth);
    for (let i = 0; i < 12; i++) {
        const span = document.createElement('span');
        span.innerHTML = months[startIndex + i];
        if ((startIndex + i) === months.length) {
            startIndex = -1;
        }
        monthsContainer.append(span);
    }
}

void run();