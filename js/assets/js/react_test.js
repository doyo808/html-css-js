const targetLength = 5;
let measureResults = [];
const main = document.getElementById('main');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const cards = {
            test_ready: testReadyComp(),
            test_wait: document.getElementById('test-wait'),
            test_wait_click: document.getElementById('test-wait-click'),
            test_clicked: document.getElementById('test-clicked'),
            test_record: document.getElementById('test-record')
        };

const boxes = [];
    boxes.push(document.getElementById('box1'));
    boxes.push(document.getElementById('box2')),
    boxes.push(document.getElementById('box3')),
    boxes.push(document.getElementById('box4')),
    boxes.push(document.getElementById('box5')),
    

// 처음 화면 세팅
replaceCard(cards.test_ready); 
replaceCard(cards.test_wait);
replaceCard(cards.test_wait_click);
replaceCard(cards.test_clicked);
replaceCard(cards.test_record);

// function 정리
function replaceCard(card) {
    // firstChild는 첫 번째 노드를 가져온다 (텍스트 노드도 포함)
    // firstElementChild는 첫 번째 요소를 가져온다
    const currCard = main.firstElementChild;
    main.replaceChild(card, currCard);
}

function testReadyComp() {
    const wrapper = document.createElement('div');
    wrapper.id = 'test-ready';

    const icon = document.createElement('div');
    icon.classList.add('main-icon');
    wrapper.appendChild(icon);

    const title = document.createElement('div');
    title.classList.add('title');
    const titleText = document.createTextNode('React Time Test');
    title.appendChild(titleText);
    wrapper.appendChild(title);

    const button = document.createElement('div');
    button.id = 'start-button';
    button.classList.add('test-start-button');
    const buttonText = document.createTextNode('Start');
    button.appendChild(buttonText);
    wrapper.appendChild(button);

    return wrapper;
}

    // 상단바 함수
function updateProgressBar() {
    progressText.innerText = `${measureResults.length}/5`;
        for (let i = 0; i < measureResults.length; i++) {
            boxes[i].style.backgroundColor = 'skyblue';
        }
};
function defaultProgressBar() {
    progressBar.style.visibility = 'visible';
    progressText.innerText = `0/5`;
        for (let box of boxes) {
            box.style.backgroundColor = 'lightgray';
        }
};

    // 시간 측정 함수
function getRecords() {
    const records = {};

    let min = measureResults[0];
    let max = measureResults[0];
    let total = 0;

    for (r of measureResults) {
        min = Math.min(min, r);
        max = Math.max(max, r);
        total += r;
    }
    records.min = min;
    records.max = max;
    records.avg = (total / measureResults.length).toFixed(0);

    return records;
};

let measure_start_time;
let measure_end_time;
let measureTO = null;

function waitClick() {
    if (measureResults.length === 0) {
        defaultProgressBar()
    };

    main.removeEventListener('click', startWaitHander);
    measureTO = window.setTimeout(() => {
        measureStart();
    }, Math.floor(Math.random() * 2501 + 500));

    window.setTimeout(() => {
        main.addEventListener('click', tooFastClickHandler);
    }, 100);
}

    // 초기화 함수
function reset(prevCard) {
    measureResults = [];
    main.classList.remove(prevCard);
    progressBar.style.visibility = 'hidden';
    replaceCard(cards.test_ready);
}


// 액션리스너 붙이기
    // 대기화면
replaceCard(cards.test_ready); 
const startBtn = document.getElementById('start-button');

const startWaitHander = (e) => {
    replaceCard(cards.test_wait);
    main.classList.remove('measure-end');
    main.classList.add('waiting');

    waitClick();
};
startBtn.addEventListener('click', startWaitHander);

    // 너무빠른 클릭 시
const tooFastClickHandler = (e) => {
    alert('너무빠름');
    window.clearTimeout(measureTO);
    main.removeEventListener('click', tooFastClickHandler);
    reset('waiting');
}

    // 측정 시작시 메인에 이벤트 붙이기
function measureStart() {
    measure_start_time = new Date().getTime(); // 측정시작
    
    main.removeEventListener('click', tooFastClickHandler);
    main.classList.remove('waiting');
    replaceCard(cards.test_wait_click);

    main.addEventListener('click', measureStartHandler);
}

    // 측정시간 안내창에 이벤트 붙이기
const measureStartHandler = (e) => {
    measure_end_time = new Date().getTime(); // 측정완료
    const result = (measure_end_time - measure_start_time)
    measureResults.push(result);
        
    if (measureResults.length < targetLength) {
        const to_show = cards.test_clicked;
        to_show.querySelector('.millisec').innerText = `${result} ms`;
        replaceCard(to_show);
        updateProgressBar();

        main.classList.add('measure-end');
        main.addEventListener('click', startWaitHander);
        main.removeEventListener('click', measureStartHandler);

    } else {
        const records = getRecords();
        const to_show = cards.test_record;
        
        to_show.querySelector('.worst-time > .millisec').innerText = records.max;
        to_show.querySelector('.best-time > .millisec').innerText = records.min;
        to_show.querySelector('.avg-time > .millisec').innerText = records.avg;
        to_show.querySelector('#try-again-button').addEventListener('click', (e) => {
            reset('finish');
        });

        replaceCard(to_show);
        updateProgressBar();
        main.classList.add('finish');
        main.removeEventListener('click', measureStartHandler);
    }
}

